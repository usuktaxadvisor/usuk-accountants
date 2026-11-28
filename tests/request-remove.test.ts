import { describe, expect, it } from 'vitest';
import { canRemoveRequest } from '@/lib/portal/request-view';

describe('removing a document request', () => {
  it('is allowed only while the request is waiting on the client with nothing uploaded', () => {
    expect(canRemoveRequest({ status: 'REQUESTED', files: [] })).toBe(true);
  });
  it('is never allowed once anything has been uploaded, whatever the status', () => {
    expect(canRemoveRequest({ status: 'REQUESTED', files: [{}] })).toBe(false);
    for (const status of ['UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED'] as const) {
      expect(canRemoveRequest({ status, files: [{}] })).toBe(false);
    }
  });
  it('is not allowed for a request that has moved on, even with no files listed', () => {
    for (const status of ['UPLOADED', 'RECEIVED', 'UNDER_REVIEW', 'COMPLETED'] as const) {
      expect(canRemoveRequest({ status, files: [] })).toBe(false);
    }
  });
});
