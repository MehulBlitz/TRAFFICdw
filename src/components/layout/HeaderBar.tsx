import React, { useState, useEffect } from 'react';
import { LedIndicator } from '../skeuomorphic/LedIndicator';
import { Radio, ShieldAlert, Cpu } from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="main-industrial-header"
      className="w-full bg-brushed-chassis border-b-2 border-neutral-800 px-5 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4 select-none relative"
    >
      {/* Brand Identity & Physical Model Badge */}
      <div className="flex items-center gap-4">
        <div className="screw-head" />

        <div className="flex items-center gap-3">
          {/* Metallic Cast Logo Plate */}
          <div className="bg-gradient-to-b from-neutral-200 via-neutral-400 to-neutral-500 p-2 rounded-lg border-2 border-neutral-700 shadow-md flex items-center justify-center">
            <Radio className="w-5 h-5 text-neutral-950 font-black" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-widest text-neutral-100 uppercase font-mono">
                TrafficDW Studio
              </h1>
              <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider">
                MARK-II
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              Zero-Code Highway Telemetry Data Warehouse & Analytical Machine
            </p>
          </div>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden md:flex items-center gap-5 px-4 py-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
        <LedIndicator id="led-master-pwr" label="MAIN POWER" active={true} color="green" />
        <LedIndicator id="led-clock-sync" label="TELEMETRY CLOCK" active={true} color="amber" />
        <div className="text-xs font-mono font-bold text-amber-400 bg-black px-2.5 py-0.5 rounded border border-neutral-800">
          {timeStr}
        </div>
      </div>

      {/* Right Model Specification Badge */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest font-mono">
            STAR SCHEMA ARCHITECTURE
          </div>
          <div className="text-[9px] text-neutral-500 font-mono">
            FACT + 5 DIMENSIONS // ANSI SQL-99
          </div>
        </div>

        <div className="screw-head" />
      </div>
    </header>
  );
};
