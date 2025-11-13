/**
 * DrawflowCanvas Component
 * Main canvas component that combines Canvas, Nodes, and Connections
 */

import type { Node as NodeType, Position } from '@react-drawflow/types';
import React, { useEffect, useRef, useState } from 'react';
import { useDrawflowStore } from '../../store';
import { calculateBezierPath } from '../../utils/geometry';
import { getPortPositionRelative } from '../../utils/port-position';
import { Canvas } from '../Canvas';
import { SelectionBox } from '../Canvas/SelectionBox';
import { Connection } from '../Connection';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu';
import { Node } from '../Node';
import { NodePropertiesPopover } from '../NodePropertiesPopover';

export interface DrawflowCanvasProps {
  className?: string;
  renderNode?: (node: NodeType) => React.ReactNode;
}

export function DrawflowCanvas({ className, renderNode }: DrawflowCanvasProps) {
  const store = useDrawflowStore();
  const nodes = store.getAllNodes();
  const connections = store.getAllConnections();
  const connecting = store.connecting;
  const viewport = store.canvas.viewport;
  const currentModule = store.currentModule;
  const modules = store.getModules();
  const isLocked = store.isLocked();

  // Selection box state
  const [selectionBox, setSelectionBox] = useState<{ start: Position; end: Position } | null>(null);
  const isSelecting = useRef(false);
  const selectionStart = useRef<Position | null>(null);

  // Node properties popover state
  const [selectedNodeForProperties, setSelectedNodeForProperties] = useState<NodeType | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<Position | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    nodeId: string | number;
  } | null>(null);

  // Clipboard state
  const clipboardRef = useRef<string | null>(null);

  // Node dimensions cache - stores actual measured dimensions for each node
  const nodeDimensionsRef = useRef<Map<string | number, { width: number; height: number }>>(
    new Map()
  );

  // Handle node dimensions change
  const handleNodeDimensionsChange = React.useCallback(
    (nodeId: string | number, dimensions: { width: number; height: number }) => {
      nodeDimensionsRef.current.set(nodeId, dimensions);
    },
    []
  );

  // Get node by ID helper
  const getNodeById = React.useCallback(
    (id: string | number): NodeType | undefined => {
      return store.getNode(id);
    },
    [store]
  );

  // Handle connection start
  const handleConnectStart = React.useCallback(
    (nodeId: string | number, portId: string, type: 'input' | 'output') => {
      if (type === 'output') {
        const node = getNodeById(nodeId);
        if (node) {
          const dimensions = nodeDimensionsRef.current.get(nodeId);
          const portPos = getPortPositionRelative(
            node,
            portId,
            'output',
            store.canvas.direction,
            dimensions
          );
          store.startConnection(nodeId, portId, {
            x: node.position.x + portPos.x,
            y: node.position.y + portPos.y,
          });
        }
      }
    },
    [store, getNodeById]
  );

  // Handle connection end
  const handleConnectEnd = React.useCallback(
    (nodeId: string | number, portId: string, type: 'input' | 'output') => {
      if (type === 'input' && connecting?.isConnecting) {
        store.saveToHistory();
        store.completeConnection(nodeId, portId);
      }
    },
    [store, connecting]
  );

  // Handle node selection with multi-select support
  const handleNodeSelect = React.useCallback(
    (nodeId: string | number, e?: React.MouseEvent) => {
      const isMultiSelect = e?.shiftKey || e?.ctrlKey || e?.metaKey;
      store.selectNode(nodeId, isMultiSelect);

      // Show properties popover for single selection
      if (!isMultiSelect) {
        const node = getNodeById(nodeId);
        if (node) {
          setSelectedNodeForProperties(node);
          // Position popover near the node
          const canvas = document.querySelector('.drawflow-canvas') as HTMLElement;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = node.position.x * viewport.zoom + viewport.x + 200;
            const y = node.position.y * viewport.zoom + viewport.y;
            setPopoverPosition({ x, y });
          }
        }
      } else {
        setSelectedNodeForProperties(null);
      }
    },
    [store, getNodeById, viewport]
  );

  // Handle node delete
  const handleNodeDelete = React.useCallback(
    (nodeId: string | number) => {
      store.saveToHistory();
      store.removeNode(nodeId);
      setSelectedNodeForProperties(null);
    },
    [store]
  );

  // Handle node copy
  const handleNodeCopy = React.useCallback(
    (nodeId: string | number) => {
      const copiedData = store.copyNodes([nodeId]);
      clipboardRef.current = copiedData;
      // Also copy to system clipboard if available
      if (navigator.clipboard) {
        navigator.clipboard.writeText(copiedData).catch(console.error);
      }
    },
    [store]
  );

  // Handle node clone
  const handleNodeClone = React.useCallback(
    (nodeId: string | number) => {
      store.saveToHistory();
      store.cloneNode(nodeId, { x: 20, y: 20 });
    },
    [store]
  );

  // Handle multiple nodes clone
  const handleNodesClone = React.useCallback(() => {
    if (store.selectedNodes.size > 0) {
      store.saveToHistory();
      store.cloneNodes(Array.from(store.selectedNodes), { x: 20, y: 20 });
    }
  }, [store]);

  // Handle connection delete
  const handleConnectionDelete = React.useCallback(
    (connectionId: string) => {
      store.saveToHistory();
      store.removeConnection(connectionId);
    },
    [store]
  );

  // Handle context menu
  const handleNodeContextMenu = React.useCallback(
    (nodeId: string | number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const node = getNodeById(nodeId);
      if (!node) return;

      // Show context menu at mouse position
      setContextMenu({
        position: { x: e.clientX, y: e.clientY },
        nodeId,
      });
    },
    [getNodeById]
  );

  // Context menu items
  const getContextMenuItems = React.useCallback(
    (nodeId: string | number): ContextMenuItem[] => {
      return [
        {
          label: 'Clone',
          icon: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4H6C4.89543 4 4 4.89543 4 6V10C4 11.1046 4.89543 12 6 12H10C11.1046 12 12 11.1046 12 10V6C12 4.89543 11.1046 4 10 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ),
          onClick: () => {
            handleNodeClone(nodeId);
          },
        },
        {
          label: 'Copy',
          icon: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4H6C4.89543 4 4 4.89543 4 6V10C4 11.1046 4.89543 12 6 12H10C11.1046 12 12 11.1046 12 10V6C12 4.89543 11.1046 4 10 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          ),
          onClick: () => {
            handleNodeCopy(nodeId);
          },
        },
        { divider: true },
        {
          label: 'Delete',
          icon: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ),
          onClick: () => {
            handleNodeDelete(nodeId);
          },
        },
      ];
    },
    [handleNodeClone, handleNodeCopy, handleNodeDelete]
  );

  // Handle export
  const handleExport = React.useCallback(() => {
    store.exportFlowToFile(`drawflow-export-${Date.now()}.json`);
  }, [store]);

  // Handle import
  const handleImport = React.useCallback(
    async (file: File) => {
      try {
        await store.importFlowFromFile(file, true); // Clear existing
        setSelectedNodeForProperties(null);
      } catch (error) {
        console.error('Import failed:', error);
        throw error;
      }
    },
    [store]
  );

  // Handle clear canvas
  const handleClearCanvas = React.useCallback(() => {
    if (
      window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')
    ) {
      store.clearCanvas();
      setSelectedNodeForProperties(null);
      setContextMenu(null);
    }
  }, [store]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Delete selected nodes/connections
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedNodes.size > 0) {
          e.preventDefault();
          store.saveToHistory();
          store.selectedNodes.forEach((nodeId) => {
            store.removeNode(nodeId);
          });
          setSelectedNodeForProperties(null);
        }
        if (store.selectedConnections.size > 0) {
          e.preventDefault();
          store.saveToHistory();
          store.selectedConnections.forEach((connId) => {
            store.removeConnection(connId);
          });
        }
      }

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (store.selectedNodes.size > 0) {
          e.preventDefault();
          const copiedData = store.copyNodes(Array.from(store.selectedNodes));
          clipboardRef.current = copiedData;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(copiedData).catch(console.error);
          }
        }
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboardRef.current) {
          e.preventDefault();
          store.saveToHistory();
          store.pasteNodes(clipboardRef.current, { x: 20, y: 20 });
        } else if (navigator.clipboard) {
          navigator.clipboard
            .readText()
            .then((text) => {
              try {
                JSON.parse(text); // Validate JSON
                store.saveToHistory();
                store.pasteNodes(text, { x: 20, y: 20 });
              } catch {
                // Not valid JSON, ignore
              }
            })
            .catch(console.error);
        }
      }

      // Clone (Ctrl+D / Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        if (store.selectedNodes.size > 0) {
          e.preventDefault();
          handleNodesClone();
        }
      }

      // Escape to close popover
      if (e.key === 'Escape') {
        setSelectedNodeForProperties(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [store, handleNodesClone]);

  // Handle canvas mouse down for selection box
  const handleCanvasMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only start selection box if clicking on canvas (not nodes/ports)
      if (
        target.closest('.drawflow-node') ||
        target.closest('.drawflow-port') ||
        target.closest('.drawflow-connection')
      ) {
        return;
      }

      if (e.button === 0 && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Clear selection on canvas click (unless multi-select)
        store.clearSelection();
        setSelectedNodeForProperties(null);
      }

      if (e.button === 0 && (e.shiftKey || e.ctrlKey || e.metaKey)) {
        // Start selection box
        const canvas = document.querySelector('.drawflow-canvas') as HTMLElement;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Convert to world coordinates
        const worldX = (screenX - viewport.x) / viewport.zoom;
        const worldY = (screenY - viewport.y) / viewport.zoom;

        isSelecting.current = true;
        selectionStart.current = { x: worldX, y: worldY };
        setSelectionBox({ start: { x: worldX, y: worldY }, end: { x: worldX, y: worldY } });
      }
    },
    [store, viewport]
  );

  // Handle selection box mouse move
  useEffect(() => {
    if (!isSelecting.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!selectionStart.current) return;

      const canvas = document.querySelector('.drawflow-canvas') as HTMLElement;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Convert to world coordinates
      const worldX = (screenX - viewport.x) / viewport.zoom;
      const worldY = (screenY - viewport.y) / viewport.zoom;

      setSelectionBox((prev) => {
        if (!prev || !selectionStart.current) return prev;
        return {
          start: selectionStart.current,
          end: { x: worldX, y: worldY },
        };
      });
    };

    const handleMouseUp = () => {
      if (isSelecting.current) {
        setSelectionBox((box) => {
          if (box) {
            // Select nodes within selection box
            const left = Math.min(box.start.x, box.end.x);
            const right = Math.max(box.start.x, box.end.x);
            const top = Math.min(box.start.y, box.end.y);
            const bottom = Math.max(box.start.y, box.end.y);

            const selectedNodeIds: (string | number)[] = [];
            nodes.forEach((node) => {
              const nodeLeft = node.position.x;
              const nodeRight = node.position.x + 150; // Approximate node width
              const nodeTop = node.position.y;
              const nodeBottom = node.position.y + 80; // Approximate node height

              // Check if node intersects with selection box
              if (nodeLeft < right && nodeRight > left && nodeTop < bottom && nodeBottom > top) {
                selectedNodeIds.push(node.id);
              }
            });

            if (selectedNodeIds.length > 0) {
              store.selectNodes(selectedNodeIds);
            }
          }

          isSelecting.current = false;
          selectionStart.current = null;
          return null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [nodes, store, viewport]);

  // Handle mouse move for connection preview
  useEffect(() => {
    if (!connecting?.isConnecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Get the parent canvas container (not the transformed content div)
      const canvas = document.querySelector('.drawflow-canvas') as HTMLElement;
      if (!canvas) return;

      // Get the bounding rect of the canvas (parent container)
      const rect = canvas.getBoundingClientRect();

      // Calculate mouse position relative to the canvas container (screen coordinates)
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Convert screen coordinates to world coordinates
      // The transform applied by Framer Motion is: translate(viewport.x, viewport.y) scale(viewport.zoom)
      // But CSS transforms apply scale first, then translate
      // So: screenX = viewport.x + worldX * viewport.zoom
      // Therefore: worldX = (screenX - viewport.x) / viewport.zoom
      // worldY = (screenY - viewport.y) / viewport.zoom
      const worldX = (screenX - viewport.x) / viewport.zoom;
      const worldY = (screenY - viewport.y) / viewport.zoom;

      store.updateConnectionMouse({ x: worldX, y: worldY });
    };

    const handleMouseUp = () => {
      if (connecting?.isConnecting) {
        store.cancelConnection();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connecting?.isConnecting, store, viewport]);

  // Memoize nodes to prevent unnecessary re-renders
  const uniqueNodes = React.useMemo(() => {
    const seen = new Set<string | number>();
    return nodes.filter((node) => {
      if (seen.has(node.id)) {
        return false;
      }
      seen.add(node.id);
      return true;
    });
  }, [nodes]);

  // Render connection preview while dragging
  const renderConnectionPreview = () => {
    if (!connecting?.isConnecting || !connecting.sourceNode || !connecting.mousePosition) {
      return null;
    }

    const sourceNode = getNodeById(connecting.sourceNode);
    if (!sourceNode) return null;

    const sourceDimensions = nodeDimensionsRef.current.get(connecting.sourceNode);
    const sourcePortPos = getPortPositionRelative(
      sourceNode,
      connecting.sourceOutput!,
      'output',
      store.canvas.direction,
      sourceDimensions
    );
    const startPos = {
      x: sourceNode.position.x + sourcePortPos.x,
      y: sourceNode.position.y + sourcePortPos.y,
    };

    const endPos = connecting.mousePosition;
    const path = calculateBezierPath(startPos, endPos, 0.5, undefined, store.canvas.direction);

    return (
      <svg
        className="drawflow-connection-preview"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <path
          d={path}
          className="drawflow-connection preview"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="none"
        />
      </svg>
    );
  };

  // Handle module change
  const handleModuleChange = React.useCallback(
    (moduleName: string) => {
      store.changeModule(moduleName);
    },
    [store]
  );

  // Handle lock toggle
  const handleToggleLock = React.useCallback(() => {
    store.toggleLock();
  }, [store]);

  return (
    <div className="drawflow-canvas-wrapper">
      <Canvas className={className} onMouseDown={handleCanvasMouseDown} disabled={isLocked}>
        {/* Render Connections (behind nodes) */}
        <div
          className="drawflow-connections-layer"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {connections.map((connection) => {
            const sourceNode = getNodeById(connection.source);
            const targetNode = getNodeById(connection.target);

            if (!sourceNode || !targetNode) return null;

            // Create a composite key that includes node positions to force re-render on position changes
            // This ensures connections update smoothly when nodes are dragged
            const connectionKey = `${connection.id}-${sourceNode.position.x}-${sourceNode.position.y}-${targetNode.position.x}-${targetNode.position.y}`;

            const sourceDimensions = nodeDimensionsRef.current.get(connection.source);
            const targetDimensions = nodeDimensionsRef.current.get(connection.target);

            return (
              <Connection
                key={connectionKey}
                connection={connection}
                sourceNode={sourceNode}
                targetNode={targetNode}
                viewport={viewport}
                direction={store.canvas.direction}
                sourceNodeDimensions={sourceDimensions}
                targetNodeDimensions={targetDimensions}
                onSelect={(id) => store.selectConnection(id)}
                onDelete={handleConnectionDelete}
              />
            );
          })}
        </div>

        {/* Connection Preview */}
        {renderConnectionPreview()}

        {/* Selection Box */}
        {selectionBox && (
          <SelectionBox start={selectionBox.start} end={selectionBox.end} viewport={viewport} />
        )}

        {/* Node Properties Popover */}
        {selectedNodeForProperties && popoverPosition && (
          <NodePropertiesPopover
            node={selectedNodeForProperties}
            position={popoverPosition}
            onClose={() => setSelectedNodeForProperties(null)}
          />
        )}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            position={contextMenu.position}
            items={getContextMenuItems(contextMenu.nodeId)}
            onClose={() => setContextMenu(null)}
          />
        )}

        {/* Render Nodes */}
        <div
          className="drawflow-nodes-layer"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {uniqueNodes.map((node) => (
            <Node
              key={String(node.id)}
              node={node}
              onSelect={handleNodeSelect}
              onMove={(id, position) => {
                // Don't save to history on every move - only save when drag ends
                // This allows smooth real-time updates without performance issues
                store.moveNode(id, position);
              }}
              onConnectStart={handleConnectStart}
              onConnectEnd={handleConnectEnd}
              onDelete={handleNodeDelete}
              onCopy={handleNodeCopy}
              onClone={(nodeId) => handleNodeClone(nodeId)}
              onContextMenu={handleNodeContextMenu}
              onDimensionsChange={handleNodeDimensionsChange}
            >
              {renderNode ? renderNode(node) : null}
            </Node>
          ))}
        </div>
      </Canvas>
    </div>
  );
}
