import React from 'react';
import { Article } from '../../types';
import { X, ExternalLink, Clock, User, AlertTriangle, Shield, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdvisoryDetailProps {
  article: Article;
  onClose: () => void;
}

export function AdvisoryDetail({ article, onClose }: AdvisoryDetailProps) {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Security Advisory</h2>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{article.title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Published {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </span>
            </div>
            
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{article.author}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{article.feedTitle}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {article.severity && (
              <div>
                <span className="text-sm text-gray-500 block mb-1">Severity Level</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(article.severity)}`}>
                  {article.severity.toUpperCase()}
                </span>
              </div>
            )}
            
            {article.cveId && (
              <div>
                <span className="text-sm text-gray-500 block mb-1">CVE ID</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-mono">
                  {article.cveId}
                </span>
              </div>
            )}
            
            {article.cvssScore && (
              <div>
                <span className="text-sm text-gray-500 block mb-1">CVSS Score</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold">
                  {article.cvssScore}/10
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{article.description}</p>
          </div>
          
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="text-gray-700 leading-relaxed"
          />
        </div>
        
        <div className="mt-6 flex items-center gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}