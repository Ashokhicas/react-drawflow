/**
 * DrawflowProvider
 * Context provider for Drawflow canvas
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useDrawflowStore } from '../../store';
import type { CanvasConfig } from '@react-drawflow/types';

export interface DrawflowProviderProps {
  children: ReactNode;
  config?: CanvasConfig;
}

const DrawflowContext = createContext<ReturnType<typeof useDrawflowStore> | null>(null);

export function DrawflowProvider({ children, config }: DrawflowProviderProps) {
  const store = useDrawflowStore();

  // Initialize theme on mount - ensure light mode is default
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      // Remove any existing theme classes first
      html.classList.remove('light', 'dark');
      // Get current theme from store, default to 'light'
      const currentTheme = store.theme || 'light';
      // Tailwind uses absence of 'dark' class for light mode
      // Only add 'dark' class if theme is dark
      if (currentTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Apply initial config if provided
  React.useEffect(() => {
    if (config) {
      if (config.mode) store.setMode(config.mode);
      if (config.direction) store.setDirection(config.direction);
      if (config.grid) store.setGrid(config.grid);
      if (config.zoom) {
        if (config.zoom.min !== undefined) {
          // Store zoom limits in a separate config
        }
        if (config.zoom.max !== undefined) {
          // Store zoom limits
        }
      }
    }
  }, [config, store]);

  // Update theme class when theme changes
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      const theme = store.theme || 'light';
      // Tailwind uses absence of 'dark' class for light mode
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, [store.theme]);

  return (
    <DrawflowContext.Provider value={store}>
      {children}
    </DrawflowContext.Provider>
  );
}

export function useDrawflowContext() {
  const context = useContext(DrawflowContext);
  if (!context) {
    throw new Error('useDrawflowContext must be used within DrawflowProvider');
  }
  return context;
}

