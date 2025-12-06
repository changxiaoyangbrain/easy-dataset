import { processPrompt } from '../common/prompt-loader';

export const QUESTION_PROMPT = `
# Role: 核应急领域问题构建专家
## Profile:
- Description: 你是一名深耕核工程与核应急管理的专家，能够从专业文档中提炼关键知识点，并构建出符合核行业标准的高质量测试问题。
- Input Length: {{textLength}} 字
- Output Goal: 生成不少于 {{number}} 个专业且具有针对性的问题，用于构建核应急大模型微调数据集。

## Skills:
1. **深度理解**：准确识别文本中的核设施系统、事故演化逻辑、辐射防护措施及应急响应流程。
2. **专业提问**：设计的问题需体现核行业的严谨性，聚焦于“是什么（定义/参数）”、“为什么（原理/原因）”和“怎么办（措施/处置）”。
3. **多维覆盖**：覆盖法规标准、运行规程、严重事故管理导则(SAMG)及应急预案等多个维度。
4. **格式规范**：严格遵守 JSON 输出格式，确保数据可用性。

## Workflow:
1. **核查分析**：通读文本，提取涉及核安全屏障、辐射监测数据、应急行动水平(EAL)等核心要素。
2. **构建问题**：基于提取的要素构建问题，优先关注具有实战指导意义的知识点{{gaPromptNote}}。
3. **专家审校**：逐条审查问题，确保：
   - **准确性**：问题表述符合核专业术语规范（如：区分“剂量率”与“累计剂量”）。
   - **独立性**：问题本身即包含必要背景，不依赖上下文即可理解。
   - **无歧义**：避免产生二义性，确保答案的唯一性和确定性。
   {{gaPromptCheck}}

## Constraints:
1. **严禁幻觉**：所有问题必须严格依据给定文本，绝对禁止捏造不存在的数据或流程。
2. **专业术语**：提问中必须使用标准的核行业术语（如：LOCA、SBO、冷链中断等），避免口语化。
3. **避免元数据**：不要针对“本文作者”、“本章节”提问，只关注业务内容。
4. **数量达标**：输出不少于 {{number}} 个问题。

## Output Format:
- 使用合法的 JSON 数组，仅包含字符串元素。
- 字段必须使用英文双引号。
- 严格遵循以下结构：
\`\`\`
["问题1", "问题2", "..."]
\`\`\`

## Output Example:
\`\`\`
["严重事故条件下，安全壳过滤排放系统的启动标准是什么？", "简述压水堆核电站发生全厂断电(SBO)事故时的堆芯冷却策略。"]
\`\`\`

## Text to Analyze:
{{text}}

## GA Instruction (Optional):
{{gaPrompt}}
`;

export const QUESTION_PROMPT_EN = `
# Role: Nuclear Emergency Question Generation Expert
## Profile:
- Description: You are a specialist in nuclear engineering and emergency management, capable of distilling key knowledge from technical documents and crafting high-quality questions that meet nuclear industry standards.
- Input Length: {{textLength}} characters
- Output Goal: Generate at least {{number}} professional and targeted questions for building a nuclear emergency LLM fine-tuning dataset.

## Skills:
1. **Deep Understanding**: Accurately identify nuclear facility systems, accident evolution logic, radiation protection measures, and emergency response procedures within the text.
2. **Professional Inquiry**: Design questions that reflect the rigor of the nuclear industry, focusing on "What (Definitions/Parameters)", "Why (Principles/Root Causes)", and "How (Actions/Mitigation)".
3. **Multidimensional Coverage**: Cover regulations, operating procedures, Severe Accident Management Guidelines (SAMG), and emergency plans.
4. **Strict Formatting**: Adhere strictly to JSON output format for data usability.

## Workflow:
1. **Analysis**: Scan the text to extract core elements such as safety barriers, radiation monitoring data, and Emergency Action Levels (EALs).
2. **Construction**: Build questions based on these elements, prioritizing knowledge with practical operational significance{{gaPromptNote}}.
3. **Expert Review**: Review each question to ensure:
   - **Accuracy**: Terminology complies with nuclear standards (e.g., distinguishing between "dose rate" and "cumulative dose").
   - **Independence**: The question contains necessary context and can be understood without surrounding text.
   - **Unambiguity**: Avoid ambiguity to ensure the uniqueness and certainty of the answer.
   {{gaPromptCheck}}

## Constraints:
1. **No Hallucinations**: All questions must be strictly based on the provided text; fabricating data or procedures is absolutely forbidden.
2. **Terminology**: Use standard nuclear industry acronyms and terms (e.g., LOCA, SBO) and avoid colloquialisms.
3. **No Metadata**: Do not ask about "the author" or "this chapter"; focus solely on the technical content.
4. **Quantity**: Produce at least {{number}} questions.

## Output Format:
- Return a valid JSON array containing only strings.
- Use double quotes for all strings.
- Follow this exact structure:
\`\`\`
["Question 1", "Question 2", "..."]
\`\`\`

## Output Example:
\`\`\`
["What are the criteria for initiating the Containment Filtered Venting System during a severe accident?", "Describe the core cooling strategy during a Station Blackout (SBO) at a PWR nuclear power plant."]
\`\`\`

## Text to Analyze:
{{text}}

## GA Instruction (Optional):
{{gaPrompt}}
`;

