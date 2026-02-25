# 设计文档 - 为您推荐模块完善

## 概述

本设计文档描述了"为您推荐"模块的促销标签优先级显示功能的技术实现方案。该功能通过在车辆卡片上显示不同优先级的促销标签（围观人数、多人意向、周转快），帮助买家快速识别热门和优质车辆。

设计的核心目标是：
1. 实现基于数据驱动的促销标签优先级算法
2. 确保车辆数据的完整性和一致性
3. 提供清晰的视觉反馈
4. 保持现有功能的稳定性

## 架构

### 系统组件

```
┌─────────────────────────────────────────────────────────┐
│                    推荐页面 (RecommendationPage)          │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │          车辆卡片 (CarCard)                      │    │
│  │                                                   │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │   促销标签计算逻辑                        │   │    │
│  │  │   getPromotionTag()                      │   │    │
│  │  │   - 检查 viewUV ≥ 100                    │   │    │
│  │  │   - 检查 bidderCount > 3                 │   │    │
│  │  │   - 检查 turnoverScore > 70              │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │   促销标签渲染                            │   │    │
│  │  │   - 围观人数 (红色)                       │   │    │
│  │  │   - 多人意向 (橙色)                       │   │    │
│  │  │   - 周转快 (绿色)                         │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            │
                            │ 车辆数据
                            ▼
┌─────────────────────────────────────────────────────────┐
│           推荐引擎 (recommendationEngine.js)              │
│                                                           │
│  - mockCars 数据数组                                      │
│  - 包含 viewUV, bidderCount, turnoverScore 字段          │
│  - getRecommendations() 函数                             │
│  - getSimilarCars() 函数                                 │
└─────────────────────────────────────────────────────────┘
```

### 数据流

1. **推荐引擎** 生成包含完整字段的车辆数据
2. **车辆卡片** 接收车辆数据作为 props
3. **促销标签计算逻辑** 根据优先级规则计算应显示的标签
4. **促销标签渲染** 根据计算结果显示相应的标签样式

## 组件和接口

### CarCard 组件

**文件路径**: `src/components/CarRecommendation/CarCard.jsx`

**Props 接口**:
```javascript
{
  car: {
    id: number,
    name: string,
    brand: string,
    year: number,
    price: number,
    mileage: number,
    location: string,
    viewUV: number,        // 浏览人数
    bidderCount: number,   // 出价人数
    turnoverScore: number, // 周转分
    status: string,        // 'active' | 'ended' | 'removed'
    // ... 其他字段
  },
  onLike: function,
  onView: function,
  onVehicleClick: function,
  isLiked: boolean
}
```

**核心方法**:

```javascript
// 计算促销标签
const getPromotionTag = () => {
  const viewUV = car.viewUV || 0;
  const bidderCount = car.bidderCount || 0;
  const turnoverScore = car.turnoverScore || 0;
  
  // 优先级1: 围观人数（浏览UV ≥ 100）
  if (viewUV >= 100) {
    return { text: '围观人数', color: 'bg-red-500' };
  }
  
  // 优先级2: 多人意向（出价人数 > 3）
  if (bidderCount > 3) {
    return { text: '多人意向', color: 'bg-orange-500' };
  }
  
  // 优先级3: 快速周转（周转分 > 70）
  if (turnoverScore > 70) {
    return { text: '周转快', color: 'bg-green-500' };
  }
  
  // 不满足任何条件，返回 null
  return null;
};
```

**渲染逻辑**:
```jsx
const promotionTag = getPromotionTag();

// 在互动数据区域显示
{car.viewUV && (
  <div className="flex gap-3 mb-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
    <span>{car.viewUV}人围观</span>
    {car.bidderCount > 0 && <span>{car.bidderCount}人出价</span>}
    {promotionTag && (
      <span className={`px-2 py-0.5 ${promotionTag.color} text-white rounded`}>
        {promotionTag.text}
      </span>
    )}
  </div>
)}
```

### 推荐引擎模块

**文件路径**: `src/components/CarRecommendation/recommendationEngine.js`

**数据结构更新**:

现有的 `mockCars` 数组已经包含了必要的字段：
- `viewUV`: 浏览人数
- `bidderCount`: 出价人数
- `turnoverScore`: 周转分

