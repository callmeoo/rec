# API 接口文档

## 概述

本文档定义了"为您推荐"模块需要对接的后端API接口。当前前端使用模拟数据，生产环境需要实现这些接口。

---

## 基础信息

**Base URL**: `https://api.example.com/v1`

**认证方式**: Bearer Token

**请求头**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**响应格式**: JSON

**通用响应结构**:
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2026-01-28T10:00:00Z"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  },
  "timestamp": "2026-01-28T10:00:00Z"
}
```

---

## 1. 客户端推荐接口

### 1.1 获取推荐列表

**接口**: `GET /recommendations/:buyerId`

**描述**: 获取指定买家的个性化推荐车辆列表

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buyerId | string | 是 | 买家ID |

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| count | number | 否 | 10 | 返回数量 |
| context | string | 否 | client | 调用场景：client/admin |

**请求示例**:
```
GET /recommendations/B001?count=10&context=client
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "V001",
        "name": "奔驰 E300L 2022款",
        "brand": "奔驰",
        "brandId": "BR001",
        "series": "E级",
        "seriesId": "SE001",
        "model": "2022款 豪华版",
        "modelId": "MD001",
        "licensePlate": "京A12345",
        "country": "德国",
        "location": "北京",
        "year": 2022,
        "mileage": 25000,
        "conditionScore": 95,
        "price": 350000,
        "startPrice": 320000,
        "originalPrice": 380000,
        "endTime": "2026-01-28T18:00:00Z",
        "status": "active",
        "auctionStatus": "2小时后结束",
        "views": 1234,
        "viewUV": 156,
        "bidCount": 45,
        "bidderCount": 8,
        "turnoverScore": 85,
        "image": "https://cdn.example.com/vehicles/V001.jpg",
        "images": [
          "https://cdn.example.com/vehicles/V001_1.jpg",
          "https://cdn.example.com/vehicles/V001_2.jpg"
        ],
        "position": 1,
        "candidateSet": 1,
        "recommendReason": "画像匹配-主打车型",
        "matchScore": 95
      }
    ],
    "totalCount": 10,
    "generatedAt": "2026-01-28T10:00:00Z"
  }
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 车辆唯一标识 |
| name | string | 车辆名称 |
| brand | string | 品牌名称 |
| brandId | string | 品牌ID |
| series | string | 车系名称 |
| seriesId | string | 车系ID |
| model | string | 车型名称 |
| modelId | string | 车型ID |
| licensePlate | string | 车牌号 |
| country | string | 国别 |
| location | string | 所在地 |
| year | number | 年份 |
| mileage | number | 表显里程（公里） |
| conditionScore | number | 车况评分（0-100） |
| price | number | 当前价格（元） |
| startPrice | number | 起拍价（元） |
| originalPrice | number | 原价（元，可选） |
| endTime | string | 竞价结束时间（ISO 8601） |
| status | string | 车辆状态：active/ended/removed |
| auctionStatus | string | 拍卖状态描述 |
| views | number | 浏览次数 |
| viewUV | number | 浏览人数（UV） |
| bidCount | number | 出价次数 |
| bidderCount | number | 出价人数 |
| turnoverScore | number | 周转分（0-100） |
| image | string | 主图URL |
| images | array | 图片列表 |
| position | number | 推荐位序号 |
| candidateSet | number | 候选集编号（1/2/3） |
| recommendReason | string | 推荐理由 |
| matchScore | number | 匹配分数（可选） |

**错误码**:
| 错误码 | 说明 |
|--------|------|
| BUYER_NOT_FOUND | 买家不存在 |
| INSUFFICIENT_DATA | 数据不足，无法生成推荐 |

---

### 1.2 获取车辆实时数据

**接口**: `GET /vehicles/interaction-data`

**描述**: 批量获取车辆的实时互动数据（用于30秒刷新）

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| vehicleIds | string | 是 | 车辆ID列表，逗号分隔 |

