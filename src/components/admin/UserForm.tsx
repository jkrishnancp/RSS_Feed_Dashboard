import React, { useState } from 'react';
import { User, Permission } from '../../types';
import { X, Save, User as UserIcon, Mail, Shield, Eye, Edit } from 'lucide-react';

interface UserFormProps {
  user?: User | null;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const defaultPermissions: Permission[] = [
  { id: 'read-feeds', name: 'Read Feeds', description: 'View RSS feeds and articles', resource: 'feeds', action: 'read' },
  { id: 'manage-bookmarks', name: 'Manage Bookmarks', description: 'Create and manage bookmarks', resource: 'bookmarks', action: 'create' },
  { id: 'update-profile', name: 'Update Profile', description: 'Modify own profile information', resource: 'profile', action: 'update' },
];

const adminPermissions: Permission[] = [
  ...defaultPermissions,
  { id: 'manage-feeds', name: 'Manage Feeds', description: 'Add, edit, and delete RSS feeds', resource: 'feeds', action: 'create' },
  { id: 'manage-users', name: 'Manage Users', description: 'Create and manage user accounts', resource: 'users', action: 'create' },
  { id: 'system-settings', name: 'System Settings', description: 'Configure system-wide settings', resource: 'system', action: 'update' },
];

const editorPermissions: Permission[] = [
  ...defaultPermissions,
  { id: 'manage-feeds', name: 'Manage Feeds', description: 'Add, edit, and delete RSS feeds', resource: 'feeds', action: 'create' },
];

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'viewer' as const,
    isActive: user?.isActive ?? true,
    feedAccess: user?.feedAccess || [],
    permissions: user?.permissions || defaultPermissions,
  });

  const handleRoleChange = (role: 'admin' | 'editor' | 'viewer') => {
    let permissions: Permission[];
    switch (role) {
      case 'admin':
        permissions = adminPermissions;
        break;
      case 'editor':
        permissions = editorPermissions;
        break;
      default:
        permissions = defaultPermissions;
    }
    
    setFormData({ ...formData, role, permissions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lastLogin: user?.lastLogin || new Date(),
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'editor': return Edit;
      case 'viewer': return Eye;
      default: return Eye;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">User Role</label>
            <div className="grid grid-cols-3 gap-3">
              {(['viewer', 'editor', 'admin'] as const).map((role) => {
                const Icon = getRoleIcon(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.role === role
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-medium text-gray-900 capitalize">{role}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {role === 'admin' && 'Full system access'}
                      {role === 'editor' && 'Content management'}
                      {role === 'viewer' && 'Read-only access'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Account is active
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-3">
                {formData.permissions.map((permission) => (
                  <div key={permission.id} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="font-medium text-gray-900 text-sm">{permission.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{permission.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {permission.resource}
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {permission.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}