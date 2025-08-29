import React from 'react';
import { Article } from '../../types';
import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

interface ThreatLandscapeProps {
  articles: Article[];
}

export function ThreatLandscape({ articles }: ThreatLandscapeProps) {
  const threatTypes = {
    malware: articles.filter(a => a.tags.some(tag => tag.includes('malware'))).length,
    ransomware: articles.filter(a => a.tags.some(tag => tag.includes('ransomware'))).length,
    phishing: articles.filter(a => a.tags.some(tag => tag.includes('phishing'))).length,
    apt: articles.filter(a => a.tags.some(tag => tag.includes('apt'))).length,
  };

  const threats = [
    { name: 'Malware', count: threatTypes.malware, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Ransomware', count: threatTypes.ransomware, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Phishing', count: threatTypes.phishing, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'APT Groups', count: threatTypes.apt, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-gray-900">Threat Landscape</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {threats.map((threat) => (
          <div key={threat.name} className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${threat.bg} ${threat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{threat.count}</div>
            <div className="text-sm text-gray-600">{threat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}