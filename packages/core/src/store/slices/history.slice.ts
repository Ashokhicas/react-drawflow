/**
 * History state slice
 * Handles undo/redo functionality using command pattern
 */

import type { DrawflowStoreState } from '../index';

export const historySlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Save state to history
  saveToHistory: () => {
    const state = get();
    const currentState = {
      nodes: { ...state.nodes },
      nodeIds: [...state.nodeIds],
      connections: { ...state.connections },
      connectionIds: [...state.connectionIds],
    };
    
    set((s) => ({
      history: {
        past: [...s.history.past, s.history.present].slice(-50), // Limit to 50
        present: currentState,
        future: [], // Clear future when new action is performed
      },
    }));
  },

  // Undo
  undo: () => {
    const state = get();
    if (state.history.past.length === 0) return;
    
    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    
    set((s) => ({
      history: {
        past: newPast,
        present: s.history.present,
        future: [s.history.present, ...s.history.future],
      },
      nodes: previous.nodes,
      nodeIds: previous.nodeIds,
      connections: previous.connections,
      connectionIds: previous.connectionIds,
    }));
  },

  // Redo
  redo: () => {
    const state = get();
    if (state.history.future.length === 0) return;
    
    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    
    set((s) => ({
      history: {
        past: [...s.history.past, s.history.present],
        present: next,
        future: newFuture,
      },
      nodes: next.nodes,
      nodeIds: next.nodeIds,
      connections: next.connections,
      connectionIds: next.connectionIds,
    }));
  },

  // Check if undo is possible
  canUndo: (): boolean => {
    return get().history.past.length > 0;
  },

  // Check if redo is possible
  canRedo: (): boolean => {
    return get().history.future.length > 0;
  },
});

