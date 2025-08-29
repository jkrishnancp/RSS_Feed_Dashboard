import React, { useState } from 'react';
import { Article } from '../types';
import { SecurityFilters } from '../components/security/SecurityFilters';
import { SecurityStats } from '../components/security/SecurityStats';
import { AdvisoryList } from '../components/security/AdvisoryList';
import { AdvisoryDetail } from '../components/security/AdvisoryDetail';
import { Shield } from 'lucide-react';

interface SecurityAdvisoriesProps {
  articles: Article[];
}

export function SecurityAdvisories({ articles }: SecurityAdvisoriesProps) {
  const [selectedAdvisory, setSelectedAdvisory] = useState<Article | null>(null);
  const [filters, setFilters] = useState({
    dateRange: 7,
    severity: 'all',
    cveOnly: false,
    readStatus: 'all' as const,
    searchQuery: ''
  });

  const securityArticles = articles.filter(article => 
    article.category.slug === 'security' || 
    article.tags.some(tag => tag.toLowerCase().includes('security') || tag.toLowerCase().includes('cve'))
  );

  const filteredArticles = securityArticles.filter(article => {
    const now = new Date();
    const articleDate = new Date(article.publishedAt);
    const daysDiff = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDateRange = daysDiff <= filters.dateRange;
    const matchesSeverity = filters.severity === 'all' || article.severity === filters.severity;
    const matchesCVE = !filters.cveOnly || article.cveId;
    const matchesReadStatus = filters.readStatus === 'all' || 
      (filters.readStatus === 'read' && article.isRead) ||
      (filters.readStatus === 'unread' && !article.isRead);
    const matchesSearch = !filters.searchQuery || 
      article.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesDateRange && matchesSeverity && matchesCVE && matchesReadStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Advisories</h1>
        <p className="text-gray-600">Monitor security vulnerabilities and advisories across your feeds</p>
      </div>

      <SecurityStats articles={securityArticles} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <SecurityFilters 
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={securityArticles.length}
            filteredCount={filteredArticles.length}
          />
          
          <div className="mt-6">
            <AdvisoryList 
              articles={filteredArticles}
              selectedId={selectedAdvisory?.id}
              onSelect={setSelectedAdvisory}
            />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedAdvisory ? (
            <AdvisoryDetail 
              article={selectedAdvisory}
              onClose={() => setSelectedAdvisory(null)}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Advisory</h3>
              <p className="text-gray-600">Choose a security advisory from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}