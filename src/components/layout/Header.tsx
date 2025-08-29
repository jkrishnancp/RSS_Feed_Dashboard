import React, { useState } from 'react';
import { RefreshCw, Bell, Settings, Search, User, LogOut, Users, Rss, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onRefresh: () => void;
  loading: boolean;
  error: string | null;
}

export function Header({ onRefresh, loading, error }: HeaderProps) {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search across all feeds..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {error && (
            <div className="text-red-400 text-sm font-medium bg-red-900/20 px-3 py-1 rounded-lg border border-red-800">
              Connection Error
            </div>
          )}
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Refresh All'}
          </button>
          
          <button className="p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
          </button>
          
          {/* Admin Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              className="flex items-center gap-1 p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showAdminDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/users');
                      setShowAdminDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    User Management
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/feeds');
                      setShowAdminDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 transition-colors"
                  >
                    <Rss className="w-4 h-4" />
                    RSS Management
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                JD
              </div>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="text-sm font-medium text-gray-100">John Doe</div>
                  <div className="text-xs text-gray-400">john@company.com</div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      // Handle logout
                      setShowProfileDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}