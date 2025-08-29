import React from 'react';
import { Article } from '../../types';
import { Clock, Eye, Bookmark, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  articles: Article[];
}

export function RecentActivity({ articles }: RecentActivityProps) {
  const recentArticles = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {recentArticles.map((article) => (
          <div key={article.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              article.severity === 'critical' ? 'bg-red-500' :
              article.severity === 'high' ? 'bg-orange-500' :
              article.severity === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{article.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {article.feedTitle}
                </span>
                {article.cveId && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    {article.cveId}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!article.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              {article.isBookmarked && <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}