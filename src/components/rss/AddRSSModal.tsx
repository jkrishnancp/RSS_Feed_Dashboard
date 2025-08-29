import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle, Loader2, Info, Rss } from 'lucide-react';
import { validateRSSUrl, validateAndImportRSS, RSSFeedData } from '../../utils/rssValidator';

interface AddRSSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (rssData: RSSFeedData) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function AddRSSModal({ isOpen, onClose, onAdd, categories }: AddRSSModalProps) {
  const [formData, setFormData] = useState({
    category: '',
    url: '',
    title: ''
  });
  const [validation, setValidation] = useState<{
    isValidating: boolean;
    isValid: boolean;
    error?: string;
    suggestedTitle?: string;
  }>({
    isValidating: false,
    isValid: false
  });
  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.url) {
      return;
    }

    // Validate RSS URL first if not already validated
    if (!validation.isValid) {
      await handleUrlChange(formData.url);
      return;
    }

    setIsImporting(true);
    
    try {
      // Validate and import RSS feed with 7-day limitation
      const rssData = await validateAndImportRSS(
        formData.url, 
        formData.category, 
        formData.title || validation.suggestedTitle
      );

      // Add the RSS feed data
      onAdd(rssData);

      // Reset form
      setFormData({ category: '', url: '', title: '' });
      setValidation({ isValidating: false, isValid: false });
      setIsImporting(false);
      onClose();
    } catch {
      setValidation({
        ...validation,
        error: 'Failed to import RSS feed. Please try again.'
      });
      setIsImporting(false);
    }
  };

  const handleUrlChange = async (url: string) => {
    if (!url.trim()) {
      setValidation({ isValidating: false, isValid: false });
      return;
    }
    
    // Validate URL
    setValidation({ isValidating: true, isValid: false });
    
    try {
      const validationResult = await validateRSSUrl(url);
      setValidation({
        isValidating: false,
        isValid: validationResult.isValid,
        error: validationResult.error,
        suggestedTitle: validationResult.title
      });
      
      // Auto-fill title if not provided and we have a suggestion
      if (validationResult.isValid && validationResult.title && !formData.title) {
        setFormData(prev => ({
          ...prev,
          title: validationResult.title || ''
        }));
      }
    } catch {
      setValidation({
        isValidating: false,
        isValid: false,
        error: 'Failed to validate URL'
      });
    }
  };
  
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, url });
    
    // Reset validation state
    setValidation({ isValidating: false, isValid: false });
  };
  
  const handleUrlBlur = () => {
    if (formData.url.trim()) {
      handleUrlChange(formData.url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Add RSS Feed</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RSS URL *
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.url}
                onChange={handleUrlInputChange}
                onBlur={handleUrlBlur}
                placeholder="https://example.com/feed.xml"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              {validation.isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              )}
              {!validation.isValidating && validation.isValid && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>
            {validation.error && (
              <div className="mt-2 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{validation.error}</span>
              </div>
            )}
            {validation.isValid && !validation.error && (
              <div className="mt-2 flex items-start gap-2 text-blue-600 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span>URL validated successfully! RSS feed is accessible.</span>
                  {validation.suggestedTitle && (
                    <div className="mt-1 text-xs">Suggested title: <strong>{validation.suggestedTitle}</strong></div>
                  )}
                  <div className="mt-1 text-xs text-gray-600">Only articles from the last 7 days will be imported.</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Custom feed title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={validation.isValidating || isImporting || !formData.category || !formData.url || !validation.isValid}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : validation.isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Feed
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}