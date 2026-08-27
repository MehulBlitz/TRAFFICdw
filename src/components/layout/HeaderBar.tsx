import React, { useState, useEffect } from 'react';
import { LedIndicator } from '../skeuomorphic/LedIndicator';
import { Activity, Zap, Radio, Clock, ShieldCheck } from 'lucide-react';

interface HeaderBarProps {
  datasetName?: string;
  onOpenUploadModal?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  datasetName = 'National Indian Highway Star Schema v2.4',
  onOpenUploadModal,
}) => {
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
      className="w-full neu-raised-lg px-6 py-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 select-none relative"
    >
      {/* Brand Identity & Soft User Greeting (Inspired by Reference Screenshot) */}
      <div className="flex items-center gap-4">
        {/* Soft Elevated App Icon */}
        <div className="w-12 h-12 rounded-2xl neu-raised flex items-center justify-center text-blue-600 shadow-md">
          <Radio className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              TrafficDW <span className="text-blue-600">Studio</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
              PRO DW
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Active Dataset: <span className="text-slate-700 font-semibold">{datasetName}</span>
          </p>
        </div>
      </div>

      {/* Quick Access Metric Cards & Upload Button */}
      <div className="flex items-center gap-3">
        {onOpenUploadModal && (
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-4 py-2.5 neu-raised text-xs font-bold text-blue-600 rounded-2xl hover:bg-blue-50 transition-all shadow-xs"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Upload Dataset</span>
          </button>
        )}

        {/* Quick Ingestion Stat Card */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 neu-inset rounded-2xl">
          <div className="w-8 h-8 rounded-xl neu-raised-sm flex items-center justify-center text-amber-500">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 leading-none">
              27.4k <span className="text-[10px] text-slate-400 font-medium">rec/s</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Live Ingestion Feed
            </div>
          </div>
        </div>

        {/* Live Clock & System Status */}
        <div className="flex items-center gap-4 px-4 py-2.5 neu-raised-sm rounded-2xl">
          <LedIndicator id="led-master-pwr" label="LIVE" active={true} color="green" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

