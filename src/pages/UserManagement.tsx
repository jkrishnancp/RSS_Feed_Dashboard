import React, { useState } from 'react';
import { User } from '../types';
import { UserList } from '../components/admin/UserList';
import { UserDetail } from '../components/admin/UserDetail';
import { UserForm } from '../components/admin/UserForm';
import { UserStats } from '../components/admin/UserStats';
import { Users, Plus, Search, Filter } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUserUpdate: (user: User) => void;
  onUserCreate: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUserDelete: (userId: string) => void;
}

export function UserManagement({ users, onUserUpdate, onUserCreate, onUserDelete }: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    searchQuery: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);
    const matchesSearch = !filters.searchQuery || 
      user.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleFormSubmit = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      onUserUpdate({ ...userData, id: editingUser.id, createdAt: editingUser.createdAt } as User);
    } else {
      onUserCreate(userData);
    }
    setShowUserForm(false);
    setEditingUser(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <UserStats users={users} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Search Users
                </label>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  placeholder="Search by name or email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of{' '}
                <span className="font-medium text-gray-900">{users.length}</span> users
              </div>
            </div>
          </div>

          <UserList 
            users={filteredUsers}
            selectedId={selectedUser?.id}
            onSelect={setSelectedUser}
            onEdit={handleEditUser}
            onDelete={onUserDelete}
          />
        </div>
        
        <div className="lg:col-span-2">
          {selectedUser ? (
            <UserDetail 
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onEdit={() => handleEditUser(selectedUser)}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a User</h3>
              <p className="text-gray-600">Choose a user from the list to view their details and manage permissions</p>
            </div>
          )}
        </div>
      </div>

      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}