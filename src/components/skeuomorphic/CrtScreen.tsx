import React from 'react';

interface CrtScreenProps {
  id?: string;
  title?: string;
  badge?: string;
  phosphor?: 'green' | 'amber' | 'blue';
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  heightClass?: string;
  scanlines?: boolean;
}

export const CrtScreen: React.FC<CrtScreenProps> = ({
  id,
  title = 'TELEMETRY VIEW // TRAFFICDW ENGINE',
  badge = 'ACTIVE',
  phosphor = 'blue',
  children,
  headerRight,
  heightClass = 'min-h-[420px]',
}) => {
  const getBadgeStyle = () => {
    if (phosphor === 'amber') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (phosphor === 'green') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div
      id={id}
      className="neu-raised-lg p-5 rounded-3xl relative flex flex-col gap-4 border border-white/80"
    >
      {/* Soft Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
          <h3 className="text-sm font-bold tracking-tight text-slate-800">
            {title}
          </h3>
          {badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">{headerRight}</div>
      </div>

      {/* Recessed Soft Display Well */}
      <div
        className={`relative flex-1 rounded-2xl p-4 sm:p-5 overflow-auto neu-inset bg-[#ebf0f7] text-slate-800 ${heightClass}`}
      >
        <div className="relative z-10">{children}</div>
      </div>

      {/* Soft Footer Status Bar */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-medium">
        <span>TrafficDW Engine v2.4</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Telemetric Link Active</span>
        </div>
        <span>Ultra-low Latency</span>
      </div>
    </div>
  );
};

