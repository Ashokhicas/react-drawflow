/**
 * History middleware for Zustand
 * Automatically saves state to history on certain actions
 */

import type { DrawflowStore } from '../index';

// This middleware can be applied to automatically save history
// For now, we'll use explicit saveToHistory calls in actions
export const historyMiddleware = (config: any) => (set: any, get: any, api: any) =>
  config(
    (...args: any[]) => {
      const result = set(...args);
      // Auto-save to history for certain actions
      // This can be customized based on which actions should be undoable
      return result;
    },
    get,
    api
  );