**请求示例**:
```
GET /vehicles/interaction-data?vehicleIds=V001,V002,V003
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "V001": {
      "viewCount": 1250,
      "viewUV": 160,
      "bidCount": 48,
      "bidderCount": 9,
      "status": "active",
      "countdown": 7200,
      "currentPrice": 355000
    },
    "V002": {
      "viewCount": 1000,
      "viewUV": 100,
      "bidCount": 35,
      "bidderCount": 6,
      "status": "active",
      "countdown": 10800,
      "currentPrice": 325000
    }
  },
  "timestamp": "2026-01-28T10:00:00Z"
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| viewCount | number | 浏览次数 |
| viewUV | number | 浏览人数 |
| bidCount | number | 出价次数 |
| bidderCount | number | 出价人数 |
| status | string | 车辆状态 |
| countdown | number | 剩余秒数 |
| currentPrice | number | 当前价格 |

---

## 2. 管理后台接口

### 2.1 推荐算法验证

**接口**: `GET /admin/recommendations/verify/:buyerId`

**描述**: 获取指定买家的推荐验证数据（固定30条），支持多种查询方式

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| buyerId | string | 是 | 买家ID、姓名或手机号 |

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| searchType | string | 否 | 查询类型：id/name/phone（自动识别） |

**请求示例**:
```
GET /admin/recommendations/verify/B001
GET /admin/recommendations/verify/张三
GET /admin/recommendations/verify/13812345678
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "buyerId": "B001",
    "buyerInfo": {
      "id": "B001",
      "name": "张三",
      "phone": "138****1234",
      "region": "北京"
    },
    "buyerProfile": {
      "countries": [
        { "name": "日系", "percentage": 80 },
        { "name": "德系", "percentage": 15 },
        { "name": "美系", "percentage": 5 }
      ],
      "brands": [
        { "name": "大众", "percentage": 60 },
        { "name": "丰田", "percentage": 20 },
        { "name": "本田", "percentage": 15 },
        { "name": "其他", "percentage": 5 }
      ],
      "series": [
        { "name": "大众迈腾", "percentage": 55 },
        { "name": "丰田凯美瑞", "percentage": 30 },
        { "name": "本田雅阁", "percentage": 10 },
        { "name": "其他", "percentage": 5 }
      ],
      "priceRanges": [
        { "name": "0-3万", "percentage": 35 },
        { "name": "3-5万", "percentage": 28 },
        { "name": "5-8万", "percentage": 20 },
        { "name": "8-15万", "percentage": 12 },
        { "name": "其他", "percentage": 5 }
      ],
      "ageRanges": [
        { "name": "4-6年", "percentage": 61 },
        { "name": "2-4年", "percentage": 25 },
        { "name": "6-8年", "percentage": 10 },
        { "name": "其他", "percentage": 4 }
      ],
      "preferredSeries": ["SE001", "SE002"],
      "priceRange": "30-50万",
      "ageRange": {
        "min": 1,
        "max": 3
      },
      "bidCount": 45,
      "bidVehicleCount": 32,
      "lastBidTime": "2026-01-27T15:30:00Z",
      "confidence": "high"
    },
    "recommendations": [
      {
        "position": 1,
        "vehicle": {
          "id": "V001",
          "brand": "奔驰",
          "series": "E级",
          "model": "2022款 豪华版",
          "plate": "京A12345",
          "country": "德国",
          "location": "北京",
          "mileage": 25000,
          "age": 2,
          "conditionScore": 95,
          "startPrice": 320000,
          "currentPrice": 350000,
          "countdown": "2小时",
          "viewCount": 1234,
          "viewUV": 156,
          "bidCount": 45,
          "bidderCount": 8
        },
        "reason": "画像匹配-主打车型",
        "candidateSet": 1,
        "matchScore": 95
      }
    ]
  }
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| buyerProfile | object | 买家画像数据 |
| countries | array | 主打国别百分比分布 |
| brands | array | 主打品牌百分比分布 |
| series | array | 主打车系百分比分布 |
| priceRanges | array | 主打价位段百分比分布 |
| ageRanges | array | 主打车龄百分比分布 |
| bidCount | number | 出价次数（90天内） |
| bidVehicleCount | number | 出价台次（90天内） |
| preferredSeries | array | 主打车系ID列表 |
| priceRange | string | 偏好价位区间 |
| ageRange | object | 偏好车龄范围 |
| confidence | string | 画像置信度：high/medium/low |
| reason | string | 推荐理由 |
| candidateSet | number | 候选集编号 |
| matchScore | number | 匹配分数 |

---

### 2.2 平台周转排行

**接口**: `GET /admin/turnover-ranking`

**描述**: 获取全平台车型周转分排行

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| seriesId | string | 否 | 车系ID（展开特定车系的车型） |

