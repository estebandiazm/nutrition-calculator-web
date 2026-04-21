'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SummaryCard from '@/components/activity/SummaryCard';
import TrendsChart from '@/components/activity/TrendsChart';
import RecentRecords from '@/components/activity/RecentRecords';
import WeightTrendsChart from '@/components/activity/WeightTrendsChart';
import WeightRecentRecords from '@/components/activity/WeightRecentRecords';
import DailyStepsModal from '@/components/client/DailyStepsModal';
import DailyWeightModal from '@/components/client/DailyWeightModal';
import { DailyStep } from '@/domain/types/DailySteps';
import { DailyWeight } from '@/domain/types/DailyWeight';

type Tab = 'steps' | 'weight';

interface ActivityPageClientProps {
  clientId: string;
  clientName: string;
  dailySteps: DailyStep[];
  dailyWeights: DailyWeight[];
  stepGoal?: number;
  targetWeight?: number;
  onRefresh?: () => void;
}

export function ActivityPageClient({
  clientId,
  clientName,
  dailySteps,
  dailyWeights,
  stepGoal,
  targetWeight,
  onRefresh,
}: ActivityPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get('tab') as Tab) === 'weight' ? 'weight' : 'steps';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`/activity?tab=${tab}`, { scroll: false });
  };

  const dailyAverage =
    dailySteps.length > 0
      ? Math.round(
          dailySteps.reduce((sum, step) => sum + step.steps, 0) / dailySteps.length
        )
      : 0;

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    onRefresh?.();
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Activity Tracker</h1>
          <p className="text-on-surface-variant mt-2 font-medium">
            {activeTab === 'steps'
              ? 'Monitor your daily steps and progress toward your goals'
              : 'Track your weight and progress toward your target'}
          </p>
        </div>
        <button
          onClick={() =>
            activeTab === 'steps'
              ? setIsStepsModalOpen(true)
              : setIsWeightModalOpen(true)
          }
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-700 hover:to-purple-700 transition w-full lg:w-auto"
        >
          + Add Record
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        <button
          onClick={() => handleTabChange('steps')}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'steps'
              ? 'text-pink-400 border-pink-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base align-middle mr-1">
            directions_run
          </span>
          Steps
        </button>
        <button
          onClick={() => handleTabChange('weight')}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'weight'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base align-middle mr-1">
            monitor_weight
          </span>
          Weight
        </button>
      </div>

      {/* Steps Tab */}
      {activeTab === 'steps' && (
        <>
          <SummaryCard dailyAverage={dailyAverage} stepGoal={stepGoal} />
          {dailySteps.length > 0 && (
            <TrendsChart steps={dailySteps} key={`chart-${refreshKey}`} />
          )}
          {dailySteps.length > 0 ? (
            <RecentRecords
              steps={dailySteps}
              stepGoal={stepGoal}
              key={`records-${refreshKey}`}
            />
          ) : (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6">
              <p className="text-gray-400 text-center">
                No step records yet. Start tracking by adding your first record.
              </p>
            </div>
          )}
        </>
      )}

      {/* Weight Tab */}
      {activeTab === 'weight' && (
        <>
          <WeightTrendsChart weights={dailyWeights} key={`weight-chart-${refreshKey}`} />
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Recent Records</h3>
            <WeightRecentRecords
              weights={dailyWeights}
              key={`weight-records-${refreshKey}`}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <DailyStepsModal
        open={isStepsModalOpen}
        onClose={() => setIsStepsModalOpen(false)}
        clientId={clientId}
        onSuccess={handleSuccess}
      />
      <DailyWeightModal
        open={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        clientId={clientId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
