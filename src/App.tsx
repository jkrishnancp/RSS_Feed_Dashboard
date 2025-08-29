import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainDashboard } from './pages/MainDashboard';
import { SecurityAdvisories } from './pages/SecurityAdvisories';
import { TechNews } from './pages/TechNews';
import { DevBlogs } from './pages/DevBlogs';
import { CyberSecurity } from './pages/CyberSecurity';
import { AIML } from './pages/AIML';
import { SocialMediaFeeds } from './pages/SocialMediaFeeds';
import { VendorBlogs } from './pages/VendorBlogs';
import { Uncategorized } from './pages/Uncategorized';
import { UserManagement } from './pages/UserManagement';
import { AdminRSSManagement } from './pages/AdminRSSManagement';
import { UserProfile } from './pages/UserProfile';
import { useRSSFeeds } from './hooks/useRSSFeeds';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { feeds, loading, error, refreshFeeds } = useRSSFeeds();

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)} 
            feeds={feeds} 
          />
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
            <Header onRefresh={refreshFeeds} loading={loading} error={error} />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<MainDashboard />} />
                <Route path="/security" element={<SecurityAdvisories />} />
                <Route path="/tech-news" element={<TechNews />} />
                <Route path="/dev-blogs" element={<DevBlogs />} />
                <Route path="/cybersecurity" element={<CyberSecurity />} />
                <Route path="/ai-ml" element={<AIML />} />
                <Route path="/social-media" element={<SocialMediaFeeds />} />
                <Route path="/vendor-blogs" element={<VendorBlogs />} />
                <Route path="/uncategorized" element={<Uncategorized />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/admin/feeds" element={<AdminRSSManagement />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}