/**
 * ConnectionDeleteButton Component
 * Floating delete button for selected connections
 */

import React from 'react';
import './ConnectionDeleteButton.css';

export interface ConnectionDeleteButtonProps {
  position: { x: number; y: number };
  onDelete: () => void;
}

export function ConnectionDeleteButton({ position, onDelete }: ConnectionDeleteButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="drawflow-connection-delete-button"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
      }}
      onClick={handleClick}
    >
      <button
        className="drawflow-connection-delete-btn"
        aria-label="Delete connection"
        title="Delete connection"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

