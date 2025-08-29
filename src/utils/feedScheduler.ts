// RSS Feed Scheduler - Automatically refresh feeds every 3 hours
import { refreshRSSFeed, RSSFeedData } from './rssValidator';

export interface SchedulerConfig {
  intervalHours: number;
  maxRetries: number;
  retryDelayMs: number;
}

export interface SchedulerCallbacks {
  onFeedRefreshed: (feedId: string, success: boolean, data?: RSSFeedData) => void;
  onSchedulerError: (error: string) => void;
  onSchedulerStatus: (isRunning: boolean) => void;
}

class FeedScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private feeds: RSSFeedData[] = [];
  private config: SchedulerConfig = {
    intervalHours: 3,
    maxRetries: 3,
    retryDelayMs: 30000 // 30 seconds
  };
  private callbacks: SchedulerCallbacks | null = null;
  private lastRefresh: Date | null = null;

  constructor(config?: Partial<SchedulerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Initialize the scheduler with feeds and callbacks
  init(feeds: RSSFeedData[], callbacks: SchedulerCallbacks): void {
    this.feeds = feeds;
    this.callbacks = callbacks;
    console.log(`FeedScheduler initialized with ${feeds.length} feeds`);
  }

  // Start the automatic refresh scheduler
  start(): void {
    if (this.isRunning) {
      console.log('FeedScheduler is already running');
      return;
    }

    this.isRunning = true;
    this.callbacks?.onSchedulerStatus(true);

    // Set up interval for refreshing feeds every N hours
    const intervalMs = this.config.intervalHours * 60 * 60 * 1000;
    
    console.log(`Starting FeedScheduler - will refresh feeds every ${this.config.intervalHours} hours`);
    
    // Immediate refresh on start
    this.refreshAllFeeds();

    // Schedule periodic refreshes
    this.intervalId = setInterval(() => {
      this.refreshAllFeeds();
    }, intervalMs);
  }

  // Stop the scheduler
  stop(): void {
    if (!this.isRunning) {
      console.log('FeedScheduler is not running');
      return;
    }

    this.isRunning = false;
    this.callbacks?.onSchedulerStatus(false);

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('FeedScheduler stopped');
  }

  // Manually trigger a refresh of all feeds
  async refreshAllFeeds(): Promise<void> {
    if (!this.callbacks || this.feeds.length === 0) {
      console.log('No feeds to refresh or callbacks not set');
      return;
    }

    console.log(`Refreshing ${this.feeds.length} RSS feeds...`);
    this.lastRefresh = new Date();

    const refreshPromises = this.feeds.map(feed => this.refreshFeedWithRetry(feed));
    
    try {
      await Promise.allSettled(refreshPromises);
      console.log(`Completed refresh cycle at ${this.lastRefresh.toISOString()}`);
    } catch (error) {
      const errorMsg = `Failed to complete refresh cycle: ${error}`;
      console.error(errorMsg);
      this.callbacks.onSchedulerError(errorMsg);
    }
  }

  // Refresh a single feed with retry logic
  private async refreshFeedWithRetry(feed: RSSFeedData): Promise<void> {
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`Refreshing feed "${feed.title}" (attempt ${attempt}/${this.config.maxRetries})`);
        
        const refreshedFeed = await refreshRSSFeed(feed);
        this.callbacks?.onFeedRefreshed(feed.id, true, refreshedFeed);
        
        console.log(`Successfully refreshed feed "${feed.title}"`);
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Failed to refresh feed "${feed.title}" (attempt ${attempt}/${this.config.maxRetries}):`, error);
        
        // Wait before retry (except on last attempt)
        if (attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelayMs));
        }
      }
    }

    // All retries failed
    console.error(`Failed to refresh feed "${feed.title}" after ${this.config.maxRetries} attempts:`, lastError);
    this.callbacks?.onFeedRefreshed(feed.id, false);
  }

  // Update the list of feeds to monitor
  updateFeeds(feeds: RSSFeedData[]): void {
    this.feeds = feeds;
    console.log(`FeedScheduler updated with ${feeds.length} feeds`);
  }

  // Get scheduler status
  getStatus(): {
    isRunning: boolean;
    feedCount: number;
    lastRefresh: Date | null;
    nextRefresh: Date | null;
    config: SchedulerConfig;
  } {
    const nextRefresh = this.lastRefresh && this.isRunning 
      ? new Date(this.lastRefresh.getTime() + (this.config.intervalHours * 60 * 60 * 1000))
      : null;

    return {
      isRunning: this.isRunning,
      feedCount: this.feeds.length,
      lastRefresh: this.lastRefresh,
      nextRefresh,
      config: this.config
    };
  }

  // Update scheduler configuration
  updateConfig(config: Partial<SchedulerConfig>): void {
    const oldInterval = this.config.intervalHours;
    this.config = { ...this.config, ...config };
    
    console.log('FeedScheduler configuration updated:', this.config);
    
    // If interval changed and scheduler is running, restart it
    if (this.isRunning && oldInterval !== this.config.intervalHours) {
      console.log('Restarting scheduler due to interval change');
      this.stop();
      this.start();
    }
  }

  // Check if it's been more than the interval since last refresh
  needsRefresh(): boolean {
    if (!this.lastRefresh) return true;
    
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - this.lastRefresh.getTime();
    const intervalMs = this.config.intervalHours * 60 * 60 * 1000;
    
    return timeSinceLastRefresh >= intervalMs;
  }
}

// Create a singleton instance
export const feedScheduler = new FeedScheduler();

// Helper function to format time until next refresh
export const formatTimeUntilRefresh = (nextRefresh: Date | null): string => {
  if (!nextRefresh) return 'Unknown';
  
  const now = new Date();
  const diffMs = nextRefresh.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Refreshing soon...';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

// Helper function to check if user just logged in
export const isUserLoginRefresh = (): boolean => {
  const lastLogin = localStorage.getItem('lastLogin');
  const lastFeedRefresh = localStorage.getItem('lastFeedRefresh');
  
  if (!lastLogin || !lastFeedRefresh) return true;
  
  const loginTime = new Date(lastLogin).getTime();
  const refreshTime = new Date(lastFeedRefresh).getTime();
  
  // If login is more recent than last refresh, trigger refresh
  return loginTime > refreshTime;
};

// Set login timestamp
export const setLoginTimestamp = (): void => {
  localStorage.setItem('lastLogin', new Date().toISOString());
};

// Set feed refresh timestamp
export const setFeedRefreshTimestamp = (): void => {
  localStorage.setItem('lastFeedRefresh', new Date().toISOString());
};