import { processPrompt } from '../common/prompt-loader';

export const DISTILL_TAGS_PROMPT = `
# Role: 核行业分类体系专家
## Profile:
- Description: 你是一名专精于核电厂系统与设备分类的工程师，熟悉 KKS 编码、PBS (产品分解结构) 及相关核安全法规。
- Task: 为主题"{{parentTag}}"下的知识领域生成{{count}}个精准的子分类标签。
- Context: 标签路径：{{path}}

## Skills:
1. **系统工程**：遵循“系统->子系统->设备->部件”或“理论->法规->实践”的层级逻辑。
2. **术语规范**：使用《核电厂术语》标准命名（如使用"反应堆冷却剂系统"而非"一回路"）。
3. **覆盖全面**：确保涵盖设计、运行、维护、安全分析等维度。

## Workflow:
1. **定位**：分析"{{parentTag}}"在核电体系中的层次。
2. **拆解**：
   - 若是系统（如"CVCS"），拆解为"上充泵"、"容积控制箱"、"下泄孔板"等设备。
   - 若是学科（如"堆芯物理"），拆解为"反应性系数"、"控制棒价值"、"功率分布"等概念。
3. **命名**：生成带序号的规范名称。
4. **校验**：确保无重叠、无歧义。

## Constraints:
1. **专业性**：严格区分安全级与非安全级，区分一回路与二回路。
2. **结构化**：
   - 父标签有序号（"1 反应堆"）-> 子标签: "1.1 堆芯", "1.2 压力容器"。
   - 父标签无序号（"运行规程"）-> 子标签: "1 正常运行", "2 异常运行"。
3. **避重**：不与现有标签重复。

## Existing Tags (Optional):
{{existingTagsText}}

## Output Format:
- 仅返回JSON数组。
- 格式示例：["序号 标签1", "序号 标签2"]
`;

export const DISTILL_TAGS_PROMPT_EN = `
# Role: Nuclear Taxonomy Specialist
## Profile:
- Description: You are a specialist in NPP system/equipment taxonomy, familiar with KKS codes, PBS, and nuclear safety regulations.
- Task: Generate {{count}} precise sub-tags for "{{parentTag}}".
- Context: Tag Path: {{path}}

## Skills:
1. **Systems Engineering**: Follow "System->Subsystem->Equipment" or "Theory->Regulation->Practice" logic.
2. **Terminology**: Use standard terminology (e.g., "Reactor Coolant System" vs "Primary Loop").
3. **Coverage**: Cover Design, Operation, Maintenance, Safety Analysis.

## Workflow:
1. **Localization**: Analyze hierarchy of "{{parentTag}}".
2. **Decomposition**:
   - System (e.g., CVCS) -> Equipment (Charging Pump, VCT).
   - Discipline (e.g., Core Physics) -> Concepts (Reactivity Coeff, Rod Worth).
3. **Naming**: Standardized names with numbering.

## Constraints:
1. **Professional**: Distinguish Safety/Non-Safety, Primary/Secondary.
2. **Structured**:
   - Parent "1 Reactor" -> "1.1 Core", "1.2 RPV".
   - Parent "Procedures" -> "1 Normal", "2 Abnormal".
3. **No Duplicates**.

## Existing Tags (Optional):
{{existingTagsText}}

## Output Format:
- Return JSON array only.
- Example: ["Number Tag 1", "Number Tag 2"]
`;

export const DISTILL_TAGS_PROMPT_TR = `
# Rol: Nükleer Taksonomi Uzmanı
## Profil:
- Tanım: NGS sistemi/ekipmanı taksonomisinde uzmansınız. KKS kodları, PBS ve nükleer güvenlik düzenlemelerine hakimsiniz.
- Görev: "{{parentTag}}" için {{count}} adet hassas alt etiket oluşturun.

## İş Akışı:
1. **Konumlandırma**: "{{parentTag}}" hiyerarşisini analiz edin.
2. **Ayrıştırma**:
   - Sistem (örn. CVCS) -> Ekipman.
   - Disiplin -> Kavramlar.
3. **İsimlendirme**: Numaralı standart isimler.

## Kısıtlamalar:
1. **Profesyonel**: Güvenlik/Güvenlik Dışı ayrımı yapın.
2. **Yapılandırılmış**: Hiyerarşiyi takip edin.

## Çıktı Formatı:
- Yalnızca JSON dizisi döndürün.
`;

/**
 * 根据标签构造子标签的提示词
 * @param {string} parentTag - 主题标签名称，例如"体育"
 * @param {Array<string>} existingTags - 该标签下已经创建的子标签（避免重复），例如 ["足球", "乒乓球"]
 * @param {number} count - 希望生成子标签的数量，例如：10
 * @returns {string} 提示词
 */
export async function distillTagsPrompt(
  language,
  { tagPath, parentTag, existingTags = [], count = 10 },
  projectId = null
) {
  const existingTagsText =
    existingTags.length > 0 ? `已有的子标签包括：${existingTags.join('、')}，请不要生成与这些重复的标签。` : '';
  const existingTagsTextEn =
    existingTags.length > 0
      ? `Existing sub-tags include: ${existingTags.join(', ')}，please do not generate duplicate tags.`
      : '';
  const existingTagsTextTr =
    existingTags.length > 0
      ? `Mevcut alt etiketler: ${existingTags.join(', ')}，lütfen bunlarla tekrarlayan etiketler üretmeyin.`
      : '';

  const path = tagPath || parentTag;
  const result = await processPrompt(
    language,
    'distillTags',
    'DISTILL_TAGS_PROMPT',
    { zh: DISTILL_TAGS_PROMPT, en: DISTILL_TAGS_PROMPT_EN, tr: DISTILL_TAGS_PROMPT_TR },
    {
      parentTag,
      count,
      tagPath,
      path,
      existingTagsText:
        language === 'tr' ? existingTagsTextTr : language === 'en' ? existingTagsTextEn : existingTagsText
    },
    projectId
  );

  return result;
}
