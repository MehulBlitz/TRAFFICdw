import React from 'react';

interface LedIndicatorProps {
  id?: string;
  label?: string;
  active: boolean;
  color?: 'green' | 'red' | 'amber' | 'blue';
  pulse?: boolean;
}

export const LedIndicator: React.FC<LedIndicatorProps> = ({
  id,
  label,
  active,
  color = 'green',
  pulse = false,
}) => {
  const getLedClass = () => {
    if (!active) return `led-off-${color}`;
    return `led-on-${color} ${pulse ? 'animate-pulse' : ''}`;
  };

  return (
    <div id={id} className="inline-flex items-center gap-2 select-none">
      <div className={`led-jewel ${getLedClass()} shrink-0`} />
      {label && (
        <span className="text-[11px] font-semibold tracking-tight text-neutral-300">
          {label}
        </span>
      )}
    </div>
  );
};
