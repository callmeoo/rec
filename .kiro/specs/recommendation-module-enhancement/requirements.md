# 需求文档 - 为您推荐模块完善

## 介绍

本需求文档定义了"为您推荐"模块的功能完善需求。主要包括客户端推荐页面的促销标签优先级显示功能，以及确保所有必要的数据字段完整性。该模块旨在通过显示不同优先级的促销标签来提升用户对热门车辆的关注度，从而提高平台的转化率。

## 术语表

- **推荐系统 (Recommendation_System)**: 为用户生成个性化车辆推荐的系统
- **车辆卡片 (Vehicle_Card)**: 在推荐页面展示单个车辆信息的UI组件
- **促销标签 (Promotion_Tag)**: 显示在车辆卡片上的特殊标识，用于突出车辆的热门程度或特性
- **围观人数标签 (Hot_Viewing_Tag)**: 当浏览UV ≥ 100时显示的促销标签
- **多人意向标签 (Multiple_Bidders_Tag)**: 当出价人数 > 3时显示的促销标签
- **快速周转标签 (Fast_Turnover_Tag)**: 当周转分 > 70时显示的促销标签
- **浏览UV (View_UV)**: 浏览该车辆的独立用户数量
- **出价人数 (Bidder_Count)**: 对该车辆出价的独立用户数量
- **周转分 (Turnover_Score)**: 衡量车辆周转速度的综合评分（0-100分）
- **推荐引擎 (Recommendation_Engine)**: 生成推荐数据和模拟数据的后端模块

## 需求

### 需求 1: 促销标签优先级显示

**用户故事**: 作为买家，我想在浏览推荐车辆时看到最重要的促销标签，以便快速识别热门和优质车辆。

#### 验收标准

1. WHEN 车辆的浏览UV ≥ 100，THEN THE 车辆卡片 SHALL 显示"围观人数"标签
2. WHEN 车辆的浏览UV < 100 AND 出价人数 > 3，THEN THE 车辆卡片 SHALL 显示"多人意向"标签
3. WHEN 车辆的浏览UV < 100 AND 出价人数 ≤ 3 AND 周转分 > 70，THEN THE 车辆卡片 SHALL 显示"周转快"标签
4. WHEN 车辆不满足任何促销标签条件，THEN THE 车辆卡片 SHALL NOT 显示促销标签
5. THE 车辆卡片 SHALL 在任何时刻最多显示一个促销标签

### 需求 2: 促销标签视觉设计

**用户故事**: 作为买家，我想通过不同的视觉样式区分不同类型的促销标签，以便理解标签的含义。

#### 验收标准

1. WHEN 显示"围观人数"标签，THEN THE 车辆卡片 SHALL 使用红色背景样式
2. WHEN 显示"多人意向"标签，THEN THE 车辆卡片 SHALL 使用橙色背景样式
3. WHEN 显示"周转快"标签，THEN THE 车辆卡片 SHALL 使用绿色背景样式
4. THE 促销标签 SHALL 使用白色文字以确保可读性
5. THE 促销标签 SHALL 显示在车辆卡片的互动数据区域

### 需求 3: 车辆数据完整性

**用户故事**: 作为系统管理员，我想确保所有推荐车辆包含完整的数据字段，以便促销标签功能正常运行。

#### 验收标准

1. THE 推荐引擎 SHALL 为每个车辆生成 viewUV 字段（浏览人数）
2. THE 推荐引擎 SHALL 为每个车辆生成 bidderCount 字段（出价人数）
3. THE 推荐引擎 SHALL 为每个车辆生成 turnoverScore 字段（周转分）
4. WHEN 生成 viewUV 值，THE 推荐引擎 SHALL 生成范围在 0 到 500 之间的整数
5. WHEN 生成 bidderCount 值，THE 推荐引擎 SHALL 生成范围在 0 到 20 之间的整数
6. WHEN 生成 turnoverScore 值，THE 推荐引擎 SHALL 生成范围在 50 到 100 之间的整数

### 需求 4: 车辆状态异常处理（确认现有实现）

**用户故事**: 作为买家，我想在点击已下架或已结束的车辆时收到明确提示，以便了解车辆的当前状态。

#### 验收标准

1. WHEN 用户点击状态为 "removed" 的车辆，THEN THE 推荐系统 SHALL 显示"该车辆已下架，请刷新页面"提示
2. WHEN 用户点击状态为 "ended" 的车辆，THEN THE 推荐系统 SHALL 显示"该车辆竞价已结束，请刷新页面"提示
3. WHEN 用户点击状态为 "active" 的车辆，THEN THE 推荐系统 SHALL 导航到车辆详情页
4. THE 推荐系统 SHALL 在显示提示后阻止导航到详情页

### 需求 5: 促销标签数据一致性

**用户故事**: 作为开发人员，我想确保促销标签的显示逻辑与数据字段保持一致，以便避免显示错误的标签。

#### 验收标准

1. WHEN 计算促销标签优先级，THE 车辆卡片 SHALL 使用当前车辆对象的 viewUV、bidderCount 和 turnoverScore 字段
2. WHEN 车辆数据缺少 viewUV 字段，THEN THE 车辆卡片 SHALL 将其视为 0
3. WHEN 车辆数据缺少 bidderCount 字段，THEN THE 车辆卡片 SHALL 将其视为 0
4. WHEN 车辆数据缺少 turnoverScore 字段，THEN THE 车辆卡片 SHALL 将其视为 0
5. THE 车辆卡片 SHALL 在每次渲染时重新计算促销标签