**请求示例**:
```
GET /admin/turnover-ranking
GET /admin/turnover-ranking?seriesId=SE001
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSeries": 10,
      "maxTurnoverScore": 94.5,
      "avgDealRate": 75.3,
      "avgDealTime": 32.5
    },
    "series": [
      {
        "seriesId": "SE001",
        "seriesName": "奔驰E级",
        "avgDealRate": 85.5,
        "medianDealTime": 24.5,
        "turnoverScore": 88.3,
        "models": [
          {
            "modelId": "MD001",
            "modelName": "奔驰E级 2022款",
            "dealRate": 87.0,
            "medianDealTime": 22.0,
            "turnoverScore": 89.5,
            "activeCount": 15,
            "listingCount": 50,
            "dealCount": 43
          }
        ]
      }
    ]
  }
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| summary | object | 统计概览 |
| totalSeries | number | 车系总数 |
| maxTurnoverScore | number | 最高周转分 |
| avgDealRate | number | 平均成交率 |
| avgDealTime | number | 平均耗时（小时） |
| avgDealRate | number | 平均成交率（%） |
| medianDealTime | number | 成交耗时中位数（小时） |
| turnoverScore | number | 综合周转分 |
| activeCount | number | 当前在拍数量 |
| listingCount | number | 上架总数 |
| dealCount | number | 成交总数 |

---

## 3. 数据看板接口

### 3.1 获取推荐数据概览

**接口**: `GET /admin/dashboard/overview`

**描述**: 获取推荐系统核心指标数据

**查询参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| dateRange | number | 否 | 7 | 日期范围（天）：7/30/90 |

**请求示例**:
```
GET /admin/dashboard/overview?dateRange=7
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalExposure": 125680,
      "totalClicks": 8945,
      "ctr": 7.12,
      "bidRate": 12.5,
      "avgBidAmount": 8.2
    },
    "trend": {
      "dates": ["01-22", "01-23", "01-24", "01-25", "01-26", "01-27", "01-28"],
      "exposure": [15200, 16800, 18500, 17200, 19800, 18900, 19280],
      "clicks": [1080, 1190, 1320, 1220, 1410, 1345, 1380],
      "bids": [135, 148, 165, 152, 176, 168, 171]
    },
    "candidateSetDistribution": [
      { "name": "画像匹配", "value": 45 },
      { "name": "平台周转", "value": 35 },
      { "name": "全站兜底", "value": 20 }
    ],
    "positionPerformance": [
      {
        "position": "1-3位",
        "exposure": 38000,
        "clicks": 3420,
        "ctr": 9.0,
        "bidRate": 15.2
      }
    ],
    "deviceDistribution": [
      {
        "device": "PC端",
        "exposure": 75408,
        "clicks": 5367,
        "ctr": 7.12
      }
    ]
  }
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| totalExposure | number | 总曝光量 |
| totalClicks | number | 总点击量 |
| ctr | number | 点击率（%） |
| bidRate | number | 出价率（%） |
| avgBidAmount | number | 平均出价金额（万元） |
| trend | object | 趋势数据 |
| candidateSetDistribution | array | 候选集命中分布 |
| positionPerformance | array | 推荐位效果分析 |
| deviceDistribution | array | 设备分布 |

**数据来源**: 友盟统计平台

**更新频率**: 非实时数据，有1天延迟

---

### 3.2 友盟埋点事件列表

**已实现的埋点事件**:

| 事件名称 | Event Name | 触发时机 | 数据字段 |
|---------|-----------|---------|---------|
| 推荐模块曝光 | recommendation_exposure | 推荐列表加载完成 | user_id, device_type, car_ids, exposure_count |
| 车辆卡片点击 | car_card_click | 用户点击车辆卡片 | user_id, car_id, car_brand, car_model, position, candidate_set, device_type |
| 页面浏览 | page_view | 页面加载/刷新 | page_name, device_type, is_logged_in |
| 出价行为 | bid_action | 用户出价 | user_id, car_id, bid_amount, position, candidate_set |
| 筛选器使用 | filter_usage | 使用筛选功能 | user_id, filters |

**埋点实现位置**:
- `src/utils/umengTracking.js` - 埋点工具函数
- `src/components/CarRecommendation/RecommendationPage.jsx` - PC端埋点
- `src/components/CarRecommendation/MobileRecommendationPage.jsx` - 移动端埋点
- `src/components/CarRecommendation/CarCard.jsx` - 车辆卡片埋点

**友盟配置**:
```javascript
// 友盟AppKey配置
const UMENG_APP_KEY = 'YOUR_UMENG_APP_KEY';

// 初始化友盟
import { initUmeng } from './utils/umengTracking';
initUmeng();
```

**数据查看**:
- 开发环境：浏览器控制台（Console）
- 生产环境：友盟统计后台 + 系统数据看板

详细说明请参考：`友盟埋点集成说明.md`

---

## 4. 推荐算法接口（内部）

### 4.1 买家画像提取

**接口**: `POST /internal/buyer-profile/extract`

**描述**: 提取买家画像（内部接口，供推荐引擎调用）

