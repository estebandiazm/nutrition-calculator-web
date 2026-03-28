'use client';

import React from 'react';
import Link from 'next/link';

export interface PlanSwitcherProps {
  plans: {
    label?: string;
    days?: string;
  }[];
  activeIndex: number;
}

export function PlanSwitcher({ plans, activeIndex }: PlanSwitcherProps) {
  if (!plans || plans.length <= 1) {
    return null; // Don't show switcher if there's only 0 or 1 plan
  }

  return (
    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 lg:w-auto w-full">
      {plans.map((plan, index) => {
        const isActive = index === activeIndex;
        // fallback to "Plan X" and "(N Days)"
        const label = plan.label || `Plan ${index + 1}`;
        const days = plan.days ? `(${plan.days})` : '';

        return (
          <Link
            key={index}
            href={`?planIndex=${index}`}
            scroll={false}
            className={`flex-1 flex text-center justify-center items-center px-4 lg:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
              isActive
                ? 'bg-gradient-to-br from-primary to-accent-purple text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            {label} {days}
          </Link>
        );
      })}
    </div>
  );
}
