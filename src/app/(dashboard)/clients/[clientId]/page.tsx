import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authProvider } from '@/lib/registry';
import { getCoachByAuthId } from '@/app/actions/coachActions';
import { getClientById } from '@/app/actions/clientActions';
import { CoachHeader } from '@/components/coach/CoachHeader';
import { CoachSidebar } from '@/components/coach/CoachSidebar';
import SummaryCard from '@/components/activity/SummaryCard';
import TrendsChart from '@/components/activity/TrendsChart';
import RecentRecords from '@/components/activity/RecentRecords';
import StepGoalEditor from '@/components/coach/StepGoalEditor';

interface ClientDetailPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage(props: ClientDetailPageProps) {
  const params = await props.params;
  const clientId = params.clientId;

  const session = await authProvider.getSession();
  if (!session) {
    redirect('/login');
  }

  const coach = await getCoachByAuthId(session.user.id);
  if (!coach) {
    redirect('/login?error=Coach+profile+not+found');
  }

  const client = await getClientById(clientId);
  if (!client) {
    redirect('/clients?error=Client+not+found');
  }

  // Verify the coach owns this client
  if (client.coachId !== coach.id) {
    redirect('/clients?error=Unauthorized');
  }

  const dailySteps = client.dailySteps || [];
  const stepGoal = client.stepGoal || undefined;

  const dailyAverage = dailySteps.length > 0
    ? Math.round(dailySteps.reduce((sum, step) => sum + step.steps, 0) / dailySteps.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      <CoachHeader coachName={coach.name} coachEmail={coach.email} />

      <div className="flex flex-1">
        <CoachSidebar />

        <main className="flex-1 p-6 overflow-auto">
          {/* Back Link */}
          <Link
            href="/clients"
            className="text-[#ec4899] hover:text-[#f472b6] text-sm font-medium transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Back to Clients
          </Link>

          {/* Client Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#ec4899]/20 flex items-center justify-center text-[#ec4899] font-semibold">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{client.name}</h1>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="space-y-6">
            {/* Goal Editor */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Step Goal</h2>
              <StepGoalEditor clientId={clientId} currentGoal={stepGoal} />
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Daily Average</h2>
              <div className="text-3xl font-bold text-white">{dailyAverage.toLocaleString()}</div>
              {stepGoal && (
                <>
                  <p className="text-xs text-gray-400 mt-4 mb-2">
                    Progress to Goal ({stepGoal.toLocaleString()})
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all"
                        style={{ width: `${Math.min((dailyAverage / stepGoal) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-pink-400 min-w-fit">
                      {Math.round(Math.min((dailyAverage / stepGoal) * 100, 100))}%
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Chart */}
            {dailySteps.length > 0 && (
              <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Activity Trends</h2>
                <TrendsChart steps={dailySteps} />
              </div>
            )}

            {/* Recent Records */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Records</h2>
              {dailySteps.length > 0 ? (
                <RecentRecords steps={dailySteps} stepGoal={stepGoal} />
              ) : (
                <p className="text-[#94a3b8] text-center py-8">No step records yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
