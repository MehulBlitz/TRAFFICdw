import React from 'react';

interface VuMeterProps {
  id: string;
  label: string;
  value: number; // 0 to 100
  unit?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  subLabel?: string;
}

export const VuMeter: React.FC<VuMeterProps> = ({
  id,
  label,
  value,
  unit = '%',
  warningThreshold = 65,
  dangerThreshold = 85,
  subLabel,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      id={id}
      className="p-4 neu-raised rounded-2xl flex flex-col gap-2 select-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className="text-sm font-bold text-slate-800">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>

      {/* Neumorphic Inset Progress Track with Vibrant Gradient */}
      <div className="w-full h-3 neu-inset-sm rounded-full p-0.5 relative overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 shadow-sm"
          style={{
            width: `${clamped}%`,
            background:
              clamped > dangerThreshold
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : clamped > warningThreshold
                ? 'linear-gradient(90deg, #06b6d4, #f59e0b)'
                : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
          }}
        />
      </div>

      {subLabel && (
        <span className="text-[10px] text-slate-400 font-medium">{subLabel}</span>
      )}
    </div>
  );
};

