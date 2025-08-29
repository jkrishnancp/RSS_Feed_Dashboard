// RSS Feed Validation and Health Monitoring Utilities
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface RSSHealthStatus {
  isValid: boolean;
  status: 'active' | 'warning' | 'error';
  lastFetch: Date;
  lastSuccessfulFetch: Date;
  errorCount: number;
  message: string;
}

export interface RSSFeedData {
  id: string;
  title: string;
  url: string;
  category: string;
  isActive: boolean;
  health: RSSHealthStatus;
  lastUpdated: Date;
  articleCount: number;
  description?: string;
  tags?: string[];
}

// Bulk import result interface
export interface BulkImportResult {
  successful: RSSFeedData[];
  failed: Array<{ feed: { category: string; url: string; title?: string }; error: string }>;
  total: number;
  successCount: number;
  failureCount: number;
}

// Enhanced URL validation with more comprehensive checks
export const validateRSSUrl = async (url: string): Promise<{ isValid: boolean; error?: string; title?: string }> => {
  try {
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      return { isValid: false, error: 'Invalid URL format. URL must start with http:// or https://' };
    }

    // Additional URL format validation
    try {
      new URL(url);
    } catch {
      return { isValid: false, error: 'Malformed URL' };
    }

    // For demo purposes, simulate RSS validation
    // In production, this would make an actual API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Simple heuristic validation for common RSS patterns
    const commonRSSPatterns = [
      /feed/i, /rss/i, /xml/i, /atom/i
    ];
    
    const hasRSSPattern = commonRSSPatterns.some(pattern => pattern.test(url));
    
    if (!hasRSSPattern) {
      // Still allow it but with a warning
      return { 
        isValid: true, 
        title: extractTitleFromUrl(url),
        error: 'URL doesn\'t match common RSS patterns but will be accepted' 
      };
    }
    
    return { 
      isValid: true, 
      title: extractTitleFromUrl(url)
    };
  } catch {
    return { isValid: false, error: 'Failed to validate RSS feed' };
  }
};

// Extract a reasonable title from URL
const extractTitleFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0 && pathParts[0] !== 'feed' && pathParts[0] !== 'rss') {
      return `${hostname} - ${pathParts[0].replace(/[-_]/g, ' ')}`;
    }
    
    return hostname;
  } catch {
    return 'RSS Feed';
  }
};

// Check RSS feed health based on last fetch times
export const checkRSSHealth = (lastSuccessfulFetch: Date): RSSHealthStatus['status'] => {
  const now = new Date();
  const hoursSinceLastFetch = (now.getTime() - lastSuccessfulFetch.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastFetch <= 6) {
    return 'active';
  } else if (hoursSinceLastFetch <= 24) {
    return 'warning';
  } else {
    return 'error';
  }
};

// Update RSS feed health status
export const updateRSSHealth = (feed: RSSFeedData): RSSFeedData => {
  const now = new Date();
  const hoursSinceLastFetch = (now.getTime() - feed.health.lastSuccessfulFetch.getTime()) / (1000 * 60 * 60);
  
  let status: RSSHealthStatus['status'] = 'active';
  let message = 'Feed is working normally';
  
  if (hoursSinceLastFetch > 6 && hoursSinceLastFetch <= 24) {
    status = 'warning';
    message = `No data received in ${Math.floor(hoursSinceLastFetch)} hours`;
  } else if (hoursSinceLastFetch > 24) {
    status = 'error';
    message = `No data received in ${Math.floor(hoursSinceLastFetch / 24)} day${Math.floor(hoursSinceLastFetch / 24) > 1 ? 's' : ''}`;
  } else {
    message = `Last updated ${formatTimeAgo(feed.health.lastSuccessfulFetch)}`;
  }
  
  return {
    ...feed,
    health: {
      ...feed.health,
      status,
      message,
    }
  };
};

// Monitor RSS feed health for all feeds
export const monitorRSSHealth = (feeds: RSSFeedData[]): RSSFeedData[] => {
  return feeds.map(feed => updateRSSHealth(feed));
};

