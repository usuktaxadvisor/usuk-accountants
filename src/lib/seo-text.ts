/**
 * Trim free text to a search-snippet-friendly meta description.
 * Cuts at a sentence boundary when one falls inside the limit, otherwise at a
 * word boundary with an ellipsis. Used only for <meta name="description">;
 * on-page copy is never shortened.
 */
export function metaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.split(/(?<=[.!?])\s+/);
  let out = '';
  for (const s of sentences) {
    const next = (out + ' ' + s).trim();
    if (next.length > max) break;
    out = next;
  }
  if (out.length >= 70) return out;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–—-]$/, '') + '…';
}
