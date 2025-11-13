/**
 * Grid Component
 * Renders the canvas grid
 */

import React from 'react';
import type { GridConfig, Viewport } from '@react-drawflow/types';

export interface GridProps {
  grid: GridConfig;
  viewport: Viewport;
}

export function Grid({ grid, viewport }: GridProps) {
  const gridSize = grid.size * viewport.zoom;
  const offsetX = viewport.x % gridSize;
  const offsetY = viewport.y % gridSize;

  return (
    <svg
      className="drawflow-grid"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={grid.color || '#e5e7eb'}
            strokeWidth={1}
            opacity={grid.opacity || 0.5}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}

