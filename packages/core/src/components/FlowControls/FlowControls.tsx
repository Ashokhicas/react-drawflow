/**
 * FlowControls Component
 * Control buttons for export, import, and clear canvas
 */

import React, { useRef } from 'react';
import './FlowControls.css';

export interface FlowControlsProps {
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
  className?: string;
}

export function FlowControls({ onExport, onImport, onClear, className }: FlowControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
      } catch (error) {
        console.error('Failed to import flow:', error);
        alert('Failed to import flow. Please check the file format.');
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`drawflow-flow-controls ${className || ''}`}>
      <button
        className="drawflow-control-btn drawflow-control-export"
        onClick={onExport}
        title="Export flow"
        aria-label="Export flow"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2V10M8 10L5 7M8 10L11 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Export</span>
      </button>

      <button
        className="drawflow-control-btn drawflow-control-import"
        onClick={handleImportClick}
        title="Import flow"
        aria-label="Import flow"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 14V6M8 6L5 9M8 6L11 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 4V3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Import</span>
      </button>

      <button
        className="drawflow-control-btn drawflow-control-clear"
        onClick={onClear}
        title="Clear canvas"
        aria-label="Clear canvas"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Clear</span>
      </button>
    </div>
  );
}

