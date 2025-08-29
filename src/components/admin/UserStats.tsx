import React from 'react';
import { User } from '../../types';
import { Users, UserCheck, UserX, Shield, Eye, Edit } from 'lucide-react';

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    viewers: users.filter(u => u.role === 'viewer').length,
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'All registered users'
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Currently active accounts'
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: UserX,
      color: 'text-red-600',
      bg: 'bg-red-100',
      description: 'Disabled accounts'
    },
    {
      title: 'Administrators',
      value: stats.admins,
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Full system access'
    },
    {
      title: 'Editors',
      value: stats.editors,
      icon: Edit,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      description: 'Content management access'
    },
    {
      title: 'Viewers',
      value: stats.viewers,
      icon: Eye,
      color: 'text-teal-600',
      bg: 'bg-teal-100',
      description: 'Read-only access'
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