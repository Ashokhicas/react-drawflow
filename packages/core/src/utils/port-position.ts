/**
 * Port position calculation utilities
 * Calculates actual port positions on the canvas
 */

import type { Node, Position } from '@react-drawflow/types';

// Default node dimensions (can be made configurable)
const DEFAULT_NODE_WIDTH = 150;
const DEFAULT_NODE_HEIGHT = 80;
const PORT_SIZE = 12;
const PORT_DOT_SIZE = 12; // Size of the port dot

/**
 * Get the position of a port on the canvas
 */
export function getPortPosition(
  node: Node,
  portId: string,
  portType: 'input' | 'output',
  viewport: { x: number; y: number; zoom: number }
): Position {
  const inputs = node.inputs ? Object.entries(node.inputs) : [];
  const outputs = node.outputs ? Object.entries(node.outputs) : [];

  const ports = portType === 'input' ? inputs : outputs;
  const portIndex = ports.findIndex(([id]) => id === portId);

  if (portIndex === -1) {
    // Fallback to node center
    return {
      x: node.position.x + DEFAULT_NODE_WIDTH / 2,
      y: node.position.y + DEFAULT_NODE_HEIGHT / 2,
    };
  }

  const totalPorts = ports.length;
  const spacing = DEFAULT_NODE_HEIGHT / (totalPorts + 1);
  const portY = node.position.y + spacing * (portIndex + 1);

  const portX = portType === 'input' ? node.position.x : node.position.x + DEFAULT_NODE_WIDTH;

  // Apply viewport transform
  return {
    x: (portX + viewport.x) * viewport.zoom,
    y: (portY + viewport.y) * viewport.zoom,
  };
}

/**
 * Get port position relative to node (not transformed)
 * Supports both horizontal and vertical flow directions
 * @param nodeDimensions - Optional node dimensions. If not provided, uses defaults.
 */
export function getPortPositionRelative(
  node: Node,
  portId: string,
  portType: 'input' | 'output',
  direction: 'horizontal' | 'vertical' = 'horizontal',
  nodeDimensions?: { width: number; height: number }
): Position {
  const inputs = node.inputs ? Object.entries(node.inputs) : [];
  const outputs = node.outputs ? Object.entries(node.outputs) : [];

  const ports = portType === 'input' ? inputs : outputs;
  const portIndex = ports.findIndex(([id]) => id === portId);

  // Use actual node dimensions if provided, otherwise use defaults
  const nodeWidth = nodeDimensions?.width ?? DEFAULT_NODE_WIDTH;
  const nodeHeight = nodeDimensions?.height ?? DEFAULT_NODE_HEIGHT;

  if (portIndex === -1) {
    return {
      x: nodeWidth / 2,
      y: nodeHeight / 2,
    };
  }

  if (direction === 'vertical') {
    // Vertical flow: inputs at top, outputs at bottom
    // Based on original Drawflow logic: ports are positioned using their actual DOM element positions
    // In vertical mode, the port container is centered at 50% of node width
    // CSS: .drawflow-node-inputs-vertical { left: 50%; transform: translateX(-50%); top: -12px; }
    // CSS: .drawflow-node-outputs-vertical { left: 50%; transform: translateX(-50%); bottom: -12px; }
    // Ports are arranged horizontally within the container with gap: 8px (from .drawflow-node-inputs gap)
    // Each port dot is 12px in diameter (PORT_DOT_SIZE)

    const totalPorts = ports.length;
    let portX: number;

    // The container is centered at 50% of node width with translateX(-50%)
    // This means the container's center is at nodeWidth / 2
    const nodeCenterX = nodeWidth / 2;

    if (totalPorts === 1) {
      // Single port: center it exactly at the middle of the node width
      portX = nodeCenterX;
    } else {
      // Multiple ports: calculate positions within the centered container
      // The container is centered at 50% with translateX(-50%)
      // Ports are arranged in a row with gap: 8px (from .drawflow-node-inputs gap)
      // Each port dot is 12px in diameter
      // The container width depends on the number of ports and spacing
      // Total width needed: (totalPorts * PORT_DOT_SIZE) + ((totalPorts - 1) * 8)
      const containerWidth = PORT_DOT_SIZE * totalPorts + 8 * (totalPorts - 1);
      const containerLeft = nodeCenterX - containerWidth / 2;

      // Position of each port dot center within the container
      // First port dot center is at containerLeft + PORT_DOT_SIZE/2
      // Subsequent ports are spaced by (PORT_DOT_SIZE + 8)
      portX = containerLeft + PORT_DOT_SIZE / 2 + portIndex * (PORT_DOT_SIZE + 8);
    }

    // Inputs at top, outputs at bottom
    // CSS: inputs container at top: -12px, outputs container at bottom: -12px
    // The port dot is 12px in diameter, centered within its container
    // For inputs: container top edge is at -12px, port dot center is at -12px + 6px = -6px
    // For outputs: container bottom edge is at nodeHeight + 12px, port dot center is at nodeHeight + 12px - 6px = nodeHeight + 6px
    let portY: number;
    if (portType === 'input') {
      // Input container top is at -12px, port dot (12px) center is at -6px
      portY = -12 + PORT_DOT_SIZE / 2;
    } else {
      // Output container bottom is at nodeHeight + 12px, port dot (12px) center is at nodeHeight + 6px
      portY = nodeHeight + 12 - PORT_DOT_SIZE / 2;
    }

    return { x: portX, y: portY };
  } else {
    // Horizontal flow: inputs on left, outputs on right (default)
    const totalPorts = ports.length;
    const spacing = nodeHeight / (totalPorts + 1);
    const portY = spacing * (portIndex + 1);

    const portX = portType === 'input' ? 0 : nodeWidth;

    return { x: portX, y: portY };
  }
}
