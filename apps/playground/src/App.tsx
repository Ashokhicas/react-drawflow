import {
  DrawflowCanvas,
  DrawflowProvider,
  LockButton,
  ModuleTabs,
  OrientationToggle,
  ThemeToggle,
  useDrawflow,
} from '@react-drawflow/core';
import React, { useEffect, useRef } from 'react';

function CanvasControls() {
  const drawflow = useDrawflow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSampleNode = () => {
    // UUID will be auto-generated
    drawflow.saveToHistory();
    drawflow.addNode({
      name: 'Sample Node',
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { label: 'Sample Node' },
      inputs: {
        input_1: {
          id: 'input_1',
          type: 'string',
          label: 'Input',
        },
      },
      outputs: {
        output_1: {
          id: 'output_1',
          type: 'string',
          label: 'Output',
        },
      },
    });
  };

  return (
    <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-2">
      <h3 className="font-semibold text-neutral-800 dark:text-gray-200 mb-2">Controls</h3>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => drawflow.zoomIn()}
          className="px-3 py-1.5 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm"
        >
          Zoom In
        </button>
        <button
          onClick={() => drawflow.zoomOut()}
          className="px-3 py-1.5 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm"
        >
          Zoom Out
        </button>
        <button
          onClick={() => drawflow.zoomReset()}
          className="px-3 py-1.5 bg-secondary-500 text-white rounded hover:bg-secondary-600 transition-colors text-sm"
        >
          Reset Zoom
        </button>
        <button
          onClick={() => drawflow.toggleGrid()}
          className="px-3 py-1.5 bg-neutral-200 dark:bg-gray-700 text-neutral-800 dark:text-gray-200 rounded hover:bg-neutral-300 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          {drawflow.canvas.grid.visible ? 'Hide' : 'Show'} Grid
        </button>
        <button
          onClick={addSampleNode}
          className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
        >
          Add Node
        </button>
        <button
          onClick={() => {
            if (drawflow.selectedNodes.length > 0) {
              drawflow.saveToHistory();
              drawflow.selectedNodes.forEach((id) => drawflow.removeNode(id));
              drawflow.clearSelection();
            }
          }}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          disabled={drawflow.selectedNodes.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="pt-2 border-t border-neutral-200 dark:border-gray-700 mt-2">
        <h4 className="text-xs font-semibold text-neutral-700 dark:text-gray-300 mb-2">
          Flow Controls
        </h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => drawflow.exportFlowToFile(`drawflow-export-${Date.now()}.json`)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    await drawflow.importFlowFromFile(file, true);
                  } catch (error) {
                    console.error('Failed to import flow:', error);
                    alert('Failed to import flow. Please check the file format.');
                  }
                }
                // Reset input so same file can be selected again
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              style={{ display: 'none' }}
            />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 14V6M8 6L5 9M8 6L11 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 4V3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Import
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear the canvas? This action cannot be undone.'
                )
              ) {
                drawflow.clearCanvas();
              }
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Clear Canvas
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 dark:border-gray-700 mt-2">
        <div className="text-xs text-neutral-600 dark:text-gray-400">
          Zoom: {Math.round(drawflow.canvas.viewport.zoom * 100)}%
        </div>
        <div className="text-xs text-neutral-600 dark:text-gray-400">
          Nodes: {drawflow.nodes.length}
        </div>
        <div className="text-xs text-neutral-600 dark:text-gray-400">
          Connections: {drawflow.connections.length}
        </div>
      </div>
    </div>
  );
}

function ModuleTabsAndLock() {
  const drawflow = useDrawflow();
  const modules = drawflow.getModules();
  const currentModule = drawflow.currentModule;
  const isLocked = drawflow.isLocked();
  const theme = drawflow.theme;
  const direction = drawflow.direction;

  const handleModuleChange = (moduleName: string) => {
    drawflow.changeModule(moduleName);
  };

  const handleToggleLock = () => {
    drawflow.toggleLock();
  };

  const handleToggleTheme = () => {
    drawflow.toggleTheme();
  };

  const handleToggleOrientation = () => {
    drawflow.setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');
  };

  return (
    <>
      {/* Module Tabs */}
      <div className="absolute top-0 left-[320px] right-[180px] z-30 bg-white dark:bg-gray-800 shadow-lg h-10 flex items-center">
        <ModuleTabs
          modules={modules}
          currentModule={currentModule}
          onModuleChange={handleModuleChange}
        />
      </div>

      {/* Control Buttons */}
      <div className="absolute top-1 right-4 z-30 flex gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-md p-1 shadow-lg flex gap-1">
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          <OrientationToggle direction={direction} onToggle={handleToggleOrientation} />
          <LockButton isLocked={isLocked} onToggle={handleToggleLock} />
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const drawflow = useDrawflow();
  const nodesInitialized = React.useRef(false);

  // Add initial sample nodes (only once) - UUIDs will be auto-generated
  useEffect(() => {
    if (nodesInitialized.current) return;
    if (drawflow.nodes.length > 0) return; // Don't add if nodes already exist

    nodesInitialized.current = true;

    // Nodes without IDs - UUIDs will be auto-generated
    drawflow.addNode({
      name: 'Start',
      type: 'start',
      position: { x: 200, y: 200 },
      data: { label: 'Start Node' },
      outputs: {
        output_1: {
          id: 'output_1',
          type: 'string',
          label: 'Output',
        },
      },
    });

    drawflow.addNode({
      name: 'Process',
      type: 'process',
      position: { x: 400, y: 200 },
      data: { label: 'Process Node' },
      inputs: {
        input_1: {
          id: 'input_1',
          type: 'string',
          label: 'Input',
        },
      },
      outputs: {
        output_1: {
          id: 'output_1',
          type: 'string',
          label: 'Output',
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
            React Drawflow
          </h1>
          <p className="text-sm text-neutral-600 dark:text-gray-400">
            Modern flow-based programming library for React
          </p>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <DrawflowCanvas className="w-full h-full" />
          <CanvasControls />
          <ModuleTabsAndLock />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DrawflowProvider>
      <AppContent />
    </DrawflowProvider>
  );
}

export default App;
