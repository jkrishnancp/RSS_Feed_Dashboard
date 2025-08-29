import { useState, useCallback } from 'react';
import { User, Permission } from '../types';

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@company.com',
    name: 'John Administrator',
    role: 'admin',
    avatar: undefined,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    isActive: true,
    permissions: [
      { id: 'manage-feeds', name: 'Manage Feeds', description: 'Add, edit, and delete RSS feeds', resource: 'feeds', action: 'create' },
      { id: 'manage-users', name: 'Manage Users', description: 'Create and manage user accounts', resource: 'users', action: 'create' },
      { id: 'system-settings', name: 'System Settings', description: 'Configure system-wide settings', resource: 'system', action: 'update' },
    ],
    feedAccess: ['feed-1', 'feed-2', 'feed-3', 'feed-4', 'feed-5', 'feed-6'],
  },
  {
    id: 'user-2',
    email: 'sarah.editor@company.com',
    name: 'Sarah Editor',
    role: 'editor',
    avatar: undefined,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isActive: true,
    permissions: [
      { id: 'read-feeds', name: 'Read Feeds', description: 'View RSS feeds and articles', resource: 'feeds', action: 'read' },
      { id: 'manage-feeds', name: 'Manage Feeds', description: 'Add, edit, and delete RSS feeds', resource: 'feeds', action: 'create' },
      { id: 'manage-bookmarks', name: 'Manage Bookmarks', description: 'Create and manage bookmarks', resource: 'bookmarks', action: 'create' },
    ],
    feedAccess: ['feed-1', 'feed-2', 'feed-3'],
  },
  {
    id: 'user-3',
    email: 'mike.viewer@company.com',
    name: 'Mike Viewer',
    role: 'viewer',
    avatar: undefined,
    createdAt: new Date('2024-02-10'),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isActive: true,
    permissions: [
      { id: 'read-feeds', name: 'Read Feeds', description: 'View RSS feeds and articles', resource: 'feeds', action: 'read' },
      { id: 'manage-bookmarks', name: 'Manage Bookmarks', description: 'Create and manage bookmarks', resource: 'bookmarks', action: 'create' },
    ],
    feedAccess: ['feed-1', 'feed-3'],
  },
  {
    id: 'user-4',
    email: 'inactive.user@company.com',
    name: 'Inactive User',
    role: 'viewer',
    avatar: undefined,
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isActive: false,
    permissions: [
      { id: 'read-feeds', name: 'Read Feeds', description: 'View RSS feeds and articles', resource: 'feeds', action: 'read' },
    ],
    feedAccess: [],
  },
];

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const createUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  }, []);

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
  };
}