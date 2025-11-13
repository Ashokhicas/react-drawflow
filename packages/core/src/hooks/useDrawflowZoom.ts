/**
 * useDrawflowZoom hook
 * Specialized hook for zoom operations
 */

import { useDrawflowStore } from '../store';

export function useDrawflowZoom() {
  const store = useDrawflowStore();

  return {
    zoom: store.canvas.viewport.zoom,
    setZoom: store.setZoom,
    zoomIn: store.zoomIn,
    zoomOut: store.zoomOut,
    zoomReset: store.zoomReset,
    minZoom: 0.5,
    maxZoom: 2.0,
  };
}

