# 需求文档

## 介绍

本文档定义了将现有二手车拍卖平台项目拆分为独立部署项目并添加响应式设计支持的需求。当前系统将PC端和移动端推荐模块集成在一个单体应用中，通过侧边栏导航切换。本功能将实现项目拆分、响应式设计和独立部署能力，以提高部署灵活性和用户体验。

## 术语表

- **Platform**: 二手车拍卖平台系统
- **PC_Recommendation_App**: PC端推荐应用（独立项目）
- **Mobile_Recommendation_App**: 移动端推荐应用（独立项目）
- **Responsive_Design**: 响应式设计，根据设备屏幕尺寸自动调整布局
- **Deployment_Package**: 部署包，包含可独立部署的构建产物
- **Breakpoint**: 响应式断点，定义不同屏幕尺寸的阈值
- **Viewport**: 视口，浏览器可视区域
- **Build_System**: 构建系统，使用Vite进行项目打包
- **Configuration_File**: 配置文件，用于环境变量和部署设置

## 需求

### 需求 1: 项目拆分

**用户故事:** 作为开发人员，我希望将PC端和移动端推荐模块拆分为独立项目，以便能够独立开发、测试和部署。

#### 验收标准

1. THE Build_System SHALL 为PC_Recommendation_App创建独立的项目结构
2. THE Build_System SHALL 为Mobile_Recommendation_App创建独立的项目结构
3. WHEN 构建PC_Recommendation_App时，THE Build_System SHALL 生成独立的Deployment_Package
4. WHEN 构建Mobile_Recommendation_App时，THE Build_System SHALL 生成独立的Deployment_Package
5. THE PC_Recommendation_App SHALL 包含所有必需的依赖项和配置文件
6. THE Mobile_Recommendation_App SHALL 包含所有必需的依赖项和配置文件
7. THE PC_Recommendation_App SHALL 移除侧边栏导航组件
8. THE Mobile_Recommendation_App SHALL 移除侧边栏导航组件
9. THE PC_Recommendation_App SHALL 保留车辆推荐和详情查看功能
10. THE Mobile_Recommendation_App SHALL 保留车辆推荐和详情查看功能

### 需求 2: 响应式设计实现

**用户故事:** 作为用户，我希望应用能够在不同设备上自动适配显示，以便在任何设备上都能获得良好的浏览体验。

#### 验收标准

1. THE PC_Recommendation_App SHALL 定义移动端（<768px）、平板端（768px-1024px）和桌面端（>1024px）三个Breakpoint
2. THE Mobile_Recommendation_App SHALL 定义移动端（<768px）、平板端（768px-1024px）和桌面端（>1024px）三个Breakpoint
3. WHEN Viewport宽度小于768px时，THE Platform SHALL 应用移动端布局样式
4. WHEN Viewport宽度在768px到1024px之间时，THE Platform SHALL 应用平板端布局样式
5. WHEN Viewport宽度大于1024px时，THE Platform SHALL 应用桌面端布局样式
6. THE Platform SHALL 使用流式布局确保内容在不同屏幕尺寸下正确显示
7. THE Platform SHALL 使用相对单位（rem、em、%、vw、vh）替代固定像素单位
8. WHEN 屏幕尺寸改变时，THE Platform SHALL 在200ms内完成布局调整
9. THE Platform SHALL 确保触摸目标在移动端至少为44x44px
10. THE Platform SHALL 确保文字在移动端最小字号为14px

### 需求 3: 车辆卡片响应式布局

**用户故事:** 作为用户，我希望车辆推荐卡片能够根据屏幕尺寸自动调整排列方式，以便在不同设备上都能清晰查看车辆信息。

#### 验收标准

1. WHEN Viewport宽度小于768px时，THE Platform SHALL 以单列方式显示车辆卡片
2. WHEN Viewport宽度在768px到1024px之间时，THE Platform SHALL 以双列方式显示车辆卡片
3. WHEN Viewport宽度大于1024px时，THE Platform SHALL 以三列或四列方式显示车辆卡片
4. THE Platform SHALL 在车辆卡片之间保持一致的间距
5. THE Platform SHALL 确保车辆图片按比例缩放不变形
6. WHEN 屏幕方向改变时，THE Platform SHALL 重新计算并调整卡片布局
7. THE Platform SHALL 确保卡片内文字在小屏幕上可读

### 需求 4: 车辆详情页响应式设计

**用户故事:** 作为用户，我希望车辆详情页能够在不同设备上自适应显示，以便在任何设备上都能查看完整的车辆信息。

#### 验收标准

1. WHEN Viewport宽度小于768px时，THE Platform SHALL 以垂直堆叠方式显示车辆详情内容
2. WHEN Viewport宽度大于768px时，THE Platform SHALL 以左右分栏方式显示车辆详情内容
3. THE Platform SHALL 确保车辆图片在移动端全宽显示
4. THE Platform SHALL 确保车辆参数表格在小屏幕上可横向滚动
5. WHEN 用户点击车辆图片时，THE Platform SHALL 以全屏方式显示图片
6. THE Platform SHALL 确保关闭按钮在所有屏幕尺寸下可点击
7. THE Platform SHALL 在移动端隐藏或折叠次要信息

### 需求 5: 独立部署配置

**用户故事:** 作为运维人员，我希望能够将PC端和移动端应用独立部署到外网，以便用户可以通过不同的URL访问不同的应用。

#### 验收标准

