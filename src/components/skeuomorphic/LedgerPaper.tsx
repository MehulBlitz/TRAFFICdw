import React from 'react';

interface LedgerPaperProps {
  id?: string;
  title: string;
  subtitle?: string;
  columns: string[];
  data: Array<Record<string, unknown>>;
  renderRow?: (row: Record<string, unknown>, index: number) => React.ReactNode;
}

export const LedgerPaper: React.FC<LedgerPaperProps> = ({
  id,
  title,
  subtitle,
  columns,
  data,
  renderRow,
}) => {
  return (
    <div
      id={id}
      className="neu-raised-lg p-5 rounded-3xl overflow-hidden flex flex-col gap-4 text-slate-800"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {data.length} Audited Records
          </span>
        </div>
      </div>

      {/* Recessed Table Container */}
      <div className="overflow-x-auto neu-inset rounded-2xl p-2">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="py-2.5 px-3">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 font-mono text-slate-700">
            {data.map((row, idx) => {
              if (renderRow) return renderRow(row, idx);
              return (
                <tr
                  key={idx}
                  className="hover:bg-white/40 transition-colors"
                >
                  <td className="py-2 px-3 font-semibold text-slate-400">
                    {(idx + 1).toString().padStart(2, '0')}
                  </td>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                      {String(row[col] ?? '-')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span>Verified by Star Schema Validator</span>
        <span>Standardized ETL Stream</span>
      </div>
    </div>
  );
};

