import React, { useState } from 'react';
import { RSSFeed, FeedCategory, RSSFeedForm } from '../types';
import { FeedList } from '../components/admin/FeedList';
import { FeedForm } from '../components/admin/FeedForm';
import { FeedStats } from '../components/admin/FeedStats';
import { CategoryManager } from '../components/admin/CategoryManager';
import { BulkActions } from '../components/admin/BulkActions';
import { Rss, Plus, Search, Filter, Settings } from 'lucide-react';

interface AdminRSSManagementProps {
  feeds: RSSFeed[];
  categories: FeedCategory[];
  onFeedCreate: (feed: RSSFeedForm) => void;
  onFeedUpdate: (feed: RSSFeed) => void;
  onFeedDelete: (feedId: string) => void;
  onCategoryCreate: (category: Omit<FeedCategory, 'id' | 'feedCount'>) => void;
  onCategoryUpdate: (category: FeedCategory) => void;
  onCategoryDelete: (categoryId: string) => void;
}

export function AdminRSSManagement({ 
  feeds, 
  categories, 
  onFeedCreate, 
  onFeedUpdate, 
  onFeedDelete,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete
}: AdminRSSManagementProps) {
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'feeds' | 'categories'>('feeds');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    folder: 'all',
    searchQuery: ''
  });

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

  const handleCreateFeed = () => {
    setEditingFeed(null);
    setShowFeedForm(true);
  };

  const handleEditFeed = (feed: RSSFeed) => {
    setEditingFeed(feed);
    setShowFeedForm(true);
  };

  const handleFormSubmit = (feedData: RSSFeedForm) => {
    if (editingFeed) {
      onFeedUpdate({ 
        ...editingFeed, 
        ...feedData,
        category: categories.find(c => c.id === feedData.categoryId)!
      });
    } else {
      onFeedCreate(feedData);
    }
    setShowFeedForm(false);
    setEditingFeed(null);
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        selectedFeeds.forEach(feedId => {
          const feed = feeds.find(f => f.id === feedId);
          if (feed) onFeedUpdate({ ...feed, isActive: true });
        });
        break;
      case 'deactivate':
        selectedFeeds.forEach(feedId => {
          const feed = feeds.find(f => f.id === feedId);
          if (feed) onFeedUpdate({ ...feed, isActive: false });
        });
        break;
      case 'delete':
        selectedFeeds.forEach(feedId => onFeedDelete(feedId));
        break;
    }
    setSelectedFeeds([]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RSS Feed Management</h1>
          <p className="text-gray-600">Manage RSS feeds, categories, and feed organization</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateFeed}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add RSS Feed
          </button>
        </div>
      </div>

      <FeedStats feeds={feeds} categories={categories} />

      <div className="mt-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('feeds')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'feeds'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Rss className="w-4 h-4 inline mr-2" />
            RSS Feeds ({feeds.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Categories ({categories.length})
          </button>
        </div>

        {activeTab === 'feeds' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="Search feeds..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder</label>
                  <select
                    value={filters.folder}
                    onChange={(e) => setFilters({ ...filters, folder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Folders</option>
                    {folders.map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{filteredFeeds.length}</span> of{' '}
                  <span className="font-medium text-gray-900">{feeds.length}</span> feeds
                </div>
              </div>
            </div>

            {selectedFeeds.length > 0 && (
              <BulkActions
                selectedCount={selectedFeeds.length}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedFeeds([])}
              />
            )}

            <FeedList
              feeds={filteredFeeds}
              categories={categories}
              selectedFeeds={selectedFeeds}
              onSelectionChange={setSelectedFeeds}
              onEdit={handleEditFeed}
              onDelete={onFeedDelete}
            />
          </div>
        ) : (
          <CategoryManager
            categories={categories}
            feeds={feeds}
            onCreate={onCategoryCreate}
            onUpdate={onCategoryUpdate}
            onDelete={onCategoryDelete}
          />
        )}
      </div>

      {showFeedForm && (
        <FeedForm
          feed={editingFeed}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowFeedForm(false);
            setEditingFeed(null);
          }}
        />
      )}
    </div>
  );
}