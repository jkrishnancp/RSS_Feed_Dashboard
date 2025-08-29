import { useState, useEffect, useCallback } from 'react';
import { RSSFeed, Article, FeedCategory, DashboardStats } from '../types';
import { mockFeeds, mockArticles, mockCategories } from '../data/mockData';

export function useRSSFeeds() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const refreshFeeds = useCallback(async () => {
    await loadFeeds();
  }, [loadFeeds]);

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
  };
}