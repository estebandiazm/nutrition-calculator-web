import React from 'react';
import { GlassCard } from '../ui/GlassCard';

interface StepsCounterProps {
  current?: number;
  goal?: number;
}

export function StepsCounter({ current = 8450, goal = 10000 }: StepsCounterProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <GlassCard className="rounded-3xl p-6 border-white/10">
      <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">Steps Counter</h3>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
          <span className="material-symbols-outlined text-3xl">directions_run</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{current.toLocaleString()}</p>
          <p className="text-xs text-on-surface-variant font-medium">Goal: {goal.toLocaleString()}</p>
        </div>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
        <div className="bg-primary h-full shadow-[0_0_15px_rgba(236,72,153,0.4)]" style={{ width: `${percentage}%` }}></div>
      </div>
    </GlassCard>
  );
}
