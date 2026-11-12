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

describe('real-world PDFs (bank statements)', () => {
  const body = Buffer.alloc(64, 1);
  const pdf = (pre = '') => Buffer.concat([Buffer.from(pre), Buffer.from('%PDF-1.4\n'), body]);
  it('accepts PDF MIME variants some browsers report', () => {
    for (const m of ['application/x-pdf', 'application/acrobat', 'text/pdf', 'APPLICATION/PDF', ''])
      expect(validateUpload('statement.pdf', m, pdf()).ok).toBe(true);
  });
  it('accepts a PDF whose header follows a BOM or blank line', () => {
    expect(validateUpload('statement.pdf', 'application/pdf', pdf('﻿')).ok).toBe(true);
    expect(validateUpload('statement.pdf', 'application/pdf', pdf('\r\n')).ok).toBe(true);
  });
  it('accepts names with trailing spaces or upper-case extensions', () => {
    expect(validateUpload('statement.pdf ', 'application/pdf', pdf())).toMatchObject({ ok: true, safeName: 'statement.pdf' });
    expect(validateUpload('M&S Statement.PDF', 'application/pdf', pdf())).toMatchObject({ ok: true, ext: 'pdf' });
  });
  it('names a real PDF saved without an extension as .pdf', () => {
    expect(validateUpload('Statement', 'application/pdf', pdf())).toMatchObject({ ok: true, ext: 'pdf', safeName: 'Statement.pdf' });
  });
  it('still refuses non-PDF content without an extension, and an EXE disguised as PDF', () => {
    expect(validateUpload('Statement', 'application/octet-stream', EXE).ok).toBe(false);
    expect(validateUpload('invoice.pdf', 'application/x-pdf', EXE).ok).toBe(false);
    expect(validateUpload('hidden', 'application/pdf', Buffer.concat([Buffer.alloc(2000, 1), Buffer.from('%PDF-')])).ok).toBe(false);
  });
});