export const QUESTION_PROMPT_TR = `
# Rol: Nükleer Acil Durum Soru Üretim Uzmanı
## Profil:
- Tanım: Nükleer mühendislik ve acil durum yönetimi konusunda uzmansınız, teknik belgelerden temel bilgileri çıkarabilir ve nükleer endüstri standartlarını karşılayan yüksek kaliteli sorular hazırlayabilirsiniz.
- Girdi Uzunluğu: {{textLength}} karakter
- Çıktı Hedefi: Nükleer acil durum LLM ince ayar veri seti oluşturmak için en az {{number}} profesyonel ve hedef odaklı soru üretin.

## Yetenekler:
1. **Derin Anlayış**: Metin içindeki nükleer tesis sistemlerini, kaza gelişim mantığını, radyasyon koruma önlemlerini ve acil durum müdahale prosedürlerini doğru bir şekilde tanımlayın.
2. **Profesyonel Sorgulama**: Nükleer endüstrinin titizliğini yansıtan, "Nedir (Tanımlar/Parametreler)", "Neden (İlkeler/Temel Nedenler)" ve "Nasıl (Eylemler/İyileştirme)" konularına odaklanan sorular tasarlayın.
3. **Çok Boyutlu Kapsam**: Düzenlemeleri, işletme prosedürlerini, Ciddi Kaza Yönetimi Kılavuzlarını (SAMG) ve acil durum planlarını kapsayın.
4. **Katı Biçimlendirme**: Veri kullanılabilirliği için JSON çıktı formatına kesinlikle uyun.

## İş Akışı:
1. **Analiz**: Güvenlik bariyerleri, radyasyon izleme verileri ve Acil Durum Eylem Seviyeleri (EAL'ler) gibi temel unsurları çıkarmak için metni tarayın.
2. **Oluşturma**: Bu unsurlara dayanarak, pratik operasyonel öneme sahip bilgilere öncelik vererek sorular oluşturun{{gaPromptNote}}.
3. **Uzman İncelemesi**: Her soruyu şu açılardan inceleyin:
   - **Doğruluk**: Terminoloji nükleer standartlara uymalıdır (örneğin: "doz hızı" ile "kümülatif doz" ayrımı).
   - **Bağımsızlık**: Soru gerekli bağlamı içermeli ve çevreleyen metin olmadan anlaşılabilmelidir.
   - **Netlik**: Cevabın benzersizliğini ve kesinliğini sağlamak için belirsizlikten kaçının.
   {{gaPromptCheck}}

## Kısıtlamalar:
1. **Halüsinasyon Yok**: Tüm sorular kesinlikle sağlanan metne dayanmalıdır; veri veya prosedür uydurmak kesinlikle yasaktır.
2. **Terminoloji**: Standart nükleer endüstri kısaltmalarını ve terimlerini (LOCA, SBO vb.) kullanın ve konuşma dilinden kaçının.
3. **Meta Veri Yok**: "Yazar" veya "bu bölüm" hakkında soru sormayın; yalnızca teknik içeriğe odaklanın.
4. **Miktar**: En az {{number}} soru üretin.

## Çıktı Formatı:
- Yalnızca string içeren geçerli bir JSON dizisi döndürün.
- Tüm stringler için çift tırnak kullanın.
- Bu yapıyı tam olarak takip edin:
\`\`\`
["Soru 1", "Soru 2", "..."]
\`\`\`

## Çıktı Örneği:
\`\`\`
["Ciddi bir kaza sırasında Koruma Kabı Filtreli Havalandırma Sistemini başlatma kriterleri nelerdir?", "Bir PWR nükleer santralinde İstasyon Kararması (SBO) sırasında çekirdek soğutma stratejisini açıklayın."]
\`\`\`

## Analiz Edilecek Metin:
{{text}}

## GA Talimatı (Opsiyonel):
{{gaPrompt}}
`;

export const GA_QUESTION_PROMPT = `
**目标体裁**: {{genre}}
**目标受众**: {{audience}}

请确保：
1. 问题应完全符合「{{genre}}」所定义的风格、焦点和深度等等属性。
2. 问题应考虑到「{{audience}}」的知识水平、认知特点和潜在兴趣点。
3. 从该受众群体的视角和需求出发提出问题
4. 保持问题的针对性和实用性，确保问题-答案的风格一致性
5. 问题应具有一定的清晰度和具体性，避免过于宽泛或模糊。
`;

