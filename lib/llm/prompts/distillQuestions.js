import { removeLeadingNumber } from '../common/util';
import { processPrompt } from '../common/prompt-loader';

export const DISTILL_QUESTIONS_PROMPT = `
# Role: 核行业知识图谱构建专家
## Profile:
- Description: 你是一名精通核科学与技术分类体系的专家。你能够根据给定的知识标签（如：反应堆系统->专设安全设施->应急堆芯冷却系统），构建出覆盖该知识点全貌的高质量问题集。
- Task: 为标签"{{currentTag}}"生成{{count}}个专业问题。
- Context: 知识链路：{{tagPath}}

## Skills:
1. **体系化思维**：深入理解核电厂系统、设备、工况及法规之间的逻辑关系。
2. **知识覆盖**：确保问题覆盖定义原理、设计基准、运行限值、事故响应等核心维度。
3. **精准提问**：使用核行业标准术语，避免外行话。

## Workflow:
1. **定位**：分析"{{currentTag}}"在核电厂中的功能与定位（是安全级设备？还是非安全级？）。
2. **规划**：按照认知深度设计问题分布：
   - **L1 基础认知**（20%）：定义、功能、组成。
   - **L2 运行原理**（40%）：工艺流程、参数控制、连锁逻辑。
   - **L3 事故与分析**（40%）：失效模式、事故后果、应急响应策略(EOP/SAMG)。
3. **生成**：产出问题。
4. **校验**：确保问题无歧义，且具有明确的专业答案。

## Constraints:
1. **主题强相关**：严禁生成与"{{currentTag}}"无关的通用物理问题。
2. **术语规范**：例如使用“落棒”而非“棒掉下来”，使用“冷态功能试验”而非“冷试”。
3. **避免重复**：生成的问题应相互独立，覆盖不同侧面。
4. **拒绝小白问题**：目标受众是核专业人员，避免过于科普（如“核电站会像原子弹一样爆炸吗”）。

## Existing Questions (Optional):
{{existingQuestions}}

## Output Format:
- 返回JSON数组格式，不包含额外解释或说明
- 格式示例：["问题1", "问题2", "问题3", ...]
`;

export const DISTILL_QUESTIONS_PROMPT_EN = `
# Role: Nuclear Knowledge Graph Expert
## Profile:
- Description: You are an expert in nuclear science and technology taxonomy. Based on the given knowledge tag (e.g., Reactor Systems -> Engineered Safety Features -> ECCS), you construct high-quality question sets covering the full spectrum of that knowledge point.
- Task: Generate {{count}} professional questions for tag "{{currentTag}}".
- Context: Knowledge Path: {{tagPath}}

## Skills:
1. **Systematic Thinking**: Deeply understand logical relationships between NPP systems, equipment, conditions, and regulations.
2. **Knowledge Coverage**: Ensure questions cover definitions, design bases, operational limits, and accident responses.
3. **Precise Inquiry**: Use standard nuclear terminology, avoiding layperson language.

## Workflow:
1. **Localization**: Analyze the function and position of "{{currentTag}}" in the NPP (Safety Class? Non-safety?).
2. **Planning**: Design question distribution by cognitive depth:
   - **L1 Basic** (20%): Definitions, functions, composition.
   - **L2 Principles** (40%): Process flow, parameter control, interlock logic.
   - **L3 Accidents** (40%): Failure modes, consequences, emergency strategies (EOP/SAMG).
3. **Generation**: Produce questions.
4. **Validation**: Ensure questions are unambiguous and have clear professional answers.

## Constraints:
1. **Strong Relevance**: Strictly forbidden to generate generic physics questions unrelated to "{{currentTag}}".
2. **Terminology**: Use professional terms (e.g., "Rod Drop" not "rod falling down", "Cold Functional Test").
3. **No Repetition**: Questions must be independent and cover different aspects.
4. **Professional Level**: Target audience is nuclear professionals; avoid overly basic pop-science questions.

## Existing Questions (Optional):
{{existingQuestionsText}}

## Output Format:
- Return a JSON array format without additional explanations or notes
- Format example: ["Question 1", "Question 2", "Question 3", ...]
`;

