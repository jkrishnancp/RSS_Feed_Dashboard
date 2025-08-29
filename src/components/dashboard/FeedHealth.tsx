import React from 'react';
import { RSSFeed } from '../../types';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedHealthProps {
  feeds: RSSFeed[];
}

export function FeedHealth({ feeds }: FeedHealthProps) {
  const getFeedStatus = (feed: RSSFeed) => {
    const hoursSinceUpdate = (Date.now() - feed.lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (!feed.isActive) {
      return { status: 'inactive', icon: XCircle, color: 'text-gray-500' };
    } else if (hoursSinceUpdate > 24) {
      return { status: 'stale', icon: AlertTriangle, color: 'text-yellow-500' };
    } else if (hoursSinceUpdate > 48) {
      return { status: 'error', icon: XCircle, color: 'text-red-500' };
    } else {
      return { status: 'healthy', icon: CheckCircle, color: 'text-green-500' };
    }
  };

  const healthyCount = feeds.filter(feed => getFeedStatus(feed).status === 'healthy').length;
  const staleCount = feeds.filter(feed => getFeedStatus(feed).status === 'stale').length;
  const errorCount = feeds.filter(feed => getFeedStatus(feed).status === 'error').length;
  const inactiveCount = feeds.filter(feed => getFeedStatus(feed).status === 'inactive').length;

  return (
    <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Feed Health</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-300">Healthy</span>
          </div>
          <span className="text-sm font-medium text-slate-100">{healthyCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-slate-300">Stale</span>
          </div>
          <span className="text-sm font-medium text-slate-100">{staleCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-300">Error</span>
          </div>
          <span className="text-sm font-medium text-slate-100">{errorCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-slate-300">Inactive</span>
          </div>
          <span className="text-sm font-medium text-slate-100">{inactiveCount}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-300 mb-2">Recent Issues</h4>
        {feeds
          .filter(feed => getFeedStatus(feed).status !== 'healthy')
          .slice(0, 3)
          .map((feed) => {
            const { icon: StatusIcon, color } = getFeedStatus(feed);
            return (
              <div key={feed.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <StatusIcon className={`w-4 h-4 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{feed.title}</p>
                  <p className="text-xs text-slate-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatDistanceToNow(feed.lastUpdated, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}