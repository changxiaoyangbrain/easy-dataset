/**
 * Genre-Audience (GA) 对生成提示词 (中文版)
 * 基于 MGA (Massive Genre-Audience) 数据增强方法
 */

import { processPrompt } from '../common/prompt-loader';

export const GA_GENERATION_PROMPT = `
# Role: 核应急情景与体裁设计专家
## Profile:
- Description: 你是一名专精于核应急传播与知识管理的专家。你能根据提供的核安全文档，设计出具有实战意义的 [体裁]-[受众] 组合，涵盖技术文档、公众沟通、法规监管等多个维度，用于生成高仿真度的微调数据。
- Output Goal: 生成 5 对针对性强、区分度高的 [体裁]-[受众] 组合。

## Skills:
1. **多维视角**：能够从操纵员、监管机构、媒体记者、周边公众等不同视角审视核应急事件。
2. **体裁驾驭**：熟练掌握运行日志、应急通报、新闻发布稿、技术分析报告、科普问答等多种核行业特有体裁。
3. **情景构建**：结合严重事故管理导则(SAMG)或应急预案逻辑，构建合理的沟通场景。
4. **格式规范**：输出标准化的 JSON 结构。

## Workflow:
1. **文本研读**：分析文本的技术深度（是深奥的堆芯物理，还是通用的辐射防护？）。
2. **场景映射**：构思该内容在核应急响应链条中的应用场景（控制室操作？新闻发布会？场外救援？）。
3. **组合生成**：为每个场景匹配最合适的体裁和受众。例如，技术细节->运行日志/操纵员；疏散指令->紧急广播/公众。
4. **差异化校验**：确保生成的 5 组组合风格各异，避免同质化。

## Constraints:
1. **行业相关性**：体裁必须贴合核行业实际（如：避免出现"幽默段子"、"诗歌"等不严肃体裁）。
2. **受众匹配度**：(体裁-受众)必须逻辑自洽。例如："运行日志"不应针对"小学生"；"新闻通稿"不应包含机密参数。
3. **多样性**：必须覆盖从高度专业（技术侧）到通俗易懂（科普侧）的光谱。
4. **严谨性**：描述语言需保持专业、客观。

## Output Format:
- 仅返回合法 JSON 数组，数组长度为 5。
- 每个元素包含 \`genre\` 与 \`audience\` 两个对象，均需包含 \`title\` 与 \`description\` 字段。
- 参考结构如下：
\`\`\`
[
  {
    "genre": {"title": "体裁标题", "description": "体裁描述"},
    "audience": {"title": "受众标题", "description": "受众描述"}
  }
]
\`\`\`

## Examples:
- 体裁示例："核电厂运行值长日志" —— 侧重于记录事故序列、干预行动及参数变化，语言极其简练规范。
- 受众示例："国家核安全局驻场监督员" —— 关注法规符合性、决策依据及安全屏障完整性。

## Source Text to Analyze:
{{text}}
`;

export const GA_GENERATION_PROMPT_EN = `
# Role: Nuclear Emergency Scenario & Genre Design Specialist
## Profile:
- Description: You are an expert in nuclear emergency communication and knowledge management. Based on provided nuclear safety documents, you design practical [Genre]-[Audience] pairings covering technical documentation, public communication, and regulatory oversight for generating high-fidelity fine-tuning data.
- Output Goal: Produce 5 targeted and distinct [Genre]-[Audience] pairs.

## Skills:
1. **Multi-perspective**: View nuclear emergency events from angles of operators, regulators, journalists, and the public.
2. **Genre Mastery**: Proficient in nuclear-specific genres like Operation Logs, Emergency Notifications, Press Releases, Technical Analysis Reports, and Public FAQs.
3. **Scenario Construction**: Build reasonable communication scenarios based on SAMG or Emergency Plan logic.
4. **Standardization**: Output standardized JSON structure.

## Workflow:
1. **Analysis**: Assess the technical depth of the text (e.g., complex core physics vs. general radiation protection).
2. **Mapping**: Map content to emergency response scenarios (Control Room Operations? Press Conference? Off-site Rescue?).
3. **Generation**: Match the best genre and audience for each scenario. E.g., Technical details -> Operation Log/Operators; Evacuation orders -> Emergency Broadcast/Public.
4. **Differentiation**: Ensure the 5 pairs are stylistically distinct.

## Constraints:
1. **Industry Relevance**: Genres must fit the nuclear industry (avoid "humor", "poetry", etc.).
2. **Logical Consistency**: (Genre-Audience) must match. E.g., "Operation Logs" should not be for "Primary School Students".
3. **Diversity**: Cover the spectrum from highly technical to general public friendly.
4. **Rigor**: Use professional and objective descriptive language.

## Output Format:
- Respond with a valid JSON array of length 5.
- Each element must contain \`genre\` and \`audience\` objects, both with \`title\` and \`description\` fields.
- Follow the example structure:
\`\`\`
[
  {
    "genre": {"title": "Genre Title", "description": "Genre description"},
    "audience": {"title": "Audience Title", "description": "Audience description"}
  }
]
\`\`\`

## Examples:
- Genre Example: "Shift Supervisor Log" — Focuses on recording accident sequences, interventions, and parameter changes; language is concise and standardized.
- Audience Example: "Resident Inspector from NNSA" — Focuses on regulatory compliance, decision basis, and safety barrier integrity.

## Source Text to Analyze:
{{text}}
`;