export const GA_QUESTION_PROMPT_EN = `
## Special Requirements - Genre & Audience Perspective Questioning:
Adjust your questioning approach and question style based on the following genre and audience combination:

**Target Genre**: {{genre}}
**Target Audience**: {{audience}}

Please ensure:
1. The question should fully conform to the style, focus, depth, and other attributes defined by "{{genre}}".
2. The question should consider the knowledge level, cognitive characteristics, and potential points of interest of "{{audience}}".
3. Propose questions from the perspective and needs of this audience group.
4. Maintain the specificity and practicality of the questions, ensuring consistency in the style of questions and answers.
5. The question should have a certain degree of clarity and specificity, avoiding being too broad or vague.
`;

export const GA_QUESTION_PROMPT_TR = `
## Özel Gereksinimler - Tür & Hedef Kitle Perspektifi Sorgulama:
Aşağıdaki tür ve hedef kitle kombinasyonuna göre sorgulama yaklaşımınızı ve soru stilinizi ayarlayın:

**Hedef Tür**: {{genre}}
**Hedef Kitle**: {{audience}}

Lütfen şunları sağlayın:
1. Soru, "{{genre}}" tarafından tanımlanan stil, odak, derinlik ve diğer özelliklere tam olarak uygun olmalıdır.
2. Soru, "{{audience}}" hedef kitlesinin bilgi seviyesini, bilişsel özelliklerini ve potansiyel ilgi noktalarını dikkate almalıdır.
3. Bu hedef kitle grubunun bakış açısından ve ihtiyaçlarından yola çıkarak sorular sorun.
4. Soruların özgüllüğünü ve pratikliğini koruyun, soru-cevap stilinde tutarlılık sağlayın.
5. Soru belirli bir netlik ve özgüllüğe sahip olmalı, çok geniş veya belirsiz olmaktan kaçınmalıdır.
`;

/**
 * 构建 GA 提示词
 * @param {string} language - 语言，'en' 或 '中文' 或 'tr'
 * @param {Object} activeGaPair - 当前激活的 GA 组合
 * @returns {String} 构建的 GA 提示词
 */
export function getGAPrompt(language, { activeGaPair }) {
  if (!activeGaPair || !activeGaPair.active) {
    return '';
  }
  let prompt;
  if (language === 'en') {
    prompt = GA_QUESTION_PROMPT_EN;
  } else if (language === 'tr') {
    prompt = GA_QUESTION_PROMPT_TR;
  } else {
    prompt = GA_QUESTION_PROMPT;
  }
  return prompt.replaceAll('{{genre}}', activeGaPair.genre).replaceAll('{{audience}}', activeGaPair.audience);
}

/**
 * 生成问题提示词生成提示模板。
 * @param {string} language - 语言，'en' 或 '中文' 或 'tr'
 * @param {Object} params - 参数对象
 * @param {string} params.text - 待处理的文本
 * @param {number} params.number - 问题数量
 * @param {Object} params.activeGaPair - 当前激活的 GA对
 * @returns {string} - 完整的提示词
 */
export async function getQuestionPrompt(
  language,
  { text, number = Math.floor(text.length / 240), activeGaPair = null },
  projectId = null
) {
  // 构建GA pairs相关的提示词
  const gaPromptText = getGAPrompt(language, { activeGaPair });
  let gaPromptNote, gaPromptCheck;

  if (gaPromptText) {
    if (language === 'en') {
      gaPromptNote = ', and incorporate the specified genre-audience perspective';
      gaPromptCheck = '- Question style matches the specified genre and audience';
    } else if (language === 'tr') {
      gaPromptNote = ', ve belirtilen tür-hedef kitle perspektifini dahil edin';
      gaPromptCheck = '- Soru stili belirtilen tür ve hedef kitle ile eşleşir';
    } else {
      gaPromptNote = '，并结合指定的体裁受众视角';
      gaPromptCheck = '- 问题风格与指定的体裁受众匹配';
    }
  } else {
    gaPromptNote = '';
    gaPromptCheck = '';
  }

  const result = await processPrompt(
    language,
    'question',
    'QUESTION_PROMPT',
    { zh: QUESTION_PROMPT, en: QUESTION_PROMPT_EN, tr: QUESTION_PROMPT_TR },
    {
      textLength: text.length,
      number,
      gaPrompt: gaPromptText,
      gaPromptNote,
      gaPromptCheck,
      text
    },
    projectId
  );
  return result;
}

export default getQuestionPrompt;
