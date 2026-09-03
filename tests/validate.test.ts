import { describe, it, expect } from 'vitest';
import { validateUpload, sanitiseFilename } from '@/lib/portal/validate';

const PDF = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(64, 1)]);
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32, 2)]);
const EXE = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(64, 0)]);

describe('upload validation', () => {
  it('accepts a real PDF', () => {
    expect(validateUpload('p60.pdf', 'application/pdf', PDF)).toMatchObject({ ok: true, ext: 'pdf' });
  });
  it('accepts a real PNG with octet-stream declared type', () => {
    expect(validateUpload('scan.png', 'application/octet-stream', PNG)).toMatchObject({ ok: true });
  });
  it('rejects an EXE renamed to .pdf (magic bytes)', () => {
    expect(validateUpload('invoice.pdf', 'application/pdf', EXE)).toMatchObject({ ok: false });
  });
  it('rejects disallowed extensions outright', () => {
    expect(validateUpload('run.exe', 'application/octet-stream', EXE).ok).toBe(false);
    expect(validateUpload('script.sh', 'text/plain', Buffer.from('#!/bin/sh')).ok).toBe(false);
  });
  it('rejects empty and oversized files', () => {
    expect(validateUpload('a.pdf', 'application/pdf', Buffer.alloc(0)).ok).toBe(false);
    const big = Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(26 * 1024 * 1024)]);
    expect(validateUpload('big.pdf', 'application/pdf', big).ok).toBe(false);
  });
  it('rejects CSV containing NUL bytes (binary masquerading as text)', () => {
    expect(validateUpload('data.csv', 'text/csv', Buffer.from([0x41, 0x00, 0x42])).ok).toBe(false);
  });
  it('strips path traversal from filenames', () => {
    expect(sanitiseFilename('../../etc/passwd')).toBe('passwd');
    expect(sanitiseFilename('..\\..\\win\\cmd.pdf')).toBe('cmd.pdf');
    expect(sanitiseFilename('nice name (1).pdf')).toBe('nice name (1).pdf');
  });
  it('rejects MIME/extension mismatch', () => {
    expect(validateUpload('doc.pdf', 'image/png', PDF).ok).toBe(false);
  });
});
