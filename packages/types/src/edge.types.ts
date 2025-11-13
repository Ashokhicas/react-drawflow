/**
 * Edge/Connection-related type definitions for React Drawflow
 */

import type { NodeId, Position } from './node.types';

export type ConnectionId = string;

export type ConnectionType = 'bezier' | 'straight' | 'stepped';

export interface ReroutePoint {
  id: string;
  position: Position;
}

export interface Connection {
  id: ConnectionId;
  source: NodeId;
  sourceOutput: string;
  target: NodeId;
  targetInput: string;
  type?: ConnectionType;
  label?: string;
  color?: string;
  width?: number;
  dashed?: boolean;
  animated?: boolean;
  reroutePoints?: ReroutePoint[];
  selected?: boolean;
  curvature?: number; // For bezier curves (0.1 - 1.0)
}

export interface ConnectionPath {
  path: string; // SVG path string
  controlPoints?: Position[];
}

export interface ConnectionValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