需要确保所有车辆数据都包含这些字段，并且值在合理范围内：
- `viewUV`: 0-500
- `bidderCount`: 0-20
- `turnoverScore`: 50-100

## 数据模型

### 车辆数据模型

```javascript
{
  id: number,                    // 车辆ID
  name: string,                  // 车辆名称
  brand: string,                 // 品牌
  year: number,                  // 年份
  price: number,                 // 当前价格
  mileage: number,               // 里程
  location: string,              // 所在地
  views: number,                 // 浏览次数
  viewUV: number,                // 浏览人数 (必需)
  bidCount: number,              // 出价次数
  bidderCount: number,           // 出价人数 (必需)
  turnoverScore: number,         // 周转分 (必需)
  transferCount: number,         // 过户次数
  endTime: string,               // 结束时间 (ISO格式)
  image: string,                 // 图片URL
  status: string,                // 状态: 'active' | 'ended' | 'removed'
  tags: string[],                // 标签数组
  recommendReason: string        // 推荐理由
}
```

### 促销标签模型

```javascript
{
  text: string,    // 标签文本: '围观人数' | '多人意向' | '周转快'
  color: string    // Tailwind CSS 类名: 'bg-red-500' | 'bg-orange-500' | 'bg-green-500'
}
```


## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 促销标签优先级正确性

*对于任何* 车辆对象，getPromotionTag() 函数应该根据以下优先级规则返回正确的标签：
- 当 viewUV ≥ 100 时，返回 { text: '围观人数', color: 'bg-red-500' }
- 当 viewUV < 100 且 bidderCount > 3 时，返回 { text: '多人意向', color: 'bg-orange-500' }
- 当 viewUV < 100 且 bidderCount ≤ 3 且 turnoverScore > 70 时，返回 { text: '周转快', color: 'bg-green-500' }
- 当不满足任何条件时，返回 null

**验证需求: 1.1, 1.2, 1.3, 1.4**

### 属性 2: 单一标签不变量

*对于任何* 车辆对象，getPromotionTag() 函数应该返回 null 或单个标签对象，永远不会返回多个标签或数组。

**验证需求: 1.5**

### 属性 3: 标签颜色映射正确性

*对于任何* 由 getPromotionTag() 返回的非 null 标签对象，其 color 属性应该与 text 属性正确对应：
- '围观人数' → 'bg-red-500'
- '多人意向' → 'bg-orange-500'
- '周转快' → 'bg-green-500'

**验证需求: 2.1, 2.2, 2.3**

### 属性 4: 车辆数据字段完整性

*对于所有* mockCars 数组中的车辆对象，每个对象都应该包含 viewUV、bidderCount 和 turnoverScore 字段。

**验证需求: 3.1, 3.2, 3.3**

### 属性 5: 车辆数据范围有效性

*对于所有* mockCars 数组中的车辆对象：
- viewUV 应该在 [0, 500] 范围内
- bidderCount 应该在 [0, 20] 范围内
- turnoverScore 应该在 [50, 100] 范围内

**验证需求: 3.4, 3.5, 3.6**

### 属性 6: 缺失字段默认值处理

*对于任何* 缺少 viewUV、bidderCount 或 turnoverScore 字段的车辆对象，getPromotionTag() 函数应该将缺失字段视为 0，并基于此计算标签。

**验证需求: 5.2, 5.3, 5.4**

### 属性 7: 标签计算使用正确数据源

*对于任何* 车辆对象，getPromotionTag() 函数应该使用该对象的 viewUV、bidderCount 和 turnoverScore 字段进行计算，而不是使用其他数据源。

**验证需求: 5.1**

## 错误处理

### 数据缺失处理

当车辆数据缺少必要字段时，系统应该使用安全的默认值：

```javascript
const viewUV = car.viewUV || 0;
const bidderCount = car.bidderCount || 0;
const turnoverScore = car.turnoverScore || 0;
```

这确保了即使数据不完整，促销标签计算逻辑也不会崩溃。

### 车辆状态异常处理

现有的车辆状态异常处理逻辑已经实现：

```javascript
// 检查车辆状态
if (car.status === 'removed') {
  alert('该车辆已下架，请刷新页面');
  return;
}
if (car.status === 'ended') {
  alert('该车辆竞价已结束，请刷新页面');
  return;
}
```

