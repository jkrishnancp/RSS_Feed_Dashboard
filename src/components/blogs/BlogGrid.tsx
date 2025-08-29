import React from 'react';
import { Article } from '../../types';
import { Clock, User, ExternalLink, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BlogGridProps {
  articles: Article[];
}

export function BlogGrid({ articles }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {articles.length === 0 ? (
        <div className="col-span-full bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No blog posts match your current filters</p>
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
              </div>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </div>
                {article.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                )}
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{article.feedTitle}</span>
                <span className="text-xs text-gray-500">{article.readingTime} min read</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}