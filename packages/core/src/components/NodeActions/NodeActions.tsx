/**
 * NodeActions Component
 * Action buttons (delete, copy, context menu) for nodes
 */

import React, { useState } from 'react';
import './NodeActions.css';

export interface NodeActionsProps {
  onDelete?: () => void;
  onCopy?: () => void;
  onClone?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  showOnHover?: boolean;
}

export function NodeActions({
  onDelete,
  onCopy,
  onClone,
  onContextMenu,
  showOnHover = true,
}: NodeActionsProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.();
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onCopy?.();
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClone?.();
  };

  const handleContextMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e);
    } else {
      setShowContextMenu(!showContextMenu);
    }
  };

  return (
    <div
      className={`drawflow-node-actions ${showOnHover ? 'show-on-hover' : 'always-visible'}`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="drawflow-node-actions-buttons">
          {onClone && (
            <button
              className="drawflow-node-action-btn drawflow-node-action-clone"
              onClick={handleClone}
              title="Clone node"
              aria-label="Clone node"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4H6C4.89543 4 4 4.89543 4 6V10C4 11.1046 4.89543 12 6 12H10C11.1046 12 12 11.1046 12 10V6C12 4.89543 11.1046 4 10 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </button>
          )}
          {onCopy && (
            <button
              className="drawflow-node-action-btn drawflow-node-action-copy"
              onClick={handleCopy}
              title="Copy node"
              aria-label="Copy node"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 4H6C4.89543 4 4 4.89543 4 6V10C4 11.1046 4.89543 12 6 12H10C11.1046 12 12 11.1046 12 10V6C12 4.89543 11.1046 4 10 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M4 6C4 4.89543 4.89543 4 6 4H8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          {onContextMenu && (
            <button
              className="drawflow-node-action-btn drawflow-node-action-menu"
              onClick={handleContextMenuClick}
              title="More options"
              aria-label="More options"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className="drawflow-node-action-btn drawflow-node-action-delete"
              onClick={handleDelete}
              title="Delete node"
              aria-label="Delete node"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
      </div>
    </div>
  );
}

