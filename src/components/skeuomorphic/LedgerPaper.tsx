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
    <div id={id} className="ledger-paper p-5 rounded-lg border border-amber-900/30 shadow-xl font-mono overflow-x-auto text-neutral-900">
      {/* Header Stamp */}
      <div className="flex items-center justify-between border-b-2 border-neutral-700/80 pb-3 mb-3">
        <div>
          <div className="text-sm font-black tracking-wider text-neutral-900 uppercase">
            {title}
          </div>
          {subtitle && <div className="text-[11px] text-neutral-700 italic">{subtitle}</div>}
        </div>
        <div className="text-right">
          <div className="inline-block border-2 border-red-800 text-red-800 px-2 py-0.5 text-[10px] font-black uppercase rounded -rotate-2">
            OFFICIAL DW AUDIT RECORD
          </div>
          <div className="text-[9px] text-neutral-600 mt-0.5">PAGE 01 // TRAFFICDW V2.0</div>
        </div>
      </div>

      {/* Ledger Table */}
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-700 bg-neutral-200/60 text-neutral-800 font-bold uppercase tracking-wider text-[10px]">
            <th className="py-1.5 px-2 border-r border-neutral-400">#</th>
            {columns.map((col, idx) => (
              <th key={idx} className="py-1.5 px-2 border-r border-neutral-400 last:border-r-0">
                {col.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300">
          {data.map((row, idx) => {
            if (renderRow) return renderRow(row, idx);
            return (
              <tr key={idx} className="hover:bg-amber-100/60 transition-colors">
                <td className="py-1.5 px-2 font-bold text-neutral-600 border-r border-neutral-300">
                  {(idx + 1).toString().padStart(2, '0')}
                </td>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="py-1.5 px-2 border-r border-neutral-300 last:border-r-0 whitespace-nowrap">
                    {String(row[col] ?? '-')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer Total Bar */}
      <div className="mt-3 pt-2 border-t-2 border-neutral-700/80 flex items-center justify-between text-[10px] font-bold text-neutral-700">
        <span>TOTAL AUDITED ROWS: {data.length}</span>
        <span>VERIFIED BY: STAR_SCHEMA_VALIDATOR</span>
      </div>
    </div>
  );
};
