/**
 * Connection Component
 * Renders connections between nodes with Bezier curves
 */

import React from 'react';
import { calculateBezierPath } from '../../utils/geometry';
import { getPortPositionRelative } from '../../utils/port-position';
import { ConnectionDeleteButton } from '../ConnectionDeleteButton';
import type { Connection as ConnectionType, Node } from '@react-drawflow/types';
import './Connection.css';

export interface ConnectionProps {
  connection: ConnectionType;
  sourceNode: Node;
  targetNode: Node;
  viewport?: { x: number; y: number; zoom: number };
  direction?: 'horizontal' | 'vertical';
  sourceNodeDimensions?: { width: number; height: number };
  targetNodeDimensions?: { width: number; height: number };
  onSelect?: (connectionId: string) => void;
  onDelete?: (connectionId: string) => void;
}

export function Connection({
  connection,
  sourceNode,
  targetNode,
  viewport,
  direction = 'horizontal',
  sourceNodeDimensions,
  targetNodeDimensions,
  onSelect,
  onDelete,
}: ConnectionProps) {
  // Calculate actual port positions - these are relative to node, so they don't change unless node structure changes
  const sourcePortPos = getPortPositionRelative(
    sourceNode,
    connection.sourceOutput,
    'output',
    direction,
    sourceNodeDimensions
  );
  const targetPortPos = getPortPositionRelative(
    targetNode,
    connection.targetInput,
    'input',
    direction,
    targetNodeDimensions
  );

  // Calculate absolute positions - these MUST update immediately when nodes move
  // No memoization here to ensure real-time updates during dragging
  const startPos = {
    x: sourceNode.position.x + sourcePortPos.x,
    y: sourceNode.position.y + sourcePortPos.y,
  };

  const endPos = {
    x: targetNode.position.x + targetPortPos.x,
    y: targetNode.position.y + targetPortPos.y,
  };

  // Calculate path - recalculate on every render for smooth real-time updates
  const path = calculateBezierPath(
    startPos,
    endPos,
    connection.curvature || 0.5,
    connection.reroutePoints,
    direction
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(connection.id);
  };

  return (
    <svg
      className="drawflow-connection-layer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'stroke',
        overflow: 'visible',
      }}
    >
      <path
        d={path}
        className={`drawflow-connection ${connection.selected ? 'selected' : ''} ${
          connection.dashed ? 'dashed' : ''
        }`}
        stroke={connection.color || '#6b7280'}
        strokeWidth={connection.width || 2}
        fill="none"
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          // Remove transition for smooth real-time updates during node dragging
          transition: 'none',
        }}
      />
      {connection.label && (
        <text
          x={(startPos.x + endPos.x) / 2}
          y={(startPos.y + endPos.y) / 2}
          className="drawflow-connection-label"
          fill={connection.color || '#6b7280'}
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {connection.label}
        </text>
      )}
      {connection.selected && onDelete && (
        <ConnectionDeleteButton
          position={{
            x: (startPos.x + endPos.x) / 2,
            y: (startPos.y + endPos.y) / 2,
          }}
          onDelete={() => onDelete(connection.id)}
        />
      )}
    </svg>
  );
}

