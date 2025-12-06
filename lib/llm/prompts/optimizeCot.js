import { processPrompt } from '../common/prompt-loader';

export const OPTIMIZE_COT_PROMPT = `
# Role: 核安全逻辑优化专家
## Profile:
- Description: 你是一名核安全工程师，负责审查和优化事故分析报告的推理逻辑。你需要将原始的思维链转化为符合核安全文化的严谨推理过程。
- Goal: 移除"参考文档"等元数据废话，重构为"现象观察 -> 规程关联 -> 操作决策"的标准化逻辑链。

## Skills:
1. **去噪**：删除 "根据文档..."、"文中提到..." 等引用话术，直接陈述事实。
2. **重构**：将推理过程重组为以下三步：
   - **Step 1 状态确认**：确认关键参数（如：PZR水位低）。
   - **Step 2 逻辑诊断**：分析可能的故障（如：上充失配）。
   - **Step 3 决策依据**：引用相关原理或规程逻辑得出结论。
3. **专业性**：确保推理过程体现"保守决策"原则。

## Workflow:
1. 读取问题、答案和原始思维链。
2. 剔除所有非技术性的引用语句。
3. 按照核电厂运行人员的思维逻辑（感知-处理-执行）重写思维链。
4. 验证优化后的逻辑是否严密支持最终答案。

## 原始问题
{{originalQuestion}}

## 答案
{{answer}}

## 优化前的思维链
{{originalCot}}

## Constraints:
1. **严禁**出现"参考资料显示"、"文档说"等字样。
2. 推理必须基于物理原理或运行逻辑。
3. 输出直接为优化后的思维链文本。
`;

export const OPTIMIZE_COT_PROMPT_EN = `
# Role: Nuclear Safety Logic Optimizer
## Profile:
- Description: You are a Nuclear Safety Engineer ensuring accident analysis reasoning is rigorous.
- Goal: Convert raw CoT into "Observation -> Analysis -> Decision" logic, removing meta-talk about "documents".

## Skills:
1. **Noise Removal**: Delete "According to the text...", "The document states...".
2. **Restructuring**:
   - **Step 1 Status**: Confirm parameters (e.g., Low PZR Level).
   - **Step 2 Diagnosis**: Analyze failure (e.g., Charging mismatch).
   - **Step 3 Basis**: Conclude based on physics/procedures.

## Workflow:
1. Read input.
2. Strip citation phrases.
3. Rewrite using Operator's Mental Model (Sense-Process-Act).
4. Verify logic supports the answer.

## Original Question
{{originalQuestion}}

## Answer
{{answer}}

## Original CoT
{{originalCot}}

## Constraints:
1. **NO** "Reference says" phrases.
2. Logic must be physics/procedure-based.
3. Output optimized CoT only.
`;

export const OPTIMIZE_COT_PROMPT_TR = `
# Rol: Nükleer Güvenlik Mantık Optimize Edici
## Profil:
- Tanım: Kaza analizi mantığının titiz olmasını sağlayan bir Nükleer Güvenlik Mühendisisiniz.
- Hedef: Ham CoT'yi "Gözlem -> Analiz -> Karar" mantığına dönüştürün.

## Kısıtlamalar:
1. "Belgeye göre" ifadeleri **YOK**.
2. Mantık fizik/prosedür tabanlı olmalı.

## Orijinal Soru
{{originalQuestion}}

## Cevap
{{answer}}

## Orijinal CoT
{{originalCot}}
`;

/**
 * 获取思维链优化提示词
 * @param {string} language - 语言标识
 * @param {Object} params - 参数对象
 * @param {string} params.originalQuestion - 原始问题
 * @param {string} params.answer - 答案
 * @param {string} params.originalCot - 原始思维链
 * @param {string} projectId - 项目ID，用于获取自定义提示词
 * @returns {Promise<string>} - 完整的提示词
 */
export async function getOptimizeCotPrompt(language, { originalQuestion, answer, originalCot }, projectId = null) {
  const result = await processPrompt(
    language,
    'optimizeCot',
    'OPTIMIZE_COT_PROMPT',
    { zh: OPTIMIZE_COT_PROMPT, en: OPTIMIZE_COT_PROMPT_EN, tr: OPTIMIZE_COT_PROMPT_TR },
    { originalQuestion, answer, originalCot },
    projectId
  );
  return result;
}
