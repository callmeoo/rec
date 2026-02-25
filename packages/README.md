# 二手车拍卖平台 - Monorepo

这是一个使用pnpm workspace管理的monorepo项目，包含PC端和移动端推荐应用。

## 项目结构

```
car-auction-platform/
├── packages/
│   ├── pc-recommendation/          # PC端推荐应用
│   ├── mobile-recommendation/      # 移动端推荐应用
│   └── shared/                     # 共享代码库
│       ├── components/             # 共享组件
│       ├── utils/                  # 工具函数
│       ├── hooks/                  # 自定义Hooks
│       └── constants/              # 常量定义
├── package.json                    # 根package.json
└── pnpm-workspace.yaml            # workspace配置
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动PC端应用：
```bash
pnpm dev:pc
```

启动移动端应用：
```bash
pnpm dev:mobile
```

同时启动两个应用：
```bash
pnpm dev:all
```

### 构建生产版本

构建PC端：
```bash
pnpm build:pc
```

构建移动端：
```bash
pnpm build:mobile
```

构建所有应用：
```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview:pc    # 预览PC端
pnpm preview:mobile # 预览移动端
```

## 访问地址

- PC端开发服务器：http://localhost:5173
- 移动端开发服务器：http://localhost:5174
- PC端预览：http://localhost:4173
- 移动端预览：http://localhost:4174

## 添加新的共享组件

1. 在 `packages/shared/components/` 目录下创建组件文件
2. 在 `packages/shared/components/index.js` 中导出组件
3. 在PC端或移动端应用中导入使用：

```javascript
import { MyComponent } from '@car-auction/shared/components';
```

## 技术栈

- **构建工具**：Vite 7.x
- **框架**：React 19.x
- **样式**：Tailwind CSS 3.x
- **包管理**：pnpm workspace
- **图标**：lucide-react

## 响应式断点

- 移动端：< 768px
- 平板端：768px - 1024px
- 桌面端：> 1024px