这个逻辑应该保持不变，确保用户在点击无效车辆时收到明确的反馈。

### 边界值处理

促销标签的阈值判断使用严格的比较运算符：
- `viewUV >= 100` (包含边界值)
- `bidderCount > 3` (不包含边界值)
- `turnoverScore > 70` (不包含边界值)

这确保了边界值的处理是明确和一致的。

## 测试策略

### 双重测试方法

本功能将采用单元测试和基于属性的测试相结合的方法：

**单元测试**:
- 测试特定的示例场景
- 测试边界值情况（viewUV = 100, bidderCount = 3, turnoverScore = 70）
- 测试车辆状态异常处理的具体情况
- 测试UI渲染的特定示例

**基于属性的测试**:
- 验证促销标签优先级规则对所有可能输入的正确性
- 验证数据完整性和范围有效性
- 验证缺失字段的默认值处理
- 每个属性测试运行至少100次迭代

### 测试库选择

由于项目使用 React 和 JavaScript，推荐使用以下测试库：
- **Jest**: 单元测试框架
- **React Testing Library**: React 组件测试
- **fast-check**: JavaScript 的基于属性的测试库

### 属性测试配置

每个基于属性的测试应该：
1. 运行至少 100 次迭代
2. 使用注释标记引用的设计属性
3. 标记格式: `// Feature: recommendation-module-enhancement, Property {number}: {property_text}`

### 测试覆盖范围

**促销标签计算逻辑**:
- 属性测试: 属性1（优先级正确性）、属性2（单一标签）、属性3（颜色映射）
- 单元测试: 边界值、特定示例

**数据完整性**:
- 属性测试: 属性4（字段完整性）、属性5（范围有效性）
- 单元测试: 检查 mockCars 数组

**错误处理**:
- 属性测试: 属性6（缺失字段处理）
- 单元测试: 车辆状态异常处理的具体场景

**UI渲染**:
- 单元测试: 标签显示位置、样式类名、文本内容

### 测试数据生成

对于基于属性的测试，应该生成以下类型的随机数据：

```javascript
// 车辆对象生成器
const arbitraryVehicle = fc.record({
  id: fc.integer({ min: 1, max: 1000 }),
  viewUV: fc.integer({ min: 0, max: 500 }),
  bidderCount: fc.integer({ min: 0, max: 20 }),
  turnoverScore: fc.integer({ min: 50, max: 100 }),
  // ... 其他字段
});

// 缺失字段的车辆对象生成器
const arbitraryVehicleWithMissingFields = fc.record({
  id: fc.integer({ min: 1, max: 1000 }),
  viewUV: fc.option(fc.integer({ min: 0, max: 500 }), { nil: undefined }),
  bidderCount: fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
  turnoverScore: fc.option(fc.integer({ min: 50, max: 100 }), { nil: undefined }),
  // ... 其他字段
});
```

## 实现注意事项

### 向后兼容性

现有的 CarCard 组件已经有一个 `getPromotionTag()` 函数，但它只检查 `turnoverScore > 70`。新的实现需要：
1. 替换现有的 `getPromotionTag()` 函数
2. 保持函数签名不变（无参数，返回标签对象或 null）
3. 确保其他组件功能不受影响

### 性能考虑

`getPromotionTag()` 函数在每次组件渲染时都会被调用。由于它只包含简单的条件判断，性能影响可以忽略不计。如果未来需要优化，可以考虑使用 `useMemo` hook。

### 数据一致性

推荐引擎（`recommendationEngine.js`）中的 `mockCars` 数组已经包含了所有必要的字段。需要验证：
1. 所有12个车辆对象都有 viewUV、bidderCount、turnoverScore 字段
2. 这些字段的值在指定范围内
3. 如果发现不符合要求的数据，需要更新

### 样式一致性

促销标签使用 Tailwind CSS 类：
- `bg-red-500`: 红色背景（围观人数）
- `bg-orange-500`: 橙色背景（多人意向）
- `bg-green-500`: 绿色背景（周转快）
- `text-white`: 白色文字
- `px-2 py-0.5 rounded`: 内边距和圆角

这些样式应该与现有的设计系统保持一致。

