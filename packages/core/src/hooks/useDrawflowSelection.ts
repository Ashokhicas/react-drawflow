/**
 * useDrawflowSelection hook
 * Specialized hook for selection operations
 */

import { useDrawflowStore } from '../store';
import type { NodeId, ConnectionId } from '@react-drawflow/types';

export function useDrawflowSelection() {
  const store = useDrawflowStore();

  return {
    selectedNodes: Array.from(store.selectedNodes),
    selectedConnections: Array.from(store.selectedConnections),
    selectNode: (nodeId: NodeId, addToSelection?: boolean) =>
      store.selectNode(nodeId, addToSelection),
    selectNodes: store.selectNodes,
    deselectNode: store.deselectNode,
    clearSelection: store.clearSelection,
    selectConnection: store.selectConnection,
    deselectConnection: store.deselectConnection,
    hasSelection: store.selectedNodes.size > 0 || store.selectedConnections.size > 0,
  };
}

