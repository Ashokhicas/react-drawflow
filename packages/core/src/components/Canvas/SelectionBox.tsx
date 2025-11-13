/**
 * SelectionBox Component
 * Drag selection box for multi-select
 */

import React from 'react';
import type { Position } from '@react-drawflow/types';

export interface SelectionBoxProps {
  start: Position;
  end: Position;
  viewport: { x: number; y: number; zoom: number };
}

export function SelectionBox({ start, end, viewport }: SelectionBoxProps) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="drawflow-selection-box"
      style={{
        position: 'absolute',
        left: left * viewport.zoom + viewport.x,
        top: top * viewport.zoom + viewport.y,
        width: width * viewport.zoom,
        height: height * viewport.zoom,
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  );
}

