'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Blockly, getToolboxXml, generatePython } from '@/lib/blocklyConfig';

interface Props {
  availableBlocks: string[];
  onCodeChange: (code: string) => void;
}

export default function BlocklyEditor({ availableBlocks, onCodeChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const handleChange = useCallback(() => {
    if (workspaceRef.current) {
      const code = generatePython(workspaceRef.current);
      onCodeChange(code);
    }
  }, [onCodeChange]);

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return;

    const toolboxXml = getToolboxXml(availableBlocks);

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: toolboxXml,
      theme: Blockly.Themes.Classic,
      grid: { spacing: 20, length: 3, colour: '#1e1e3a', snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 2, minScale: 0.5 },
      trashcan: true,
      renderer: 'zelos',
    });

    // Dark theme for workspace
    const svg = containerRef.current.querySelector('.blocklySvg');
    if (svg) {
      (svg as SVGElement).style.backgroundColor = '#1a1a2e';
    }

    workspace.addChangeListener(handleChange);
    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [availableBlocks, handleChange]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
}
