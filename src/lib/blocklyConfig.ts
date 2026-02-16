import * as Blockly from 'blockly';
import 'blockly/blocks';
import { pythonGenerator, Order } from 'blockly/python';
import * as jaLocale from 'blockly/msg/ja';

// Apply Japanese locale
Blockly.setLocale(jaLocale as any);

// Custom print block
Blockly.Blocks['python_print'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('TEXT').setCheck(null).appendField('📢 表示する');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#22c55e');
    this.setTooltip('文字や数字を表示するよ');
  },
};

pythonGenerator.forBlock['python_print'] = function (block: Blockly.Block, generator: any) {
  const value = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  return `print(${value})\n`;
};

// Custom text join block
Blockly.Blocks['python_text_join'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('A').setCheck(null).appendField('🔗 つなげる');
    this.appendValueInput('B').setCheck(null).appendField('+');
    this.setOutput(true, null);
    this.setColour('#3b82f6');
    this.setTooltip('2つの文字をつなげるよ');
  },
};

pythonGenerator.forBlock['python_text_join'] = function (block: Blockly.Block, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ADDITIVE) || "''";
  const b = generator.valueToCode(block, 'B', Order.ADDITIVE) || "''";
  return [`str(${a}) + str(${b})`, Order.ADDITIVE];
};

// Dark theme
const darkTheme = Blockly.Theme.defineTheme('pythonQuestDark', {
  name: 'pythonQuestDark',
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#1a1a2e',
    toolboxBackgroundColour: '#12122a',
    toolboxForegroundColour: '#e2e8f0',
    flyoutBackgroundColour: '#12122a',
    flyoutForegroundColour: '#e2e8f0',
    flyoutOpacity: 0.95,
    scrollbarColour: '#2a2a4a',
    scrollbarOpacity: 0.7,
    insertionMarkerColour: '#7c3aed',
    insertionMarkerOpacity: 0.5,
  },
  fontStyle: {
    family: 'sans-serif',
    weight: 'bold',
    size: 12,
  },
});

export function getToolboxXml(availableBlocks: string[]): string {
  const categories: string[] = [];

  if (availableBlocks.includes('print')) {
    categories.push(`
      <category name="📢 出力" colour="#22c55e">
        <block type="python_print"></block>
      </category>
    `);
  }

  if (availableBlocks.includes('text') || availableBlocks.includes('text_join')) {
    const textBlocks = [];
    if (availableBlocks.includes('text')) {
      textBlocks.push('<block type="text"><field name="TEXT">こんにちは</field></block>');
    }
    if (availableBlocks.includes('text_join')) {
      textBlocks.push('<block type="python_text_join"></block>');
    }
    categories.push(`
      <category name="📝 文字" colour="#3b82f6">
        ${textBlocks.join('\n')}
      </category>
    `);
  }

  if (availableBlocks.includes('math_number') || availableBlocks.includes('math_arithmetic')) {
    const mathBlocks = [];
    if (availableBlocks.includes('math_number')) {
      mathBlocks.push('<block type="math_number"><field name="NUM">0</field></block>');
    }
    if (availableBlocks.includes('math_arithmetic')) {
      mathBlocks.push('<block type="math_arithmetic"></block>');
    }
    categories.push(`
      <category name="🔢 計算" colour="#f59e0b">
        ${mathBlocks.join('\n')}
      </category>
    `);
  }

  if (availableBlocks.includes('variables')) {
    categories.push(`
      <category name="📦 変数" colour="#a855f7" custom="VARIABLE"></category>
    `);
  }

  return `<xml>${categories.join('\n')}</xml>`;
}

export function generatePython(workspace: Blockly.Workspace): string {
  return pythonGenerator.workspaceToCode(workspace);
}

export { Blockly, darkTheme };
