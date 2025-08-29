// Custom hook to manage RSS feed scheduling
import { useEffect, useState, useCallback } from 'react';
import { 
  feedScheduler, 
  SchedulerCallbacks, 
  isUserLoginRefresh, 
  setLoginTimestamp, 
  setFeedRefreshTimestamp,
  formatTimeUntilRefresh 
} from '../utils/feedScheduler';
import { RSSFeedData } from '../utils/rssValidator';

export interface SchedulerStatus {
  isRunning: boolean;
  feedCount: number;
  lastRefresh: Date | null;
  nextRefresh: Date | null;
  timeUntilRefresh: string;
  needsRefresh: boolean;
}

export interface UseFeedSchedulerOptions {
  autoStart?: boolean;
  intervalHours?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export function useFeedScheduler(
  feeds: RSSFeedData[],
  onFeedUpdate: (feedId: string, feedData?: RSSFeedData) => void,
  options: UseFeedSchedulerOptions = {}
) {
  const [status, setStatus] = useState<SchedulerStatus>({
    isRunning: false,
    feedCount: 0,
    lastRefresh: null,
    nextRefresh: null,
    timeUntilRefresh: 'Unknown',
    needsRefresh: false
  });
  
  const [error, setError] = useState<string | null>(null);
  const [refreshingFeeds, setRefreshingFeeds] = useState<Set<string>>(new Set());

  // Update status from scheduler
  const updateStatus = useCallback(() => {
    const schedulerStatus = feedScheduler.getStatus();
    const timeUntilRefresh = formatTimeUntilRefresh(schedulerStatus.nextRefresh);
    const needsRefresh = feedScheduler.needsRefresh();

    setStatus({
      isRunning: schedulerStatus.isRunning,
      feedCount: schedulerStatus.feedCount,
      lastRefresh: schedulerStatus.lastRefresh,
      nextRefresh: schedulerStatus.nextRefresh,
      timeUntilRefresh,
      needsRefresh
    });
  }, []);

  // Scheduler callbacks
  const callbacks: SchedulerCallbacks = {
    onFeedRefreshed: (feedId: string, success: boolean, data?: RSSFeedData) => {
      setRefreshingFeeds(prev => {
        const next = new Set(prev);
        next.delete(feedId);
        return next;
      });

      if (success && data) {
        onFeedUpdate(feedId, data);
        setFeedRefreshTimestamp();
      } else {
        console.warn(`Failed to refresh feed ${feedId}`);
      }

      updateStatus();
    },
    onSchedulerError: (error: string) => {
      setError(error);
      console.error('Scheduler error:', error);
    },
    onSchedulerStatus: (isRunning: boolean) => {
      updateStatus();
    }
  };

  // Initialize scheduler
  useEffect(() => {
    if (feeds.length > 0) {
      feedScheduler.init(feeds, callbacks);
      feedScheduler.updateFeeds(feeds);
      updateStatus();

      // Configure scheduler if options provided
      if (options.intervalHours || options.maxRetries || options.retryDelayMs) {
        feedScheduler.updateConfig({
          ...(options.intervalHours && { intervalHours: options.intervalHours }),
          ...(options.maxRetries && { maxRetries: options.maxRetries }),
          ...(options.retryDelayMs && { retryDelayMs: options.retryDelayMs })
        });
      }

      // Auto-start if enabled
      if (options.autoStart !== false) {
        feedScheduler.start();
      }
    }

    return () => {
      feedScheduler.stop();
    };
  }, [feeds, options.autoStart, options.intervalHours, options.maxRetries, options.retryDelayMs]);

  // Update feeds when they change
  useEffect(() => {
    if (feeds.length > 0) {
      feedScheduler.updateFeeds(feeds);
      updateStatus();
    }
  }, [feeds, updateStatus]);

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [updateStatus]);

  // Check for login-triggered refresh
  useEffect(() => {
    if (isUserLoginRefresh() && feeds.length > 0) {
      console.log('User login detected - triggering feed refresh');
      setLoginTimestamp();
      manualRefresh();
    }
  }, [feeds]);

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    setError(null);
    setRefreshingFeeds(new Set(feeds.map(f => f.id)));
    
    try {
      await feedScheduler.refreshAllFeeds();
      updateStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh feeds');
    }
  }, [feeds, updateStatus]);

  // Start scheduler
  const start = useCallback(() => {
    setError(null);
    feedScheduler.start();
  }, []);

  // Stop scheduler
  const stop = useCallback(() => {
    feedScheduler.stop();
  }, []);

  // Check if specific feed is refreshing
  const isFeedRefreshing = useCallback((feedId: string) => {
    return refreshingFeeds.has(feedId);
  }, [refreshingFeeds]);

  // Get time since last refresh
  const timeSinceLastRefresh = useCallback(() => {
    if (!status.lastRefresh) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - status.lastRefresh.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  }, [status.lastRefresh]);

  return {
    // Status
    status,
    error,
    isRefreshing: refreshingFeeds.size > 0,
    
    // Functions
    start,
    stop,
    manualRefresh,
    isFeedRefreshing,
    timeSinceLastRefresh,
    
    // Utilities
    clearError: () => setError(null)
  };
}