import React from 'react';
import { Article } from '../../types';
import { Shield, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface SecurityStatsProps {
  articles: Article[];
}

export function SecurityStats({ articles }: SecurityStatsProps) {
  const criticalCount = articles.filter(a => a.severity === 'critical').length;
  const highCount = articles.filter(a => a.severity === 'high').length;
  const cveCount = articles.filter(a => a.cveId).length;
  const unreadCount = articles.filter(a => !a.isRead).length;

  const stats = [
    {
      title: 'Critical Vulnerabilities',
      value: criticalCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100',
      description: 'Immediate attention required'
    },
    {
      title: 'High Severity',
      value: highCount,
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      description: 'Should be addressed soon'
    },
    {
      title: 'CVE Entries',
      value: cveCount,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Official vulnerability entries'
    },
    {
      title: 'Unread Advisories',
      value: unreadCount,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Pending review'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.title}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}