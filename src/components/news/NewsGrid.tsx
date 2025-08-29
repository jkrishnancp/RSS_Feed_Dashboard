import React from 'react';
import { Article } from '../../types';
import { Clock, Eye, Bookmark, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NewsGridProps {
  articles: Article[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="space-y-4">
      {articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No articles match your current filters</p>
        </div>
      ) : (
        articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1 mr-4">
                {article.title}
              </h3>
              <div className="flex items-center gap-2">
                {!article.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                {article.isBookmarked && <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </div>
                {article.author && <span>by {article.author}</span>}
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {article.feedTitle}
                </span>
              </div>
              <div className="text-gray-400">
                {article.readingTime} min read
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}