/**
 * OrientationToggle Component
 * Button to toggle between horizontal and vertical flow direction
 */

import React from 'react';
import './OrientationToggle.css';

export interface OrientationToggleProps {
  direction: 'horizontal' | 'vertical';
  onToggle: () => void;
  className?: string;
}

export function OrientationToggle({ direction, onToggle, className }: OrientationToggleProps) {
  return (
    <button
      className={`drawflow-orientation-toggle ${className || ''}`}
      onClick={onToggle}
      title={direction === 'horizontal' ? 'Switch to vertical flow' : 'Switch to horizontal flow'}
      aria-label={direction === 'horizontal' ? 'Switch to vertical flow' : 'Switch to horizontal flow'}
    >
      {direction === 'horizontal' ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <polyline points="12 3 21 12 12 21" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="3" x2="12" y2="21" />
          <polyline points="3 12 12 3 21 12" />
        </svg>
      )}
    </button>
  );
}

