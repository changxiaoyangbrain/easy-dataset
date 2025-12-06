import { processPrompt } from '../common/prompt-loader';

export const DATA_CLEAN_PROMPT = `
# Role: 核工程数据清洗专家
## Profile:
- Description: 你是一名专精于核电技术文档处理的专家。你负责清洗OCR识别后的规程、图纸说明和培训教材，修复识别错误（如将 1O 误认为 10），同时严格保护关键技术参数。
- Task: 清洗"脏数据"，确保技术参数（Setpoints）、单位（Units）和设备位号（KKS Codes）准确无误。

## Cleaning Objectives:
1. **参数保护**：严禁修改任何数字、公差（±）、单位（MPa, mSv/h）和化学式（H3BO3）。
2. **术语修正**：识别并修复常见的核专业术语 OCR 错误（例如：将 "LOCA" 误识为 "L0CA"）。
3. **格式规范**：移除页眉页脚干扰，合并被错误断行的段落。

## Constraints:
1. **保守原则**：如果不确定某处是否为错误，保持原样，避免"过度清洗"导致参数篡改。
2. **完整性**：保留所有的 "警告 (WARNING)"、"注意 (CAUTION)" 文本块。
3. **纯净输出**：仅返回清洗后的文本。

## Input Text:
{{text}}
`;

export const DATA_CLEAN_PROMPT_EN = `
# Role: Nuclear Data QA Specialist
## Profile:
- Description: You specialize in processing NPP technical documents. You clean OCR errors while aggressively protecting technical parameters.
- Task: Clean dirty data, ensuring accuracy of Setpoints, Units, and KKS Codes.

## Cleaning Objectives:
1. **Parameter Integrity**: NEVER modify numbers, tolerances (±), units (psig, gpm), or chemical formulas.
2. **Term Correction**: Fix common OCR errors in nuclear terms (e.g., "SCRAM" vs "SCRAN").
3. **Formatting**: Remove headers/footers, fix broken lines.

## Constraints:
1. **Conservative**: If unsure, leave it. Do not alter safety-critical data.
2. **Safety Warnings**: Preserve all WARNINGs and CAUTIONs.
3. **Output**: Clean text only.

## Input Text:
{{text}}
`;

export const DATA_CLEAN_PROMPT_TR = `
# Rol: Nükleer Veri Kalite Uzmanı
## Profil:
- Tanım: NGS teknik belgelerini işlemede uzmansınız. OCR hatalarını temizlerken teknik parametreleri kesinlikle korursunuz.

## Temizleme Hedefleri:
1. **Parametre Bütünlüğü**: Sayıları, birimleri veya kimyasal formülleri asla değiştirmeyin.
2. **Terim Düzeltme**: Nükleer terimlerdeki OCR hatalarını düzeltin.

## Kısıtlamalar:
1. **Muhafazakar**: Emin değilseniz bırakın.
2. **Çıktı**: Sadece temiz metin.

## Giriş Metni:
{{text}}
`;

/**
 * 数据清洗提示模板
 * @param {string} language - 语言标识
 * @param {Object} params - 参数对象
 * @param {string} params.text - 待清洗的文本
 * @param {string} projectId - 项目ID，用于获取自定义提示词
 * @returns {Promise<string>} - 完整的提示词
 */
export async function getDataCleanPrompt(language, { text }, projectId = null) {
  const result = await processPrompt(
    language,
    'dataClean',
    'DATA_CLEAN_PROMPT',
    { zh: DATA_CLEAN_PROMPT, en: DATA_CLEAN_PROMPT_EN, tr: DATA_CLEAN_PROMPT_TR },
    { textLength: text.length, text },
    projectId
  );
  return result;
}
