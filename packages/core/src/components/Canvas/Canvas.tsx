/**
 * Canvas Component
 * Main canvas with pan, zoom, and grid support
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useDrawflowStore } from '../../store';
import { Grid } from './Grid';
import './Canvas.css';

export interface CanvasProps {
  children?: React.ReactNode;
  className?: string;
  onPan?: (x: number, y: number) => void;
  onZoom?: (zoom: number) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export function Canvas({ children, className = '', onPan, onZoom, onMouseDown, disabled = false }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const [isPanningState, setIsPanningState] = useState(false);
  const store = useDrawflowStore();

  const { viewport, grid } = store.canvas;

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.5, Math.min(2.0, viewport.zoom + delta));
        store.setZoom(newZoom);
        onZoom?.(newZoom);
      }
    },
    [viewport.zoom, store, onZoom]
  );

  // Handle pan start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Don't allow interaction if disabled (locked)
      if (disabled) {
        return;
      }

      // Call external handler first
      onMouseDown?.(e);
      
      // Don't pan if clicking on a node or other interactive element
      const target = e.target as HTMLElement;
      if (target.closest('.drawflow-node') || target.closest('.drawflow-port')) {
        return;
      }
      
      // Don't pan if shift/ctrl/meta is pressed (for selection box)
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        return;
      }
      
      if (e.button === 0) {
        // Left mouse button
        isPanning.current = true;
        setIsPanningState(true);
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    },
    [onMouseDown, disabled]
  );

  // Handle pan move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning.current) {
        const deltaX = e.clientX - lastPanPoint.current.x;
        const deltaY = e.clientY - lastPanPoint.current.y;
        store.panBy(deltaX, deltaY);
        onPan?.(viewport.x + deltaX, viewport.y + deltaY);
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    },
    [store, viewport, onPan]
  );

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    setIsPanningState(false);
  }, []);

  // Handle space + drag for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Set up mouse event listeners for panning
  useEffect(() => {
    const handleMouseMoveEvent = (e: MouseEvent) => {
      if (isPanning.current) {
        handleMouseMove(e);
      }
    };

    const handleMouseUpEvent = () => {
      if (isPanning.current) {
        handleMouseUp();
      }
    };

    window.addEventListener('mousemove', handleMouseMoveEvent);
    window.addEventListener('mouseup', handleMouseUpEvent);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveEvent);
      window.removeEventListener('mouseup', handleMouseUpEvent);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Set up wheel listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div
      ref={canvasRef}
      className={`drawflow-canvas ${className}`}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: grid.visible 
          ? 'var(--drawflow-canvas-bg, #fafafa)' 
          : 'var(--drawflow-bg-primary, #ffffff)',
        cursor: isPanningState ? 'grabbing' : 'default',
      }}
    >
      {grid.visible && <Grid grid={grid} viewport={viewport} />}
      <div
        className="drawflow-canvas-content"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformOrigin: '0 0',
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          transition: isPanningState ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}

