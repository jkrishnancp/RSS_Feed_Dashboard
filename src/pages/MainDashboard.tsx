import React from 'react';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { FeedHealth } from '../components/dashboard/FeedHealth';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { mockArticles, mockCategories } from '../data/mockData';

export function MainDashboard() {
  const { feeds, stats } = useRSSFeeds();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Monitor your RSS feeds and stay updated with the latest content
          </p>
        </div>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity articles={mockArticles} />
        </div>
        <div className="space-y-6">
          <CategoryBreakdown categories={mockCategories} />
          <FeedHealth feeds={feeds} />
        </div>
      </div>
    </div>
  );
}