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
      <div
        id={id}
        className="flex flex-col items-center gap-2 p-4 neu-raised rounded-3xl"
      >
        <span className="text-xs font-semibold text-slate-500 text-center tracking-tight">
          {label}
        </span>

        {/* Vertical Track */}
        <div className="relative h-44 w-12 flex items-center justify-center py-2">
          <div className="w-3 h-full neu-inset-sm rounded-full relative flex justify-center">
            {/* Slider Thumb */}
            <div
              className="absolute w-8 h-8 rounded-full neu-circle bg-[#ebf0f7] transition-all duration-75 shadow-md flex items-center justify-center"
              style={{ bottom: `calc(${percent}% - 16px)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
            </div>
          </div>

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

        {/* Value Readout */}
        <div className="px-2.5 py-1 neu-inset-sm rounded-xl text-xs font-bold text-slate-800">
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit}
        </div>
      </div>
    );
  }

  // Horizontal Neumorphic Slider
  return (
    <div
      id={id}
      className="flex flex-col gap-2 p-3.5 neu-raised rounded-2xl"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="px-2 py-0.5 neu-inset-sm rounded-lg text-xs font-bold text-slate-800">
          {value.toFixed(step < 1 ? 2 : 0)} {unit}
        </span>
      </div>

      <div className="relative py-2 flex items-center">
        {/* Recessed Track with Gradient fill */}
        <div className="w-full h-2.5 neu-inset-sm rounded-full relative flex items-center overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Floating Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full neu-circle bg-[#ebf0f7] pointer-events-none flex items-center justify-center shadow-md"
          style={{ left: `calc(${percent}% - 12px)` }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-500" />
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
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
          {ticks.map((t, i) => (
            <span key={i}>{t.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

