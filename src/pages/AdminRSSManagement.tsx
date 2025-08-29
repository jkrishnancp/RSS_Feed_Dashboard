import React, { useState } from 'react';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { Pagination } from '../components/common/Pagination';
import { Rss, Plus, Settings, BarChart3, Search, Filter } from 'lucide-react';

export function AdminRSSManagement() {
  const { feeds, categories } = useRSSFeeds();
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    folder: 'all',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredFeeds = feeds.filter(feed => {
    const matchesCategory = filters.category === 'all' || feed.category.id === filters.category;
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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginate filtered feeds
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeeds = filteredFeeds.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">RSS Feed Management</h1>
          <p className="text-slate-400 mt-1">Manage RSS feeds, categories, and feed organization</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add RSS Feed
        </button>
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
                  <option key={category.id} value={category.id}>{category.name}</option>
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
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-100">{filteredFeeds.length}</span> of{' '}
              <span className="font-medium text-slate-100">{feeds.length}</span> feeds
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
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Folder</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Articles</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeeds.map((feed) => (
                      <tr key={feed.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{feed.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            {feed.category.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{feed.folder}</td>
                        <td className="py-3 px-4 text-gray-600">{feed.articleCount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            feed.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {feed.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(feed.lastUpdated).toLocaleDateString()}
                        </td>
                      </tr>
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
            <p className="text-3xl font-bold text-slate-100">{feeds.length}</p>
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
              <h3 className="text-lg font-semibold text-slate-100">Active Feeds</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{feeds.filter(f => f.isActive).length}</p>
            <p className="text-slate-400 text-sm">Currently updating</p>
          </div>
        </div>
      </div>
    </div>
  );
}