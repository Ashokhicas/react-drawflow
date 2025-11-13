/**
 * ModuleTabs Component
 * Tabbed interface for switching between flow modules (Home, Other, etc.)
 */

import React from 'react';
import './ModuleTabs.css';

export interface ModuleTabsProps {
  modules: string[];
  currentModule: string;
  onModuleChange: (moduleName: string) => void;
  onAddModule?: () => void;
  className?: string;
}

export function ModuleTabs({
  modules,
  currentModule,
  onModuleChange,
  onAddModule,
  className,
}: ModuleTabsProps) {
  return (
    <div className={`drawflow-module-tabs ${className || ''}`}>
      <div className="drawflow-module-tabs-list">
        {modules.map((moduleName) => (
          <button
            key={moduleName}
            className={`drawflow-module-tab ${
              currentModule === moduleName ? 'active' : ''
            }`}
            onClick={() => onModuleChange(moduleName)}
          >
            {moduleName}
          </button>
        ))}
      </div>
      {onAddModule && (
        <button
          className="drawflow-module-tab-add"
          onClick={onAddModule}
          title="Add new module"
          aria-label="Add new module"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

