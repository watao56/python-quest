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
      zoom: { controls: true, wheel: true, startScale: 0.5, maxScale: 2, minScale: 0.3 },
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
    // Use MutationObserver to reset flyout SVG transform when zoom changes
    const flyoutSvg = containerRef.current?.querySelector('.blocklyFlyout');
    let flyoutObserver: MutationObserver | null = null;
    if (flyoutSvg) {
      const blockCanvas = flyoutSvg.querySelector('.blocklyBlockCanvas');
      if (blockCanvas) {
        flyoutObserver = new MutationObserver(() => {
          const transform = blockCanvas.getAttribute('transform');
          if (transform) {
            // Extract translate but force scale to 1
            const match = transform.match(/translate\(([^)]+)\)/);
            if (match && transform.includes('scale')) {
              blockCanvas.setAttribute('transform', `translate(${match[1]}) scale(1)`);
            }
          }
        });
        flyoutObserver.observe(blockCanvas, { attributes: true, attributeFilter: ['transform'] });
      }
    }
    // Also patch flyout workspace scale
    const flyoutWs = flyout?.getWorkspace();
    if (flyoutWs) {
      Object.defineProperty(flyoutWs, 'scale', {
        get() { return 1; },
        set() { /* noop — always 1 */ },
        configurable: true,
      });
    }

    // Explicitly set initial scale (startScale in config may be overridden by Blockly internals)
    workspace.setScale(0.5);
    workspace.scrollCenter();

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
      flyoutObserver?.disconnect();
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
