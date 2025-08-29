import React, { useState } from 'react';
import { Article } from '../types';
import { Pagination } from '../components/common/Pagination';
import { ArticleDetail } from '../components/common/ArticleDetail';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { MessageCircle, Users, TrendingUp, Search, Calendar, Filter, Share2 } from 'lucide-react';

export function SocialMediaFeeds() {
  const { articles } = useRSSFeeds();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 7,
    platform: 'all',
    readStatus: 'all' as const,
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const socialArticles = articles.filter(article => 
    article.category.slug === 'social-media' ||
    article.tags.some(tag => ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'social'].includes(tag.toLowerCase()))
  );

  const filteredArticles = socialArticles.filter(article => {
    const now = new Date();
    const articleDate = new Date(article.publishedAt);
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDateRange = daysDiff <= filters.dateRange;
    const matchesReadStatus = filters.readStatus === 'all' || 
      (filters.readStatus === 'read' && article.isRead) ||
      (filters.readStatus === 'unread' && !article.isRead);
    const matchesSearch = !filters.searchQuery || 
      article.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesDateRange && matchesReadStatus && matchesSearch;
  });

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginate filtered articles
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Social Media Feeds</h1>
          <p className="text-slate-400 mt-1">Stay connected with social media trends and updates</p>
        </div>
      </div>

      {/* Filters on top */}
      <div className="w-full">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                placeholder="Search social media..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Last Day</option>
                <option value={7}>Last Week</option>
                <option value={14}>Last 2 Weeks</option>
                <option value={30}>Last Month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => updateFilter('platform', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Platforms</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Read Status</label>
              <select
                value={filters.readStatus}
                onChange={(e) => updateFilter('readStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Posts</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-100">{filteredArticles.length}</span> of{' '}
              <span className="font-medium text-slate-100">{socialArticles.length}</span> posts
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={`grid gap-6 ${selectedArticle ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 xl:grid-cols-4'}`}>
        {/* Article list - adjusts width based on whether detail panel is open */}
        <div className={selectedArticle ? 'xl:col-span-1' : 'xl:col-span-3'}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {paginatedArticles.map((article) => (
                  <div 
                    key={article.id} 
                    onClick={() => handleArticleClick(article)}
                    className={`flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border cursor-pointer ${
                      selectedArticle?.id === article.id ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{article.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{article.feedTitle}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          Social Post
                        </span>
                        {article.tags.filter(tag => ['twitter', 'linkedin', 'facebook', 'instagram'].includes(tag.toLowerCase())).slice(0, 2).map((tag) => (
                          <React.Fragment key={tag}>
                            <span>•</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              {tag}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    {!article.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                  </div>
                ))}
              </div>
            </div>
            {filteredArticles.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredArticles.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
        
        {/* Article Detail Panel - shows when article is selected */}
        {selectedArticle && (
          <div className="xl:col-span-1">
            <ArticleDetail 
              article={selectedArticle} 
              onClose={() => setSelectedArticle(null)} 
            />
          </div>
        )}

        {/* Social Stats - shows when no article is selected */}
        {!selectedArticle && (
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-100">Today's Posts</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {socialArticles.filter(a => {
                  const daysDiff = Math.floor((Date.now() - new Date(a.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
                  return daysDiff <= 1;
                }).length}
              </p>
              <p className="text-slate-400 text-sm">New social posts</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-100">Trending</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {socialArticles.filter(a => !a.isRead).length}
              </p>
              <p className="text-slate-400 text-sm">Unread posts</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-100">Platforms</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {new Set(socialArticles.flatMap(a => a.tags.filter(tag => ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube'].includes(tag.toLowerCase())))).size}
              </p>
              <p className="text-slate-400 text-sm">Social platforms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}