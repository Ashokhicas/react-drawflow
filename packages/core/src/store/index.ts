/**
 * Zustand store for React Drawflow
 * Centralized state management for canvas, nodes, connections, and UI
 */

import { create } from 'zustand';
import type { Node, Connection, CanvasState, NodeId, ConnectionId } from '@react-drawflow/types';
import { canvasSlice } from './slices/canvas.slice';
import { nodesSlice } from './slices/nodes.slice';
import { connectionsSlice } from './slices/connections.slice';
import { selectionSlice } from './slices/selection.slice';
import { historySlice } from './slices/history.slice';
import { exportImportSlice } from './slices/export-import.slice';
import { modulesSlice } from './slices/modules.slice';
import { themeSlice } from './slices/theme.slice';

// Base store state
export interface DrawflowStoreState {
  // Canvas state
  canvas: CanvasState;
  
  // Nodes
  nodes: Record<string, Node>;
  nodeIds: NodeId[];
  
  // Connections
  connections: Record<string, Connection>;
  connectionIds: ConnectionId[];
  
  // Selection
  selectedNodes: Set<NodeId>;
  selectedConnections: Set<ConnectionId>;
  
  // Connection creation state (for drag-to-connect)
  connecting: {
    isConnecting: boolean;
    sourceNode?: NodeId;
    sourceOutput?: string;
    mousePosition?: { x: number; y: number };
  } | null;
  
  // History
  history: {
    past: any[];
    present: any;
    future: any[];
  };
  
  // Modules
  currentModule: string;
  modules: Record<string, {
    nodes: Record<string, Node>;
    nodeIds: NodeId[];
    connections: Record<string, Connection>;
    connectionIds: ConnectionId[];
    viewport?: {
      x: number;
      y: number;
      zoom: number;
    };
  }>;
  
  // Theme
  theme: 'light' | 'dark';
}

// Helper type to extract return type from slice functions
type SliceReturnType<T> = T extends (
  set: any,
  get: any
) => infer R
  ? R
  : never;

// Actions from slices
type CanvasSliceActions = SliceReturnType<typeof canvasSlice>;
type NodesSliceActions = SliceReturnType<typeof nodesSlice>;
type ConnectionsSliceActions = SliceReturnType<typeof connectionsSlice>;
type SelectionSliceActions = SliceReturnType<typeof selectionSlice>;
type HistorySliceActions = SliceReturnType<typeof historySlice>;
type ExportImportSliceActions = SliceReturnType<typeof exportImportSlice>;
type ModulesSliceActions = SliceReturnType<typeof modulesSlice>;
type ThemeSliceActions = SliceReturnType<typeof themeSlice>;

// Combined store type
export type DrawflowStore = DrawflowStoreState &
  CanvasSliceActions &
  NodesSliceActions &
  ConnectionsSliceActions &
  SelectionSliceActions &
  HistorySliceActions &
  ExportImportSliceActions &
  ModulesSliceActions &
  ThemeSliceActions;

// Create the store by combining all slices
export const useDrawflowStore = create<DrawflowStore>((set, get) => ({
  // Initial state
  canvas: {
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { size: 20, visible: true, snap: false },
    mode: 'edit',
    direction: 'horizontal',
  },
  nodes: {},
  nodeIds: [],
  connections: {},
  connectionIds: [],
  selectedNodes: new Set(),
  selectedConnections: new Set(),
  connecting: null,
  history: {
    past: [],
    present: null,
    future: [],
  },
  
  // Modules initial state
  currentModule: 'Home',
  modules: {
    Home: {
      nodes: {},
      nodeIds: [],
      connections: {},
      connectionIds: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    Other: {
      nodes: {},
      nodeIds: [],
      connections: {},
      connectionIds: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  },
  
  // Theme initial state
  theme: 'light',
  
  // Combine all slice actions
  ...canvasSlice(set, get),
  ...nodesSlice(set, get),
  ...connectionsSlice(set, get),
  ...selectionSlice(set, get),
  ...historySlice(set, get),
  ...exportImportSlice(set, get),
  ...modulesSlice(set, get),
  ...themeSlice(set, get),
}));

