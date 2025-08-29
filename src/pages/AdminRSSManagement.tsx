import React from 'react';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { Rss, Plus, Settings, BarChart3 } from 'lucide-react';

export function AdminRSSManagement() {
  const { feeds, categories } = useRSSFeeds();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Feed List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Feed Name</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Articles</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeds.slice(0, 5).map((feed) => (
                <tr key={feed.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-slate-100">{feed.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                      {feed.category.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{feed.articleCount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feed.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {feed.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}