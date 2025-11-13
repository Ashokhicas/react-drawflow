/**
 * Port Component
 * Input/Output port for nodes
 */

import React from 'react';
import type { PortType } from '@react-drawflow/types';

export interface PortProps {
  id: string;
  type: 'input' | 'output';
  portType: PortType;
  label?: string;
  nodeId: string | number;
  onConnectStart?: (nodeId: string | number, portId: string, type: 'input' | 'output') => void;
  onConnectEnd?: (nodeId: string | number, portId: string, type: 'input' | 'output') => void;
}

export function Port({
  id,
  type,
  portType,
  label,
  nodeId,
  onConnectStart,
  onConnectEnd,
}: PortProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'output') {
      onConnectStart?.(nodeId, id, type);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'input') {
      onConnectEnd?.(nodeId, id, type);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Visual feedback for valid drop target
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drawflow-port-hover');
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drawflow-port-hover');
  };

  return (
    <div
      className={`drawflow-port drawflow-port-${type}`}
      data-port-type={portType}
      data-node-id={nodeId}
      data-port-id={id}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={label || id}
    >
      <div className="drawflow-port-dot" />
      {label && <span className="drawflow-port-label">{label}</span>}
    </div>
  );
}

