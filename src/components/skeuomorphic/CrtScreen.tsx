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
  title = 'TERMINAL // TRAFFICDW ENGINE',
  badge = 'SYS-ONLINE',
  phosphor = 'green',
  children,
  headerRight,
  heightClass = 'min-h-[420px]',
  scanlines = true,
}) => {
  const getGlassClass = () => {
    if (phosphor === 'amber') return 'crt-glass-amber';
    if (phosphor === 'blue') return 'bg-slate-950 text-sky-400 text-shadow-sm shadow-inner';
    return 'crt-glass-green';
  };

  return (
    <div id={id} className="crt-bezel p-3 rounded-xl shadow-2xl relative flex flex-col">
      {/* Top Screws on CRT Housing */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="screw-head" />
          <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase font-mono">
            {title}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-800 border border-neutral-700 text-neutral-300">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {headerRight}
          <div className="screw-head" />
        </div>
      </div>

      {/* Curved CRT Glass Monitor */}
      <div
        className={`relative flex-1 rounded-lg p-4 overflow-auto font-mono ${getGlassClass()} ${heightClass} border border-black/40`}
      >
        {/* Subtle Glass Reflection Curve */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none rounded-lg" />

        {/* Scanlines Effect */}
        {scanlines && <div className="absolute inset-0 scanlines rounded-lg" />}

        {/* Inner Content */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* Bottom CRT Calibration Notches & Power Indicator */}
      <div className="flex items-center justify-between mt-2 px-2 text-[9px] font-mono text-neutral-500">
        <span>RESOLUTION: 1024x768 HYPERCUBE</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" />
          <span>PHOSPHOR EMISSION READY</span>
        </div>
        <span>CYCLE: 60Hz</span>
      </div>
    </div>
  );
};
