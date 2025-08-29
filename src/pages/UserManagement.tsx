import React, { useState } from 'react';
import { Users, UserPlus, Shield, Clock, Search, Filter, Calendar } from 'lucide-react';
import { Pagination } from '../components/common/Pagination';

export function UserManagement() {
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15', createdAt: '2023-06-01' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active', lastLogin: '2024-01-14', createdAt: '2023-07-15' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2024-01-10', createdAt: '2023-08-20' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'Editor', status: 'Active', lastLogin: '2024-01-13', createdAt: '2023-09-10' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Active', lastLogin: '2024-01-12', createdAt: '2023-10-05' }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.status === 'Active') ||
      (filters.status === 'inactive' && user.status === 'Inactive');
    const matchesSearch = !filters.searchQuery || 
      user.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginate filtered users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
          <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters on top */}
      <div className="w-full">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-100">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Users
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => updateFilter('role', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-100">{filteredUsers.length}</span> of{' '}
              <span className="font-medium text-slate-100">{mockUsers.length}</span> users
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
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Role</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{user.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {filteredUsers.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
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
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-100">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{mockUsers.length}</p>
            <p className="text-slate-400 text-sm">Registered accounts</p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-slate-100">Active Users</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">{mockUsers.filter(u => u.status === 'Active').length}</p>
            <p className="text-slate-400 text-sm">Currently active</p>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-slate-100">Recent Logins</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100">12</p>
            <p className="text-slate-400 text-sm">Last 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}