import React from 'react';
import { playFaderTick } from '../../audio/soundEffects';

interface ConsoleFaderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (val: number) => void;
  ticks?: Array<{ val: number; label: string }>;
  vertical?: boolean;
}

export const ConsoleFader: React.FC<ConsoleFaderProps> = ({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  onChange,
  ticks,
  vertical = false,
}) => {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    playFaderTick();
    onChange(newVal);
  };

  if (vertical) {
    return (
      <div id={id} className="flex flex-col items-center gap-2 p-3 bg-neutral-900/90 rounded-lg border border-neutral-800 shadow-inner">
        <span className="text-[11px] font-bold text-neutral-300 text-center tracking-tight">{label}</span>
        
        {/* Vertical Fader Track Container */}
        <div className="relative h-44 w-12 flex items-center justify-center py-2">
          {/* Tick Scale Marks */}
          <div className="absolute left-1 h-full flex flex-col justify-between text-[8px] text-neutral-500 font-mono select-none">
            <span>+10</span>
            <span>+5</span>
            <span>0</span>
            <span>-5</span>
            <span>-∞</span>
          </div>

          {/* Recessed Track */}
          <div className="w-2.5 h-full bg-neutral-950 rounded-full border border-neutral-800 shadow-inner relative flex justify-center">
            {/* Center Slot Line */}
            <div className="w-0.5 h-full bg-black/80" />
            
            {/* Chrome Fader Cap */}
            <div
              className="absolute w-10 h-7 fader-cap rounded shadow-lg transition-all duration-75 flex items-center justify-center"
              style={{ bottom: `calc(${percent}% - 14px)` }}
            />
          </div>

          {/* Hidden Input for interaction */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
          />
        </div>

        {/* Digital Readout */}
        <div className="px-2 py-0.5 bg-black border border-neutral-700 rounded text-[11px] font-mono font-bold text-amber-400">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </div>
      </div>
    );
  }

  // Horizontal Console Fader
  return (
    <div id={id} className="flex flex-col gap-1.5 p-2.5 bg-neutral-900/90 rounded-lg border border-neutral-800 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-300 tracking-tight">{label}</span>
        <span className="px-1.5 py-0.5 bg-black border border-neutral-800 rounded text-[11px] font-mono font-bold text-amber-400">
          {value.toFixed(step < 1 ? 2 : 0)} {unit}
        </span>
      </div>

      <div className="relative py-3 flex items-center">
        {/* Recessed Track */}
        <div className="w-full h-3 bg-neutral-950 rounded-full border border-neutral-800 shadow-inner relative flex items-center">
          <div className="w-full h-0.5 bg-black/90" />
          
          {/* Fader Cap */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-6 fader-cap rounded shadow-md pointer-events-none"
            style={{ left: `calc(${percent}% - 16px)` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      {ticks && (
        <div className="flex justify-between text-[9px] text-neutral-500 font-mono px-1">
          {ticks.map((t, i) => (
            <span key={i}>{t.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};
