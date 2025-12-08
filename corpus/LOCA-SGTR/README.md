# LOCA/SGTR事故数据集

## 数据来源

**论文标题**: Machine learning-based approach for identification of Loss of Coolant Accident (LOCA) and Steam Generator Tube Rupture (SGTR)

**来源**: ScienceDirect (Nuclear Engineering and Design)

**DOI链接**: https://www.sciencedirect.com/science/article/abs/pii/S014919702200138X

## 数据说明

该数据集包含冷却剂丧失事故（LOCA）和蒸汽发生器管道破裂事故（SGTR）的仿真数据。

### 事故类型说明

#### LOCA (Loss of Coolant Accident) - 冷却剂丧失事故
- 一回路管道破裂导致冷却剂泄漏
- 根据破口大小分为：大破口LOCA、中破口LOCA、小破口LOCA
- 是核电厂最重要的设计基准事故之一

#### SGTR (Steam Generator Tube Rupture) - 蒸汽发生器传热管破裂
- 蒸汽发生器传热管破损
- 导致一回路放射性物质泄漏至二回路
- 可能造成放射性向环境释放

## 获取方式

由于该数据来自付费期刊论文，有以下获取方式：

1. **联系论文作者**：通过论文通讯作者邮箱请求数据共享
2. **论文补充材料**：检查论文的Supporting Information部分
3. **机构数据库**：通过学术机构VPN访问Elsevier获取附件
4. **预印本版本**：搜索arXiv或ResearchGate查找预印本及附带数据

## 替代数据源

如需类似的LOCA/SGTR数据，可考虑：

| 来源 | 说明 |
|------|------|
| **NPPAD** | 本仓库中的NPPAD数据集包含LOCA相关工况 |
| **PCTRAN模拟器** | 可自行生成LOCA/SGTR模拟数据 |
| **RELAP5** | 开源热工水力分析代码 |
| **NRC NUREG报告** | 美国核管会公开的事故分析报告 |
| **IAEA TECDOC** | IAEA技术文档中的参考案例 |

## 数据格式预期

该数据集预期包含：
- 反应堆冷却剂系统参数时序数据
- 蒸汽发生器参数（压力、水位、温度）
- 事故诊断标签（LOCA/SGTR/正常运行）
- 事故不同阶段的特征参数

## NPPAD中的相关数据

本仓库的NPPAD数据集包含以下与LOCA相关的工况：
- Large LOCA (大破口LOCA)
- Medium LOCA (中破口LOCA) 
- Small LOCA (小破口LOCA)

可直接使用NPPAD数据进行LOCA相关的机器学习研究。

---
*创建时间: 2025年12月*