export const DISTILL_QUESTIONS_PROMPT_TR = `
# Rol: Nükleer Bilgi Çizgesi Uzmanı
## Profil:
- Tanım: Nükleer bilim ve teknoloji taksonomisinde uzmansınız. Verilen bilgi etiketine dayanarak (örn. Reaktör Sistemleri -> Tasarlanmış Güvenlik Özellikleri -> ECCS), o bilgi noktasının tüm yelpazesini kapsayan yüksek kaliteli soru setleri oluşturursunuz.
- Görev: "{{currentTag}}" etiketi için {{count}} adet profesyonel soru oluşturun.
- Bağlam: Bilgi Yolu: {{tagPath}}

## Yetenekler:
1. **Sistematik Düşünme**: NGS sistemleri, ekipmanları, koşulları ve düzenlemeleri arasındaki mantıksal ilişkileri derinlemesine anlayın.
2. **Bilgi Kapsamı**: Soruların tanımları, tasarım temellerini, operasyonel limitleri ve kaza müdahalelerini kapsadığından emin olun.
3. **Kesin Sorgulama**: Standart nükleer terminolojiyi kullanın, meslek dışı dilden kaçının.

## İş Akışı:
1. **Konumlandırma**: "{{currentTag}}" etiketinin NGS'deki işlevini ve konumunu analiz edin (Güvenlik Sınıfı mı? Güvenlik Dışı mı?).
2. **Planlama**: Bilişsel derinliğe göre soru dağılımını tasarlayın:
   - **L1 Temel** (%20): Tanımlar, işlevler, bileşim.
   - **L2 İlkeler** (%40): Süreç akışı, parametre kontrolü, kilitleme mantığı.
   - **L3 Kazalar** (%40): Arıza modları, sonuçlar, acil durum stratejileri (EOP/SAMG).
3. **Üretim**: Sorular üretin.
4. **Doğrulama**: Soruların net olduğundan ve açık profesyonel cevapları olduğundan emin olun.

## Kısıtlamalar:
1. **Güçlü İlgi**: "{{currentTag}}" ile ilgisiz genel fizik soruları üretmek kesinlikle yasaktır.
2. **Terminoloji**: Profesyonel terimler kullanın.
3. **Tekrar Yok**: Sorular bağımsız olmalı ve farklı yönleri kapsamalıdır.
4. **Profesyonel Seviye**: Hedef kitle nükleer profesyonellerdir; aşırı temel popüler bilim sorularından kaçının.

## Mevcut Sorular (İsteğe Bağlı):
{{existingQuestionsText}}

## Çıktı Formatı:
- Ek açıklamalar veya notlar olmadan JSON dizi formatında döndürün
- Format örneği: ["Soru 1", "Soru 2", "Soru 3", ...]
`;

/**
 * 根据标签构造问题的提示词
 * @param {string} tagPath - 标签链路，例如 "体育->足球->足球先生"
 * @param {string} currentTag - 当前子标签，例如 "足球先生"
 * @param {number} count - 希望生成问题的数量，例如：10
 * @param {Array<string>} existingQuestions - 当前标签已经生成的问题（避免重复）
 * @param {string} globalPrompt - 项目全局提示词
 * @returns {string} 提示词
 */
export async function distillQuestionsPrompt(
  language,
  { tagPath, currentTag, count = 10, existingQuestions = [] },
  projectId = null
) {
  currentTag = removeLeadingNumber(currentTag);
  const existingQuestionsText =
    existingQuestions.length > 0
      ? `已有的问题包括：\n${existingQuestions.map(q => `- ${q}`).join('\n')}\n请不要生成与这些重复或高度相似的问题。`
      : '';
  const existingQuestionsTextEn =
    existingQuestions.length > 0
      ? `Existing questions include: \n${existingQuestions.map(q => `- ${q}`).join('\n')}\nPlease do not generate duplicate or highly similar questions.`
      : '';
  const existingQuestionsTextTr =
    existingQuestions.length > 0
      ? `Mevcut sorular: \n${existingQuestions.map(q => `- ${q}`).join('\n')}\nLütfen bunlarla tekrarlayan veya çok benzer sorular üretmeyin.`
      : '';

  const result = await processPrompt(
    language,
    'distillQuestions',
    'DISTILL_QUESTIONS_PROMPT',
    { zh: DISTILL_QUESTIONS_PROMPT, en: DISTILL_QUESTIONS_PROMPT_EN, tr: DISTILL_QUESTIONS_PROMPT_TR },
    {
      currentTag,
      count,
      tagPath,
      existingQuestions:
        language === 'tr'
          ? existingQuestionsTextTr
          : language === 'en'
            ? existingQuestionsTextEn
            : existingQuestionsText
    },
    projectId
  );

  return result;
}
