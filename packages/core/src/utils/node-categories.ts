/**
 * Node category utilities
 * Helper functions for organizing nodes by category/section
 */

import type { Node } from '@react-drawflow/types';

/**
 * Get all unique categories from nodes
 */
export function getNodeCategories(nodes: Node[]): string[] {
  const categories = new Set<string>();
  nodes.forEach((node) => {
    if (node.category) {
      categories.add(node.category);
    } else {
      categories.add('default'); // Default category for nodes without category
    }
  });
  return Array.from(categories).sort();
}

/**
 * Filter nodes by category
 */
export function filterNodesByCategory(nodes: Node[], category: string): Node[] {
  if (category === 'default') {
    return nodes.filter((node) => !node.category || node.category === 'default');
  }
  return nodes.filter((node) => node.category === category);
}

/**
 * Group nodes by category
 */
export function groupNodesByCategory(nodes: Node[]): Record<string, Node[]> {
  const grouped: Record<string, Node[]> = {};
  nodes.forEach((node) => {
    const category = node.category || 'default';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(node);
  });
  return grouped;
}

/**
 * Set category for multiple nodes
 */
export function setNodesCategory(
  nodeIds: (string | number)[],
  category: string,
  updateNode: (nodeId: string | number, updates: Partial<Node>) => void
): void {
  nodeIds.forEach((nodeId) => {
    updateNode(nodeId, { category });
  });
}

