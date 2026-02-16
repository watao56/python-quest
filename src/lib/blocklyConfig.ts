import * as Blockly from 'blockly';
import 'blockly/blocks';
import { pythonGenerator, Order } from 'blockly/python';

// Japanese locale
Blockly.setLocale({
  LOGIC_HUE: '210',
  LOOPS_HUE: '120',
  MATH_HUE: '230',
  TEXTS_HUE: '160',
  LISTS_HUE: '260',
  COLOUR_HUE: '20',
  VARIABLES_HUE: '330',
  PROCEDURES_HUE: '290',
  CONTROLS_IF_MSG_IF: 'もし',
  CONTROLS_IF_MSG_THEN: 'なら',
  CONTROLS_IF_MSG_ELSE: 'でなければ',
  CONTROLS_IF_MSG_ELSEIF: 'でなくもし',
  LOGIC_OPERATION_AND: 'かつ',
  LOGIC_OPERATION_OR: 'または',
  LOGIC_BOOLEAN_TRUE: '真',
  LOGIC_BOOLEAN_FALSE: '偽',
  MATH_ADDITION_SYMBOL: '+',
  TEXT_JOIN_TITLE_CREATEWITH: '文字をつなげる',
  TEXT_TEXT_TOOLTIP: '文字を入力',
  TEXT_TEXT_HELPURL: '',
  VARIABLES_SET: '%1 を %2 にする',
  VARIABLES_GET: '%1',
} as any);

// Custom print block
Blockly.Blocks['python_print'] = {
  init: function(this: Blockly.Block) {
    this.appendValueInput('TEXT')
      .setCheck(null)
      .appendField('📢 表示する');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('#22c55e');
    this.setTooltip('文字や数字を表示するよ');
  }
};

pythonGenerator.forBlock['python_print'] = function(block: Blockly.Block, generator: any) {
  const value = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  return `print(${value})\n`;
};

// Custom text join block  
Blockly.Blocks['python_text_join'] = {
  init: function(this: Blockly.Block) {
    this.appendValueInput('A')
      .setCheck(null)
      .appendField('🔗 つなげる');
    this.appendValueInput('B')
      .setCheck(null)
      .appendField('+');
    this.setOutput(true, null);
    this.setColour('#3b82f6');
    this.setTooltip('2つの文字をつなげるよ');
  }
};

pythonGenerator.forBlock['python_text_join'] = function(block: Blockly.Block, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ADDITIVE) || "''";
  const b = generator.valueToCode(block, 'B', Order.ADDITIVE) || "''";
  return [`str(${a}) + str(${b})`, Order.ADDITIVE];
};

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

  return `<xml>${categories.join('\n')}</xml>`;
}

export function generatePython(workspace: Blockly.Workspace): string {
  return pythonGenerator.workspaceToCode(workspace);
}

export { Blockly };
