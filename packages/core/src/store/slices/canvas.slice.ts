/**
 * Canvas state slice
 * Handles viewport, zoom, pan, grid, and editor mode
 */

import type { EditorMode, GridConfig, LayoutDirection, Viewport } from '@react-drawflow/types';
import type { DrawflowStoreState } from '../index';

export const canvasSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Viewport actions
  setViewport: (viewport: Partial<Viewport>) => {
    set((state) => {
      const newViewport = { ...state.canvas.viewport, ...viewport };

      // Update the current module's viewport
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          viewport: newViewport,
        },
      };

      return {
        canvas: {
          ...state.canvas,
          viewport: newViewport,
        },
        modules: updatedModules,
      };
    });
  },

  panBy: (deltaX: number, deltaY: number) => {
    set((state) => {
      // DeltaX and deltaY are in screen pixels
      // viewport.x and viewport.y are in screen pixels (for CSS transform)
      // So we just add the deltas directly
      const newViewport = {
        ...state.canvas.viewport,
        x: state.canvas.viewport.x + deltaX,
        y: state.canvas.viewport.y + deltaY,
      };

      // Update the current module's viewport
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          viewport: newViewport,
        },
      };

      return {
        canvas: {
          ...state.canvas,
          viewport: newViewport,
        },
        modules: updatedModules,
      };
    });
  },

  panTo: (x: number, y: number) => {
    set((state) => {
      const newViewport = { ...state.canvas.viewport, x, y };

      // Update the current module's viewport
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          viewport: newViewport,
        },
      };

      return {
        canvas: {
          ...state.canvas,
          viewport: newViewport,
        },
        modules: updatedModules,
      };
    });
  },

  // Zoom actions
  setZoom: (zoom: number) => {
    const minZoom = 0.5;
    const maxZoom = 2.0;
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

    set((state) => {
      const newViewport = { ...state.canvas.viewport, zoom: clampedZoom };

      // Update the current module's viewport
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          viewport: newViewport,
        },
      };

      return {
        canvas: {
          ...state.canvas,
          viewport: newViewport,
        },
        modules: updatedModules,
      };
    });
  },

  zoomIn: (step: number = 0.1) => {
    const state = get();
    state['setZoom'](state.canvas.viewport.zoom + step);
  },

  zoomOut: (step: number = 0.1) => {
    const state = get();
    state['setZoom'](state.canvas.viewport.zoom - step);
  },

  zoomReset: () => {
    set((state) => {
      const newViewport = { ...state.canvas.viewport, zoom: 1 };

      // Update the current module's viewport
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          viewport: newViewport,
        },
      };

      return {
        canvas: {
          ...state.canvas,
          viewport: newViewport,
        },
        modules: updatedModules,
      };
    });
  },

  // Grid actions
  setGrid: (grid: Partial<GridConfig>) => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        grid: { ...state.canvas.grid, ...grid },
      },
    }));
  },

  toggleGrid: () => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        grid: { ...state.canvas.grid, visible: !state.canvas.grid.visible },
      },
    }));
  },

  toggleSnap: () => {
    set((state) => ({
      canvas: {
        ...state.canvas,
        grid: { ...state.canvas.grid, snap: !state.canvas.grid.snap },
      },
    }));
  },

  // Editor mode
  setMode: (mode: EditorMode) => {
    set((state) => ({
      canvas: { ...state.canvas, mode },
    }));
  },

  // Toggle lock (switches between 'edit' and 'fixed' mode)
  toggleLock: () => {
    const state = get();
    const newMode = state.canvas.mode === 'edit' ? 'fixed' : 'edit';
    state['setMode'](newMode);
  },

  // Check if canvas is locked
  isLocked: () => {
    const state = get();
    return state.canvas.mode === 'fixed';
  },

  // Layout direction
  setDirection: (direction: LayoutDirection) => {
    set((state) => ({
      canvas: { ...state.canvas, direction },
    }));
  },
});
