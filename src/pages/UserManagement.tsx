import React from 'react';
import { Users, UserPlus, Shield, Clock } from 'lucide-react';

export function UserManagement() {
  const mockUsers = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-100">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">24</p>
          <p className="text-slate-400 text-sm">Registered accounts</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-100">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">18</p>
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

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">User List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-4 text-slate-100">{user.name}</td>
                  <td className="py-3 px-4 text-slate-300">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'Editor' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.status}
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