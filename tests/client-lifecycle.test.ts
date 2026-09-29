import { describe, it, expect } from 'vitest';
import { decide, isArchiveReason } from '@/lib/portal/client-lifecycle';

describe('client deletion decision rule', () => {
  const now = new Date('2026-09-29T00:00:00Z');
  it('legal hold always wins: archive only', () => {
    expect(decide({ legalHold: true, protectedRecords: 0, retainUntil: null, now }).decision).toBe('ARCHIVE_ONLY');
    expect(decide({ legalHold: true, protectedRecords: 3, retainUntil: new Date('2020-01-01'), now }).decision).toBe('ARCHIVE_ONLY');
  });
  it('no protected records and no hold: permanent deletion allowed', () => {
    expect(decide({ legalHold: false, protectedRecords: 0, retainUntil: null, now })).toEqual({ decision: 'FULL_DELETE_ALLOWED', retentionActive: false });
  });
  it('any signature/identity record: partial deletion with retention — active while inside the period or undated', () => {
    expect(decide({ legalHold: false, protectedRecords: 1, retainUntil: new Date('2033-09-30'), now })).toEqual({ decision: 'PARTIAL_DELETE_RETENTION_REQUIRED', retentionActive: true });
    expect(decide({ legalHold: false, protectedRecords: 1, retainUntil: null, now })).toEqual({ decision: 'PARTIAL_DELETE_RETENTION_REQUIRED', retentionActive: true });
    expect(decide({ legalHold: false, protectedRecords: 1, retainUntil: new Date('2020-01-01'), now })).toEqual({ decision: 'PARTIAL_DELETE_RETENTION_REQUIRED', retentionActive: false });
  });
  it('reason codes are validated', () => {
    expect(isArchiveReason('TEST_RECORD')).toBe(true);
    expect(isArchiveReason('DROP TABLE')).toBe(false);
    expect(isArchiveReason(undefined)).toBe(false);
  });
});
