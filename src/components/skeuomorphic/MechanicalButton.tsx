import React from 'react';
import { playPushButton } from '../../audio/soundEffects';

interface MechanicalButtonProps {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'danger' | 'success' | 'amber' | 'neutral' | 'metallic';
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MechanicalButton: React.FC<MechanicalButtonProps> = ({
  id,
  label,
  onClick,
  variant = 'neutral',
  icon,
  disabled = false,
  active = false,
  size = 'md',
}) => {
  const handleClick = () => {
    if (disabled) return;
    playPushButton();
    onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-gradient-to-b from-red-600 to-red-800 text-white border-red-950 hover:from-red-500 hover:to-red-700 shadow-red-950/60';
      case 'success':
        return 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-emerald-950 hover:from-emerald-500 hover:to-emerald-700 shadow-emerald-950/60';
      case 'amber':
        return 'bg-gradient-to-b from-amber-500 to-amber-700 text-black font-black border-amber-950 hover:from-amber-400 hover:to-amber-600 shadow-amber-950/60';
      case 'metallic':
        return 'bg-gradient-to-b from-neutral-200 via-neutral-400 to-neutral-500 text-neutral-900 font-bold border-neutral-600 hover:from-neutral-100 hover:to-neutral-400';
      default:
        return 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 text-neutral-200 border-neutral-950 hover:from-neutral-600 hover:to-neutral-800 shadow-black/80';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1 text-xs';
      case 'lg':
        return 'px-5 py-2.5 text-sm font-bold tracking-wide';
      default:
        return 'px-3.5 py-1.5 text-xs font-semibold';
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded border shadow-md transition-all duration-75 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()} ${
        active ? 'translate-y-0.5 shadow-inner' : 'active:translate-y-0.5 active:shadow-inner'
      }`}
    >
      {/* Chrome Bevel Highlight on Top Edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 rounded-t" />
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
