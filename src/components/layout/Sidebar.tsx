import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  Newspaper, 
  Code, 
  Lock,
  Menu,
  Rss,
  ChevronLeft,
  Brain,
  MessageCircle,
  Building2,
  Package
} from 'lucide-react';
import { RSSFeed } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  feeds: RSSFeed[];
}

export function Sidebar({ isOpen, onToggle, feeds }: SidebarProps) {
  const categories = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: LayoutDashboard, 
      color: 'text-blue-400',
      count: feeds.length
    },
    { 
      name: 'Security Advisories', 
      path: '/security', 
      icon: Shield, 
      color: 'text-red-400',
      count: feeds.filter(f => f.category.slug === 'security').length
    },
    { 
      name: 'Tech News', 
      path: '/tech-news', 
      icon: Newspaper, 
      color: 'text-blue-400',
      count: feeds.filter(f => f.category.slug === 'tech-news').length
    },
    { 
      name: 'Dev Blogs', 
      path: '/dev-blogs', 
      icon: Code, 
      color: 'text-purple-400',
      count: feeds.filter(f => f.category.slug === 'dev-blogs').length
    },
    { 
      name: 'Cybersecurity', 
      path: '/cybersecurity', 
      icon: Lock, 
      color: 'text-orange-400',
      count: feeds.filter(f => f.category.slug === 'cybersecurity').length
    },
    { 
      name: 'AI & ML', 
      path: '/ai-ml', 
      icon: Brain, 
      color: 'text-green-400',
      count: feeds.filter(f => f.category.slug === 'ai-ml').length
    },
    { 
      name: 'Social Media', 
      path: '/social-media', 
      icon: MessageCircle, 
      color: 'text-green-400',
      count: feeds.filter(f => f.category.slug === 'social-media').length
    },
    { 
      name: 'Vendor Blogs', 
      path: '/vendor-blogs', 
      icon: Building2, 
      color: 'text-indigo-400',
      count: feeds.filter(f => f.category.slug === 'vendor-blogs').length
    },
    { 
      name: 'Uncategorized', 
      path: '/uncategorized', 
      icon: Package, 
      color: 'text-gray-400',
      count: feeds.filter(f => f.category.slug === 'uncategorized' || !f.category.slug).length
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 shadow-xl transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Rss className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold text-gray-100">RSS Reader</h1>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <NavLink
                key={category.path}
                to={category.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-900/30 text-blue-400 shadow-sm border border-blue-800'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`
                }
              >
                <Icon className={`w-5 h-5 ${category.color} group-hover:scale-110 transition-transform`} />
                {isOpen && (
                  <>
                    <span className="font-medium flex-1">{category.name}</span>
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-800">
            <div className="text-xs text-blue-400 mb-1 font-medium">Total Feeds</div>
            <div className="text-2xl font-bold text-blue-300">{feeds.length}</div>
            <div className="text-xs text-blue-400">Active subscriptions</div>
          </div>
        </div>
      )}
    </div>
  );
}