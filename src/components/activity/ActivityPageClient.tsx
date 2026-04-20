'use client';

import React, { useState } from 'react';
import SummaryCard from '@/components/activity/SummaryCard';
import TrendsChart from '@/components/activity/TrendsChart';
import RecentRecords from '@/components/activity/RecentRecords';
import DailyStepsModal from '@/components/client/DailyStepsModal';
import { DailyStep } from '@/domain/types/DailySteps';

interface ActivityPageClientProps {
  clientId: string;
  clientName: string;
  dailySteps: DailyStep[];
  stepGoal?: number;
  onRefresh?: () => void;
}

export function ActivityPageClient({
  clientId,
  clientName,
  dailySteps,
  stepGoal,
  onRefresh,
}: ActivityPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const dailyAverage = dailySteps.length > 0
    ? Math.round(dailySteps.reduce((sum, step) => sum + step.steps, 0) / dailySteps.length)
    : 0;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    onRefresh?.();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Activity Tracker</h1>
          <p className="text-on-surface-variant mt-2 font-medium">
            Monitor your daily steps and progress toward your goals
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition w-full lg:w-auto"
        >
          + Add Record
        </button>
      </div>

      {/* Summary Section */}
      <SummaryCard dailyAverage={dailyAverage} stepGoal={stepGoal} />

      {/* Chart Section */}
      {dailySteps.length > 0 && <TrendsChart steps={dailySteps} key={`chart-${refreshKey}`} />}

      {/* Recent Records Section */}
      {dailySteps.length > 0 ? (
        <RecentRecords steps={dailySteps} stepGoal={stepGoal} key={`records-${refreshKey}`} />
      ) : (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-center">No step records yet. Start tracking by adding your first record.</p>
        </div>
      )}

      <DailyStepsModal
        open={isModalOpen}
        onClose={handleModalClose}
        clientId={clientId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
