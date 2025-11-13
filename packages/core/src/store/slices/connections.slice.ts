/**
 * Connections state slice
 * Handles connection creation, updates, and deletion
 */

import type { Connection, ConnectionId, NodeId } from '@react-drawflow/types';
import { generateShortId } from '../../utils/uuid';
import type { DrawflowStoreState } from '../index';

export const connectionsSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Start connection (from output port)
  startConnection: (
    sourceNode: NodeId,
    sourceOutput: string,
    mousePosition?: { x: number; y: number }
  ) => {
    set((state) => ({
      connecting: {
        isConnecting: true,
        sourceNode,
        sourceOutput,
        mousePosition,
      },
    }));
  },

  // Update connection mouse position while dragging
  updateConnectionMouse: (mousePosition: { x: number; y: number }) => {
    set((state) => {
      if (state.connecting) {
        return {
          connecting: {
            ...state.connecting,
            mousePosition,
          },
        };
      }
      return state;
    });
  },

  // Complete connection (to input port)
  completeConnection: (targetNode: NodeId, targetInput: string) => {
    const state = get();
    if (!state.connecting || !state.connecting.sourceNode || !state.connecting.sourceOutput) {
      return;
    }

    // Prevent self-connections
    if (state.connecting.sourceNode === targetNode) {
      set((state) => ({ connecting: null }));
      return;
    }

    // Check if connection already exists
    const existingConnection = state.connectionIds
      .map((id) => state.connections[id])
      .find(
        (conn) =>
          conn.source === state.connecting!.sourceNode &&
          conn.sourceOutput === state.connecting!.sourceOutput &&
          conn.target === targetNode &&
          conn.targetInput === targetInput
      );

    if (existingConnection) {
      set((state) => ({ connecting: null }));
      return;
    }

    // Create new connection
    const connectionId = generateShortId();
    const newConnection: Connection = {
      id: connectionId,
      source: state.connecting.sourceNode,
      sourceOutput: state.connecting.sourceOutput,
      target: targetNode,
      targetInput: targetInput,
      type: 'bezier',
      curvature: 0.5,
    };

    const newConnections = { ...state.connections, [connectionId]: newConnection };
    const newConnectionIds = [...state.connectionIds, connectionId];

    set((state) => {
      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          connections: newConnections,
          connectionIds: newConnectionIds,
        },
      };

      return {
        connections: newConnections,
        connectionIds: newConnectionIds,
        connecting: null,
        modules: updatedModules,
      };
    });
  },

  // Cancel connection
  cancelConnection: () => {
    set((state) => ({ connecting: null }));
  },

  // Add connection
  addConnection: (connection: Connection) => {
    set((state) => {
      // Prevent duplicate connections
      const existing = state.connectionIds
        .map((id) => state.connections[id])
        .find(
          (conn) =>
            conn.source === connection.source &&
            conn.sourceOutput === connection.sourceOutput &&
            conn.target === connection.target &&
            conn.targetInput === connection.targetInput
        );

      if (existing) {
        console.warn('Connection already exists. Skipping.');
        return state;
      }

      const newConnections = { ...state.connections, [connection.id]: connection };
      const newConnectionIds = [...state.connectionIds, connection.id];

      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          connections: newConnections,
          connectionIds: newConnectionIds,
        },
      };

      return {
        connections: newConnections,
        connectionIds: newConnectionIds,
        modules: updatedModules,
      };
    });
  },

  // Remove connection
  removeConnection: (connectionId: ConnectionId) => {
    set((state) => {
      const { [connectionId]: removed, ...remainingConnections } = state.connections;
      const newConnectionIds = state.connectionIds.filter((id) => id !== connectionId);

      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          connections: remainingConnections,
          connectionIds: newConnectionIds,
        },
      };

      return {
        connections: remainingConnections,
        connectionIds: newConnectionIds,
        modules: updatedModules,
      };
    });
  },

  // Update connection
  updateConnection: (connectionId: ConnectionId, updates: Partial<Connection>) => {
    set((state) => {
      const connection = state.connections[connectionId];
      if (!connection) return state;

      const updatedConnections = {
        ...state.connections,
        [connectionId]: { ...connection, ...updates },
      };

      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          connections: updatedConnections,
        },
      };

      return {
        connections: updatedConnections,
        modules: updatedModules,
      };
    });
  },

  // Get connection
  getConnection: (connectionId: ConnectionId): Connection | undefined => {
    return get().connections[connectionId];
  },

  // Get connections for a node
  getNodeConnections: (nodeId: NodeId): Connection[] => {
    const state = get();
    return state.connectionIds
      .map((id) => state.connections[id])
      .filter((conn) => conn && (conn.source === nodeId || conn.target === nodeId));
  },

  // Get all connections
  getAllConnections: (): Connection[] => {
    const state = get();
    return state.connectionIds.map((id) => state.connections[id]).filter(Boolean);
  },
});
