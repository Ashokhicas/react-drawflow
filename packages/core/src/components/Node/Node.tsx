/**
 * Node Component
 * Individual node with inputs and outputs
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { Node as NodeType } from '@react-drawflow/types';
import { useDrawflowStore } from '../../store';
import { Port } from './Port';
import { NodeActions } from '../NodeActions';
import './Node.css';

// Get store instance for use in callbacks
const getStore = () => useDrawflowStore.getState();

export interface NodeProps {
  node: NodeType;
  onSelect?: (nodeId: NodeType['id'], e?: React.MouseEvent) => void;
  onMove?: (nodeId: NodeType['id'], position: { x: number; y: number }) => void;
  onConnectStart?: (nodeId: NodeType['id'], portId: string, type: 'input' | 'output') => void;
  onConnectEnd?: (nodeId: NodeType['id'], portId: string, type: 'input' | 'output') => void;
  onDelete?: (nodeId: NodeType['id']) => void;
  onCopy?: (nodeId: NodeType['id']) => void;
  onClone?: (nodeId: NodeType['id']) => void;
  onContextMenu?: (nodeId: NodeType['id'], e: React.MouseEvent) => void;
  onDimensionsChange?: (nodeId: NodeType['id'], dimensions: { width: number; height: number }) => void;
  children?: React.ReactNode;
}

export function Node({
  node,
  onSelect,
  onMove,
  onConnectStart,
  onConnectEnd,
  onDelete,
  onCopy,
  onClone,
  onContextMenu,
  onDimensionsChange,
  children,
}: NodeProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const startPosition = React.useRef({ x: 0, y: 0 });
  const store = useDrawflowStore();
  const zoomRef = React.useRef(store.canvas.viewport.zoom);
  const [nodeDimensions, setNodeDimensions] = React.useState<{ width: number; height: number } | null>(null);
  
  // Update zoom ref when it changes
  React.useEffect(() => {
    zoomRef.current = store.canvas.viewport.zoom;
  }, [store.canvas.viewport.zoom]);

  // Measure actual node dimensions
  React.useEffect(() => {
    if (nodeRef.current) {
      const updateDimensions = () => {
        if (nodeRef.current) {
          const rect = nodeRef.current.getBoundingClientRect();
          // Account for zoom when storing dimensions
          const zoom = store.canvas.viewport.zoom;
          const dimensions = {
            width: rect.width / zoom,
            height: rect.height / zoom,
          };
          setNodeDimensions(dimensions);
          // Notify parent of dimension changes
          onDimensionsChange?.(node.id, dimensions);
        }
      };

      // Initial measurement
      updateDimensions();

      // Use ResizeObserver to track size changes
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(nodeRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [store.canvas.viewport.zoom, node.id, node.name, node.data, children, onDimensionsChange]);
  
  // Use refs to store latest callbacks to avoid stale closures
  const onMoveRef = React.useRef(onMove);
  const onSelectRef = React.useRef(onSelect);
  
  React.useEffect(() => {
    onMoveRef.current = onMove;
    onSelectRef.current = onSelect;
  }, [onMove, onSelect]);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      // Get screen pixel deltas
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      // Convert screen pixel deltas to world coordinate deltas
      // Since the canvas is scaled by zoom, we need to divide by zoom
      // Use zoomRef to get the latest zoom value
      const zoom = zoomRef.current;
      onMoveRef.current?.(node.id, {
        x: startPosition.current.x + deltaX / zoom,
        y: startPosition.current.y + deltaY / zoom,
      });
    }
  }, [node.id]);

  const handleMouseUp = React.useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      // Save to history when drag ends, not during dragging
      // This ensures smooth real-time updates during drag
      const store = getStore();
      store.saveToHistory();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseMove]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button === 0 && !isDragging.current) {
      // Handle selection first
      onSelectRef.current?.(node.id, e);
      
      // Check if we should start dragging (not if just selecting)
      const target = e.target as HTMLElement;
      if (target.closest('.drawflow-port')) {
        // Don't drag if clicking on port
        return;
      }
      
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      startPosition.current = { x: node.position.x, y: node.position.y };
      
      // Add event listeners for dragging
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }, [node.id, node.position.x, node.position.y, handleMouseMove, handleMouseUp]);

  const inputs = node.inputs ? Object.entries(node.inputs) : [];
  const outputs = node.outputs ? Object.entries(node.outputs) : [];
  const direction = store.canvas.direction;
  const isVertical = direction === 'vertical';

  return (
    <motion.div
      ref={nodeRef}
      className={`drawflow-node ${node.class || ''} ${node.selected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        zIndex: node.zIndex || 1,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Input Ports */}
      {inputs.length > 0 && (
        <div className={`drawflow-node-inputs ${isVertical ? 'drawflow-node-inputs-vertical' : ''}`}>
          {inputs.map(([key, input]) => (
            <Port
              key={key}
              id={key}
              type="input"
              portType={input.type}
              label={input.label}
              nodeId={node.id}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
            />
          ))}
        </div>
      )}

      {/* Node Actions */}
      <NodeActions
        onDelete={onDelete ? () => onDelete(node.id) : undefined}
        onCopy={onCopy ? () => onCopy(node.id) : undefined}
        onClone={onClone ? () => onClone(node.id) : undefined}
        onContextMenu={onContextMenu ? (e) => onContextMenu(node.id, e) : undefined}
        showOnHover={true}
      />

      {/* Node Content */}
      <div className="drawflow-node-content">
        {children || (
          <div className="drawflow-node-default">
            <div className="drawflow-node-title">{node.name}</div>
            {node.data && Object.keys(node.data).length > 0 && (
              <div className="drawflow-node-data">
                {JSON.stringify(node.data, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Ports */}
      {outputs.length > 0 && (
        <div className={`drawflow-node-outputs ${isVertical ? 'drawflow-node-outputs-vertical' : ''}`}>
          {outputs.map(([key, output]) => (
            <Port
              key={key}
              id={key}
              type="output"
              portType={output.type}
              label={output.label}
              nodeId={node.id}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

