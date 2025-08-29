import React, { useState } from 'react';
import { BlogFilters } from '../components/blogs/BlogFilters';
import { BlogGrid } from '../components/blogs/BlogGrid';
import { PopularAuthors } from '../components/blogs/PopularAuthors';
import { useRSSFeeds } from '../hooks/useRSSFeeds';

export function DevBlogs() {
  const { articles } = useRSSFeeds();
  const [filters, setFilters] = useState({
    dateRange: 30,
    readStatus: 'all' as const,
    searchQuery: '',
    author: 'all'
  });

  const blogArticles = articles.filter(article => 
    article.category.slug === 'dev-blogs'
  );

  const filteredArticles = blogArticles.filter(article => {
    const now = new Date();
    const articleDate = new Date(article.publishedAt);
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDateRange = daysDiff <= filters.dateRange;
    const matchesReadStatus = filters.readStatus === 'all' || 
      (filters.readStatus === 'read' && article.isRead) ||
      (filters.readStatus === 'unread' && !article.isRead);
    const matchesSearch = !filters.searchQuery || 
      article.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesAuthor = filters.author === 'all' || article.author === filters.author;

    return matchesDateRange && matchesReadStatus && matchesSearch && matchesAuthor;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Developer Blogs</h1>
          <p className="text-slate-400 mt-1">Discover insights and tutorials from the developer community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <BlogFilters 
            filters={filters}
            onFiltersChange={setFilters}
            articles={blogArticles}
          />
          
          <div className="mt-6">
            <PopularAuthors articles={blogArticles} />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <BlogGrid articles={filteredArticles} />
        </div>
      </div>
    </div>
  );
}