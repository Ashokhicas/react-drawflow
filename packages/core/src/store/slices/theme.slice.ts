/**
 * Theme state slice
 * Handles light/dark mode theme management
 */

import type { DrawflowStoreState } from '../index';

export type ThemeMode = 'light' | 'dark';

export const themeSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Theme state
  theme: 'light' as ThemeMode,

  // Toggle theme
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      // Apply theme class to document root
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        if (newTheme === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
      return { theme: newTheme };
    });
  },

  // Set theme
  setTheme: (theme: ThemeMode) => {
    set((state) => {
      if (typeof document !== 'undefined') {
        const html = document.documentElement;
        if (theme === 'dark') {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
      return { theme };
    });
  },
});

