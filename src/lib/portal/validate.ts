/**
 * Server-side upload validation. Never trusts the browser: the extension
 * allow-list is checked against the filename, the MIME type against the
 * request, AND the magic bytes against the actual content. Executables,
 * path traversal and oversized files are rejected before Drive is touched.
 */
const ALLOWED: Record<string, string[]> = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  xls: ['application/vnd.ms-excel'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv', 'application/vnd.ms-excel', 'text/plain'],
};

export const MAX_BYTES = () => (Number(process.env.UPLOAD_MAX_MB ?? 25)) * 1024 * 1024;

function magicOk(ext: string, buf: Buffer): boolean {
  const b = buf.subarray(0, 8);
  switch (ext) {
    case 'pdf': return b.subarray(0, 5).toString('latin1') === '%PDF-';
    case 'png': return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case 'jpg': case 'jpeg': return b[0] === 0xff && b[1] === 0xd8;
    case 'docx': case 'xlsx': return b[0] === 0x50 && b[1] === 0x4b; // zip container
    case 'doc': case 'xls': return b[0] === 0xd0 && b[1] === 0xcf;   // OLE compound
    case 'csv': return !buf.subarray(0, 512).includes(0);            // no NUL bytes = plausibly text
    default: return false;
  }
}

export function sanitiseFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file'; // strip any path segments
  return base.replace(/[^\w.\- ()]/g, '_').slice(0, 140) || 'file';
}

export type ValidationResult = { ok: true; ext: string; safeName: string } | { ok: false; reason: string };

export function validateUpload(filename: string, declaredMime: string, buf: Buffer): ValidationResult {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > MAX_BYTES()) return { ok: false, reason: `File exceeds ${process.env.UPLOAD_MAX_MB ?? 25} MB limit` };
  const safeName = sanitiseFilename(filename);
  const ext = safeName.includes('.') ? safeName.split('.').pop()!.toLowerCase() : '';
  const allowedMimes = ALLOWED[ext];
  if (!allowedMimes) return { ok: false, reason: 'File type not accepted' };
  if (!allowedMimes.includes(declaredMime) && declaredMime !== 'application/octet-stream')
    return { ok: false, reason: 'File type mismatch' };
  if (!magicOk(ext, buf)) return { ok: false, reason: 'File content does not match its type' };
  return { ok: true, ext, safeName };
}
