import React from 'react';
import { Article } from '../../types';
import { TrendingUp, Hash } from 'lucide-react';

interface TrendingTopicsProps {
  articles: Article[];
}

export function TrendingTopics({ articles }: TrendingTopicsProps) {
  const tagCounts = articles.reduce((acc, article) => {
    article.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const trendingTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
      </div>
      
      <div className="space-y-2">
        {trendingTags.map(([tag, count]) => (
          <div key={tag} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{tag}</span>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}