import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainDashboard } from './pages/MainDashboard';
import { SecurityAdvisories } from './pages/SecurityAdvisories';
import { TechNews } from './pages/TechNews';
import { DevBlogs } from './pages/DevBlogs';
import { CyberSecurity } from './pages/CyberSecurity';
import { UserManagement } from './pages/UserManagement';
import { AdminRSSManagement } from './pages/AdminRSSManagement';
import { UserProfile } from './pages/UserProfile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MainDashboard />;
      case 'security':
        return <SecurityAdvisories />;
      case 'tech-news':
        return <TechNews />;
      case 'dev-blogs':
        return <DevBlogs />;
      case 'cybersecurity':
        return <CyberSecurity />;
      case 'users':
        return <UserManagement />;
      case 'admin-rss':
        return <AdminRSSManagement />;
      case 'profile':
        return <UserProfile />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Header onPageChange={setCurrentPage} />
          <main className="flex-1 p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}