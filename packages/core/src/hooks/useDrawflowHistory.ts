/**
 * useDrawflowHistory hook
 * Specialized hook for undo/redo operations
 */

import { useDrawflowStore } from '../store';

export function useDrawflowHistory() {
  const store = useDrawflowStore();

  return {
    history: store.history,
    undo: store.undo,
    redo: store.redo,
    canUndo: store.canUndo(),
    canRedo: store.canRedo(),
    saveToHistory: store.saveToHistory,
  };
}

