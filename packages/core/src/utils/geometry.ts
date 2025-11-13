/**
 * Geometry utilities
 * Bezier curves, positions, and path calculations
 */

import type { Position, Connection, ReroutePoint } from '@react-drawflow/types';

/**
 * Calculate Bezier curve path for a connection
 * Supports both horizontal (left to right) and vertical (top to bottom) flow
 */
export function calculateBezierPath(
  start: Position,
  end: Position,
  curvature: number = 0.5,
  reroutePoints?: ReroutePoint[],
  direction: 'horizontal' | 'vertical' = 'horizontal'
): string {
  if (reroutePoints && reroutePoints.length > 0) {
    // Build path with reroute points
    const points = [start, ...reroutePoints.map((p) => p.position), end];
    return buildPathWithReroutePoints(points, curvature, direction);
  }

  // Simple Bezier curve between two points
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (direction === 'vertical') {
    // Vertical flow: top to bottom
    const cp1x = start.x;
    const cp1y = start.y + dy * curvature;
    const cp2x = end.x;
    const cp2y = end.y - dy * curvature;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  } else {
    // Horizontal flow: left to right (default)
    const cp1x = start.x + dx * curvature;
    const cp1y = start.y;
    const cp2x = end.x - dx * curvature;
    const cp2y = end.y;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  }
}

/**
 * Build path with multiple reroute points
 */
function buildPathWithReroutePoints(
  points: Position[],
  curvature: number,
  direction: 'horizontal' | 'vertical' = 'horizontal'
): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const isFirst = i === 0;
    const isLast = i === points.length - 2;

    if (isFirst && isLast) {
      // Only two points
      const dx = next.x - current.x;
      const cp1x = current.x + dx * curvature;
      const cp1y = current.y;
      const cp2x = next.x - dx * curvature;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    } else if (isFirst) {
      // First segment
      const dx = next.x - current.x;
      const cp1x = current.x + dx * curvature;
      const cp1y = current.y;
      const cp2x = next.x;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    } else if (isLast) {
      // Last segment
      const dx = next.x - current.x;
      const cp1x = current.x;
      const cp1y = current.y;
      const cp2x = next.x - dx * curvature;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    } else {
      // Middle segments - straight lines through reroute points
      path += ` L ${next.x} ${next.y}`;
    }
  }

  return path;
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Snap position to grid
 */
export function snapToGrid(
  position: Position,
  gridSize: number,
  enabled: boolean
): Position {
  if (!enabled) return position;

  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Get port position on node
 */
export function getPortPosition(
  nodePosition: Position,
  nodeWidth: number,
  nodeHeight: number,
  portIndex: number,
  totalPorts: number,
  isInput: boolean
): Position {
  const spacing = nodeHeight / (totalPorts + 1);
  const y = nodePosition.y + spacing * (portIndex + 1);

  return {
    x: isInput ? nodePosition.x : nodePosition.x + nodeWidth,
    y,
  };
}

