/**
 * LockButton Component
 * Button to toggle lock/unlock state of the canvas
 */

import React from 'react';
import './LockButton.css';

export interface LockButtonProps {
  isLocked: boolean;
  onToggle: () => void;
  className?: string;
}

export function LockButton({ isLocked, onToggle, className }: LockButtonProps) {
  return (
    <button
      className={`drawflow-lock-button ${isLocked ? 'locked' : 'unlocked'} ${className || ''}`}
      onClick={onToggle}
      title={isLocked ? 'Unlock canvas (enable editing)' : 'Lock canvas (disable editing)'}
      aria-label={isLocked ? 'Unlock canvas' : 'Lock canvas'}
    >
      {isLocked ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 7V5C4 3.34315 5.34315 2 7 2H9C10.6569 2 12 3.34315 12 5V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="3"
            y="7"
            width="10"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 7V5C4 3.34315 5.34315 2 7 2H9C10.6569 2 12 3.34315 12 5V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          <rect
            x="3"
            y="7"
            width="10"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}

