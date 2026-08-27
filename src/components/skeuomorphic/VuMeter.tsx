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
  // Needle Angle from -45 deg to +45 deg
  const clamped = Math.min(100, Math.max(0, value));
  const needleAngle = -45 + (clamped / 100) * 90;

  return (
    <div
      id={id}
      className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 shadow-inner flex flex-col items-center gap-1.5"
    >
      <div className="flex items-center justify-between w-full text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-amber-400 font-mono font-bold">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>

      {/* Analog Gauge Face */}
      <div className="relative w-44 h-24 bg-gradient-to-b from-amber-50 to-amber-100/90 rounded-t-full rounded-b-md border-2 border-neutral-700 p-2 shadow-inner overflow-hidden flex flex-col justify-end items-center">
        {/* Vintage Warm Backlight Glow */}
        <div className="absolute inset-0 bg-radial from-amber-200/40 to-transparent pointer-events-none" />

        {/* Gauge Scale Arc Arc Line */}
        <svg className="absolute top-1 w-40 h-20 overflow-visible" viewBox="0 0 160 80">
          {/* Normal Zone (Green) */}
          <path
            d="M 15 70 A 65 65 0 0 1 100 15"
            fill="none"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeDasharray="2 1"
          />
          {/* Warning Zone (Yellow) */}
          <path
            d="M 100 15 A 65 65 0 0 1 130 35"
            fill="none"
            stroke="#ca8a04"
            strokeWidth="3.5"
            strokeDasharray="2 1"
          />
          {/* Danger Zone (Red) */}
          <path
            d="M 130 35 A 65 65 0 0 1 145 70"
            fill="none"
            stroke="#dc2626"
            strokeWidth="4"
          />

          {/* Scale Labels */}
          <text x="20" y="65" fontSize="8" fill="#1f2937" fontWeight="bold">0</text>
          <text x="50" y="32" fontSize="8" fill="#1f2937" fontWeight="bold">50</text>
          <text x="100" y="24" fontSize="8" fill="#1f2937" fontWeight="bold">{warningThreshold}</text>
          <text x="135" y="65" fontSize="8" fill="#991b1b" fontWeight="bold">100</text>
        </svg>

        {/* Brand Text */}
        <div className="text-[7px] font-bold tracking-widest text-neutral-600 mb-1 z-10">
          TRAFFICDW CALIBRATED
        </div>

        {/* Physical Needle with Pivot Pivot */}
        <div
          className="absolute bottom-0 w-0.5 h-16 bg-red-600 origin-bottom transition-transform duration-200 shadow-sm z-20"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        />

        {/* Chrome Pivot Cap */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-b from-neutral-300 via-neutral-600 to-neutral-800 border border-neutral-700 shadow-md z-30 mb--1" />
      </div>

      {subLabel && <span className="text-[9px] text-neutral-400 font-mono">{subLabel}</span>}
    </div>
  );
};
