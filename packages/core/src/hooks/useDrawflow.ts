/**
 * Main useDrawflow hook
 * Primary hook for interacting with the Drawflow canvas
 */

import { useDrawflowStore } from '../store';
import type { Node, Connection, NodeId, ConnectionId } from '@react-drawflow/types';

export interface UseDrawflowConfig {
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export function useDrawflow(config?: UseDrawflowConfig) {
  const store = useDrawflowStore();

  return {
    // State
    nodes: store.getAllNodes(),
    connections: store.getAllConnections(),
    canvas: store.canvas,
    selectedNodes: Array.from(store.selectedNodes),
    selectedConnections: Array.from(store.selectedConnections),

    // Node actions
    addNode: store.addNode,
    removeNode: store.removeNode,
    updateNode: store.updateNode,
    moveNode: store.moveNode,
    getNode: store.getNode,

    // Connection actions
    addConnection: store.addConnection,
    removeConnection: store.removeConnection,
    updateConnection: store.updateConnection,
    getConnection: store.getConnection,
    getNodeConnections: store.getNodeConnections,

    // Selection actions
    selectNode: store.selectNode,
    selectNodes: store.selectNodes,
    clearSelection: store.clearSelection,
    selectConnection: store.selectConnection,

    // Canvas actions
    setViewport: store.setViewport,
    panBy: store.panBy,
    panTo: store.panTo,
    setZoom: store.setZoom,
    zoomIn: store.zoomIn,
    zoomOut: store.zoomOut,
    zoomReset: store.zoomReset,
    toggleGrid: store.toggleGrid,
    toggleSnap: store.toggleSnap,
    setMode: store.setMode,
    setDirection: store.setDirection,

    // History actions
    undo: store.undo,
    redo: store.redo,
    canUndo: store.canUndo,
    canRedo: store.canRedo,
    saveToHistory: store.saveToHistory,

    // Connection actions (for drag-to-connect)
    startConnection: store.startConnection,
    completeConnection: store.completeConnection,
    cancelConnection: store.cancelConnection,

    // Node cloning and copying
    cloneNode: store.cloneNode,
    cloneNodes: store.cloneNodes,
    copyNodes: store.copyNodes,
    pasteNodes: store.pasteNodes,

    // Export/Import
    exportFlow: store.exportFlow,
    exportFlowToFile: store.exportFlowToFile,
    importFlow: store.importFlow,
    importFlowFromFile: store.importFlowFromFile,
    clearCanvas: store.clearCanvas,

    // Modules
    currentModule: store.currentModule,
    getModules: store.getModules,
    changeModule: store.changeModule,
    addModule: store.addModule,
    removeModule: store.removeModule,

    // Lock/Unlock
    toggleLock: store.toggleLock,
    isLocked: store.isLocked,
    
    // Theme
    theme: store.theme,
    toggleTheme: store.toggleTheme,
    setTheme: store.setTheme,
    
    // Direction
    direction: store.canvas.direction,
    setDirection: store.setDirection,
  };
}

