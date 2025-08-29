import React, { useState } from 'react';
import { Article } from '../types';
import { CyberFilters } from '../components/cyber/CyberFilters';
import { ThreatLandscape } from '../components/cyber/ThreatLandscape';
import { IncidentTimeline } from '../components/cyber/IncidentTimeline';

interface CyberSecurityProps {
  articles: Article[];
}

export function CyberSecurity({ articles }: CyberSecurityProps) {
  const [filters, setFilters] = useState({
    dateRange: 14,
    threatType: 'all',
    readStatus: 'all' as const,
    searchQuery: ''
  });

  const cyberArticles = articles.filter(article => 
    article.category.slug === 'cybersecurity'
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cybersecurity Intelligence</h1>
        <p className="text-gray-600">Track threats, incidents, and cybersecurity developments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CyberFilters 
            filters={filters}
            onFiltersChange={setFilters}
            articles={cyberArticles}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <ThreatLandscape articles={cyberArticles} />
          <IncidentTimeline articles={cyberArticles} />
        </div>
      </div>
    </div>
  );
}