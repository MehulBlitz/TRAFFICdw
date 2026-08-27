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
      className={`group relative p-2.5 rounded-lg border cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 select-none ${
        active
          ? 'bg-gradient-to-r from-neutral-800 to-neutral-900 border-neutral-600 shadow-md shadow-black/80'
          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
      }`}
    >
      {/* Screw accent on left edge */}
      <div className="screw-head shrink-0 opacity-70" />

      {/* Switch Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider font-bold text-amber-500/90 uppercase">{code}</span>
          {badge && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
              {badge}
            </span>
          )}
        </div>
        <div
          className={`text-xs font-semibold truncate transition-colors ${
            active ? 'text-neutral-100' : 'text-neutral-400 group-hover:text-neutral-200'
          }`}
        >
          {label}
        </div>
      </div>

      {/* Physical Rocker Switch Lever */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* LED Light */}
        <div className={`led-jewel ${getLedClass()}`} />

        {/* Rocker Mechanism */}
        <div className="w-8 h-12 bg-neutral-950 rounded border border-neutral-800 p-1 flex flex-col justify-between shadow-inner">
          <div
            className={`w-full h-5 rounded-sm transition-all duration-100 flex items-center justify-center text-[8px] font-bold ${
              active
                ? 'bg-gradient-to-b from-red-600 to-red-900 text-white shadow-md'
                : 'bg-neutral-800 text-neutral-600'
            }`}
          >
            I
          </div>
          <div
            className={`w-full h-5 rounded-sm transition-all duration-100 flex items-center justify-center text-[8px] font-bold ${
              !active
                ? 'bg-gradient-to-b from-neutral-700 to-neutral-800 text-neutral-300 shadow-inner'
                : 'bg-neutral-900 text-neutral-700'
            }`}
          >
            O
          </div>
        </div>
      </div>
    </div>
  );
};