**请求体**:
```json
{
  "buyerId": "B001",
  "days": 90
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "buyerId": "B001",
    "preferredSeries": ["SE001", "SE002", "SE003"],
    "priceRange": "30-50万",
    "ageRange": {
      "min": 1,
      "max": 5
    },
    "bidCount": 45,
    "lastBidTime": "2026-01-27T15:30:00Z",
    "confidence": "high",
    "extractedAt": "2026-01-28T10:00:00Z"
  }
}
```

---

### 4.2 周转分计算

**接口**: `POST /internal/turnover-score/calculate`

**描述**: 计算车型周转分（内部接口）

**请求体**:
```json
{
  "modelId": "MD001",
  "days": 30
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "modelId": "MD001",
    "modelName": "奔驰E级 2022款",
    "seriesId": "SE001",
    "seriesName": "奔驰E级",
    "listingCount": 50,
    "dealCount": 43,
    "dealRate": 86.0,
    "medianDealTime": 22.5,
    "dealRateScore": 86.0,
    "timeScore": 62.5,
    "turnoverScore": 88.95,
    "calculatedAt": "2026-01-28T10:00:00Z"
  }
}
```

**计算公式**:
```
周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3

其中：
- 成交率评分 = (成交数 / 上架数) × 100
- 耗时评分 = 100 - (成交耗时中位数 / 最大耗时) × 100
```

---

## 5. 数据要求

### 5.1 样本量要求

| 数据类型 | 最小样本量 | 说明 |
|---------|-----------|------|
| 买家画像 | 3条出价记录 | 90天内 |
| 周转分计算 | 上架数≥6 且 成交数≥3 | 30天内 |

### 5.2 数据更新频率

| 数据类型 | 更新频率 | 说明 |
|---------|---------|------|
| 实时互动数据 | 实时 | 浏览、出价数据 |
| 推荐列表 | 按需 | 用户访问时生成 |
| 买家画像 | 30分钟 | 缓存30分钟 |
| 周转分 | 1小时 | 缓存1小时 |

---

## 6. 性能要求

| 接口 | 响应时间 | 并发量 |
|------|---------|--------|
| 获取推荐列表 | <2秒 | 1000 QPS |
| 获取实时数据 | <1秒 | 2000 QPS |
| 推荐算法验证 | <3秒 | 100 QPS |
| 平台周转排行 | <5秒 | 50 QPS |
| 数据看板概览 | <3秒 | 200 QPS |

---

## 7. 错误码

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| SUCCESS | 200 | 成功 |
| BUYER_NOT_FOUND | 404 | 买家不存在 |
| VEHICLE_NOT_FOUND | 404 | 车辆不存在 |
| INSUFFICIENT_DATA | 400 | 数据不足 |
| INVALID_PARAMETER | 400 | 参数错误 |
| UNAUTHORIZED | 401 | 未授权 |
| FORBIDDEN | 403 | 无权限 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务不可用 |

---

## 8. 测试环境

**测试地址**: `https://api-test.example.com/v1`

**测试账号**:
- 买家ID: B001, B002, B003
- Token: `test_token_123456`

**测试数据**:
- 车辆数量: 100+
- 车系数量: 20+
- 买家数量: 50+

---

## 9. 对接步骤

### 步骤1: 环境配置
1. 获取API Base URL
2. 获取认证Token
3. 配置环境变量

### 步骤2: 接口对接
1. 实现认证逻辑
2. 替换模拟数据为API调用
3. 实现错误处理

### 步骤3: 测试验证
1. 单元测试
2. 集成测试
3. 性能测试

### 步骤4: 上线部署
1. 灰度发布
2. 监控告警
3. 数据验证

---

## 10. 代码示例

### 10.1 获取推荐列表

```javascript
// src/services/recommendationService.js

const API_BASE_URL = process.env.VITE_API_BASE_URL;
const API_TOKEN = process.env.VITE_API_TOKEN;

export const getRecommendations = async (buyerId, count = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations/${buyerId}?count=${count}`,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }

    return result.data.recommendations;
  } catch (error) {
    console.error('获取推荐列表失败:', error);
    throw error;
  }
};
```

### 10.2 获取实时数据

```javascript
export const getInteractionData = async (vehicleIds) => {
  try {
    const ids = vehicleIds.join(',');
    const response = await fetch(
      `${API_BASE_URL}/vehicles/interaction-data?vehicleIds=${ids}`,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    console.error('获取实时数据失败:', error);
    throw error;
  }
};
```

---

## 11. 联系方式

**技术支持**: tech-support@example.com
**API文档**: https://docs.example.com/api
**问题反馈**: https://github.com/example/issues

---

**文档版本**: v1.0
**最后更新**: 2026-01-28