// Get feed health statistics
export const getFeedHealthStats = (feeds: RSSFeedData[]) => {
  const total = feeds.length;
  const active = feeds.filter(f => f.health.status === 'active').length;
  const warning = feeds.filter(f => f.health.status === 'warning').length;
  const error = feeds.filter(f => f.health.status === 'error').length;
  const activeFeeds = feeds.filter(f => f.isActive).length;
  
  return {
    total,
    active,
    warning,
    error,
    activeFeeds,
    inactiveFeeds: total - activeFeeds
  };
};

// Parse CSV content for bulk RSS import using PapaParse
export const parseRSSCSV = (csvContent: string): Array<{ category: string; url: string; title?: string }> => {
  try {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });

    if (result.errors && result.errors.length > 0) {
      console.warn('CSV parsing errors:', result.errors);
    }

    return (result.data as Record<string, string>[]).map((row: Record<string, string>) => ({
      category: row.category || row['category name'] || '',
      url: row.url || row['rss url'] || row.link || '',
      title: row.title || row.name || ''
    })).filter(item => item.category && item.url);
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};

// Parse Excel file using XLSX library
export const parseRSSExcel = (file: File): Promise<Array<{ category: string; url: string; title?: string }>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];
        
        if (jsonData.length < 2) {
          resolve([]);
          return;
        }
        
        const headers = jsonData[0].map((header: string | number) => String(header)?.toLowerCase().trim() || '');
        const categoryIndex = headers.findIndex(h => h.includes('category'));
        const urlIndex = headers.findIndex(h => h.includes('url') || h.includes('link'));
        const titleIndex = headers.findIndex(h => h.includes('title') || h.includes('name'));
        
        if (categoryIndex === -1 || urlIndex === -1) {
          reject(new Error('Required columns (Category, URL) not found in Excel file'));
          return;
        }
        
        const result = jsonData.slice(1)
          .filter(row => row[categoryIndex] && row[urlIndex])
          .map(row => ({
            category: String(row[categoryIndex] || '').trim(),
            url: String(row[urlIndex] || '').trim(),
            title: titleIndex >= 0 ? String(row[titleIndex] || '').trim() : ''
          }));
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read Excel file'));
    reader.readAsArrayBuffer(file);
  });
};

// Get RSS feed data for the last 7 days only
export const fetchRSSFeedData = async (url: string): Promise<{ articles: any[]; title?: string }> => {
  try {
    // For demo purposes, simulate RSS data fetching
    // In production, this would make an actual API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Generate mock articles for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const mockArticles = generateMockArticles(url, 5); // Generate 5 mock articles
    
    // Filter to last 7 days
    const recentArticles = mockArticles.filter(article => {
      const publishDate = new Date(article.publishedAt);
      return publishDate >= sevenDaysAgo;
    });
    
    return {
      articles: recentArticles,
      title: extractTitleFromUrl(url)
    };
  } catch (error) {
    console.error('Failed to fetch RSS data:', error);
    return { articles: [] };
  }
};

// Generate mock articles for demo purposes
const generateMockArticles = (url: string, count: number): any[] => {
  const articles = [];
  const baseTitle = extractTitleFromUrl(url);
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const publishDate = new Date();
    publishDate.setDate(publishDate.getDate() - daysAgo);
    
    articles.push({
      id: `article_${i}_${Date.now()}`,
      title: `${baseTitle} Article ${i + 1}`,
      description: `Sample article content from ${baseTitle}`,
      publishedAt: publishDate.toISOString(),
      link: `${url}/article-${i + 1}`,
      author: 'RSS Author'
    });
  }
  
  return articles;
};

