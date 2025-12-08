# MELCOR模拟数据集

## 数据来源

**论文标题**: LSTM-based prediction of accident progress during Fukushima-like severe accident condition

**来源**: ScienceDirect (Nuclear Engineering and Technology)

**DOI链接**: https://www.sciencedirect.com/science/article/pii/S1738573324000378

## 数据说明

该数据集基于福岛事故的MELCOR模拟数据，用于训练LSTM网络预测事故进程。

### 主要内容
- 基于MELCOR代码的严重事故模拟数据
- 福岛核电站类似工况的时序数据
- 用于训练深度学习模型（LSTM）的特征工程数据

## 获取方式

由于该数据来自付费期刊论文，有以下获取方式：

1. **联系论文作者**：通过论文作者邮箱请求数据共享
2. **论文补充材料**：检查论文的Supplementary Materials部分
3. **机构订阅访问**：通过学术机构订阅访问ScienceDirect获取论文全文和附件
4. **ResearchGate请求**：在ResearchGate上向作者发送数据请求

## 替代方案

如需类似的MELCOR模拟数据，可考虑：
- 使用MELCOR软件自行生成模拟数据
- 联系美国桑迪亚国家实验室（Sandia National Laboratories）获取公开的MELCOR验证数据
- 参考NUREG系列报告中的公开模拟结果

## 数据格式预期

该数据集预期包含：
- 时序参数数据（温度、压力、流量等）
- 事故进程标签
- 用于机器学习的训练/测试集划分

---
*创建时间: 2025年12月*
