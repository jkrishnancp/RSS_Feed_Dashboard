import React, { useState, useEffect } from 'react';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { Pagination } from '../components/common/Pagination';
import { AddRSSModal } from '../components/rss/AddRSSModal';
import { BulkImportModal } from '../components/rss/BulkImportModal';
import { EditableRSSRow } from '../components/rss/EditableRSSRow';
import { RSSFeedData, monitorRSSHealth, getFeedHealthStats, refreshRSSFeed } from '../utils/rssValidator';
import { Rss, Plus, Settings, BarChart3, Search, Filter, FileSpreadsheet, AlertTriangle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function AdminRSSManagement() {
  const { feeds, categories, refreshFeeds } = useRSSFeeds();
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    folder: 'all',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [rssFeeds, setRssFeeds] = useState<RSSFeedData[]>([]);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date>(new Date());

  // Monitor RSS feed health every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRssFeeds(prev => {
        const updated = monitorRSSHealth(prev);
        setLastHealthCheck(new Date());
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get combined feeds and health stats
  const combinedFeeds = [...feeds.map(feed => ({
    id: feed.id,
    title: feed.title,
    url: feed.url,
    category: feed.category.slug,
    isActive: feed.isActive,
    health: {
      isValid: true,
      status: 'active' as const,
      lastFetch: new Date(),
      lastSuccessfulFetch: feed.lastUpdated,
      errorCount: 0,
      message: 'Working normally'
    },
    lastUpdated: feed.lastUpdated,
    articleCount: feed.articleCount
  })), ...rssFeeds];
  
  const healthStats = getFeedHealthStats(combinedFeeds);

  const filteredFeeds = combinedFeeds.filter(feed => {
    const matchesCategory = filters.category === 'all' || feed.category === filters.category;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && feed.isActive) ||
      (filters.status === 'inactive' && !feed.isActive);
    const matchesFolder = filters.folder === 'all' || feed.folder === filters.folder;
    const matchesSearch = !filters.searchQuery || 
      feed.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      feed.url.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesFolder && matchesSearch;
  });

  const folders = Array.from(new Set(feeds.map(f => f.folder)));

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginate filtered feeds
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeeds = filteredFeeds.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleAddRSS = async (rssData: RSSFeedData) => {
    try {
      setRssFeeds(prev => [...prev, rssData]);
      refreshFeeds();
    } catch (error) {
      console.error('Error adding RSS feed:', error);
    }
  };

  const handleBulkImport = async (importedFeeds: RSSFeedData[]) => {
    try {
      setRssFeeds(prev => [...prev, ...importedFeeds]);
      refreshFeeds();
    } catch (error) {
      console.error('Error bulk importing RSS feeds:', error);
    }
  };

  const handleUpdateRSS = (feedId: string, updates: Partial<RSSFeedData>) => {
    setRssFeeds(prev => 
      prev.map(feed => 
        feed.id === feedId ? { ...feed, ...updates, lastUpdated: new Date() } : feed
      )
    );
  };

  const handleDeleteRSS = (feedId: string) => {
    if (confirm('Are you sure you want to delete this RSS feed?')) {
      setRssFeeds(prev => prev.filter(feed => feed.id !== feedId));
    }
  };

  const handleRefreshRSS = async (feedId: string) => {
    const feedToRefresh = rssFeeds.find(f => f.id === feedId);
    if (!feedToRefresh) return;
    
    try {
      const refreshedFeed = await refreshRSSFeed(feedToRefresh);
      setRssFeeds(prev =>
        prev.map(feed => feed.id === feedId ? refreshedFeed : feed)
      );
    } catch (error) {
      console.error('Error refreshing RSS feed:', error);
    }
  };
  
  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      const promises = rssFeeds.map(feed => refreshRSSFeed(feed));
      const refreshedFeeds = await Promise.all(promises);
      setRssFeeds(refreshedFeeds);
    } catch (error) {
      console.error('Error refreshing all feeds:', error);
    } finally {
      setIsRefreshingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">RSS Feed Management</h1>
          <p className="text-slate-400 mt-1">Manage RSS feeds, categories, and feed organization</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefreshAll}
            disabled={isRefreshingAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshingAll ? 'animate-spin' : ''}`} />
            {isRefreshingAll ? 'Refreshing...' : 'Refresh All'}
          </button>
          <button 
            onClick={() => setShowBulkImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import Excel/CSV
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add RSS Feed
          </button>
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
                placeholder="Search feeds..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Folder</label>
              <select
                value={filters.folder}
                onChange={(e) => updateFilter('folder', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Folders</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Showing <span className="font-medium text-slate-100">{filteredFeeds.length}</span> of{' '}
                <span className="font-medium text-slate-100">{combinedFeeds.length}</span> feeds
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>{healthStats.active} Active</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{healthStats.warning} Warning</span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{healthStats.error} Error</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Last health check: {lastHealthCheck.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with stats on the right */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main content - full width and light */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Feed Name</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Category</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">URL</th>
                      <th className="text-center py-3 px-4 text-gray-700 font-medium">Articles</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Health</th>
                      <th className="text-center py-3 px-4 text-gray-700 font-medium">Last Updated</th>
                      <th className="text-center py-3 px-4 text-gray-700 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeeds.map((feed) => (
                      <EditableRSSRow
                        key={feed.id}
                        feed={feed}
                        categories={categories}
                        onUpdate={handleUpdateRSS}
                        onDelete={handleDeleteRSS}
                        onRefresh={handleRefreshRSS}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {filteredFeeds.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredFeeds.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
        
        {/* Stats on the right */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Rss className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-100">Total Feeds</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{combinedFeeds.length}</p>
            <p className="text-slate-400 text-sm">Active subscriptions</p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-slate-100">Categories</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{categories.length}</p>
            <p className="text-slate-400 text-sm">Feed categories</p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">Health Status</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{healthStats.activeFeeds}</p>
            <p className="text-slate-400 text-sm mb-3">Currently active</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{healthStats.active}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{healthStats.warning}</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>{healthStats.error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddRSSModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddRSS}
        categories={categories}
      />

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
}