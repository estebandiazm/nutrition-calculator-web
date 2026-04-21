'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { DailyWeight } from '@/domain/types/DailyWeight';

interface WeightTrendsChartProps {
  weights: DailyWeight[];
}

export default function WeightTrendsChart({ weights }: WeightTrendsChartProps) {
  const [period, setPeriod] = useState<'month' | 'week'>('month');

  const cutoffDate = new Date();
  const daysBack = period === 'week' ? 7 : 30;
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Build chart data with null for missing days (gaps, not zeros)
  const chartData = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const entry = weights.find(
      (w) => new Date(w.date).toDateString() === date.toDateString()
    );

    chartData.push({
      date: dateStr,
      weight: entry?.weight ?? null,
    });
  }

  if (weights.length === 0) return null;

  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">Weight Trends</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-sm font-semibold transition ${
              period === 'week' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-sm font-semibold transition ${
              period === 'month' ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.85rem' }} />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '0.85rem' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                background: '#0d1a33',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) =>
                value != null ? [`${value} kg`, 'Weight'] : ['No data', 'Weight']
              }
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: '#60a5fa', r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
