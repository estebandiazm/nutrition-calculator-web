'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { DailyWeight } from '@/domain/types/DailyWeight';

interface WeightTrendsChartProps {
  weights: DailyWeight[];
  targetWeight?: number;
}

export default function WeightTrendsChart({ weights, targetWeight }: WeightTrendsChartProps) {
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
    const dateISODate = date.toISOString().split('T')[0];
    const entry = weights.find((w) => {
      const wISODate = new Date(w.date).toISOString().split('T')[0];
      return wISODate === dateISODate;
    });

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
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '0.85rem' }} />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '0.85rem' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            {targetWeight && (
              <ReferenceLine
                y={targetWeight}
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Target: ${targetWeight} kg`,
                  position: 'right',
                  fill: '#10b981',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <Tooltip
              contentStyle={{
                background: 'rgba(13, 26, 51, 0.95)',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value) =>
                value != null ? [`${value} kg`, 'Weight'] : ['No data', 'Weight']
              }
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWeight)"
              dot={{
                fill: '#3b82f6',
                r: 4,
                strokeWidth: 2,
                stroke: '#0d1a33',
              }}
              activeDot={{
                r: 6,
                fill: '#3b82f6',
                stroke: '#60a5fa',
                strokeWidth: 2,
              }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
