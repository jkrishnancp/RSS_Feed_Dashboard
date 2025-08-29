import React from 'react';
import { useRSSFeeds } from '../hooks/useRSSFeeds';
import { Shield, AlertTriangle, TrendingUp, Lock } from 'lucide-react';

export function CyberSecurity() {
  const { articles } = useRSSFeeds();

  const cyberArticles = articles.filter(article => 
    article.category.slug === 'cybersecurity'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Cybersecurity Intelligence</h1>
          <p className="text-slate-400 mt-1">Track threats, incidents, and cybersecurity developments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-100">Threats Monitored</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">247</p>
          <p className="text-slate-400 text-sm">Active threat indicators</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-slate-100">High Priority</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">18</p>
          <p className="text-slate-400 text-sm">Require immediate attention</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-100">Trend Analysis</h3>
          </div>
          <p className="text-3xl font-bold text-slate-100">+15%</p>
          <p className="text-slate-400 text-sm">Threats this week</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Cybersecurity Articles</h3>
        <div className="space-y-4">
          {cyberArticles.slice(0, 5).map((article) => (
            <div key={article.id} className="flex items-start gap-4 p-4 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Lock className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-slate-100 line-clamp-1">{article.title}</h4>
                <p className="text-sm text-slate-400 line-clamp-2 mt-1">{article.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>{article.feedTitle}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}