'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { DailyStep } from '../../domain/types/DailySteps';

interface TrendsChartProps {
  steps: DailyStep[];
}

export default function TrendsChart({ steps }: TrendsChartProps) {
  const [period, setPeriod] = useState<'month' | 'week'>('month');

  const cutoffDate = new Date();
  const daysBack = period === 'week' ? 7 : 30;
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const filteredSteps = steps.filter((step) => new Date(step.date) >= cutoffDate);

  const chartData = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dateISODate = date.toISOString().split('T')[0];
    const stepEntry = filteredSteps.find((s) => {
      const sISODate = new Date(s.date).toISOString().split('T')[0];
      return sISODate === dateISODate;
    });

    chartData.push({
      date: dateStr,
      steps: stepEntry?.steps ?? 0,
    });
  }

  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">Activity Trends</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-sm font-semibold transition ${
              period === 'week'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-pink-500'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-sm font-semibold transition ${
              period === 'month'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-pink-500'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.85rem' }} />
            <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.85rem' }} />
            <Tooltip
              contentStyle={{
                background: '#0d1a33',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="steps" fill="#E91E8C" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
