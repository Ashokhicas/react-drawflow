/**
 * Default Light Theme
 * Professional color palette with modern aesthetics
 */

export const defaultTheme = {
  // Primary colors - Vibrant blue for actions and highlights
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // Secondary colors - Elegant purple for accents
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main secondary
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  // Neutral colors for backgrounds and text
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Canvas specific colors
  canvas: {
    background: '#ffffff',
    grid: '#e5e7eb',
    gridActive: '#d1d5db',
  },
  // Node colors
  node: {
    background: '#ffffff',
    border: '#e5e7eb',
    borderSelected: '#3b82f6',
    borderHover: '#93c5fd',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(59, 130, 246, 0.2)',
  },
  // Connection colors
  connection: {
    default: '#6b7280',
    active: '#3b82f6',
    selected: '#2563eb',
    hover: '#60a5fa',
  },
  // Port colors
  port: {
    input: '#a855f7',
    output: '#3b82f6',
    hover: '#60a5fa',
    connected: '#22c55e',
  },
  // Toolbar colors
  toolbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '#e5e7eb',
    button: '#6b7280',
    buttonHover: '#3b82f6',
    buttonActive: '#2563eb',
  },
  // Toolbox colors
  toolbox: {
    background: 'rgba(255, 255, 255, 0.98)',
    border: '#e5e7eb',
    header: '#f9fafb',
    itemHover: '#f3f4f6',
    itemActive: '#e5e7eb',
  },
} as const;

export type Theme = typeof defaultTheme;

