import React from 'react';
import { Article } from '../../types';
import { X, ExternalLink, Calendar, Clock, User, Tag, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

export function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const handleExternalLink = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
      // You could add a toast notification here
    }
  };

  const toggleBookmark = () => {
    // This would typically make an API call to toggle bookmark status
    console.log('Toggle bookmark for article:', article.id);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-fit">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {article.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExternalLink}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Read Full Article
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm ${
              article.isBookmarked
                ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
            {article.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Published {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{article.readingTime} minute read</span>
          </div>

          {article.author && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>by {article.author}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">Source:</span>
            <span>{article.feedTitle}</span>
          </div>

          {article.severity && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-gray-600">Severity:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.severity === 'critical' ? 'bg-red-100 text-red-700' :
                article.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                article.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {article.severity.toUpperCase()}
              </span>
            </div>
          )}

          {article.cveId && (
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-gray-600">CVE:</span>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                {article.cveId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Article Preview</h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p className="mb-4">{article.description}</p>
          {article.content && (
            <div className="text-sm text-gray-500">
              {article.content.length > 300 
                ? `${article.content.substring(0, 300)}...` 
                : article.content}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleExternalLink}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Continue reading on {new URL(article.url).hostname} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}