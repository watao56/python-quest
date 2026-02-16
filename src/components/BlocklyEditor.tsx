'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Blockly, darkTheme, getToolboxXml, generatePython } from '@/lib/blocklyConfig';

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

      // Issue #13: hide workspace guide when blocks exist
      const el = containerRef.current;
      if (el) {
        const hasBlocks = workspaceRef.current.getAllBlocks(false).length > 0;
        el.classList.toggle('has-blocks', hasBlocks);
      }
    }
  }, [onCodeChange]);

  useEffect(() => {
    if (!containerRef.current || workspaceRef.current) return;

    const toolboxXml = getToolboxXml(availableBlocks);

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: toolboxXml,
      theme: darkTheme,
      grid: { spacing: 20, length: 3, colour: '#2a2a4a', snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 2, minScale: 0.5 },
      trashcan: true,
      flyoutAutoClose: true,
      renderer: 'zelos',
      sounds: true,
    });

    // Limit flyout width
    const flyout = workspace.getFlyout();
    if (flyout) {
      (flyout as any).width_ = 200;
      (flyout as any).DEFAULT_WIDTH = 200;
    }

    // Increase snap radius for easier block connections
    (Blockly as any).config.snapRadius = 48;
    (Blockly as any).config.connectingSnapRadius = 68;

    // Keep toolbox category open after dragging a block
    workspace.addChangeListener((e: any) => {
      if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) return;
      handleChange();
    });

    // Prevent zoom from affecting flyout blocks
    workspace.addChangeListener((e: any) => {
      if (e.type === Blockly.Events.VIEWPORT_CHANGE) {
        const flyout = workspace.getFlyout();
        if (flyout) {
          const flyoutWorkspace = flyout.getWorkspace();
          if (flyoutWorkspace && flyoutWorkspace.scale !== 1) {
            flyoutWorkspace.setScale(1);
          }
        }
      }
    });

    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [availableBlocks, handleChange]);

  return (
    <div
      ref={containerRef}
      className="blockly-workspace-container"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
}
