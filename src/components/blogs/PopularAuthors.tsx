import React from 'react';
import { Article } from '../../types';
import { User, TrendingUp } from 'lucide-react';

interface PopularAuthorsProps {
  articles: Article[];
}

export function PopularAuthors({ articles }: PopularAuthorsProps) {
  const authorStats = articles.reduce((acc, article) => {
    if (article.author) {
      acc[article.author] = (acc[article.author] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topAuthors = Object.entries(authorStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Popular Authors</h3>
      </div>
      
      <div className="space-y-3">
        {topAuthors.map(([author, count]) => (
          <div key={author} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">{author}</span>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {count} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}