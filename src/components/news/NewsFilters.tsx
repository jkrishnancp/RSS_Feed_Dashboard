import React from 'react';
import { Calendar, Filter, Search } from 'lucide-react';

interface NewsFiltersProps {
  filters: {
    dateRange: number;
    category: string;
    readStatus: 'all' | 'read' | 'unread';
    searchQuery: string;
  };
  onFiltersChange: (filters: any) => void;
  totalCount: number;
  filteredCount: number;
}

export function NewsFilters({ filters, onFiltersChange, totalCount, filteredCount }: NewsFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Search
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search news..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => updateFilter('dateRange', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>Today</option>
            <option value={7}>This Week</option>
            <option value={30}>This Month</option>
            <option value={90}>Last 3 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Read Status</label>
          <select
            value={filters.readStatus}
            onChange={(e) => updateFilter('readStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Articles</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredCount}</span> of{' '}
          <span className="font-medium text-gray-900">{totalCount}</span> articles
        </div>
      </div>
    </div>
  );
}