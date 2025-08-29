import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle, Loader2, FileText, FileSpreadsheet, Info } from 'lucide-react';
import { parseRSSCSV, parseRSSExcel, batchValidateRSSFeeds, validateImportFile, RSSFeedData } from '../../utils/rssValidator';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rssFeeds: RSSFeedData[]) => void;
}

interface ImportResult {
  category: string;
  url: string;
  title?: string;
  status: 'pending' | 'validating' | 'valid' | 'invalid';
  error?: string;
  rssData?: RSSFeedData;
}

interface ValidationProgress {
  current: number;
  total: number;
  currentFeed?: { category: string; url: string };
}

export function BulkImportModal({ isOpen, onClose, onImport }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'results'>('upload');
  const [validationProgress, setValidationProgress] = useState<ValidationProgress | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type and size
    const validation = validateImportFile(selectedFile);
    if (!validation.isValid) {
      setFileError(validation.error!);
      return;
    }

    setFileError(null);
    setFile(selectedFile);
    
    try {
      await processFile(selectedFile);
    } catch (error) {
      setFileError('Error processing file. Please check the format and try again.');
      console.error('File processing error:', error);
    }
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    try {
      let parsedData: Array<{ category: string; url: string; title?: string }>;
      
      if (selectedFile.name.match(/\.(xlsx|xls)$/i)) {
        // Handle Excel files
        parsedData = await parseRSSExcel(selectedFile);
      } else {
        // Handle CSV/TSV files
        const content = await readFileAsText(selectedFile);
        parsedData = parseRSSCSV(content);
      }
      
      if (parsedData.length === 0) {
        setFileError('No valid data found in the file. Please check the format.');
        return;
      }
      
      const results: ImportResult[] = parsedData.map(item => ({
        category: item.category,
        url: item.url,
        title: item.title,
        status: 'pending' as const
      }));
      
      setImportResults(results);
      setStep('preview');
    } catch (error) {
      setFileError('Error parsing file. Please check the format and try again.');
      console.error('File processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const validateAllFeeds = async () => {
    setIsProcessing(true);
    setStep('results');
    setValidationProgress({ current: 0, total: importResults.length });

    try {
      const feedsToValidate = importResults.map(result => ({
        category: result.category,
        url: result.url,
        title: result.title
      }));

      const validationResults = await batchValidateRSSFeeds(
        feedsToValidate,
        (current, total, feed) => {
          setValidationProgress({ current, total, currentFeed: feed });
          
          // Update the status of the current feed being validated
          setImportResults(prev => prev.map((result, index) => 
            index === current - 1 
              ? { ...result, status: 'validating' as const }
              : result
          ));
        }
      );

      // Update results with validation outcomes
      const updatedResults = importResults.map((result, index) => {
        const validationResult = validationResults[index];
        return {
          ...result,
          status: validationResult.isValid ? 'valid' as const : 'invalid' as const,
          error: validationResult.isValid ? undefined : validationResult.result.health.message,
          rssData: validationResult.result
        };
      });

      setImportResults(updatedResults);
    } catch (error) {
      console.error('Validation error:', error);
      setFileError('Error during validation process');
    } finally {
      setIsProcessing(false);
      setValidationProgress(null);
    }
  };

  const handleImport = () => {
    const validFeeds = importResults
      .filter(result => result.status === 'valid' && result.rssData)
      .map(result => result.rssData!);

    if (validFeeds.length === 0) {
      alert('No valid feeds to import');
      return;
    }

    // Pass the validated RSS feed data to the parent
    onImport(validFeeds);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setImportResults([]);
    setStep('upload');
    setIsProcessing(false);
    setValidationProgress(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = `Category,RSS URL,Title
Tech News,https://example.com/tech/feed.xml,Example Tech Blog
Dev Blogs,https://dev-blog.example.com/rss,Development Blog
Security,https://security-blog.example.com/feed,Security Updates
Business,https://business.example.com/feed.xml,Business News`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rss-feeds-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Bulk Import RSS Feeds</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Upload className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Excel/CSV File</h3>
                <p className="text-gray-600 mb-4">
                  Upload an Excel, CSV, or TSV file with RSS feeds. Required columns: Category and RSS URL. Optional: Title.
                </p>
                
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls,.tsv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isProcessing}
                />

                {fileError && (
                  <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {fileError}
                  </div>
                )}

                {file && !fileError && (
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    CSV Format:
                  </h4>
                  <pre className="text-sm text-blue-800 bg-blue-100 p-2 rounded overflow-x-auto">
{`Category,RSS URL,Title
Tech News,https://example.com/feed.xml,Tech Blog
Dev Blogs,https://dev-blog.com/rss,Dev Updates`}
                  </pre>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel Format:
                  </h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div className="bg-green-100 p-2 rounded">
                      <strong>Column A:</strong> Category<br />
                      <strong>Column B:</strong> RSS URL<br />
                      <strong>Column C:</strong> Title (optional)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <strong>Important:</strong> Only articles from the last 7 days will be imported to keep your dashboard current and relevant.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Preview ({importResults.length} feeds found)
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Review the feeds before validation. Each feed will be checked and only articles from the last 7 days will be imported.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={validateAllFeeds}
                    disabled={importResults.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Validate & Import
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RSS URL</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.map((result, index) => (
                        <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {result.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div className="max-w-md truncate" title={result.url}>
                              {result.url}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {result.title || <span className="text-gray-400 italic">Auto-generated</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-6">
              {validationProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-900">Validating Feeds...</h4>
                    <span className="text-sm text-blue-700">{validationProgress.current}/{validationProgress.total}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(validationProgress.current / validationProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  {validationProgress.currentFeed && (
                    <p className="text-xs text-blue-700">
                      Currently validating: {validationProgress.currentFeed.url}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Validation Results</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="text-green-600">
                      ✓ {importResults.filter(r => r.status === 'valid').length} Valid
                    </span>
                    <span className="text-red-600">
                      ✗ {importResults.filter(r => r.status === 'invalid').length} Invalid
                    </span>
                    <span className="text-gray-500">
                      Total: {importResults.length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={importResults.filter(r => r.status === 'valid').length === 0 || isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Import Valid Feeds ({importResults.filter(r => r.status === 'valid').length})
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">RSS URL</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Articles</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResults.map((result, index) => (
                        <tr key={index} className={`border-t border-gray-200 ${
                          result.status === 'valid' ? 'bg-green-50' : 
                          result.status === 'invalid' ? 'bg-red-50' : 
                          result.status === 'validating' ? 'bg-blue-50' : 'bg-gray-50'
                        }`}>
                          <td className="px-4 py-3 text-sm">
                            {result.status === 'validating' && (
                              <div className="flex items-center gap-2 text-blue-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs">Validating</span>
                              </div>
                            )}
                            {result.status === 'valid' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Valid</span>
                              </div>
                            )}
                            {result.status === 'invalid' && (
                              <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Invalid</span>
                              </div>
                            )}
                            {result.status === 'pending' && (
                              <span className="text-gray-500 text-xs">Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            <div className="max-w-32 truncate" title={result.rssData?.title || result.title}>
                              {result.rssData?.title || result.title || <span className="text-gray-400 italic">Auto-generated</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {result.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div className="max-w-48 truncate" title={result.url}>
                              {result.url}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {result.rssData?.articleCount !== undefined ? (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {result.rssData.articleCount}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="max-w-48 truncate" title={result.rssData?.health.message || result.error}>
                              <span className={result.status === 'valid' ? 'text-green-600' : 'text-red-600'}>
                                {result.rssData?.health.message || result.error || '-'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}