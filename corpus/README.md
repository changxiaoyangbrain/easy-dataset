# 核应急领域数据集语料库

> 创建时间: 2025年12月
> 用途: NuCorpus项目 - 核应急领域大模型微调数据集构建

---

## 数据集概览

| 数据集 | 状态 | 大小 | 说明 |
|-------|------|------|------|
| **NPPAD** | ✅ 已下载 | ~16GB | 核电厂事故时序数据集 |
| **MELCOR** | ⏳ 待获取 | - | 福岛事故MELCOR模拟数据 |
| **LOCA-SGTR** | ⏳ 待获取 | - | LOCA/SGTR事故仿真数据 |

---

## 1. NPPAD - 核电厂事故数据集

### 来源
- **论文**: An open time-series simulated dataset covering various accidents for nuclear power plants
- **发表**: Nature Scientific Data (2022)
- **GitHub**: https://github.com/thu-inet/NuclearPowerPlantAccidentData

### 数据内容

```
NPPAD/
├── NPPAD/           # 主数据目录（MDB格式）
│   ├── LOCA/        # 冷却剂丧失事故
│   ├── SGATR/       # 蒸汽发生器传热管破裂A
│   ├── SGBTR/       # 蒸汽发生器传热管破裂B
│   ├── FLB/         # 给水管道破裂
│   ├── LR/          # 甩负荷
│   ├── ATWS/        # 预期瞬态未能紧急停堆
│   └── ...          # 更多事故类型
├── Operation_csv_data/   # CSV格式运行参数
├── Dose_csv_data/        # CSV格式剂量数据
├── Data Processing.py    # 数据处理脚本
└── README.md             # 原始说明文档
```

### 事故类型说明

| 缩写 | 全称 | 中文 |
|------|------|------|
| LOCA | Loss of Coolant Accident | 冷却剂丧失事故 |
| LOCAC | LOCA with Core Damage | 带堆芯损伤的LOCA |
| SGATR | Steam Generator A Tube Rupture | 蒸发器A管破裂 |
| SGBTR | Steam Generator B Tube Rupture | 蒸发器B管破裂 |
| FLB | Feedwater Line Break | 给水管破裂 |
| LLB | Large LOCA Break | 大破口LOCA |
| LR | Load Rejection | 甩负荷 |
| ATWS | Anticipated Transient Without Scram | 预期瞬态未能紧急停堆 |
| MD | Main Steam Line Break | 主蒸汽管道破裂 |
| SLBIC | Steam Line Break Inside Containment | 安全壳内蒸汽管破裂 |
| SLBOC | Steam Line Break Outside Containment | 安全壳外蒸汽管破裂 |

### 使用方式

```python
# 安装依赖
pip install -r requirements.txt

# 运行数据处理脚本
python "Data Processing.py"
```

---

## 2. MELCOR模拟数据

**状态**: ⏳ 需要从论文作者处获取

详见 `MELCOR/README.md`

---

## 3. LOCA/SGTR事故数据

**状态**: ⏳ 需要从论文作者处获取

详见 `LOCA-SGTR/README.md`

**注意**: NPPAD数据集已包含LOCA和SGTR相关工况，可直接使用。

---

## 与NuCorpus集成

这些数据集可通过以下方式用于NuCorpus数据集构建：

1. **直接使用CSV数据**: 将`Operation_csv_data`中的CSV文件导入NuCorpus
2. **生成描述文档**: 基于事故数据生成文字描述，再用于问答对生成
3. **构建事故诊断数据集**: 基于时序数据构建"现象→诊断"问答对

---

## 版权说明

- NPPAD: MIT License - 可自由使用
- MELCOR/LOCA-SGTR: 需遵循论文版权要求

---

*本语料库为NuCorpus项目的一部分*
