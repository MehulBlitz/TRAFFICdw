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
  // Map value to angle (-135 deg to +135 deg)
  const percent = (value - min) / (max - min || 1);
  const angle = -135 + percent * 270;

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
      className="flex flex-col items-center gap-1.5 p-3 bg-neutral-900/90 rounded-lg border border-neutral-800 shadow-inner select-none"
    >
      <span className="text-[11px] font-bold text-neutral-300 tracking-tight text-center">{label}</span>

      {/* Rotary Knob Housing */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer Circular Scale Ticks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="#262626"
            strokeWidth="3"
            fill="none"
            strokeDasharray="163"
            strokeDashoffset="40"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="#eab308"
            strokeWidth="3"
            fill="none"
            strokeDasharray="163"
            strokeDashoffset={163 - percent * 123}
            strokeLinecap="round"
          />
        </svg>

        {/* Physical Fluted Bakelite / Aluminum Knob */}
        <div
          className="w-11 h-11 rounded-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 border border-neutral-600 shadow-lg shadow-black/80 flex items-center justify-center transition-transform duration-75 relative cursor-pointer"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Top Knurled Ring */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-700/50 flex items-center justify-center">
            {/* White Indicator Dot / Notch */}
            <div className="w-1 h-3.5 bg-amber-400 rounded-full absolute top-1 shadow-sm shadow-amber-400" />
          </div>
        </div>
      </div>

      {/* Digital Readout */}
      <div className="px-2 py-0.5 bg-black border border-neutral-700 rounded text-[10px] font-mono font-bold text-amber-400">
        {value.toFixed(step < 1 ? 2 : 0)} {unit}
      </div>
    </div>
  );
};
