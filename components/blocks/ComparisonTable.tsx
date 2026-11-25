import type { TableBlock } from "@/lib/blocks";

// Responsive table: scrolls horizontally on small screens. First column is a row header.
export function ComparisonTable({ block }: { block: TableBlock }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line" tabIndex={0} role="region" aria-label="Comparison table">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead className="bg-cream">
          <tr>
            {block.headers.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, r) => (
            <tr key={r} className="border-t border-line">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-3 font-medium">{cell}</th>
                ) : (
                  <td key={c} className="px-4 py-3">{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
