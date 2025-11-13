/**
 * Node-related type definitions for React Drawflow
 */

export type NodeId = string | number;

export type PortType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';

export interface Position {
  x: number;
  y: number;
}

export interface Port {
  id: string;
  type: PortType;
  label?: string;
  required?: boolean;
  multiple?: boolean;
}

export interface NodeInput extends Port {
  connections?: ConnectionReference[];
}

export interface NodeOutput extends Port {
  connections?: ConnectionReference[];
}

export interface ConnectionReference {
  node: NodeId;
  input?: string;
  output?: string;
}

export interface NodeData {
  [key: string]: any;
}

export interface Node {
  id: NodeId;
  name: string;
  type: string;
  position: Position;
  data: NodeData;
  class?: string;
  category?: string; // Category/section for organization (e.g., 'default', 'other', 'custom')
  inputs?: Record<string, NodeInput>;
  outputs?: Record<string, NodeOutput>;
  selected?: boolean;
  locked?: boolean;
  visible?: boolean;
  zIndex?: number;
}

export interface NodeTemplate {
  name: string;
  type: string;
  category?: string;
  icon?: string;
  description?: string;
  defaultData?: NodeData;
  defaultInputs?: Record<string, Omit<NodeInput, 'connections'>>;
  defaultOutputs?: Record<string, Omit<NodeOutput, 'connections'>>;
  component?: any; // React.ComponentType<any> - avoiding React dependency in types package
}

