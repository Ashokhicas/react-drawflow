/**
 * Modules state slice
 * Handles multiple flow modules (Home, Other, etc.)
 */

import type { DrawflowStoreState } from '../index';
import type { Node, Connection, NodeId, ConnectionId } from '@react-drawflow/types';

export interface ModuleData {
  nodes: Record<string, Node>;
  nodeIds: NodeId[];
  connections: Record<string, Connection>;
  connectionIds: ConnectionId[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const modulesSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Current module
  currentModule: 'Home' as string,

  // Modules data (keyed by module name)
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
  } as Record<string, ModuleData>,

  // Change module
  changeModule: (moduleName: string) => {
    const state = get();
    
    // Save current module state before switching
    const currentModuleData: ModuleData = {
      nodes: { ...state.nodes },
      nodeIds: [...state.nodeIds],
      connections: { ...state.connections },
      connectionIds: [...state.connectionIds],
      viewport: { ...state.canvas.viewport },
    };
    
    // Update modules with current state
    const updatedModules = {
      ...state.modules,
      [state.currentModule]: currentModuleData,
    };
    
    // Load new module state
    const newModuleData = updatedModules[moduleName] || {
      nodes: {},
      nodeIds: [],
      connections: {},
      connectionIds: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    };
    
    // Restore viewport if available
    if (newModuleData.viewport) {
      state.setViewport(newModuleData.viewport);
    }
    
    set(() => ({
      currentModule: moduleName,
      modules: updatedModules,
      nodes: newModuleData.nodes,
      nodeIds: newModuleData.nodeIds,
      connections: newModuleData.connections,
      connectionIds: newModuleData.connectionIds,
      selectedNodes: new Set<NodeId>(),
      selectedConnections: new Set<ConnectionId>(),
      connecting: null,
    }));
  },

  // Get module list
  getModules: (): string[] => {
    const state = get();
    return Object.keys(state.modules);
  },

  // Add new module
  addModule: (moduleName: string) => {
    set((state) => {
      if (state.modules[moduleName]) {
        console.warn(`Module "${moduleName}" already exists.`);
        return state;
      }
      
      return {
        modules: {
          ...state.modules,
          [moduleName]: {
            nodes: {},
            nodeIds: [],
            connections: {},
            connectionIds: [],
            viewport: { x: 0, y: 0, zoom: 1 },
          },
        },
      };
    });
  },

  // Remove module
  removeModule: (moduleName: string) => {
    const state = get();
    
    if (state.currentModule === moduleName) {
      console.warn(`Cannot remove the currently active module "${moduleName}".`);
      return;
    }
    
    set((state) => {
      const { [moduleName]: removed, ...remainingModules } = state.modules;
      return {
        modules: remainingModules,
      };
    });
  },

  // Save current module state (called before operations that modify nodes/connections)
  saveCurrentModuleState: () => {
    const state = get();
    const currentModuleData: ModuleData = {
      nodes: { ...state.nodes },
      nodeIds: [...state.nodeIds],
      connections: { ...state.connections },
      connectionIds: [...state.connectionIds],
      viewport: { ...state.canvas.viewport },
    };
    
    set((state) => ({
      modules: {
        ...state.modules,
        [state.currentModule]: currentModuleData,
      },
    }));
  },
});

