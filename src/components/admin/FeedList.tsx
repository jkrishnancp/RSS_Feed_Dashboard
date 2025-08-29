import React from 'react';
import { RSSFeed, FeedCategory } from '../../types';
import { Edit, Trash2, CheckCircle, XCircle, ExternalLink, Folder, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedListProps {
  feeds: RSSFeed[];
  categories: FeedCategory[];
  selectedFeeds: string[];
  onSelectionChange: (feedIds: string[]) => void;
  onEdit: (feed: RSSFeed) => void;
  onDelete: (feedId: string) => void;
}

export function FeedList({ feeds, selectedFeeds, onSelectionChange, onEdit, onDelete }: FeedListProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(feeds.map(f => f.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectFeed = (feedId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedFeeds, feedId]);
    } else {
      onSelectionChange(selectedFeeds.filter(id => id !== feedId));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">RSS Feeds</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFeeds.length === feeds.length && feeds.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">Select All</label>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {feeds.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No feeds match your current filters
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedFeeds.includes(feed.id)}
                    onChange={(e) => handleSelectFeed(feed.id, e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{feed.title}</h4>
                      <div className="flex items-center gap-1 ml-2">
                        {feed.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <button
                          onClick={() => onEdit(feed)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(feed.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={feed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{feed.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {feed.folder}
                      </div>
                      <span className={`px-2 py-1 rounded-full ${
                        feed.category.color === 'red' ? 'bg-red-100 text-red-700' :
                        feed.category.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        feed.category.color === 'green' ? 'bg-green-100 text-green-700' :
                        feed.category.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {feed.category.name}
                      </span>
                      <span>{feed.articleCount} articles</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(feed.lastUpdated), { addSuffix: true })}
                      </div>
                    </div>
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