// Import RSS feed with 7-day limitation
export const importRSSFeedWithLimit = async (feedData: RSSFeedData): Promise<RSSFeedData> => {
  try {
    const { articles, title } = await fetchRSSFeedData(feedData.url);
    
    return {
      ...feedData,
      title: feedData.title || title || 'RSS Feed',
      articleCount: articles.length,
      lastUpdated: new Date(),
      health: {
        ...feedData.health,
        lastFetch: new Date(),
        lastSuccessfulFetch: new Date(),
        status: 'active',
        message: `Successfully imported ${articles.length} articles from last 7 days`
      }
    };
  } catch (error) {
    return {
      ...feedData,
      health: {
        ...feedData.health,
        lastFetch: new Date(),
        status: 'error',
        message: `Failed to import RSS data: ${error}`,
        errorCount: feedData.health.errorCount + 1
      }
    };
  }
};

// Refresh RSS feed data
export const refreshRSSFeed = async (feedData: RSSFeedData): Promise<RSSFeedData> => {
  return await importRSSFeedWithLimit(feedData);
};

// Validate and import RSS feed with data limitation
export const validateAndImportRSS = async (url: string, category: string, title?: string): Promise<RSSFeedData> => {
  const validation = await validateRSSUrl(url);
  
  const feedData: RSSFeedData = {
    id: `rss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: title || validation.title || 'New RSS Feed',
    url,
    category,
    isActive: true,
    health: {
      isValid: validation.isValid,
      status: validation.isValid ? 'active' : 'error',
      lastFetch: new Date(),
      lastSuccessfulFetch: validation.isValid ? new Date() : new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago if invalid
      errorCount: validation.isValid ? 0 : 1,
      message: validation.error || 'Feed validated and imported successfully'
    },
    lastUpdated: new Date(),
    articleCount: 0
  };

  if (validation.isValid) {
    return await importRSSFeedWithLimit(feedData);
  }
  
  return feedData;
};

// Batch validate multiple RSS feeds
export const batchValidateRSSFeeds = async (
  feeds: Array<{ category: string; url: string; title?: string }>,
  onProgress?: (current: number, total: number, feed: { category: string; url: string }) => void
): Promise<Array<{ feed: { category: string; url: string; title?: string }; result: RSSFeedData; isValid: boolean }>> => {
  const results = [];
  
  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i];
    onProgress?.(i + 1, feeds.length, feed);
    
    try {
      const result = await validateAndImportRSS(feed.url, feed.category, feed.title);
      results.push({
        feed,
        result,
        isValid: result.health.isValid
      });
    } catch (error) {
      results.push({
        feed,
        result: {
          id: `error_${Date.now()}_${i}`,
          title: feed.title || 'Failed RSS Feed',
          url: feed.url,
          category: feed.category,
          isActive: false,
          health: {
            isValid: false,
            status: 'error',
            lastFetch: new Date(),
            lastSuccessfulFetch: new Date(Date.now() - 25 * 60 * 60 * 1000),
            errorCount: 1,
            message: `Validation failed: ${error}`
          },
          lastUpdated: new Date(),
          articleCount: 0
        } as RSSFeedData,
        isValid: false
      });
    }
    
    // Small delay to prevent overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

// Get status color class based on health status
export const getStatusColorClass = (status: RSSHealthStatus['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'error':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Get health indicator icon and color
export const getHealthIndicator = (status: RSSHealthStatus['status']) => {
  switch (status) {
    case 'active':
      return {
        color: 'bg-green-500',
        textColor: 'text-green-600',
        label: 'Active - Working normally'
      };
    case 'warning':
      return {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        label: 'Warning - No data for 6+ hours'
      };
    case 'error':
      return {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        label: 'Error - No data for 24+ hours'
      };
    default:
      return {
        color: 'bg-gray-500',
        textColor: 'text-gray-600',
        label: 'Unknown status'
      };
  }
};

// Get status text based on health status
export const getStatusText = (status: RSSHealthStatus['status']): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'warning':
      return 'Warning';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
};

// Format time ago helper
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 1) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
};

// Validate file type for import
export const validateImportFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/tab-separated-values'
  ];
  
  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.txt', '.tsv'];
  
  const hasValidExtension = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'File must be CSV, Excel (.xlsx, .xls), or TSV format'
    };
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return {
      isValid: false,
      error: 'File size must be less than 5MB'
    };
  }
  
  return { isValid: true };
};