/**
 * Nodes state slice
 * Handles node creation, updates, deletion, and movement
 */

import type { DrawflowStoreState } from '../index';
import type { Node, NodeId, Position } from '@react-drawflow/types';
import { generateUUID } from '../../utils/uuid';

export const nodesSlice = (
  set: (fn: (state: DrawflowStoreState) => Partial<DrawflowStoreState>) => void,
  get: () => DrawflowStoreState & Record<string, any>
) => ({
  // Add node (auto-generates UUID if id not provided)
  addNode: (node: Node | Omit<Node, 'id'>) => {
    set((state) => {
      // Generate UUID if id not provided
      const nodeWithId: Node = 'id' in node ? node : { ...node, id: generateUUID() };
      
      // Prevent duplicate nodes
      if (state.nodes[String(nodeWithId.id)] || state.nodeIds.includes(nodeWithId.id)) {
        console.warn(`Node with id ${nodeWithId.id} already exists. Skipping.`);
        return state;
      }
      
      const newNodes = { ...state.nodes, [String(nodeWithId.id)]: nodeWithId };
      const newNodeIds = [...state.nodeIds, nodeWithId.id];
      
      // Update the current module's state with the new nodes
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          nodes: newNodes,
          nodeIds: newNodeIds,
        },
      };
      
      return {
        nodes: newNodes,
        nodeIds: newNodeIds,
        modules: updatedModules,
      };
    });
  },

  // Remove node
  removeNode: (nodeId: NodeId) => {
    set((state) => {
      const { [String(nodeId)]: removed, ...remainingNodes } = state.nodes;
      const newNodeIds = state.nodeIds.filter((id) => id !== nodeId);
      
      // Also remove connections associated with this node
      const remainingConnections: typeof state.connections = {};
      const remainingConnectionIds: typeof state.connectionIds = [];
      
      state.connectionIds.forEach((connId) => {
        const conn = state.connections[String(connId)];
        if (conn && conn.source !== nodeId && conn.target !== nodeId) {
          remainingConnections[String(connId)] = conn;
          remainingConnectionIds.push(connId);
        }
      });
      
      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          nodes: remainingNodes,
          nodeIds: newNodeIds,
          connections: remainingConnections,
          connectionIds: remainingConnectionIds,
        },
      };
      
      return {
        nodes: remainingNodes,
        nodeIds: newNodeIds,
        connections: remainingConnections,
        connectionIds: remainingConnectionIds,
        modules: updatedModules,
      };
    });
  },

  // Update node
  updateNode: (nodeId: NodeId, updates: Partial<Node>) => {
    set((state) => {
      const node = state.nodes[String(nodeId)];
      if (!node) return state;
      
      const updatedNodes = {
        ...state.nodes,
        [String(nodeId)]: { ...node, ...updates },
      };
      
      // Update the current module's state
      const updatedModules = {
        ...state.modules,
        [state.currentModule]: {
          ...state.modules[state.currentModule],
          nodes: updatedNodes,
        },
      };
      
      return {
        nodes: updatedNodes,
        modules: updatedModules,
      };
    });
  },

  // Move node
  moveNode: (nodeId: NodeId, position: Position) => {
    const state = get();
    state.updateNode(nodeId, { position });
  },

  // Get node
  getNode: (nodeId: NodeId): Node | undefined => {
    return get().nodes[String(nodeId)];
  },

  // Get all nodes
  getAllNodes: (): Node[] => {
    const state = get();
    // Filter out duplicates and undefined nodes
    const uniqueIds = Array.from(new Set(state.nodeIds));
    return uniqueIds
      .map((id) => state.nodes[String(id)])
      .filter((node): node is Node => Boolean(node));
  },

  // Clone node(s)
  cloneNode: (nodeId: NodeId, offset: Position = { x: 20, y: 20 }) => {
    const state = get();
    const node = state.nodes[String(nodeId)];
    if (!node) return;

    const clonedNode: Omit<Node, 'id'> = {
      ...node,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: false, // Cloned nodes are not selected
    };

    state.addNode(clonedNode);
  },

  // Clone multiple nodes
  cloneNodes: (nodeIds: NodeId[], offset: Position = { x: 20, y: 20 }) => {
    const state = get();
    nodeIds.forEach((nodeId) => {
      state.cloneNode(nodeId, offset);
    });
  },

  // Copy node(s) to clipboard (serialize)
  copyNodes: (nodeIds: NodeId[]): string => {
    const state = get();
    const nodesToCopy = nodeIds
      .map((id) => state.nodes[String(id)])
      .filter(Boolean);
    return JSON.stringify(nodesToCopy);
  },

  // Paste nodes from clipboard
  pasteNodes: (jsonData: string, offset: Position = { x: 20, y: 20 }) => {
    try {
      const nodes: Node[] = JSON.parse(jsonData);
      const state = get();
      
      nodes.forEach((node) => {
        const pastedNode: Omit<Node, 'id'> = {
          ...node,
          position: {
            x: node.position.x + offset.x,
            y: node.position.y + offset.y,
          },
          selected: false,
        };
        state.addNode(pastedNode);
      });
    } catch (error) {
      console.error('Failed to paste nodes:', error);
    }
  },
});

