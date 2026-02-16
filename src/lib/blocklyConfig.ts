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

// Issue #11: Custom standard blocks
Blockly.Blocks['math_number_custom'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('🔢 数字').appendField(new Blockly.FieldNumber(0), 'NUM');
    this.setOutput(true, 'Number');
    this.setColour('#f59e0b');
    this.setTooltip('好きな数字を入れてね！計算に使えるよ');
  },
};
pythonGenerator.forBlock['math_number_custom'] = function (block: Blockly.Block) {
  const num = block.getFieldValue('NUM');
  return [String(num), Order.ATOMIC];
};

Blockly.Blocks['text_custom'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('📝 文字').appendField(new Blockly.FieldTextInput('こんにちは'), 'TEXT');
    this.setOutput(true, 'String');
    this.setColour('#3b82f6');
    this.setTooltip('好きな文字を入れてね！');
  },
};
pythonGenerator.forBlock['text_custom'] = function (block: Blockly.Block) {
  const text = block.getFieldValue('TEXT');
  return [`'${text.replace(/'/g, "\\'")}'`, Order.ATOMIC];
};

Blockly.Blocks['math_arithmetic_custom'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('A').setCheck('Number');
    this.appendDummyInput().appendField('➕ 計算').appendField(
      new Blockly.FieldDropdown([
        ['+', 'ADD'],
        ['-', 'MINUS'],
        ['×', 'MULTIPLY'],
        ['÷', 'DIVIDE'],
      ]),
      'OP'
    );
    this.appendValueInput('B').setCheck('Number');
    this.setOutput(true, 'Number');
    this.setColour('#f59e0b');
    this.setTooltip('2つの数字を計算するよ！足し算・引き算・かけ算・割り算ができるよ');
    this.setInputsInline(true);
  },
};
pythonGenerator.forBlock['math_arithmetic_custom'] = function (block: Blockly.Block, generator: any) {
  const ops: Record<string, [string, any]> = {
    ADD: ['+', Order.ADDITIVE],
    MINUS: ['-', Order.ADDITIVE],
    MULTIPLY: ['*', Order.MULTIPLICATIVE],
    DIVIDE: ['/', Order.MULTIPLICATIVE],
  };
  const op = block.getFieldValue('OP');
  const [symbol, order] = ops[op] || ['+', Order.ADDITIVE];
  const a = generator.valueToCode(block, 'A', order) || '0';
  const b = generator.valueToCode(block, 'B', order) || '0';
  return [`${a} ${symbol} ${b}`, order];
};

// Dark theme (Issue #12: improved feedback)
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
    insertionMarkerColour: '#a78bfa',
    insertionMarkerOpacity: 0.8,
  },
  fontStyle: {
    family: 'sans-serif',
    weight: 'bold',
    size: 14,
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
      textBlocks.push('<block type="text_custom"><field name="TEXT">こんにちは</field></block>');
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
      mathBlocks.push('<block type="math_number_custom"><field name="NUM">0</field></block>');
    }
    if (availableBlocks.includes('math_arithmetic')) {
      mathBlocks.push('<block type="math_arithmetic_custom"></block>');
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