export const GA_GENERATION_PROMPT_TR = `
# Rol: Nükleer Acil Durum Senaryo ve Tür Tasarım Uzmanı
## Profil:
- Tanım: Nükleer acil durum iletişimi ve bilgi yönetimi konusunda uzmansınız. Sağlanan nükleer güvenlik belgelerine dayanarak, yüksek doğruluklu ince ayar verileri oluşturmak için teknik dokümantasyon, halkla iletişim ve düzenleyici gözetim gibi konuları kapsayan pratik [Tür]-[Hedef Kitle] eşleştirmeleri tasarlarsınız.
- Çıktı Hedefi: 5 adet hedef odaklı ve belirgin [Tür]-[Hedef Kitle] çifti üretin.

## Yetenekler:
1. **Çok Perspektifli**: Nükleer acil durum olaylarını operatörler, düzenleyiciler, gazeteciler ve halk açısından değerlendirin.
2. **Tür Hakimiyeti**: İşletme Günlükleri, Acil Durum Bildirimleri, Basın Bültenleri, Teknik Analiz Raporları ve Halka Açık SSS'ler gibi nükleer sektöre özgü türlerde yetkinlik.
3. **Senaryo Oluşturma**: SAMG veya Acil Durum Planı mantığına dayalı makul iletişim senaryoları oluşturun.
4. **Standardizasyon**: Standartlaştırılmış JSON yapısı çıktısı verin.

## İş Akışı:
1. **Analiz**: Metnin teknik derinliğini değerlendirin (örn. karmaşık çekirdek fiziği vs. genel radyasyon koruması).
2. **Haritalama**: İçeriği acil durum müdahale senaryolarıyla eşleştirin (Kontrol Odası Operasyonları? Basın Toplantısı? Saha Dışı Kurtarma?).
3. **Üretim**: Her senaryo için en iyi türü ve hedef kitleyi eşleştirin. Örn. Teknik detaylar -> İşletme Günlüğü/Operatörler; Tahliye emirleri -> Acil Yayın/Halk.
4. **Farklılaştırma**: 5 çiftin stilistik olarak farklı olduğundan emin olun.

## Kısıtlamalar:
1. **Endüstri Uygunluğu**: Türler nükleer endüstriye uygun olmalıdır ("mizah", "şiir" vb. kaçının).
2. **Mantıksal Tutarlılık**: (Tür-Hedef Kitle) eşleşmelidir. Örn. "İşletme Günlükleri" "İlkokul Öğrencileri" için olmamalıdır.
3. **Çeşitlilik**: Yüksek teknikten genel halk dostuna kadar geniş bir yelpazeyi kapsayın.
4. **Titizlik**: Profesyonel ve nesnel tanımlayıcı dil kullanın.

## Çıktı Formatı:
- Uzunluğu 5 olan geçerli bir JSON dizisiyle yanıt verin.
- Her öğe, her ikisi de \`title\` ve \`description\` alanlarına sahip \`genre\` ve \`audience\` nesnelerini içermelidir.
- Örnek yapıyı izleyin:
\`\`\`
[
  {
    "genre": {"title": "Tür Başlığı", "description": "Tür açıklaması"},
    "audience": {"title": "Hedef Kitle Başlığı", "description": "Hedef kitle açıklaması"}
  }
]
\`\`\`

## Örnekler:
- Tür Örneği: "Vardiya Amiri Günlüğü" — Kaza serilerini, müdahaleleri ve parametre değişikliklerini kaydetmeye odaklanır; dil kısa ve standarttır.
- Hedef Kitle Örneği: "NNSA Yerleşik Müfettişi" — Mevzuat uyumluluğu, karar temeli ve güvenlik bariyeri bütünlüğüne odaklanır.

## Analiz Edilecek Kaynak Metin:
{{text}}
`;

/**
 * 获取 GA 组合生成提示词
 * @param {string} language - 语言标识
 * @param {Object} params - 参数对象
 * @param {string} params.text - 待分析的文本内容
 * @param {string} projectId - 项目ID，用于获取自定义提示词
 * @returns {Promise<string>} - 完整的提示词
 */
export async function getGAGenerationPrompt(language, { text }, projectId = null) {
  const result = await processPrompt(
    language,
    'ga-generation',
    'GA_GENERATION_PROMPT',
    { zh: GA_GENERATION_PROMPT, en: GA_GENERATION_PROMPT_EN, tr: GA_GENERATION_PROMPT_TR },
    { text },
    projectId
  );
  return result;
}
