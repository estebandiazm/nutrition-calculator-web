import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function GlassCard({ children, className = '', id }: GlassCardProps) {
  return (
    <div id={id} className={`glass-card rounded-2xl md:rounded-3xl relative border-white/10 ${className}`}>
      {children}
    </div>
  );
}
