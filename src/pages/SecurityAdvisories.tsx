import React, { useState } from 'react';
import { Article } from '../types';
import { Pagination } from '../components/common/Pagination';
import { ArticleDetail } from '../components/common/ArticleDetail';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { Shield, AlertTriangle, TrendingUp, Search, Calendar, Filter } from 'lucide-react';

export function SecurityAdvisories() {
  const { articles } = useRSSFeeds();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 7,
    severity: 'all',
    cveOnly: false,
    readStatus: 'all' as const,
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const securityArticles = articles.filter(article => 
    article.category.slug === 'security' || 
    article.tags.some(tag => tag.toLowerCase().includes('security') || tag.toLowerCase().includes('cve'))
  );

  const filteredArticles = securityArticles.filter(article => {
    const now = new Date();
    const articleDate = new Date(article.publishedAt);
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDateRange = daysDiff <= filters.dateRange;
    const matchesSeverity = filters.severity === 'all' || article.severity === filters.severity;
    const matchesCVE = !filters.cveOnly || article.cveId;
    const matchesReadStatus = filters.readStatus === 'all' || 
      (filters.readStatus === 'read' && article.isRead) ||
      (filters.readStatus === 'unread' && !article.isRead);
    const matchesSearch = !filters.searchQuery || 
      article.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesDateRange && matchesSeverity && matchesCVE && matchesReadStatus && matchesSearch;
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
          <h1 className="text-3xl font-bold text-slate-100">Security Advisories</h1>
          <p className="text-slate-400 mt-1">Monitor security vulnerabilities and advisories across your feeds</p>
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
                placeholder="Search advisories..."
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
                <option value={7}>Last Week</option>
                <option value={14}>Last 2 Weeks</option>
                <option value={30}>Last Month</option>
                <option value={90}>Last 3 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Severity Level</label>
              <select
                value={filters.severity}
                onChange={(e) => updateFilter('severity', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Read Status</label>
              <select
                value={filters.readStatus}
                onChange={(e) => updateFilter('readStatus', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Articles</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-100">{filteredArticles.length}</span> of{' '}
              <span className="font-medium text-slate-100">{securityArticles.length}</span> articles
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
                    <Shield className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{article.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{article.feedTitle}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        {article.severity && (
                          <>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              article.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              article.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              article.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {article.severity}
                            </span>
                          </>
                        )}
                        {article.cveId && (
                          <>
                            <span>•</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                              {article.cveId}
                            </span>
                          </>
                        )}
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

        {/* Security Stats - shows when no article is selected */}
        {!selectedArticle && (
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-slate-100">Critical Alerts</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {securityArticles.filter(a => a.severity === 'critical').length}
              </p>
              <p className="text-slate-400 text-sm">Require immediate action</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-slate-100">High Priority</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {securityArticles.filter(a => a.severity === 'high').length}
              </p>
              <p className="text-slate-400 text-sm">Need attention soon</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-100">CVE Tracked</h3>
              </div>
              <p className="text-3xl font-bold text-slate-100">
                {securityArticles.filter(a => a.cveId).length}
              </p>
              <p className="text-slate-400 text-sm">With CVE numbers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}