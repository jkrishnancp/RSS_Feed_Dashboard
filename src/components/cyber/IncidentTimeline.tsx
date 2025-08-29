import React from 'react';
import { Article } from '../../types';
import { Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IncidentTimelineProps {
  articles: Article[];
}

export function IncidentTimeline({ articles }: IncidentTimelineProps) {
  const recentIncidents = articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Recent Incidents</h3>
      </div>
      
      <div className="space-y-4">
        {recentIncidents.map((article, index) => (
          <div key={article.id} className="relative">
            {index < recentIncidents.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
            )}
            
            <div className={`border-l-4 ${getSeverityColor(article.severity)} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                    </span>
                    {article.severity && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        article.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        article.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {article.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{article.feedTitle}</span>
                    {article.cveId && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-mono">
                        {article.cveId}
                      </span>
                    )}
                  </div>
                </div>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}