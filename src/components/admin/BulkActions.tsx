import React from 'react';
import { CheckCircle, XCircle, Trash2, X } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onAction, onClearSelection }: BulkActionsProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} feed{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction('activate')}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Activate
          </button>
          <button
            onClick={() => onAction('deactivate')}
            className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <XCircle className="w-4 h-4" />
            Deactivate
          </button>
          <button
            onClick={() => onAction('delete')}
            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}