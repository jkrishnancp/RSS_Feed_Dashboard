import React from 'react';
import { Article } from '../../types';
import { AlertTriangle, Clock, Eye, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdvisoryListProps {
  articles: Article[];
  selectedId?: string;
  onSelect: (article: Article) => void;
}

export function AdvisoryList({ articles, selectedId, onSelect }: AdvisoryListProps) {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Security Advisories</h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {articles.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No advisories match your current filters
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelect(article)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedId === article.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 line-clamp-2 text-sm">
                    {article.title}
                  </h4>
                  {!article.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {article.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(article.severity)}`}>
                      {article.severity.toUpperCase()}
                    </span>
                  )}
                  {article.cveId && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-mono">
                      {article.cveId}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </div>
                  <div className="text-gray-400 truncate max-w-24">
                    {article.feedTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}