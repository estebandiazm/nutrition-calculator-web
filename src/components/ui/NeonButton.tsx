import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function NeonButton({ children, className = '', ...rest }: NeonButtonProps) {
  return (
    <button
      className={`btn-neon-gradient px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg active:scale-95 transition-transform ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
