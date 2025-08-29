import React, { useState } from 'react';
import { NewsFilters } from '../components/news/NewsFilters';
import { NewsGrid } from '../components/news/NewsGrid';
import { TrendingTopics } from '../components/news/TrendingTopics';
import { useRSSFeeds } from '../hooks/useRSSFeeds';

export function TechNews() {
  const { articles } = useRSSFeeds();
  const [filters, setFilters] = useState({
    dateRange: 7,
    category: 'all',
    readStatus: 'all' as const,
    searchQuery: ''
  });

  const techArticles = articles.filter(article => 
    article.category.slug === 'tech-news'
  );

  const filteredArticles = techArticles.filter(article => {
    const now = new Date();
    const articleDate = new Date(article.publishedAt);
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDateRange = daysDiff <= filters.dateRange;
    const matchesReadStatus = filters.readStatus === 'all' || 
      (filters.readStatus === 'read' && article.isRead) ||
      (filters.readStatus === 'unread' && !article.isRead);
    const matchesSearch = !filters.searchQuery || 
      article.title.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesDateRange && matchesReadStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Tech News</h1>
          <p className="text-slate-400 mt-1">Stay updated with the latest technology news and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <NewsFilters 
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={techArticles.length}
            filteredCount={filteredArticles.length}
          />
          
          <div className="mt-6">
            <TrendingTopics articles={techArticles} />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <NewsGrid articles={filteredArticles} />
        </div>
      </div>
    </div>
  );
}