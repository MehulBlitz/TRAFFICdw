import React from 'react';
import { playFaderTick } from '../../audio/soundEffects';

interface AnalogDialProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const AnalogDial: React.FC<AnalogDialProps> = ({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  onChange,
}) => {
  const percent = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  // Angle: -120 deg to +120 deg
  const angle = -120 + percent * 240;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const nextVal = Math.min(max, Math.max(min, value + delta));
    if (nextVal !== value) {
      playFaderTick();
      onChange(Number(nextVal.toFixed(2)));
    }
  };

  return (
    <div
      id={id}
      onWheel={handleWheel}
      className="flex flex-col items-center gap-2 p-4 neu-raised rounded-3xl select-none"
    >
      <span className="text-xs font-semibold text-slate-500 tracking-tight text-center">
        {label}
      </span>

      {/* Thermostat / Dial Disc */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Rainbow Gradient Outer Ring Track */}
        <div className="absolute inset-0 rounded-full p-2.5 neu-inset flex items-center justify-center">
          <div className="w-full h-full rounded-full neu-gradient-spectrum p-1 flex items-center justify-center shadow-inner">
            <div className="w-full h-full rounded-full bg-[#ebf0f7]" />
          </div>
        </div>

        {/* Dynamic Indicator Bead on the Ring */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-md shadow-blue-500/50 border-2 border-white -translate-y-[52px]" />
        </div>

        {/* Center Embossed Convex Circular Reading Disc */}
        <div className="w-24 h-24 neu-circle flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-transform z-10">
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            {value.toFixed(step < 1 ? 1 : 0)}
          </span>
          <span className="text-[11px] font-medium text-slate-400 -mt-0.5">
            {unit}
          </span>
        </div>
      </div>

      {/* Helper adjust hint */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
        <span>Scroll / drag to adjust</span>
      </div>
    </div>
  );
};