1. THE PC_Recommendation_App SHALL 包含独立的Configuration_File用于环境变量配置
2. THE Mobile_Recommendation_App SHALL 包含独立的Configuration_File用于环境变量配置
3. THE Build_System SHALL 为PC_Recommendation_App生成可直接部署的静态文件
4. THE Build_System SHALL 为Mobile_Recommendation_App生成可直接部署的静态文件
5. THE Deployment_Package SHALL 包含部署说明文档
6. THE Configuration_File SHALL 支持配置API接口地址
7. THE Configuration_File SHALL 支持配置静态资源路径
8. WHEN 部署到生产环境时，THE Platform SHALL 使用生产环境配置
9. WHEN 部署到测试环境时，THE Platform SHALL 使用测试环境配置
10. THE Platform SHALL 支持通过环境变量覆盖默认配置

### 需求 6: 构建和打包优化

**用户故事:** 作为开发人员，我希望构建系统能够生成优化的部署包，以便提高应用加载速度和用户体验。

#### 验收标准

1. THE Build_System SHALL 对JavaScript代码进行压缩和混淆
2. THE Build_System SHALL 对CSS代码进行压缩
3. THE Build_System SHALL 对图片资源进行优化
4. THE Build_System SHALL 生成代码分割的chunk文件
5. THE Build_System SHALL 为静态资源生成带hash的文件名
6. THE Build_System SHALL 生成source map文件用于调试
7. WHEN 构建完成时，THE Build_System SHALL 输出构建统计信息
8. THE Deployment_Package SHALL 包含index.html作为入口文件
9. THE Deployment_Package SHALL 包含所有必需的静态资源
10. THE Build_System SHALL 确保构建产物大小在合理范围内（<5MB）

### 需求 7: 共享组件和工具函数

**用户故事:** 作为开发人员，我希望PC端和移动端项目能够共享通用组件和工具函数，以便减少代码重复和维护成本。

#### 验收标准

1. THE Platform SHALL 提取车辆卡片组件为共享组件
2. THE Platform SHALL 提取车辆详情组件为共享组件
3. THE Platform SHALL 提取API调用函数为共享工具函数
4. THE Platform SHALL 提取数据格式化函数为共享工具函数
5. THE PC_Recommendation_App SHALL 能够导入和使用共享组件
6. THE Mobile_Recommendation_App SHALL 能够导入和使用共享组件
7. WHERE 共享组件需要响应式行为，THE Platform SHALL 通过props或context传递屏幕尺寸信息
8. THE Platform SHALL 为共享组件提供清晰的文档说明
9. THE Platform SHALL 确保共享组件的样式不会冲突
10. THE Platform SHALL 使用npm包或monorepo方式管理共享代码

### 需求 8: 开发环境配置

**用户故事:** 作为开发人员，我希望能够在本地同时运行和调试PC端和移动端应用，以便提高开发效率。

#### 验收标准

1. THE PC_Recommendation_App SHALL 配置独立的开发服务器端口
2. THE Mobile_Recommendation_App SHALL 配置独立的开发服务器端口
3. WHEN 启动PC_Recommendation_App开发服务器时，THE Build_System SHALL 在指定端口启动服务
4. WHEN 启动Mobile_Recommendation_App开发服务器时，THE Build_System SHALL 在指定端口启动服务
5. THE Build_System SHALL 支持热模块替换（HMR）功能
6. THE Build_System SHALL 在代码变更时自动刷新浏览器
7. THE Platform SHALL 提供开发环境的README文档
8. THE Platform SHALL 在package.json中定义清晰的npm scripts
9. WHEN 开发服务器启动失败时，THE Build_System SHALL 显示清晰的错误信息
10. THE Platform SHALL 支持在局域网内访问开发服务器

### 需求 9: 跨浏览器兼容性

**用户故事:** 作为用户，我希望应用能够在主流浏览器上正常运行，以便使用自己喜欢的浏览器访问平台。

#### 验收标准

1. THE Platform SHALL 支持Chrome最近两个主要版本
2. THE Platform SHALL 支持Firefox最近两个主要版本
3. THE Platform SHALL 支持Safari最近两个主要版本
4. THE Platform SHALL 支持Edge最近两个主要版本
5. THE Platform SHALL 支持iOS Safari 12及以上版本
6. THE Platform SHALL 支持Android Chrome 80及以上版本
7. WHEN 浏览器不支持某个特性时，THE Platform SHALL 提供降级方案或polyfill
8. THE Build_System SHALL 使用Babel转译ES6+代码以确保兼容性
9. THE Platform SHALL 使用CSS前缀确保样式兼容性
10. THE Platform SHALL 在不支持的浏览器上显示升级提示

### 需求 10: 性能监控和优化

**用户故事:** 作为产品经理，我希望能够监控应用的性能指标，以便识别和优化性能瓶颈。

#### 验收标准

1. THE Platform SHALL 测量首次内容绘制（FCP）时间
2. THE Platform SHALL 测量最大内容绘制（LCP）时间
3. THE Platform SHALL 测量首次输入延迟（FID）时间
4. THE Platform SHALL 测量累积布局偏移（CLS）分数
5. WHEN FCP时间超过2秒时，THE Platform SHALL 记录性能警告
6. WHEN LCP时间超过2.5秒时，THE Platform SHALL 记录性能警告
7. THE Platform SHALL 使用懒加载技术延迟加载非关键资源
8. THE Platform SHALL 对图片使用懒加载
9. THE Platform SHALL 实现虚拟滚动以优化长列表性能
10. WHERE 支持Service Worker，THE Platform SHALL 使用Service Worker缓存静态资源
