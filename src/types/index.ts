export interface RSSFeed {
  id: string;
  title: string;
  url: string;
  description: string;
  category: FeedCategory;
  folder: string;
  lastUpdated: Date;
  articleCount: number;
  isActive: boolean;
  favicon?: string;
  language?: string;
  tags: string[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: Date;
  updatedAt: Date;
  author?: string;
  feedId: string;
  feedTitle: string;
  category: FeedCategory;
  tags: string[];
  isRead: boolean;
  isBookmarked: boolean;
  readingTime: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cveId?: string;
  cvssScore?: number;
}

export interface FeedCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  description: string;
  feedCount: number;
}

export interface DashboardStats {
  totalFeeds: number;
  totalArticles: number;
  unreadCount: number;
  bookmarkedCount: number;
  categoriesCount: number;
  lastUpdated: Date;
  dailyStats: {
    date: string;
    articles: number;
    reads: number;
  }[];
}

export interface FilterOptions {
  category?: string;
  dateRange: number; // days
  severity?: string;
  readStatus?: 'all' | 'read' | 'unread';
  sortBy: 'date' | 'title' | 'severity' | 'readCount';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
}

export interface SecurityAdvisory extends Article {
  cveId: string;
  cvssScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedProducts: string[];
  patchAvailable: boolean;
  exploitAvailable: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  permissions: Permission[];
  feedAccess: string[]; // Feed IDs user has access to
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export interface RSSFeedForm {
  title: string;
  url: string;
  description: string;
  categoryId: string;
  folder: string;
  tags: string[];
  isActive: boolean;
  updateFrequency: number; // minutes
  userAccess: string[]; // User IDs who can access this feed
}