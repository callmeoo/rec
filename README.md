# 二手车拍卖平台 - 为您推荐模块

基于React + Vite构建的B2B二手车拍卖平台推荐系统，包含客户端个性化推荐和管理后台验证功能。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173/
```

## 📋 功能模块

### 1. 客户端 - 为您推荐
- ✅ 个性化车辆推荐展示
- ✅ 促销标签优先级显示（围观人数 > 多人意向 > 快速周转）
- ✅ 完整的车辆信息展示
- ✅ 车辆状态异常处理
- ✅ 筛选功能（价格、品牌、车龄、里程）
- ✅ 换一批功能

### 2. 管理后台 - 推荐算法验证
- ✅ 买家ID搜索
- ✅ 固定展示30条推荐车源
- ✅ 完整的推荐数据列表
- ✅ 推荐逻辑标注（画像匹配/候选车源/兜底）

### 3. 管理后台 - 平台周转排行
- ✅ 全平台统计数据概览
- ✅ 车系维度排行榜
- ✅ 车型维度展开
- ✅ 周转分颜色标识

## 📖 文档

- [功能说明文档](./为您推荐模块说明.md) - 完整的功能说明和技术实现
- [演示指南](./演示指南.md) - 详细的演示步骤和测试数据
- [PRD实现对照表](./PRD实现对照表.md) - 逐条对照PRD验证实现情况
- [API接口文档](./API接口文档.md) - 后端API接口定义和对接指南
- [项目交付总结](./项目交付总结.md) - 完整的交付总结

## 🎯 测试数据

- **买家ID**: B001, B002, B003
- **车辆数量**: 12辆模拟车辆
- **车系数量**: 10个车系排行

## 🛠️ 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide React (图标库)

## 📂 项目结构

```
src/
├── components/
│   ├── CarRecommendation/          # 客户端推荐模块
│   │   ├── RecommendationPage.jsx  # 推荐页面
│   │   ├── CarCard.jsx             # 车辆卡片
│   │   ├── FilterPanel.jsx         # 筛选面板
│   │   └── recommendationEngine.js # 推荐引擎
│   └── Admin/                      # 管理后台模块
│       ├── BuyerRecommendationVerify.jsx  # 算法验证
│       └── TurnoverRanking.jsx            # 周转排行
```

## 📊 完成度

- **总体完成度**: 95.8% (23/24功能)
- **PRD符合度**: 97.5%

## 🔧 后续工作

1. **API对接** - 替换模拟数据为真实API
2. **搜索无结果页集成** - 完成最后一个功能点
3. **实时数据更新** - 实现30秒定时刷新
4. **性能优化** - 图片懒加载、虚拟滚动

## 📞 技术支持

查看详细文档获取更多信息，或联系开发团队。

---

**项目状态**: ✅ 已完成（待API对接）
**最后更新**: 2026-01-28


git init -b main
git add .
git commit -m "First comment"

git remote add origin https://github.com/andi20190206/recommendation.git
git branch -M main
git push -u origin main