import type { ComparisonTableData } from '@/lib/types';
import { IconCheck } from '@/components/ui/icons';

function Cell({ value, highlight }: { value: string | boolean; highlight: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${highlight ? 'bg-gold/20 text-gold-antique' : 'bg-gold/10 text-gold-antique'}`}>
        <IconCheck className="h-4 w-4" />
      </span>
    ) : (
      <span className="text-mist" aria-label="Not included">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5l8 8M13 5l-8 8" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return <span className={`text-sm ${highlight ? 'font-medium text-ink' : 'text-muted'}`}>{value}</span>;
}

/**
 * Comparison table. First column is the row label; remaining columns are options.
 * Use highlightColumn to emphasise "US UK Accountants" vs competitors (FEIE vs FTC, us vs DIY, etc).
 */
export function ComparisonTable({ data }: { data: ComparisonTableData }) {
  const { columns, rows, highlightColumn } = data;

  return (
    <div className="overflow-hidden rounded-2xl border border-mist">
      {/* Desktop / tablet */}
      <table className="hidden w-full border-collapse sm:table">
        <thead>
          <tr className="bg-porcelain">
            <th className="p-5 text-left text-sm font-semibold text-muted" scope="col"></th>
            {columns.map((col, i) => {
              const hl = highlightColumn === i + 1;
              return (
                <th
                  key={col}
                  scope="col"
                  className={`p-5 text-center font-display text-base font-semibold ${
                    hl ? 'bg-navy-ink text-white' : 'text-ink'
                  }`}
                >
                  {col}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.label} className={ri % 2 === 1 ? 'bg-porcelain/50' : 'bg-white'}>
              <th scope="row" className="p-5 text-left text-sm font-medium text-ink">
                {row.label}
              </th>
              {row.values.map((v, vi) => {
                const hl = highlightColumn === vi + 1;
                return (
                  <td key={vi} className={`p-5 text-center ${hl ? 'bg-navy-ink/[0.03]' : ''}`}>
                    <Cell value={v} highlight={hl} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked per option */}
      <div className="divide-y divide-mist sm:hidden">
        {columns.map((col, ci) => {
          const hl = highlightColumn === ci + 1;
          return (
            <div key={col} className={hl ? 'bg-navy-ink text-white' : 'bg-white'}>
              <p className={`px-5 pt-5 font-display text-lg font-semibold ${hl ? 'text-white' : 'text-ink'}`}>{col}</p>
              <dl className="px-5 pb-5 pt-3">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-2">
                    <dt className={`text-sm ${hl ? 'text-softwhite/80' : 'text-muted'}`}>{row.label}</dt>
                    <dd><Cell value={row.values[ci]} highlight={hl} /></dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
