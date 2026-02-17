'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Blockly, darkTheme, getToolboxXml, generatePython } from '@/lib/blocklyConfig';

interface Props {
  availableBlocks: string[];
  onCodeChange: (code: string) => void;
}

export default function BlocklyEditor({ availableBlocks, onCodeChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // #31: Debounced change handler to avoid excessive re-renders
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleChange = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (workspaceRef.current) {
        const code = generatePython(workspaceRef.current);
        onCodeChange(code);

        const el = containerRef.current;
        if (el) {
          const hasBlocks = workspaceRef.current.getAllBlocks(false).length > 0;
          el.classList.toggle('has-blocks', hasBlocks);
        }
      }
    }, 150);
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
      // @ts-expect-error flyoutAutoClose is valid but not in type definitions
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

    // Fix #36: Prevent zoom from affecting flyout blocks
    // Monkey-patch the flyout workspace to always use scale=1
    const flyoutWs = flyout?.getWorkspace();
    if (flyoutWs) {
      const origSetScale = flyoutWs.setScale.bind(flyoutWs);
      flyoutWs.setScale = (newScale: number) => {
        // Always force scale to 1 regardless of main workspace zoom
        origSetScale(1);
      };
    }

    workspaceRef.current = workspace;

    // Fix #34: ResizeObserver to handle sidebar open/close
    const resizeObserver = new ResizeObserver(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Also listen for window resize
    const handleWindowResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [availableBlocks, handleChange]);

  return (
    <div
      ref={containerRef}
      className="blockly-workspace-container"
      style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative', overflow: 'hidden' }}
    />
  );
}
