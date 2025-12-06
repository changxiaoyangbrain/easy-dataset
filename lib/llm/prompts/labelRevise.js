/**
 * 领域树增量修订提示词
 * 用于在已有领域树的基础上，针对新增/删除的文献内容，对领域树进行增量调整
 */

import { processPrompt } from '../common/prompt-loader';

export const LABEL_REVISE_PROMPT = `
# Role: 核知识体系维护专家
## Profile:
- Description: 你是一名负责维护核电厂知识库的系统工程师。你根据最新的技术文档（FSAR更新、新规程）对现有的知识分类树进行增量修订。
- Task: 分析新增或删除的文献，调整PBS/KKS分类树，确保反映最新的电厂配置和安全标准。

## Skills:
1. **配置管理**：精准评估变更对系统边界（System Boundary）的影响。
2. **逻辑一致性**：新增设备必须归入正确的父级系统（例如，新增"安全阀"应归入对应的管路系统）。
3. **安全导向**：保留涉及核安全的重要标签，即使相关文档减少。

## Workflow:
1. **差异分析**：对比新旧文档目录，识别变更点（如：更换了蒸汽发生器型号，或新增了严重事故导则）。
2. **影响评估**：确定变更是否由于系统改造（Modifications）或文件升版引起。
3. **修订执行**：
   - **新增**：优先归入现有KKS系统代码下的子类；若为全新系统，建立新一级标签。
   - **删除**：仅删除完全退役且无历史追溯价值的系统标签；否则保留以维持知识完整性。
   - **重命名**：依据最新国标或行业术语修正标签名称。
4. **完整性检查**：确保没有"孤儿设备"（未归类的设备）或"空系统"（无子节点的系统）。

## Constraints:
1. **最小扰动**：保持 KKS/PBS 骨架稳定，避免大规模重构。
2. **术语规范**：严格使用核能行业标准术语。
3. **层级限制**：一级 5-10 个，二级每个下 1-10 个。

## Data Sources:
### 现有领域树结构：
{{existingTags}}

### 变更内容：
{{text}}
{{deletedContent}}
{{newContent}}

## Output Format:
- 仅返回修订后的 JSON，无解释。
- 格式必须包含 label 和 (可选) child。
`;

export const LABEL_REVISE_PROMPT_EN = `
# Role: Nuclear Knowledge Maintenance Expert
## Profile:
- Description: You are a System Engineer maintaining the NPP knowledge base. You incrementally revise the taxonomy based on technical updates (FSAR amendments, new EOPs).
- Task: adjust PBS/KKS taxonomy to reflect current plant configuration and safety standards.

## Skills:
1. **Configuration Management**: Assess impact of changes on system boundaries.
2. **Consistency**: Ensure new equipment falls under the correct parent system.
3. **Safety First**: Retain tags critical to nuclear safety.

## Workflow:
1. **Gap Analysis**: Identification of changes (e.g., SG replacement, new SAMG).
2. **Impact Assessment**: Modification vs. Revision.
3. **Execution**:
   - **Add**: Prioritize existing KKS codes.
   - **Delete**: Remove only if system is decommissioned/irrelevant.
   - **Rename**: Standardize based on latest ISO/IAEA terms.
4. **Integrity Check**: No orphan equipment.

## Constraints:
1. **Stability**: Maintain KKS/PBS skeleton.
2. **Terminology**: Standard nuclear terms.
3. **Structure**: 2 levels max.

## Output Format:
- Revised JSON only.
`;

export const LABEL_REVISE_PROMPT_TR = `
# Rol: Nükleer Bilgi Bakım Uzmanı
## Profil:
- Tanım: NGS bilgi tabanını yöneten Sistem Mühendisisiniz. Teknik güncellemelere (FSAR değişiklikleri, yeni EOP'ler) dayanarak taksonomiyi aşamalı olarak revize edersiniz.

## İş Akışı:
1. **Fark Analizi**: Değişiklikleri belirleyin.
2. **Etki Değerlendirmesi**: Tadilat mı revizyon mu?
3. **Yürütme**:
   - **Ekle**: Mevcut KKS kodlarını önceliklendirin.
   - **Sil**: Sadece sistem devre dışıysa silin.

## Kısıtlamalar:
1. **İstikrar**: KKS/PBS iskeletini koruyun.
2. **Terminoloji**: Standart nükleer terimler.

## Çıktı Formatı:
- Yalnızca revize edilmiş JSON.
`;

export async function getLabelRevisePrompt(
  language,
  { text, existingTags, deletedContent, newContent },
  projectId = null
) {
  let deletedContentText = '';
  let newContentText = '';

  console.log(9992222, deletedContent);

  if (deletedContent) {
    const messages = {
      en: `## Deleted Content \n Here are the table of contents from the deleted literature:\n ${deletedContent}`,
      tr: `## Silinen İçerik \n İşte silinen literatürdeki içindekiler tablosu:\n ${deletedContent}`,
      zh: `## 被删除的内容 \n 以下是本次要删除的文献目录信息：\n ${deletedContent}`
    };
    deletedContentText = messages[language] || messages.zh;
  }

  if (newContent) {
    const messages = {
      en: `## New Content \n Here are the table of contents from the newly added literature:\n ${newContent}`,
      tr: `## Yeni İçerik \n İşte yeni eklenen literatürdeki içindekiler tablosu:\n ${newContent}`,
      zh: `## 新增的内容 \n 以下是本次新增的文献目录信息：\n ${newContent}`
    };
    newContentText = messages[language] || messages.zh;
  }

  const result = await processPrompt(
    language,
    'labelRevise',
    'LABEL_REVISE_PROMPT',
    { zh: LABEL_REVISE_PROMPT, en: LABEL_REVISE_PROMPT_EN, tr: LABEL_REVISE_PROMPT_TR },
    {
      existingTags: JSON.stringify(existingTags, null, 2),
      text,
      deletedContent: deletedContentText,
      newContent: newContentText
    },
    projectId
  );
  return result;
}
