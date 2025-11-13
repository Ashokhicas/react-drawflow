# React Drawflow

<div align="center">

![React Drawflow](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)
![NX](https://img.shields.io/badge/NX-Monorepo-143055?logo=nx)
[![npm version](https://img.shields.io/npm/v/@react-drawflow/core?logo=npm)](https://www.npmjs.com/package/@react-drawflow/core)
[![npm downloads](https://img.shields.io/npm/dm/@react-drawflow/core?logo=npm)](https://www.npmjs.com/package/@react-drawflow/core)
[![GitHub stars](https://img.shields.io/github/stars/Ashokhicas/react-drawflow?logo=github)](https://github.com/Ashokhicas/react-drawflow)
[![GitHub forks](https://img.shields.io/github/forks/Ashokhicas/react-drawflow?logo=github)](https://github.com/Ashokhicas/react-drawflow)

**Modern, feature-rich React implementation of Drawflow with enhanced UI/UX**

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Roadmap](#-roadmap) • [Demo](#-demo)

</div>

---

## 🎯 Overview

React Drawflow is a modern, production-ready React library for building flow-based programming interfaces. It provides a beautiful, interactive canvas for creating node-based diagrams, workflows, and data pipelines with a focus on developer experience and user experience.

Built with React 18+, TypeScript 5+, and modern tooling, React Drawflow offers:

- ✨ **Modern React Architecture** - Built with React 18+, TypeScript, and hooks
- 🎨 **Beautiful UI/UX** - Professional design with smooth animations
- 🎯 **Type-Safe** - Full TypeScript support with comprehensive types
- 🚀 **Performant** - Optimized for large graphs with efficient rendering
- 🔄 **Backward Compatible** - 100% compatible with original Drawflow JSON format
- 📦 **Modular** - NX monorepo with separate packages
- 🎭 **Themable** - Built-in light/dark themes with customization
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices

## 📦 Packages

This is an NX monorepo containing the following packages:

- **`@react-drawflow/core`** - Main library with hooks, components, and utilities
- **`@react-drawflow/types`** - TypeScript type definitions
- **`@react-drawflow/themes`** - Theme presets (light/dark)

## 🚀 Quick Start

### Installation

```bash
# Using pnpm (recommended)
pnpm add @react-drawflow/core

# Using npm
npm install @react-drawflow/core

# Using yarn
yarn add @react-drawflow/core
```

### Basic Usage

```tsx
import React from 'react';
import { DrawflowProvider, DrawflowCanvas, useDrawflow } from '@react-drawflow/core';

function MyFlowEditor() {
  const drawflow = useDrawflow();

  const handleAddNode = () => {
    drawflow.addNode({
      name: 'New Node',
      type: 'process',
      position: { x: 100, y: 100 },
      data: {},
      inputs: { input_1: { id: 'input_1', type: 'any', label: 'Input' } },
      outputs: { output_1: { id: 'output_1', type: 'any', label: 'Output' } },
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={handleAddNode}>Add Node</button>
      <DrawflowCanvas />
    </div>
  );
}

function App() {
  return (
    <DrawflowProvider>
      <MyFlowEditor />
    </DrawflowProvider>
  );
}

export default App;
```

## 🎨 Features

### Core Canvas Features

- ✅ **Infinite Canvas** - Pan and zoom with smooth interactions
- ✅ **Node Management** - Create, edit, delete, and clone nodes
- ✅ **Connection System** - Drag-and-drop connections with Bezier curves
- ✅ **Multi-Select** - Select multiple nodes with Shift/Ctrl/Cmd + click or drag selection
- ✅ **Undo/Redo** - Full history management with undo/redo support
- ✅ **Grid System** - Optional grid with snap-to-grid functionality
- ✅ **Zoom Controls** - Zoom in, zoom out, and reset zoom
- ✅ **Module System** - Support for multiple independent flow modules (Home, Other, etc.)
- ✅ **Lock/Unlock** - Lock canvas to prevent accidental edits
- ✅ **Export/Import** - Export flows to JSON and import from JSON (Drawflow compatible)

### Enhanced UI Features

- 🎨 **Professional Color Palette** - Primary blue (#3b82f6) and secondary purple (#a855f7)
- 🌓 **Light/Dark Themes** - Built-in theme system with toggle
- ✨ **Smooth Animations** - Powered by Framer Motion for professional feel
- 📐 **Orientation Support** - Horizontal and vertical flow orientations
- 🎯 **Node Actions** - Delete, copy, clone, and context menu for nodes
- 🔗 **Connection Actions** - Delete connections with floating delete button
- 📋 **Copy/Paste** - Copy and paste nodes with keyboard shortcuts
- 🖱️ **Context Menu** - Right-click context menu for nodes
- 📊 **Node Properties** - View and edit node properties in a popover
- 🎛️ **Module Tabs** - Switch between different flow modules
- 🔒 **Lock Button** - Quick toggle to lock/unlock canvas editing

### Keyboard Shortcuts

- `Delete` / `Backspace` - Delete selected nodes/connections
- `Ctrl/Cmd + C` - Copy selected nodes
- `Ctrl/Cmd + V` - Paste copied nodes
- `Ctrl/Cmd + D` - Clone selected nodes
- `Escape` - Close popover/clear selection
- `Ctrl/Cmd + Mouse Wheel` - Zoom in/out

### Advanced Features

- 🔍 **Dynamic Port Positioning** - Ports automatically position based on node dimensions
- 📏 **Responsive Layout** - Ports adapt to vertical/horizontal orientation
- 🎨 **Customizable Nodes** - Render custom node components
- 🔄 **Real-time Updates** - Connections update smoothly when nodes are dragged
- 📦 **UUID Support** - Uses UUIDs for node IDs by default
- 🎯 **Selection Box** - Drag to select multiple nodes
- 🎨 **Theme Variables** - CSS variables for easy theming

## 🏗️ Project Structure

```
react-drawflow/
├── packages/
│   ├── core/              # Main library (@react-drawflow/core)
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/         # React hooks
│   │   │   ├── store/         # Zustand store
│   │   │   └── utils/         # Utility functions
│   ├── types/             # TypeScript types (@react-drawflow/types)
│   └── themes/            # Theme presets (@react-drawflow/themes)
├── apps/
│   └── playground/        # Interactive demo app
└── legacy/                # Original Drawflow files (for reference)
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/Ashokhicas/react-drawflow.git
cd react-drawflow

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The playground app will be available at `http://localhost:3000`

### Build

```bash
# Build all packages
pnpm build

# Build specific package
nx build core
```

### Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📚 API Reference

### Hooks

#### `useDrawflow()`

Main hook for canvas operations.

```tsx
const {
  // Nodes
  nodes,
  addNode,
  removeNode,
  updateNode,
  moveNode,
  cloneNode,
  cloneNodes,
  copyNodes,
  pasteNodes,

  // Connections
  connections,
  addConnection,
  removeConnection,
  startConnection,
  completeConnection,
  cancelConnection,

  // Canvas
  canvas,
  panBy,
  panTo,
  setZoom,
  zoomIn,
  zoomOut,
  zoomReset,
  toggleGrid,
  setDirection,

  // Selection
  selectedNodes,
  selectedConnections,
  selectNode,
  selectNodes,
  selectConnection,
  clearSelection,

  // History
  undo,
  redo,
  canUndo,
  canRedo,

  // Modules
  currentModule,
  getModules,
  changeModule,
  addModule,
  removeModule,

  // Lock
  toggleLock,
  isLocked,

  // Theme
  theme,
  toggleTheme,
  setTheme,

  // Export/Import
  exportFlow,
  exportFlowToFile,
  importFlow,
  importFlowFromFile,
  clearCanvas,
} = useDrawflow();
```

#### Other Hooks

- `useDrawflowZoom()` - Zoom operations
- `useDrawflowHistory()` - Undo/Redo operations
- `useDrawflowSelection()` - Selection management
- `useDrawflowViewport()` - Viewport control

### Components

#### `<DrawflowProvider>`

Context provider that wraps your application.

```tsx
<DrawflowProvider config={{ mode: 'edit', direction: 'horizontal' }}>
  <YourApp />
</DrawflowProvider>
```

#### `<DrawflowCanvas>`

Main canvas component that renders nodes and connections.

```tsx
<DrawflowCanvas className="my-canvas" renderNode={(node) => <CustomNodeComponent node={node} />} />
```

#### Other Components

- `<Canvas>` - Base canvas with pan/zoom
- `<Node>` - Individual node component
- `<Connection>` - Connection/edge component
- `<NodeActions>` - Action buttons for nodes
- `<NodePropertiesPopover>` - Properties popover
- `<ConnectionDeleteButton>` - Delete button for connections
- `<ContextMenu>` - Right-click context menu
- `<ModuleTabs>` - Module switching tabs
- `<LockButton>` - Lock/unlock button
- `<ThemeToggle>` - Theme toggle button
- `<OrientationToggle>` - Orientation toggle button

## 🎨 Theming

React Drawflow comes with professional color palettes and built-in theme support:

- **Primary**: Vibrant blue (#3b82f6)
- **Secondary**: Elegant purple (#a855f7)

### Using Themes

```tsx
import { DrawflowProvider } from '@react-drawflow/core';

function App() {
  return (
    <DrawflowProvider>
      <YourCanvas />
    </DrawflowProvider>
  );
}
```

Themes are applied via CSS variables and can be customized:

```css
:root {
  --drawflow-bg-primary: #ffffff;
  --drawflow-bg-secondary: #f9fafb;
  --drawflow-text-primary: #1f2937;
  --drawflow-text-secondary: #6b7280;
  --drawflow-border: #e5e7eb;
}

.dark {
  --drawflow-bg-primary: #1f2937;
  --drawflow-bg-secondary: #374151;
  --drawflow-text-primary: #f9fafb;
  --drawflow-text-secondary: #d1d5db;
  --drawflow-border: #4b5563;
}
```

## 🔄 Migration from Original Drawflow

React Drawflow maintains 100% backward compatibility with the original Drawflow JSON format. You can import your existing flows seamlessly.

```tsx
import { useDrawflow } from '@react-drawflow/core';

function MyComponent() {
  const { importFlow } = useDrawflow();

  const handleImport = (drawflowJsonData) => {
    importFlow(drawflowJsonData, true); // true = clear existing
  };

  return <button onClick={() => handleImport(data)}>Import Flow</button>;
}
```

### Data Format Compatibility

The library supports both:

- **Module-based format** (new): Multiple modules (Home, Other, etc.)
- **Legacy format**: Single module format from original Drawflow

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (Completed)

- [x] Basic canvas with pan & zoom
- [x] Node creation, editing, and deletion
- [x] Connection system with Bezier curves
- [x] Multi-select and selection box
- [x] Undo/Redo system
- [x] Grid system
- [x] Module system (Home/Other)
- [x] Lock/Unlock functionality
- [x] Export/Import (Drawflow compatible)
- [x] Light/Dark themes
- [x] Horizontal/Vertical orientations
- [x] Node actions (delete, copy, clone, context menu)
- [x] Connection actions
- [x] Copy/Paste functionality
- [x] Keyboard shortcuts
- [x] Dynamic port positioning

### Phase 2: Enhanced Features 🚧 (In Progress)

- [ ] Mini-map component
- [ ] Floating toolbox
- [ ] Bottom toolbar
- [ ] Search and filter nodes
- [ ] Alignment tools
- [ ] Auto-layout algorithms
- [ ] Node categories and grouping
- [ ] Custom node templates
- [ ] Node validation
- [ ] Connection validation

### Phase 3: Advanced Features 📋 (Planned)

- [ ] Collaborative editing
- [ ] Real-time synchronization
- [ ] Version control integration
- [ ] Plugin system
- [ ] Custom renderers
- [ ] Performance optimizations for 1000+ nodes
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Internationalization (i18n)
- [ ] Mobile gesture improvements
- [ ] Touch-optimized controls

### Phase 4: Developer Experience 📋 (Planned)

- [ ] Comprehensive documentation site
- [ ] Storybook component library
- [ ] Unit test coverage (>80%)
- [ ] E2E test suite
- [ ] Performance benchmarks
- [ ] Migration guide
- [ ] Code examples and tutorials
- [ ] Video tutorials
- [ ] Community showcase

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm test && pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a React implementation inspired by the original [Drawflow](https://github.com/jerosoler/Drawflow) library.

### Built With

- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [NX](https://nx.dev/) - Monorepo tooling

## 📞 Support

- 📖 [Documentation](https://github.com/Ashokhicas/react-drawflow/wiki) (coming soon)
- 💬 [Discussions](https://github.com/Ashokhicas/react-drawflow/discussions)
- 🐛 [Issue Tracker](https://github.com/Ashokhicas/react-drawflow/issues)
- 🎮 [Live Demo](https://react-drawflow.vercel.app) (coming soon)
- 📧 [Email Support](mailto:support@react-drawflow.dev)

## 🚀 Quick Links

- 📦 [npm Package](https://www.npmjs.com/package/@react-drawflow/core)
- 🐙 [GitHub Repository](https://github.com/Ashokhicas/react-drawflow)
- 📚 [Documentation](https://docs.react-drawflow.dev) (coming soon)
- 🎥 [Video Tutorials](https://youtube.com/@react-drawflow) (coming soon)

## 🌟 Show Your Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

Made with ❤️ by the React Drawflow community

[Report Bug](https://github.com/Ashokhicas/react-drawflow/issues) • [Request Feature](https://github.com/Ashokhicas/react-drawflow/issues) • [Contribute](CONTRIBUTING.md)

</div>
