import React from 'react';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

/**
 * ThreeUI StructureFlowCollection (dimensional-field variant) 3D Shader Background
 */
export default function VantaBackground({ children, className = '', options = {} }) {
  return (
    <div className={`relative overflow-hidden bg-slate-950 ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
        <StructureFlowCollection
          variant="dimensional-field"
          hue={options.hue ?? 0}
          saturation={options.saturation ?? 1.00}
          brightness={options.brightness ?? 1.00}
        />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
}
