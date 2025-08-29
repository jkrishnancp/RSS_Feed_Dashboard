import { useState, useEffect, useCallback } from 'react';
import { RSSFeed, Article, FeedCategory, DashboardStats } from '../types';
import { mockFeeds, mockArticles, mockCategories } from '../data/mockData';
import { useFeedScheduler } from './useFeedScheduler';
import { RSSFeedData } from '../utils/rssValidator';

export function useRSSFeeds() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rssFeeds, setRssFeeds] = useState<RSSFeedData[]>([]);

  const calculateStats = useCallback((feedList: RSSFeed[], articleList: Article[]): DashboardStats => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return {
      totalFeeds: feedList.length,
      totalArticles: articleList.length,
      unreadCount: articleList.filter(a => !a.isRead).length,
      bookmarkedCount: articleList.filter(a => a.isBookmarked).length,
      categoriesCount: new Set(feedList.map(f => f.category.id)).size,
      lastUpdated: new Date(),
      dailyStats: last7Days.map(date => ({
        date,
        articles: articleList.filter(a => 
          a.publishedAt.toISOString().split('T')[0] === date
        ).length,
        reads: articleList.filter(a => 
          a.isRead && a.updatedAt.toISOString().split('T')[0] === date
        ).length,
      })),
    };
  }, []);

  const loadFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setFeeds(mockFeeds);
      setArticles(mockArticles);
      setCategories(mockCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle feed updates from scheduler
  const handleFeedUpdate = useCallback((feedId: string, feedData?: RSSFeedData) => {
    if (feedData) {
      setRssFeeds(prev => 
        prev.map(feed => feed.id === feedId ? feedData : feed)
      );
    }
  }, []);

  // Initialize scheduler
  const scheduler = useFeedScheduler(rssFeeds, handleFeedUpdate, {
    autoStart: true,
    intervalHours: 3 // Refresh every 3 hours
  });

  const refreshFeeds = useCallback(async () => {
    setLoading(true);
    try {
      await loadFeeds();
      // Trigger manual refresh of RSS feeds
      if (scheduler.manualRefresh) {
        await scheduler.manualRefresh();
      }
    } catch (err) {
      console.error('Error refreshing feeds:', err);
    } finally {
      setLoading(false);
    }
  }, [loadFeeds, scheduler.manualRefresh]);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  return {
    feeds,
    articles,
    categories,
    loading,
    error,
    refreshFeeds,
    stats: calculateStats(feeds, articles),
    // Scheduler properties
    scheduler: {
      status: scheduler.status,
      isRefreshing: scheduler.isRefreshing,
      error: scheduler.error,
      manualRefresh: scheduler.manualRefresh,
      timeSinceLastRefresh: scheduler.timeSinceLastRefresh,
      clearError: scheduler.clearError
    }
  };
}