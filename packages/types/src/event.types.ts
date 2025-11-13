/**
 * Event-related type definitions for React Drawflow
 */

import type { Node, NodeId, Position } from './node.types';
import type { Connection } from './edge.types';
import type { Viewport } from './canvas.types';

export type DrawflowEventType =
  | 'node:created'
  | 'node:removed'
  | 'node:updated'
  | 'node:selected'
  | 'node:deselected'
  | 'node:moved'
  | 'connection:start'
  | 'connection:created'
  | 'connection:removed'
  | 'connection:selected'
  | 'connection:deselected'
  | 'canvas:click'
  | 'canvas:pan'
  | 'zoom:changed'
  | 'module:created'
  | 'module:changed'
  | 'module:removed'
  | 'data:imported'
  | 'data:exported';

export interface DrawflowEventMap {
  'node:created': (nodeId: NodeId) => void;
  'node:removed': (nodeId: NodeId) => void;
  'node:updated': (nodeId: NodeId, node: Node) => void;
  'node:selected': (nodeId: NodeId) => void;
  'node:deselected': () => void;
  'node:moved': (nodeId: NodeId, position: Position) => void;
  'connection:start': (output: { node: NodeId; output: string }) => void;
  'connection:created': (connection: Connection) => void;
  'connection:removed': (connection: Connection) => void;
  'connection:selected': (connection: Connection) => void;
  'connection:deselected': () => void;
  'canvas:click': (event: MouseEvent) => void;
  'canvas:pan': (position: Position) => void;
  'zoom:changed': (zoom: number) => void;
  'module:created': (name: string) => void;
  'module:changed': (name: string) => void;
  'module:removed': (name: string) => void;
  'data:imported': (data: any) => void;
  'data:exported': (data: any) => void;
}

export type DrawflowEventHandler<T extends DrawflowEventType> = DrawflowEventMap[T];

