
import { processPrompt } from '../common/prompt-loader';

// 核应急 - 规程化问答 (CoT)
export const NUCLEAR_EOP_PROMPT = `
# Role: 核应急响应专家 (20年经验)
## Profile:
- Description: 你是一名资深的核电厂高级操纵员和应急指挥顾问，精通《核电厂核事故应急管理条例》、EOP (应急运行规程) 及 SAMG (严重事故管理导则)。
- Input Length: {{textLength}} 字
- Output Goal: 基于给定的规程或预案文本，生成 {{number}} 个高质量的"情景-响应"链式问答 (CoT)。

## Skills:
1. **规程拆解**: 能将复杂的长句式规程拆解为"征兆-判断-行动-依据"的逻辑链条。
2. **场景推演**: 能够识别规程适用的具体事故工况（如 LOCA, SBO, SGTR）。
3. **精准术语**: 严格使用核工程标准术语（如"冷段注入"、"安注箱"、"堆芯出口温度"）。
4. **安全文化**: 在推理过程中体现"保守决策"和"纵深防御"原则。

## Workflow:
1. **文本分析**: 识别文档中的关键操作步骤、参数限值（Setpoint）和逻辑条件（AND/OR）。
2. **问题构建**: 设计具体的事故征兆描述作为"问题"。
   - 例如："当稳压器水位低于 15% 且安全壳压力持续上升时，操纵员应采取什么行动？"
3. **答案生成 (CoT)**:
   - **Step 1 现状评估**: 分析这一征兆意味着什么系统故障。
   - **Step 2 规程索引**: 引用相关的规程步骤或原则。
   - **Step 3 操作指令**: 列出正确的操作序列。
   - **Step 4 物理依据**: 简要解释为什么要这样做（可选）。

## Constraints:
1. 严禁臆造不存在的参数限值。
2. 对于"双重确认"的操作，必须在步骤中明确指出。
3. 涉及放射性释放的场景，必须包含防护建议。
4. 输出格式必须严格符合 JSON 要求。

## Output Format:
- 返回一个 JSON 数组，包含字符串类型的问答对。
- 格式如下：
\`\`\`json
[
  {
    "question": "具体的事故征兆或查询条件...",
    "answer": "1. **现状分析**: ...\\n2. **执行步骤**: ...\\n3. **依据**: ..."
  }
]
\`\`\`
(注意：为了兼容系统现有解析器，如果是问答对，请确保最终输出是 JSON 字符串，系统可能会进行后续处理，这里我们统一输出问答对的 JSON 字符串表示，或根据系统要求输出 Question 数组)

**特别说明**: 当前系统 standard input 仅支持 Question 数组，因此请生成如下格式的【问题列表】，后续步骤再生成答案：
\`\`\`json
["针对[规程小节]的事故征兆，操纵员需确认哪些参数？", "当出现[征兆]时，根据本规程的第一步操作是什么？"]
\`\`\`

## Text to Analyze:
{{text}}
`;

// 核应急 - 场景判别题
export const NUCLEAR_JUDGEMENT_PROMPT = `
# Role: 核安全监管人员
## Profile:
- Description: 你负责依据《国际核事件分级表》(INES) 和国家相关法规，对给定的事故描述进行定级和分类。
- Input Length: {{textLength}} 字
- Output Goal: 生成 {{number}} 个"描述-判定"类问题。

## Skills:
1. 熟练掌握应急状态分级：应急待命、厂房应急、场区应急、场外应急。
2. 敏感于关键阈值：如场界剂量率、堆芯损伤程度。

## Workflow:
1. 从文本中提取具体的事故后果描述。
2. 构造问题："上述情况属于哪一级的应急状态？" 或 "是否满足触发场外应急的条件？"
3. 确保问题考察的是对法规标准的理解和应用。

## Output Format:
\`\`\`json
["问题1", "问题2", "..."]
\`\`\`

## Text to Analyze:
{{text}}
`;

export const NUCLEAR_EOP_PROMPT_EN = `
# Role: Nuclear Emergency Response Expert (20+ years exp)
## Profile:
- Description: You are a Senior Reactor Operator and Emergency Director advisor, expert in IAEA Safety Standards, EOPs, and SAMGs.
- Output Goal: Generate {{number}} "Scenario-Response" CoT questions based on the text.

## Skills:
1. **Procedure Decomposition**: Break down complex procedures into "Symptom-Diagnosis-Action-Basis".
2. **Scenario Simulation**: Identify specific accident conditions (LOCA, SBO, SGTR).
3. **Terminology**: Use precise Nuclear Engineering terminology.

## Output Format:
\`\`\`json
["Question 1", "Question 2", "..."]
\`\`\`

## Text to Analyze:
{{text}}
`;

/**
 * 获取核应急专用问题生成提示词
 */
export async function getNuclearQuestionPrompt(
  language,
  { text, number = Math.floor(text.length / 240), type = 'EOP' }, // type: 'EOP' | 'JUDGEMENT'
  projectId = null
) {
  let baseKey = 'NUCLEAR_EOP_PROMPT';
  let defaultZh = NUCLEAR_EOP_PROMPT;
  let defaultEn = NUCLEAR_EOP_PROMPT_EN;

  if (type === 'JUDGEMENT') {
    baseKey = 'NUCLEAR_JUDGEMENT_PROMPT';
    defaultZh = NUCLEAR_JUDGEMENT_PROMPT;
    defaultEn = NUCLEAR_EOP_PROMPT_EN; // 暂用通用的英文
  }

  const result = await processPrompt(
    language,
    'nuclear', // Custom prompt type
    baseKey,
    { zh: defaultZh, en: defaultEn },
    {
      textLength: text.length,
      number,
      text
    },
    projectId
  );
  return result;
}

export default getNuclearQuestionPrompt;
