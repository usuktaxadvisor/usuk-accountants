/**
 * Renders one or more JSON-LD schema objects into the document.
 * Server component — schema lands in the initial HTML for crawlers + AI engines.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const items = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {items.filter(Boolean).map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
