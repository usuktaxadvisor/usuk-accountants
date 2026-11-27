import { describe, expect, it } from 'vitest';
import { deadlineState, inferTaxYear, nextTaxYear, normaliseTaxYear, periodClosed, ruleDeadlines } from '@/lib/portal/engagements';
import { computeNextAction, type OverviewCounts } from '@/lib/portal/client-overview';
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

const by = (rows: { ruleKey: string; dueDate: string }[]) => Object.fromEntries(rows.map(r => [r.ruleKey, r.dueDate]));

describe('statutory deadline rules', () => {
  it('UK Self Assessment 2025/26 follows the GOV.UK dates', () => {
    expect(by(ruleDeadlines('UK_SELF_ASSESSMENT', '2025/26'))).toEqual({ sa_register: '2026-10-05', sa_paper: '2026-10-31', sa_online: '2027-01-31', sa_poa2: '2027-07-31' });
  });
  it('US 1040 dates move off weekends like the IRS (15 June 2025 was a Sunday)', () => {
    expect(by(ruleDeadlines('US_1040', '2024'))).toEqual({ us_pay: '2025-04-15', us_abroad: '2025-06-16', us_extended: '2025-10-15' });
    expect(by(ruleDeadlines('US_1040', '2025'))).toEqual({ us_pay: '2026-04-15', us_abroad: '2026-06-15', us_extended: '2026-10-15' });
  });
  it('FBAR and Form 5472 use 15 April with the October extension', () => {
    expect(by(ruleDeadlines('FBAR', '2026'))).toEqual({ fbar_due: '2027-04-15', fbar_ext: '2027-10-15' });
    expect(by(ruleDeadlines('US_5472_1120', '2026'))).toEqual({ llc_due: '2027-04-15', llc_ext: '2027-10-15' });
  });
  it('UK company dates count from the period end, including month-end edge cases', () => {
    expect(by(ruleDeadlines('UK_COMPANY', '2026-03-31'))).toEqual({ co_accounts: '2026-12-31', co_ct_pay: '2027-01-01', co_ct600: '2027-03-31' });
    expect(by(ruleDeadlines('UK_COMPANY', '2025-05-31'))).toEqual({ co_accounts: '2026-02-28', co_ct_pay: '2026-03-01', co_ct600: '2026-05-31' });
  });
  it('services without fixed dates produce none', () => {
    expect(ruleDeadlines('ADVISORY', '2026')).toEqual([]);
  });
});

describe('tax years and roll-over', () => {
  it('normalises and rejects tax years per service', () => {
    expect(normaliseTaxYear('UK_SELF_ASSESSMENT', '2025-2026')).toBe('2025/26');
    expect(normaliseTaxYear('UK_SELF_ASSESSMENT', '2025/27')).toBeNull();
    expect(normaliseTaxYear('US_1040', '25')).toBeNull();
    expect(normaliseTaxYear('UK_COMPANY', '2026-02-30')).toBeNull();
    expect(normaliseTaxYear('UK_COMPANY', '2026-03-31')).toBe('2026-03-31');
  });
  it('next year and period-closed checks', () => {
    expect(nextTaxYear('UK_SELF_ASSESSMENT', '2025/26')).toBe('2026/27');
    expect(nextTaxYear('US_1040', '2025')).toBe('2026');
    expect(nextTaxYear('ADVISORY', '2026')).toBeNull();
    expect(periodClosed('UK_SELF_ASSESSMENT', '2026/27', new Date('2027-04-05T12:00:00Z'))).toBe(false);
    expect(periodClosed('UK_SELF_ASSESSMENT', '2026/27', new Date('2027-04-06T12:00:00Z'))).toBe(true);
    expect(periodClosed('US_1040', '2026', new Date('2027-01-01T00:00:00Z'))).toBe(true);
  });
  it('deadline states', () => {
    const today = new Date('2026-11-27T10:00:00Z');
    expect(deadlineState('2026-11-26', null, today)).toBe('overdue');
    expect(deadlineState('2026-11-27', null, today)).toBe('due-soon');
    expect(deadlineState('2026-12-27', null, today)).toBe('due-soon');
    expect(deadlineState('2027-01-31', null, today)).toBe('upcoming');
    expect(deadlineState('2026-01-01', new Date(), today)).toBe('done');
  });
  it('infers tax years from titles', () => {
    expect(inferTaxYear('Adam: last UK tax return (2024/25)')).toBe('2024/25');
    expect(inferTaxYear('2026 Form W-2: José')).toBe('2026');
    expect(inferTaxYear('Santander statements 2025 and 2026')).toBeNull();
    expect(inferTaxYear('Passport photo page')).toBeNull();
  });
});

const base: OverviewCounts = {
  people: { active: 1, joint: 0, contacts: 0, notActive: 0 },
  requests: { outstanding: 0, followUp: 0, awaitingReview: 0, received: 0, accepted: 0, overdue: 0 },
  files: { uploads: 0, prepared: 0, signed: 0 },
  work: { awaitingFeedback: 0, changesRequested: 0, approved: 0 },
  signatures: { pending: 0, completed: 0, nextDue: null },
  engagements: { ready: true, open: 0, overdue: 0, dueSoon: 0, nextDeadline: null, overdueFirst: null },
};
const fmt = (d: string) => d;

describe('next action priority', () => {
  it('is calm when nothing is outstanding', () => {
    expect(computeNextAction(base, fmt).tone).toBe('calm');
  });
  it('an overdue deadline beats everything else', () => {
    const c = { ...base, requests: { ...base.requests, awaitingReview: 3 }, engagements: { ...base.engagements, overdue: 1, overdueFirst: { label: 'FBAR due', dueDate: '2026-04-15', engagement: 'FBAR 2025' } } };
    const n = computeNextAction(c, fmt);
    expect(n.tone).toBe('urgent'); expect(n.section).toBe('engagements'); expect(n.text).toContain('FBAR due');
  });
  it('uploads to review come before waiting on the client', () => {
    const c = { ...base, requests: { ...base.requests, awaitingReview: 2, outstanding: 5 }, signatures: { ...base.signatures, pending: 1 } };
    expect(computeNextAction(c, fmt)).toMatchObject({ section: 'requests', text: 'Review 2 new uploads' });
  });
  it('falls back to waiting states in order', () => {
    expect(computeNextAction({ ...base, signatures: { ...base.signatures, pending: 1 }, requests: { ...base.requests, outstanding: 2 } }, fmt).section).toBe('signatures');
    expect(computeNextAction({ ...base, requests: { ...base.requests, outstanding: 2 } }, fmt).text).toBe('Waiting on the client for 2 documents');
  });
});

describe('session gate', () => {
  it('lets Vercel Cron reach the engagements job without a session cookie (the route checks CRON_SECRET)', () => {
    const res = middleware(new NextRequest('https://example.test/api/portal/engagements/cron'));
    expect(res.status).toBe(200);
  });
  it('still blocks client sections without a session', () => {
    const res = middleware(new NextRequest('https://example.test/portal/admin/clients/abc/requests'));
    expect(res.status).toBe(307);
  });
});
