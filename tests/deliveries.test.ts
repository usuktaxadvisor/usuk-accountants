import { describe, it, expect } from 'vitest';
import {
  canClientRespond, canClientAccess, canWithdraw, canReplace,
  statusAfterClientView, statusAfterDecision, isDecision, normaliseComment,
  DELIVERY_STATUS_LABEL, DELIVERY_CATEGORIES,
} from '@/lib/portal/deliveries';

describe('delivery lifecycle rules', () => {
  it('client may respond only while open', () => {
    expect(canClientRespond('READY_FOR_REVIEW')).toBe(true);
    expect(canClientRespond('VIEWED')).toBe(true);
    expect(canClientRespond('APPROVED')).toBe(false);
    expect(canClientRespond('CHANGES_REQUESTED')).toBe(false);
    expect(canClientRespond('WITHDRAWN')).toBe(false);
  });
  it('withdrawn documents are unreachable by the client; everything else stays readable', () => {
    expect(canClientAccess('WITHDRAWN')).toBe(false);
    for (const s of ['READY_FOR_REVIEW', 'VIEWED', 'APPROVED', 'CHANGES_REQUESTED'] as const) expect(canClientAccess(s)).toBe(true);
  });
  it('first client view moves READY_FOR_REVIEW to VIEWED and nothing else', () => {
    expect(statusAfterClientView('READY_FOR_REVIEW')).toBe('VIEWED');
    expect(statusAfterClientView('VIEWED')).toBe('VIEWED');
    expect(statusAfterClientView('APPROVED')).toBe('APPROVED');
    expect(statusAfterClientView('CHANGES_REQUESTED')).toBe('CHANGES_REQUESTED');
  });
  it('decisions map to the right terminal status', () => {
    expect(statusAfterDecision('APPROVED')).toBe('APPROVED');
    expect(statusAfterDecision('CHANGES_REQUESTED')).toBe('CHANGES_REQUESTED');
  });
  it('staff can withdraw / replace anything not already withdrawn', () => {
    for (const s of ['READY_FOR_REVIEW', 'VIEWED', 'APPROVED', 'CHANGES_REQUESTED'] as const) {
      expect(canWithdraw(s)).toBe(true); expect(canReplace(s)).toBe(true);
    }
    expect(canWithdraw('WITHDRAWN')).toBe(false); expect(canReplace('WITHDRAWN')).toBe(false);
  });
});

describe('response validation', () => {
  it('accepts only the two decisions', () => {
    expect(isDecision('APPROVED')).toBe(true);
    expect(isDecision('CHANGES_REQUESTED')).toBe(true);
    expect(isDecision('approved')).toBe(false);
    expect(isDecision('WITHDRAWN')).toBe(false);
    expect(isDecision(undefined)).toBe(false);
    expect(isDecision({ decision: 'APPROVED' })).toBe(false);
  });
  it('requires a comment when requesting changes, not on approval', () => {
    expect(normaliseComment('CHANGES_REQUESTED', '')).toMatchObject({ ok: false });
    expect(normaliseComment('CHANGES_REQUESTED', '   ')).toMatchObject({ ok: false });
    expect(normaliseComment('CHANGES_REQUESTED', 'Line 12 is wrong')).toEqual({ ok: true, comment: 'Line 12 is wrong' });
    expect(normaliseComment('APPROVED', '')).toEqual({ ok: true, comment: null });
    expect(normaliseComment('APPROVED', ' thanks ')).toEqual({ ok: true, comment: 'thanks' });
  });
  it('bounds comment length and coerces non-strings safely', () => {
    const r = normaliseComment('APPROVED', 'x'.repeat(10_000));
    expect(r.ok && r.comment?.length).toBe(4000);
    expect(normaliseComment('APPROVED', null)).toEqual({ ok: true, comment: null });
    expect(normaliseComment('APPROVED', 123)).toEqual({ ok: true, comment: '123' });
  });
});

describe('labels and categories', () => {
  it('every status has a client-facing label', () => {
    for (const s of ['READY_FOR_REVIEW', 'VIEWED', 'APPROVED', 'CHANGES_REQUESTED', 'WITHDRAWN'] as const) expect(DELIVERY_STATUS_LABEL[s]).toBeTruthy();
  });
  it('categories are a fixed allow-list', () => {
    expect(DELIVERY_CATEGORIES.length).toBeGreaterThan(0);
    expect((DELIVERY_CATEGORIES as readonly string[]).includes('Tax return')).toBe(true);
  });
});
