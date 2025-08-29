import React from 'react';
import { FeedCategory } from '../../types';
import { Shield, Newspaper, Code, Lock, Brain } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: FeedCategory[];
}

const iconMap = {
  Shield,
  Newspaper,
  Code,
  Lock,
  Brain,
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'text-red-500 bg-red-500/10',
      blue: 'text-blue-500 bg-blue-500/10',
      purple: 'text-purple-500 bg-purple-500/10',
      orange: 'text-orange-500 bg-orange-500/10',
      green: 'text-green-500 bg-green-500/10',
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-500 bg-gray-500/10';
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Categories</h3>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Shield;
          const colorClasses = getColorClasses(category.color);
          
          return (
            <div key={category.id} className="flex items-center gap-4 p-3 hover:bg-slate-700/50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${colorClasses.split(' ')[1]}`}>
                <IconComponent className={`w-4 h-4 ${colorClasses.split(' ')[0]}`} />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-slate-100">{category.name}</h4>
                <p className="text-sm text-slate-400">{category.feedCount} feeds</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}