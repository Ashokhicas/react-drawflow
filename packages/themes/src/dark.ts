/**
 * Dark Theme
 * Professional dark mode with excellent contrast
 */

import type { Theme } from './default';

export const darkTheme: Theme = {
  // Primary colors - Slightly brighter for dark mode
  primary: {
    50: '#172554',
    100: '#1e3a8a',
    200: '#1e40af',
    300: '#1d4ed8',
    400: '#2563eb',
    500: '#3b82f6', // Main primary
    600: '#60a5fa',
    700: '#93c5fd',
    800: '#bfdbfe',
    900: '#dbeafe',
    950: '#eff6ff',
  },
  // Secondary colors
  secondary: {
    50: '#3b0764',
    100: '#581c87',
    200: '#6b21a8',
    300: '#7e22ce',
    400: '#9333ea',
    500: '#a855f7', // Main secondary
    600: '#c084fc',
    700: '#d8b4fe',
    800: '#e9d5ff',
    900: '#f3e8ff',
    950: '#faf5ff',
  },
  // Neutral colors - Inverted for dark mode
  neutral: {
    50: '#0a0a0a',
    100: '#171717',
    200: '#262626',
    300: '#404040',
    400: '#525252',
    500: '#737373',
    600: '#a3a3a3',
    700: '#d4d4d4',
    800: '#e5e5e5',
    900: '#f5f5f5',
    950: '#fafafa',
  },
  // Semantic colors
  success: {
    50: '#15803d',
    500: '#22c55e',
    600: '#16a34a',
    700: '#f0fdf4',
  },
  warning: {
    50: '#b45309',
    500: '#f59e0b',
    600: '#d97706',
    700: '#fffbeb',
  },
  error: {
    50: '#b91c1c',
    500: '#ef4444',
    600: '#dc2626',
    700: '#fef2f2',
  },
  info: {
    50: '#1d4ed8',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#eff6ff',
  },
  // Canvas specific colors
  canvas: {
    background: '#0f172a',
    grid: '#1e293b',
    gridActive: '#334155',
  },
  // Node colors
  node: {
    background: '#1e293b',
    border: '#334155',
    borderSelected: '#3b82f6',
    borderHover: '#60a5fa',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(59, 130, 246, 0.3)',
  },
  // Connection colors
  connection: {
    default: '#64748b',
    active: '#60a5fa',
    selected: '#3b82f6',
    hover: '#93c5fd',
  },
  // Port colors
  port: {
    input: '#c084fc',
    output: '#60a5fa',
    hover: '#93c5fd',
    connected: '#22c55e',
  },
  // Toolbar colors
  toolbar: {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '#334155',
    button: '#94a3b8',
    buttonHover: '#60a5fa',
    buttonActive: '#3b82f6',
  },
  // Toolbox colors
  toolbox: {
    background: 'rgba(30, 41, 59, 0.98)',
    border: '#334155',
    header: '#1e293b',
    itemHover: '#334155',
    itemActive: '#475569',
  },
};

