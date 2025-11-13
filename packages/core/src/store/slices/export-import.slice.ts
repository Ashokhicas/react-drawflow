/**
 * Export/Import state slice
 * Handles exporting and importing flow data
 */

import type { DrawflowStoreState } from '../index';
import type { Node, Connection, NodeId, ConnectionId } from '@react-drawflow/types';

export interface DrawflowExportData {
  version: string;
  drawflow?: {
    [moduleName: string]: {
      data: {
        [nodeId: string]: Node;
      };
    };
  };
  // Legacy format support
  nodes?: Node[];
  connections?: Connection[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const exportImportSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Export flow data to JSON
  exportFlow: (): string => {
    const state = get();
    
    // Save current module state before exporting
    if (state.saveCurrentModuleState) {
      state.saveCurrentModuleState();
    }
    
    // Export in Drawflow format with modules
    const drawflowData: Record<string, { data: Record<string, Node> }> = {};
    
    Object.keys(state.modules).forEach((moduleName) => {
      const module = state.modules[moduleName];
      const moduleNodes: Record<string, Node> = {};
      
      module.nodeIds.forEach((id) => {
        const node = module.nodes[String(id)];
        if (node) {
          moduleNodes[String(id)] = node;
        }
      });
      
      if (Object.keys(moduleNodes).length > 0) {
        drawflowData[moduleName] = { data: moduleNodes };
      }
    });
    
    const exportData: DrawflowExportData = {
      version: '1.0.0',
      drawflow: drawflowData,
    };
    return JSON.stringify(exportData, null, 2);
  },

  // Export flow data and download as file
  exportFlowToFile: (filename: string = 'drawflow-export.json') => {
    const jsonData = get().exportFlow();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import flow data from JSON
  importFlow: (jsonData: string, clearExisting: boolean = false) => {
    try {
      const data: DrawflowExportData = JSON.parse(jsonData);
      const state = get();

      if (clearExisting) {
        // Clear all existing nodes and connections
        state.nodeIds.forEach((id) => state.removeNode(id));
      }

      // Import nodes
      if (data.nodes && Array.isArray(data.nodes)) {
        data.nodes.forEach((node) => {
          // Remove id to generate new UUID
          const { id, ...nodeData } = node;
          state.addNode(nodeData);
        });
      }

      // Import connections - need to map old node IDs to new node IDs
      if (data.connections && Array.isArray(data.connections) && data.nodes) {
        // Create a mapping of old node IDs to new node IDs based on position and type
        const nodeIdMap = new Map<string | number, string | number>();
        const importedNodes = state.nodeIds
          .map((id) => state.nodes[String(id)])
          .filter(Boolean);
        
        data.nodes.forEach((oldNode) => {
          const matchingNode = importedNodes.find(
            (n) =>
              Math.abs(n.position.x - oldNode.position.x) < 1 &&
              Math.abs(n.position.y - oldNode.position.y) < 1 &&
              n.type === oldNode.type &&
              n.name === oldNode.name
          );
          if (matchingNode) {
            nodeIdMap.set(oldNode.id, matchingNode.id);
          }
        });

        // Import connections with mapped node IDs
        data.connections.forEach((connection) => {
          const newSourceId = nodeIdMap.get(connection.source);
          const newTargetId = nodeIdMap.get(connection.target);
          
          if (newSourceId && newTargetId) {
            state.addConnection({
              ...connection,
              source: newSourceId,
              target: newTargetId,
            });
          }
        });
      }

      // Restore viewport if available
      if (data.viewport) {
        state.setViewport(data.viewport);
      }

      state.saveToHistory();
    } catch (error) {
      console.error('Failed to import flow:', error);
      throw new Error('Invalid flow data format');
    }
  },

  // Import flow data from file
  importFlowFromFile: (file: File, clearExisting: boolean = false): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string;
          get().importFlow(jsonData, clearExisting);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Clear all nodes and connections
  clearCanvas: () => {
    const state = get();
    state.saveToHistory();
    
    set(() => {
      // Clear all connections
      const clearedConnections: Record<string, Connection> = {};
      const clearedConnectionIds: ConnectionId[] = [];

      // Clear all nodes
      const clearedNodes: Record<string, Node> = {};
      const clearedNodeIds: NodeId[] = [];

      // Clear selection
      const clearedSelectedNodes = new Set<NodeId>();
      const clearedSelectedConnections = new Set<ConnectionId>();

      // Reset viewport
      const resetViewport = { x: 0, y: 0, zoom: 1 };

      return {
        nodes: clearedNodes,
        nodeIds: clearedNodeIds,
        connections: clearedConnections,
        connectionIds: clearedConnectionIds,
        selectedNodes: clearedSelectedNodes,
        selectedConnections: clearedSelectedConnections,
        canvas: {
          ...state.canvas,
          viewport: resetViewport,
        },
        connecting: null,
      };
    });
  },
});

