/**
 * useDrawflowViewport hook
 * Specialized hook for viewport operations
 */

import { useDrawflowStore } from '../store';
import type { Viewport, Position } from '@react-drawflow/types';

export function useDrawflowViewport() {
  const store = useDrawflowStore();

  return {
    viewport: store.canvas.viewport,
    setViewport: (viewport: Partial<Viewport>) => store.setViewport(viewport),
    panBy: (deltaX: number, deltaY: number) => store.panBy(deltaX, deltaY),
    panTo: (x: number, y: number) => store.panTo(x, y),
    fitView: (nodes?: any[]) => {
      // TODO: Implement fit view logic
      console.log('fitView not yet implemented');
    },
  };
}

