/**
 * Canvas-related type definitions for React Drawflow
 */

import type { Position } from './node.types';

export type EditorMode = 'edit' | 'fixed' | 'view';

export type LayoutDirection = 'horizontal' | 'vertical';

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface GridConfig {
  size: number;
  visible: boolean;
  snap: boolean;
  color?: string;
  opacity?: number;
}

export interface CanvasConfig {
  mode?: EditorMode;
  direction?: LayoutDirection;
  grid?: GridConfig;
  zoom?: {
    min?: number;
    max?: number;
    step?: number;
  };
  pan?: {
    enabled?: boolean;
    spaceDrag?: boolean;
  };
  touch?: {
    enabled?: boolean;
    pinchZoom?: boolean;
  };
}

export interface CanvasState {
  viewport: Viewport;
  grid: GridConfig;
  mode: EditorMode;
  direction: LayoutDirection;
  selectedModule?: string;
}

export interface MinimapConfig {
  enabled: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: {
    width: number;
    height: number;
  };
  viewportIndicator?: boolean;
}

