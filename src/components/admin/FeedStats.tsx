import React from 'react';
import { RSSFeed, FeedCategory } from '../../types';
import { Rss, CheckCircle, XCircle, FolderOpen, Activity, Clock } from 'lucide-react';

interface FeedStatsProps {
  feeds: RSSFeed[];
  categories: FeedCategory[];
}

export function FeedStats({ feeds, categories }: FeedStatsProps) {
  const stats = {
    total: feeds.length,
    active: feeds.filter(f => f.isActive).length,
    inactive: feeds.filter(f => !f.isActive).length,
    totalArticles: feeds.reduce((sum, feed) => sum + feed.articleCount, 0),
    folders: new Set(feeds.map(f => f.folder)).size,
    avgUpdateFreq: Math.round(feeds.reduce((sum, feed) => sum + (feed.updateFrequency || 60), 0) / feeds.length),
  };

  const statCards = [
    {
      title: 'Total Feeds',
      value: stats.total,
      icon: Rss,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'All RSS feeds'
    },
    {
      title: 'Active Feeds',
      value: stats.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Currently updating'
    },
    {
      title: 'Inactive Feeds',
      value: stats.inactive,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      description: 'Disabled or failed'
    },
    {
      title: 'Total Articles',
      value: stats.totalArticles.toLocaleString(),
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Across all feeds'
    },
    {
      title: 'Folders',
      value: stats.folders,
      icon: FolderOpen,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      description: 'Organization structure'
    },
    {
      title: 'Avg Update Freq',
      value: `${stats.avgUpdateFreq}m`,
      icon: Clock,
      color: 'text-teal-600',
      bg: 'bg-teal-100',
      description: 'Minutes between updates'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">{stat.title}</div>
            <div className="text-xs text-gray-500">{stat.description}</div>
          </div>
        );
      })}
    </div>
  );
}