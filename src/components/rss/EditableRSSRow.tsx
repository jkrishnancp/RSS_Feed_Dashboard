import React, { useState } from 'react';
import { Edit3, Save, X, Trash2, RefreshCw, AlertTriangle, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { RSSFeedData, getHealthIndicator, formatTimeAgo, refreshRSSFeed } from '../../utils/rssValidator';

interface EditableRSSRowProps {
  feed: RSSFeedData;
  categories: Array<{ id: string; name: string; slug: string }>;
  onUpdate: (feedId: string, updates: Partial<RSSFeedData>) => void;
  onDelete: (feedId: string) => void;
  onRefresh?: (feedId: string) => void;
}

export function EditableRSSRow({ feed, categories, onUpdate, onDelete, onRefresh }: EditableRSSRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: feed.title,
    url: feed.url,
    category: feed.category,
    isActive: feed.isActive
  });

  const handleSave = () => {
    onUpdate(feed.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: feed.title,
      url: feed.url,
      category: feed.category,
      isActive: feed.isActive
    });
    setIsEditing(false);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    try {
      const refreshedFeed = await refreshRSSFeed(feed);
      onUpdate(feed.id, refreshedFeed);
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const getHealthIndicatorDisplay = () => {
    const indicator = getHealthIndicator(feed.health.status);
    
    let icon;
    switch (feed.health.status) {
      case 'active':
        icon = <CheckCircle className="w-3 h-3" />;
        break;
      case 'warning':
        icon = <AlertTriangle className="w-3 h-3" />;
        break;
      case 'error':
        icon = <AlertCircle className="w-3 h-3" />;
        break;
      default:
        icon = <Clock className="w-3 h-3" />;
    }
    
    return (
      <div className="flex items-center gap-2" title={indicator.label}>
        <div className={`w-2 h-2 ${indicator.color} rounded-full animate-pulse`}></div>
        <div className={`flex items-center gap-1 ${indicator.textColor}`}>
          {icon}
          <span className="text-xs font-medium capitalize">{feed.health.status}</span>
        </div>
      </div>
    );
  };

  if (isEditing) {
    return (
      <tr className="border-b border-gray-100 bg-blue-50">
        <td className="py-3 px-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            placeholder="Feed title"
          />
        </td>
        <td className="py-3 px-4">
          <select
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-4">
          <input
            type="url"
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            placeholder="RSS URL"
          />
        </td>
        <td className="py-3 px-4 text-center">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {feed.articleCount}
          </span>
        </td>
        <td className="py-3 px-4">
          <select
            value={editData.isActive ? 'active' : 'inactive'}
            onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'active' })}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </td>
        <td className="py-3 px-4">
          <div className="space-y-1">
            {getHealthIndicatorDisplay()}
            <div className="text-xs text-gray-500" title={feed.health.message}>
              {formatTimeAgo(feed.health.lastSuccessfulFetch)}
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-center text-sm text-gray-600">
          {new Date(feed.lastUpdated).toLocaleDateString()}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="Save changes"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-gray-900 font-medium">{feed.title}</td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {categories.find(c => c.slug === feed.category)?.name || feed.category}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600 break-all max-w-xs">{feed.url}</td>
      <td className="py-3 px-4 text-center">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {feed.articleCount}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          feed.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {feed.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="space-y-1">
          {getHealthIndicatorDisplay()}
          <div className="text-xs text-gray-500" title={feed.health.message}>
            {formatTimeAgo(feed.health.lastSuccessfulFetch)}
          </div>
          {feed.health.status !== 'active' && (
            <div className="text-xs text-gray-600 max-w-32 truncate" title={feed.health.message}>
              {feed.health.message}
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-center text-gray-600">
        {new Date(feed.lastUpdated).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="Edit feed"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefreshFeed}
            disabled={isRefreshing}
            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh feed and fetch latest articles"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onDelete(feed.id)}
            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
            title="Delete feed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}