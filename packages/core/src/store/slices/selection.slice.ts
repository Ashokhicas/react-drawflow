/**
 * Selection state slice
 * Handles node and connection selection
 */

import type { DrawflowStoreState } from '../index';
import type { NodeId, ConnectionId } from '@react-drawflow/types';

export const selectionSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Select node
  selectNode: (nodeId: NodeId, addToSelection: boolean = false) => {
    set((state) => {
      const newSelectedNodes = addToSelection
        ? new Set([...state.selectedNodes, nodeId])
        : new Set([nodeId]);
      
      // Update node selected state
      const updatedNodes = { ...state.nodes };
      // Deselect all nodes first if not adding to selection
      if (!addToSelection) {
        state.nodeIds.forEach((id) => {
          if (updatedNodes[String(id)]) {
            updatedNodes[String(id)] = { ...updatedNodes[String(id)], selected: false };
          }
        });
      }
      
      // Select the new node(s)
      newSelectedNodes.forEach((id) => {
        if (updatedNodes[String(id)]) {
          updatedNodes[String(id)] = { ...updatedNodes[String(id)], selected: true };
        }
      });
      
      return {
        selectedNodes: newSelectedNodes,
        nodes: updatedNodes,
        selectedConnections: new Set(), // Clear connection selection
      };
    });
  },

  // Select multiple nodes
  selectNodes: (nodeIds: NodeId[]) => {
    set((state) => {
      const newSelectedNodes = new Set(nodeIds);
      
      // Update node selected states
      const updatedNodes = { ...state.nodes };
      state.nodeIds.forEach((id) => {
        if (updatedNodes[String(id)]) {
          updatedNodes[String(id)] = {
            ...updatedNodes[String(id)],
            selected: newSelectedNodes.has(id),
          };
        }
      });
      
      return {
        selectedNodes: newSelectedNodes,
        nodes: updatedNodes,
        selectedConnections: new Set(),
      };
    });
  },

  // Deselect node
  deselectNode: (nodeId: NodeId) => {
    set((state) => {
      const newSelectedNodes = new Set(state.selectedNodes);
      newSelectedNodes.delete(nodeId);
      
      const updatedNodes = { ...state.nodes };
      if (updatedNodes[String(nodeId)]) {
        updatedNodes[String(nodeId)] = { ...updatedNodes[String(nodeId)], selected: false };
      }
      
      return {
        selectedNodes: newSelectedNodes,
        nodes: updatedNodes,
      };
    });
  },

  // Clear selection
  clearSelection: () => {
    set((state) => {
      const updatedNodes = { ...state.nodes };
      state.nodeIds.forEach((id) => {
        if (updatedNodes[String(id)]) {
          updatedNodes[String(id)] = { ...updatedNodes[String(id)], selected: false };
        }
      });
      
      const updatedConnections = { ...state.connections };
      state.connectionIds.forEach((id) => {
        if (updatedConnections[id]) {
          updatedConnections[id] = { ...updatedConnections[id], selected: false };
        }
      });
      
      return {
        selectedNodes: new Set(),
        selectedConnections: new Set(),
        nodes: updatedNodes,
        connections: updatedConnections,
      };
    });
  },

  // Select connection
  selectConnection: (connectionId: ConnectionId) => {
    set((state) => {
      const updatedConnections = { ...state.connections };
      if (updatedConnections[connectionId]) {
        updatedConnections[connectionId] = {
          ...updatedConnections[connectionId],
          selected: true,
        };
      }
      
      return {
        selectedConnections: new Set([connectionId]),
        connections: updatedConnections,
        selectedNodes: new Set(), // Clear node selection
      };
    });
  },

  // Deselect connection
  deselectConnection: (connectionId: ConnectionId) => {
    set((state) => {
      const newSelectedConnections = new Set(state.selectedConnections);
      newSelectedConnections.delete(connectionId);
      
      const updatedConnections = { ...state.connections };
      if (updatedConnections[connectionId]) {
        updatedConnections[connectionId] = {
          ...updatedConnections[connectionId],
          selected: false,
        };
      }
      
      return {
        selectedConnections: newSelectedConnections,
        connections: updatedConnections,
      };
    });
  },
});

