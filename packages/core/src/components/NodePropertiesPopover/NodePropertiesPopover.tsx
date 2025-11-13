/**
 * NodePropertiesPopover Component
 * Displays selected node properties in a popover
 */

import React from 'react';
import type { Node } from '@react-drawflow/types';
import './NodePropertiesPopover.css';

export interface NodePropertiesPopoverProps {
  node: Node;
  position: { x: number; y: number };
  onClose?: () => void;
}

export function NodePropertiesPopover({ node, position, onClose }: NodePropertiesPopoverProps) {
  return (
    <div
      className="drawflow-node-properties-popover"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 10000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="drawflow-node-properties-header">
        <h3 className="drawflow-node-properties-title">Node Properties</h3>
        {onClose && (
          <button
            className="drawflow-node-properties-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
      <div className="drawflow-node-properties-content">
        <div className="drawflow-node-property">
          <label className="drawflow-node-property-label">ID:</label>
          <span className="drawflow-node-property-value">{String(node.id)}</span>
        </div>
        <div className="drawflow-node-property">
          <label className="drawflow-node-property-label">Name:</label>
          <span className="drawflow-node-property-value">{node.name}</span>
        </div>
        <div className="drawflow-node-property">
          <label className="drawflow-node-property-label">Type:</label>
          <span className="drawflow-node-property-value">{node.type}</span>
        </div>
        {node.category && (
          <div className="drawflow-node-property">
            <label className="drawflow-node-property-label">Category:</label>
            <span className="drawflow-node-property-value">{node.category}</span>
          </div>
        )}
        <div className="drawflow-node-property">
          <label className="drawflow-node-property-label">Position:</label>
          <span className="drawflow-node-property-value">
            ({Math.round(node.position.x)}, {Math.round(node.position.y)})
          </span>
        </div>
        {node.inputs && Object.keys(node.inputs).length > 0 && (
          <div className="drawflow-node-property">
            <label className="drawflow-node-property-label">Inputs:</label>
            <span className="drawflow-node-property-value">
              {Object.keys(node.inputs).length}
            </span>
          </div>
        )}
        {node.outputs && Object.keys(node.outputs).length > 0 && (
          <div className="drawflow-node-property">
            <label className="drawflow-node-property-label">Outputs:</label>
            <span className="drawflow-node-property-value">
              {Object.keys(node.outputs).length}
            </span>
          </div>
        )}
        {node.data && Object.keys(node.data).length > 0 && (
          <div className="drawflow-node-property">
            <label className="drawflow-node-property-label">Data:</label>
            <pre className="drawflow-node-property-data">
              {JSON.stringify(node.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

