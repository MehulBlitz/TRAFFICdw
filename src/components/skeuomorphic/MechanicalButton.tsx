import React from 'react';
import { playPushButton } from '../../audio/soundEffects';

interface MechanicalButtonProps {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'danger' | 'success' | 'amber' | 'neutral' | 'metallic' | 'primary';
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
    if (active) {
      switch (variant) {
        case 'danger':
          return 'neu-inset bg-[#ebf0f7] text-rose-600 font-bold border-rose-200/60';
        case 'success':
          return 'neu-inset bg-[#ebf0f7] text-emerald-600 font-bold border-emerald-200/60';
        case 'amber':
          return 'neu-inset bg-[#ebf0f7] text-amber-600 font-bold border-amber-200/60';
        case 'primary':
          return 'neu-inset bg-[#ebf0f7] text-blue-600 font-bold border-blue-200/60';
        default:
          return 'neu-inset bg-[#ebf0f7] text-slate-900 font-bold border-slate-300/60';
      }
    }

    switch (variant) {
      case 'danger':
        return 'neu-btn text-rose-600 hover:text-rose-700 hover:bg-rose-50/40';
      case 'success':
        return 'neu-btn text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/40';
      case 'amber':
        return 'neu-btn text-amber-600 hover:text-amber-700 hover:bg-amber-50/40';
      case 'primary':
        return 'neu-btn text-blue-600 hover:text-blue-700 hover:bg-blue-50/40';
      case 'metallic':
        return 'neu-btn text-slate-700 hover:text-slate-900';
      default:
        return 'neu-btn text-slate-700 hover:text-slate-900';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-semibold rounded-xl';
      case 'lg':
        return 'px-6 py-3 text-sm font-bold tracking-wide rounded-2xl';
      default:
        return 'px-4 py-2 text-xs font-semibold rounded-xl';
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
};

