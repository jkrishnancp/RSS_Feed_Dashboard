import React from 'react';
import { User } from '../../types';
import { X, Edit, Shield, Eye, Edit3, Clock, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface UserDetailProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
}

export function UserDetail({ user, onClose, onEdit }: UserDetailProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'editor': return Edit3;
      case 'viewer': return Eye;
      default: return Eye;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'editor': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'viewer': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
              <div className="flex items-center gap-2">
                {user.isActive ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Role</label>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getRoleColor(user.role)}`}>
                <RoleIcon className="w-4 h-4" />
                <span className="font-medium capitalize">{user.role}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Email</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Mail className="w-4 h-4 text-gray-500" />
                {user.email}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Created</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-500" />
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Last Login</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4 text-gray-500" />
                {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">Feed Access</label>
              <div className="text-gray-900">
                {user.feedAccess.length} feeds assigned
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 block mb-3">Permissions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.permissions.map((permission) => (
              <div key={permission.id} className="bg-gray-50 rounded-lg p-3">
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

        <div>
          <label className="text-sm font-medium text-gray-500 block mb-3">Activity Summary</label>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">1,247</div>
                <div className="text-xs text-gray-600">Articles Read</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">89</div>
                <div className="text-xs text-gray-600">Bookmarks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">23</div>
                <div className="text-xs text-gray-600">Login Sessions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}