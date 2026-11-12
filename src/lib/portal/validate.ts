/**
 * Server-side upload validation. Never trusts the browser: the extension
 * allow-list is checked against the filename, the MIME type against the
 * request, AND the magic bytes against the actual content. Executables,
 * path traversal and oversized files are rejected before Drive is touched.
 */
const ALLOWED: Record<string, string[]> = {
  // Browsers and operating systems report PDFs under several names; the magic-byte check below is what really decides.
  pdf: ['application/pdf', 'application/x-pdf', 'application/acrobat', 'applications/vnd.pdf', 'text/pdf', 'text/x-pdf'],
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
    // The PDF spec allows the %PDF- header anywhere in the first 1024 bytes (some bank exports add a BOM or blank line first).
    case 'pdf': return buf.subarray(0, 1024).includes('%PDF-', 0, 'latin1');
    case 'png': return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case 'jpg': case 'jpeg': return b[0] === 0xff && b[1] === 0xd8;
    case 'docx': case 'xlsx': return b[0] === 0x50 && b[1] === 0x4b; // zip container
    case 'doc': case 'xls': return b[0] === 0xd0 && b[1] === 0xcf;   // OLE compound
    case 'csv': return !buf.subarray(0, 512).includes(0);            // no NUL bytes = plausibly text
    default: return false;
  }
}

export function sanitiseFilename(name: string): string {
  const base = (name.split(/[\\/]/).pop() ?? 'file').trim(); // strip any path segments and stray spaces
  return base.replace(/[^\w.\- ()]/g, '_').replace(/[. ]+$/, '').slice(0, 140) || 'file';
}

/** True when the bytes are a PDF, wherever the header sits in the first 1024 bytes. */
export function looksLikePdf(buf: Buffer): boolean {
  return buf.subarray(0, 1024).includes('%PDF-', 0, 'latin1');
}

/** Lower-case extension of an already-sanitised name, or '' when there is none. */
export function extensionOf(safeName: string): string {
  return safeName.includes('.') ? safeName.split('.').pop()!.toLowerCase() : '';
}

export const ACCEPTED_TYPES_MESSAGE = 'This file type is not accepted. Please upload a PDF, photo (JPG or PNG), Word, Excel or CSV file.';

export type ValidationResult = { ok: true; ext: string; safeName: string } | { ok: false; reason: string };

export function validateUpload(filename: string, declaredMime: string, buf: Buffer): ValidationResult {
  if (buf.length === 0) return { ok: false, reason: 'Empty file' };
  if (buf.length > MAX_BYTES()) return { ok: false, reason: `File exceeds ${process.env.UPLOAD_MAX_MB ?? 25} MB limit` };
  let safeName = sanitiseFilename(filename);
  let ext = extensionOf(safeName);
  // A genuine PDF saved without an extension (some bank downloads do this) is named .pdf rather than refused.
  if (!ALLOWED[ext] && !safeName.includes('.') && looksLikePdf(buf)) { safeName = `${safeName}.pdf`; ext = 'pdf'; }
  const allowedMimes = ALLOWED[ext];
  if (!allowedMimes) return { ok: false, reason: ACCEPTED_TYPES_MESSAGE };
  const mime = declaredMime.toLowerCase();
  if (!allowedMimes.includes(mime) && mime !== 'application/octet-stream' && mime !== '')
    return { ok: false, reason: 'This file does not match its type. Please check it opens normally and try again.' };
  if (!magicOk(ext, buf)) return { ok: false, reason: 'This file does not match its type. Please check it opens normally and try again.' };
  return { ok: true, ext, safeName };
}
