import React from 'react';
import { playSwitchClick } from '../../audio/soundEffects';

interface RackSwitchProps {
  id: string;
  code: string;
  label: string;
  badge?: string;
  active: boolean;
  onToggle: () => void;
  ledColor?: 'green' | 'red' | 'amber' | 'blue';
}

export const RackSwitch: React.FC<RackSwitchProps> = ({
  id,
  code,
  label,
  badge,
  active,
  onToggle,
  ledColor = 'green',
}) => {
  const handleClick = () => {
    playSwitchClick(active ? 'down' : 'up');
    onToggle();
  };

  const getLedClass = () => {
    if (!active) return `led-off-${ledColor}`;
    return `led-on-${ledColor}`;
  };

  return (
    <div
      id={id}
      onClick={handleClick}
      className={`group relative p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 select-none ${
        active
          ? 'neu-inset bg-[#ebf0f7] border-blue-200/80 shadow-inner'
          : 'neu-raised hover:scale-[1.01] hover:bg-[#eef3f9]'
      }`}
    >
      {/* Indicator Pill / Icon Dot */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            active
              ? 'neu-inset-sm bg-blue-500/10 text-blue-600'
              : 'neu-raised-sm bg-[#ebf0f7] text-slate-500 group-hover:text-slate-800'
          }`}
        >
          <div className={`led-jewel ${getLedClass()}`} />
        </div>

        {/* Switch Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] tracking-wider font-bold uppercase transition-colors ${
                active ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {code}
            </span>
            {badge && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600 font-medium">
                {badge}
              </span>
            )}
          </div>
          <div
            className={`text-xs font-semibold truncate transition-colors ${
              active ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'
            }`}
          >
            {label}
          </div>
        </div>
      </div>

      {/* Neumorphic Soft Toggle Pill */}
      <div
        className={`w-10 h-5 rounded-full transition-all duration-200 p-0.5 flex items-center shrink-0 ${
          active ? 'bg-blue-500 justify-end shadow-sm' : 'neu-inset-sm justify-start'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-all shadow-md ${
            active ? 'scale-105' : 'scale-95 bg-slate-300'
          }`}
        />
      </div>
    </div>
  );
};

