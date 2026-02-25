# 设计文档：响应式拆分部署

## 概述

本设计文档描述了将现有二手车拍卖平台的PC端和移动端推荐模块拆分为独立项目，并实现响应式设计的技术方案。当前系统采用单体应用架构，通过侧边栏导航在不同模块间切换。本设计将实现：

1. **项目拆分**：将PC端和移动端推荐模块拆分为两个独立的React应用
2. **响应式设计**：实现基于断点的自适应布局系统
3. **共享代码管理**：通过monorepo方式管理共享组件和工具函数
4. **独立部署**：每个应用可独立构建和部署到不同的URL
5. **性能优化**：实现代码分割、懒加载和资源优化

### 设计目标

- 提高部署灵活性，支持PC端和移动端独立发布
- 改善用户体验，提供针对不同设备优化的界面
- 降低维护成本，通过共享代码减少重复
- 提升性能，通过构建优化减少包体积
- 确保跨浏览器兼容性

## 架构

### 整体架构

采用monorepo架构，将项目组织为以下结构：

```
car-auction-platform/
├── packages/
│   ├── pc-recommendation/          # PC端推荐应用
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── mobile-recommendation/      # 移动端推荐应用
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── shared/                     # 共享代码库
│       ├── components/             # 共享组件
│       ├── utils/                  # 工具函数
│       ├── hooks/                  # 自定义Hooks
│       ├── constants/              # 常量定义
│       └── package.json
├── package.json                    # 根package.json
└── pnpm-workspace.yaml            # workspace配置
```

### 技术栈

- **构建工具**：Vite 7.x
- **框架**：React 19.x
- **样式方案**：Tailwind CSS 3.x
- **包管理**：pnpm (支持workspace)
- **状态管理**：React Hooks (useState, useContext)
- **HTTP客户端**：Fetch API
- **响应式工具**：自定义useMediaQuery Hook
- **代码质量**：ESLint
- **浏览器兼容**：Babel + Autoprefixer

### 响应式断点系统

定义三个主要断点：

```javascript
const breakpoints = {
  mobile: '0px',      // < 768px
  tablet: '768px',    // 768px - 1024px
  desktop: '1024px'   // > 1024px
}
```

Tailwind配置：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### 部署架构

```
┌─────────────────────────────────────┐
│         Nginx / CDN                 │
└─────────────────────────────────────┘
           │              │
           │              │
    ┌──────▼──────┐  ┌───▼──────────┐
    │  PC端应用    │  │  移动端应用   │
    │  /pc/*      │  │  /mobile/*   │
    └─────────────┘  └──────────────┘
           │              │
           └──────┬───────┘
                  │
         ┌────────▼────────┐
         │   后端API服务    │
         └─────────────────┘
```

## 组件和接口

### 共享组件库 (packages/shared)

#### 1. CarCard 组件

车辆卡片组件，支持响应式布局。

```typescript
interface CarCardProps {
  vehicle: Vehicle;
  onClick: (id: string) => void;
  layout?: 'compact' | 'normal' | 'detailed';
  className?: string;
}

export function CarCard({ vehicle, onClick, layout = 'normal', className }: CarCardProps)
```

**响应式行为**：
- 移动端：使用compact布局，单列显示
- 平板端：使用normal布局，双列显示
- 桌面端：使用detailed布局，三列或四列显示

#### 2. VehicleDetail 组件

车辆详情组件，支持响应式布局。

```typescript
interface VehicleDetailProps {
  vehicleId: string;
  onClose: () => void;
  mode?: 'modal' | 'page';
}

export function VehicleDetail({ vehicleId, onClose, mode = 'modal' }: VehicleDetailProps)
```

**响应式行为**：
- 移动端：垂直堆叠布局，全屏模式
- 平板端及以上：左右分栏布局，模态框模式

#### 3. ImageGallery 组件

图片画廊组件，支持全屏查看。

```typescript
interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose?: () => void;
}

export function ImageGallery({ images, initialIndex = 0, onClose }: ImageGalleryProps)
```

#### 4. ResponsiveGrid 组件

响应式网格布局组件。

```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '1rem',
  className 
}: ResponsiveGridProps)
```

### 自定义Hooks

#### useMediaQuery Hook

```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}
```

#### useBreakpoint Hook

```typescript
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function useBreakpoint(): Breakpoint {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}
```

#### useVehicleData Hook

```typescript
interface UseVehicleDataResult {
  vehicles: Vehicle[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useVehicleData(): UseVehicleDataResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 实现数据获取逻辑
  
  return { vehicles, loading, error, refetch };
}
```

### API接口

#### 车辆推荐API

```typescript
// GET /api/recommendations
interface RecommendationRequest {
  userId?: string;
  limit?: number;
  offset?: number;
}

interface RecommendationResponse {
  vehicles: Vehicle[];
  total: number;
  hasMore: boolean;
}
```

#### 车辆详情API

```typescript
// GET /api/vehicles/:id
interface VehicleDetailResponse {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  specifications: Record<string, string>;
  description: string;
}
```

### 工具函数

#### formatPrice

```typescript
function formatPrice(price: number): string {
  return `¥${(price / 10000).toFixed(2)}万`;
}
```

#### formatMileage

```typescript
function formatMileage(mileage: number): string {
  return `${(mileage / 10000).toFixed(2)}万公里`;
}
```

#### debounce

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

## 数据模型

### Vehicle 模型

```typescript
interface Vehicle {
  id: string;
  brand: string;              // 品牌
  model: string;              // 型号
  year: number;               // 年份
  price: number;              // 价格（单位：元）
  originalPrice?: number;     // 原价
  mileage: number;            // 里程（单位：米）
  color: string;              // 颜色
  transmission: string;       // 变速箱类型
  fuelType: string;           // 燃料类型
  images: string[];           // 图片URL列表
  thumbnail: string;          // 缩略图URL
  location: string;           // 所在地
  registrationDate: string;   // 上牌日期
  lastMaintenanceDate?: string; // 最后保养日期
  condition: VehicleCondition;  // 车况
  features: string[];         // 特色功能
  description: string;        // 描述
  specifications: VehicleSpecifications; // 详细参数
  createdAt: string;          // 创建时间
  updatedAt: string;          // 更新时间
}

type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

interface VehicleSpecifications {
  engine: string;             // 发动机
  displacement: string;       // 排量
  power: string;              // 功率
  torque: string;             // 扭矩
  seats: number;              // 座位数
  doors: number;              // 门数
  length: number;             // 长度（mm）
  width: number;              // 宽度（mm）
  height: number;             // 高度（mm）
  wheelbase: number;          // 轴距（mm）
  curbWeight: number;         // 整备质量（kg）
  fuelTankCapacity: number;   // 油箱容量（L）
  [key: string]: string | number; // 其他参数
}
```

### AppConfig 模型

```typescript
interface AppConfig {
  apiBaseUrl: string;         // API基础URL
  staticBaseUrl: string;      // 静态资源基础URL
  environment: 'development' | 'staging' | 'production';
  features: {
    enableAnalytics: boolean;
    enableServiceWorker: boolean;
    enableLazyLoading: boolean;
  };
  performance: {
    imageQuality: number;     // 图片质量 (0-100)
    lazyLoadThreshold: number; // 懒加载阈值（px）
    debounceDelay: number;    // 防抖延迟（ms）
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}
```

### BuildConfig 模型

```typescript
interface BuildConfig {
  entry: string;              // 入口文件
  outDir: string;             // 输出目录
  assetsDir: string;          // 资源目录
  sourcemap: boolean;         // 是否生成sourcemap
  minify: boolean;            // 是否压缩
  chunkSizeWarningLimit: number; // chunk大小警告限制（KB）
  rollupOptions: {
    output: {
      manualChunks: Record<string, string[]>;
    };
  };
}
```

### PerformanceMetrics 模型

```typescript
interface PerformanceMetrics {
  fcp: number;                // First Contentful Paint (ms)
  lcp: number;                // Largest Contentful Paint (ms)
  fid: number;                // First Input Delay (ms)
  cls: number;                // Cumulative Layout Shift
  ttfb: number;               // Time to First Byte (ms)
  timestamp: number;          // 测量时间戳
}
```


## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性反思

在分析了所有验收标准后，我识别出以下可测试的属性。通过反思，我发现了一些可以合并的属性：

- 需求2.3、2.4、2.5都是关于不同viewport宽度下应用正确样式的测试，可以合并为一个综合属性
- 需求3.1、3.2、3.3都是关于不同viewport下卡片列数的测试，可以合并为一个属性
- 需求4.1、4.2都是关于详情页布局方式的测试，可以合并为一个属性

### 属性 1: 响应式断点样式应用

*对于任何* viewport宽度，系统应该根据定义的断点（<768px为移动端，768px-1024px为平板端，>1024px为桌面端）应用相应的布局样式类。

**验证: 需求 2.3, 2.4, 2.5**

### 属性 2: 移动端触摸目标最小尺寸

*对于任何* 可交互元素（按钮、链接、输入框），在移动端viewport（<768px）下，其可点击区域应该至少为44x44像素。

**验证: 需求 2.9**

### 属性 3: 移动端文字最小字号

*对于任何* 文本元素，在移动端viewport（<768px）下，其字号应该至少为14px。

**验证: 需求 2.10**

### 属性 4: 车辆卡片响应式列数

*对于任何* 车辆列表，在不同viewport宽度下应该显示正确的列数：移动端（<768px）显示1列，平板端（768px-1024px）显示2列，桌面端（>1024px）显示3-4列。

**验证: 需求 3.1, 3.2, 3.3**

### 属性 5: 车辆卡片间距一致性

*对于任何* 车辆卡片网格布局，所有相邻卡片之间的间距应该保持一致。

**验证: 需求 3.4**

### 属性 6: 车辆图片宽高比保持

*对于任何* 车辆图片，在响应式缩放时，其宽高比应该保持不变（不变形）。

**验证: 需求 3.5**

### 属性 7: 关闭按钮全尺寸可点击

*对于任何* 模态框或弹窗的关闭按钮，在所有viewport尺寸下都应该可见且可点击（尺寸至少44x44px）。

**验证: 需求 4.6**

### 属性 8: 环境变量配置覆盖

*对于任何* 配置项，如果提供了对应的环境变量，该环境变量的值应该覆盖默认配置值。

**验证: 需求 5.10**

### 属性 9: 静态资源文件名包含hash

*对于所有* 构建输出的静态资源文件（JS、CSS、图片），其文件名应该包含内容hash值以支持缓存失效。

**验证: 需求 6.5**

### 属性 10: 共享组件接收响应式信息

*对于任何* 需要响应式行为的共享组件，它应该能够通过props或context接收当前屏幕尺寸或断点信息。

**验证: 需求 7.7**

## 错误处理

### 网络错误处理

**API请求失败**
- 场景：API请求超时或返回错误状态码
- 处理：显示用户友好的错误提示，提供重试按钮
- 实现：使用try-catch包装fetch调用，设置合理的超时时间

```typescript
async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('/api/vehicles', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接');
    }
    throw new Error('加载车辆数据失败，请稍后重试');
  }
}
```

**图片加载失败**
- 场景：车辆图片URL无效或加载失败
- 处理：显示占位图片，记录错误日志
- 实现：使用img标签的onError事件

```typescript
function CarImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc('/placeholder-car.jpg');
    console.error(`Failed to load image: ${src}`);
  };
  
  return <img src={imgSrc} alt={alt} onError={handleError} />;
}
```

### 数据验证错误

**无效的车辆数据**
- 场景：API返回的车辆数据缺少必需字段或格式错误
- 处理：过滤掉无效数据，记录警告日志
- 实现：使用数据验证函数

```typescript
function validateVehicle(data: any): data is Vehicle {
  return (
    typeof data.id === 'string' &&
    typeof data.brand === 'string' &&
    typeof data.model === 'string' &&
    typeof data.price === 'number' &&
    Array.isArray(data.images)
  );
}

function filterValidVehicles(vehicles: any[]): Vehicle[] {
  return vehicles.filter(v => {
    const isValid = validateVehicle(v);
    if (!isValid) {
      console.warn('Invalid vehicle data:', v);
    }
    return isValid;
  });
}
```

### 响应式布局错误

**Viewport尺寸检测失败**
- 场景：window.matchMedia不可用（旧浏览器）
- 处理：降级到默认桌面布局
- 实现：特性检测

```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false; // SSR或不支持的浏览器
    }
    return window.matchMedia(query).matches;
  });
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // 兼容旧版API
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);
  
  return matches;
}
```

### 构建错误处理

**构建失败**
- 场景：依赖缺失、语法错误、配置错误
- 处理：显示清晰的错误信息，指出问题所在
- 实现：Vite内置错误处理

**构建产物过大**
- 场景：bundle大小超过5MB限制
- 处理：构建时警告，提示优化建议
- 实现：配置Vite的chunkSizeWarningLimit

```javascript
// vite.config.js
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'clsx']
        }
      }
    }
  }
});
```

### 性能监控错误

**Performance API不可用**
- 场景：旧浏览器不支持Performance API
- 处理：跳过性能监控，不影响核心功能
- 实现：特性检测

```typescript
function measurePerformance(): PerformanceMetrics | null {
  if (typeof window === 'undefined' || !window.performance) {
    console.warn('Performance API not available');
    return null;
  }
  
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      lcp: 0, // 需要PerformanceObserver
      fid: 0,
      cls: 0,
      ttfb: navigation?.responseStart - navigation?.requestStart || 0,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Failed to measure performance:', error);
    return null;
  }
}
```

## 测试策略

### 测试方法概述

本项目采用双重测试策略，结合单元测试和属性测试以确保全面覆盖：

- **单元测试**：验证特定示例、边缘情况和错误条件
- **属性测试**：验证跨所有输入的通用属性

两者是互补的，都是全面覆盖所必需的。单元测试捕获具体的bug，属性测试验证一般正确性。

### 测试工具和框架

**单元测试框架**
- Vitest：快速的Vite原生测试框架
- React Testing Library：React组件测试
- jsdom：浏览器环境模拟

**属性测试库**
- fast-check：JavaScript/TypeScript的属性测试库
- 配置：每个属性测试至少运行100次迭代

**E2E测试**
- Playwright：跨浏览器端到端测试
- 用于验证响应式布局在真实浏览器中的表现

### 单元测试策略

**组件测试**

测试共享组件的渲染和交互：

```typescript
// CarCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CarCard } from './CarCard';

describe('CarCard', () => {
  const mockVehicle = {
    id: '1',
    brand: '奔驰',
    model: 'C200',
    year: 2020,
    price: 250000,
    mileage: 30000,
    images: ['image1.jpg'],
    thumbnail: 'thumb.jpg'
  };
  
  it('应该渲染车辆基本信息', () => {
    render(<CarCard vehicle={mockVehicle} onClick={() => {}} />);
    expect(screen.getByText('奔驰 C200')).toBeInTheDocument();
    expect(screen.getByText('¥25.00万')).toBeInTheDocument();
  });
  
  it('点击卡片时应该调用onClick回调', () => {
    const handleClick = vi.fn();
    render(<CarCard vehicle={mockVehicle} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });
  
  it('图片加载失败时应该显示占位图', () => {
    render(<CarCard vehicle={mockVehicle} onClick={() => {}} />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', '/placeholder-car.jpg');
  });
});
```

**Hook测试**

测试自定义Hooks的行为：

```typescript
// useBreakpoint.test.ts
import { renderHook } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';

describe('useBreakpoint', () => {
  it('在小屏幕下应该返回mobile', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(max-width: 767px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('mobile');
  });
  
  it('在中等屏幕下应该返回tablet', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(min-width: 768px) and (max-width: 1023px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('tablet');
  });
});
```

**工具函数测试**

测试数据格式化和处理函数：

```typescript
// formatters.test.ts
import { formatPrice, formatMileage } from './formatters';

describe('formatPrice', () => {
  it('应该正确格式化价格', () => {
    expect(formatPrice(250000)).toBe('¥25.00万');
    expect(formatPrice(1000000)).toBe('¥100.00万');
  });
  
  it('应该处理零价格', () => {
    expect(formatPrice(0)).toBe('¥0.00万');
  });
});

describe('formatMileage', () => {
  it('应该正确格式化里程', () => {
    expect(formatMileage(30000)).toBe('3.00万公里');
    expect(formatMileage(100000)).toBe('10.00万公里');
  });
});
```

### 属性测试策略

**属性测试配置**

每个属性测试必须：
- 运行至少100次迭代
- 使用注释标签引用设计文档中的属性
- 标签格式：`Feature: responsive-split-deployment, Property {number}: {property_text}`

**属性 1: 响应式断点样式应用**

```typescript
// Feature: responsive-split-deployment, Property 1: 响应式断点样式应用
import fc from 'fast-check';
import { getBreakpointClass } from './responsive';

describe('Property 1: 响应式断点样式应用', () => {
  it('应该根据viewport宽度返回正确的断点类', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }), // viewport宽度
        (width) => {
          const breakpoint = getBreakpointClass(width);
          
          if (width < 768) {
            return breakpoint === 'mobile';
          } else if (width >= 768 && width < 1024) {
            return breakpoint === 'tablet';
          } else {
            return breakpoint === 'desktop';
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**属性 2: 移动端触摸目标最小尺寸**

```typescript
// Feature: responsive-split-deployment, Property 2: 移动端触摸目标最小尺寸
describe('Property 2: 移动端触摸目标最小尺寸', () => {
  it('所有可交互元素在移动端应该至少44x44px', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('button', 'link', 'input'),
          viewport: fc.integer({ min: 320, max: 767 })
        }),
        ({ type, viewport }) => {
          const element = createInteractiveElement(type, viewport);
          const { width, height } = element.getBoundingClientRect();
          
          return width >= 44 && height >= 44;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**属性 5: 车辆卡片间距一致性**

```typescript
// Feature: responsive-split-deployment, Property 5: 车辆卡片间距一致性
describe('Property 5: 车辆卡片间距一致性', () => {
  it('所有相邻卡片之间的间距应该一致', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ id: fc.string() }), { minLength: 2, maxLength: 20 }),
        (vehicles) => {
          const { container } = render(<VehicleGrid vehicles={vehicles} />);
          const cards = container.querySelectorAll('[data-testid="car-card"]');
          
          const gaps: number[] = [];
          for (let i = 0; i < cards.length - 1; i++) {
            const rect1 = cards[i].getBoundingClientRect();
            const rect2 = cards[i + 1].getBoundingClientRect();
            const gap = rect2.left - rect1.right;
            if (gap > 0) gaps.push(gap);
          }
          
          // 所有间距应该相等（允许1px误差）
          return gaps.every(gap => Math.abs(gap - gaps[0]) <= 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**属性 6: 车辆图片宽高比保持**

```typescript
// Feature: responsive-split-deployment, Property 6: 车辆图片宽高比保持
describe('Property 6: 车辆图片宽高比保持', () => {
  it('图片缩放时应该保持原始宽高比', () => {
    fc.assert(
      fc.property(
        fc.record({
          originalWidth: fc.integer({ min: 400, max: 2000 }),
          originalHeight: fc.integer({ min: 300, max: 1500 }),
          containerWidth: fc.integer({ min: 200, max: 1200 })
        }),
        ({ originalWidth, originalHeight, containerWidth }) => {
          const originalRatio = originalWidth / originalHeight;
          
          const { container } = render(
            <div style={{ width: containerWidth }}>
              <CarImage 
                src="test.jpg" 
                originalWidth={originalWidth}
                originalHeight={originalHeight}
              />
            </div>
          );
          
          const img = container.querySelector('img');
          const { width, height } = img.getBoundingClientRect();
          const displayRatio = width / height;
          
          // 允许0.01的误差
          return Math.abs(displayRatio - originalRatio) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**属性 8: 环境变量配置覆盖**

```typescript
// Feature: responsive-split-deployment, Property 8: 环境变量配置覆盖
describe('Property 8: 环境变量配置覆盖', () => {
  it('环境变量应该覆盖默认配置', () => {
    fc.assert(
      fc.property(
        fc.record({
          configKey: fc.constantFrom('apiBaseUrl', 'staticBaseUrl', 'environment'),
          envValue: fc.string({ minLength: 1 })
        }),
        ({ configKey, envValue }) => {
          // 设置环境变量
          process.env[`VITE_${configKey.toUpperCase()}`] = envValue;
          
          // 重新加载配置
          const config = loadConfig();
          
          // 验证环境变量覆盖了默认值
          return config[configKey] === envValue;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**属性 9: 静态资源文件名包含hash**

```typescript
// Feature: responsive-split-deployment, Property 9: 静态资源文件名包含hash
describe('Property 9: 静态资源文件名包含hash', () => {
  it('所有静态资源文件名应该包含hash', () => {
    const buildOutput = getBuildOutputFiles();
    const staticAssets = buildOutput.filter(f => 
      /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/.test(f)
    );
    
    fc.assert(
      fc.property(
        fc.constantFrom(...staticAssets),
        (filename) => {
          // 检查文件名是否包含hash（8-32位十六进制字符）
          return /\.[a-f0-9]{8,32}\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/.test(filename);
        }
      ),
      { numRuns: Math.min(100, staticAssets.length) }
    );
  });
});
```

### 响应式布局测试

**Viewport测试**

使用Playwright进行真实浏览器测试：

```typescript
// responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('响应式布局', () => {
  test('移动端应该显示单列布局', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const cards = await page.locator('[data-testid="car-card"]').all();
    const firstCard = await cards[0].boundingBox();
    const secondCard = await cards[1].boundingBox();
    
    // 验证卡片垂直排列
    expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
  });
  
  test('平板端应该显示双列布局', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const cards = await page.locator('[data-testid="car-card"]').all();
    const firstCard = await cards[0].boundingBox();
    const secondCard = await cards[1].boundingBox();
    
    // 验证卡片水平排列
    expect(secondCard.x).toBeGreaterThan(firstCard.x + firstCard.width);
  });
  
  test('桌面端应该显示三列或四列布局', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    const cards = await page.locator('[data-testid="car-card"]').all();
    
    // 计算第一行有多少张卡片
    const firstRowY = (await cards[0].boundingBox()).y;
    let cardsInFirstRow = 0;
    
    for (const card of cards) {
      const box = await card.boundingBox();
      if (Math.abs(box.y - firstRowY) < 10) {
        cardsInFirstRow++;
      }
    }
    
    expect(cardsInFirstRow).toBeGreaterThanOrEqual(3);
    expect(cardsInFirstRow).toBeLessThanOrEqual(4);
  });
});
```

### 构建测试

**构建产物验证**

```typescript
// build.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('构建产物验证', () => {
  const distDir = path.resolve(__dirname, '../dist');
  
  it('应该生成index.html', () => {
    expect(fs.existsSync(path.join(distDir, 'index.html'))).toBe(true);
  });
  
  it('应该生成压缩的JS文件', () => {
    const files = fs.readdirSync(path.join(distDir, 'assets'));
    const jsFiles = files.filter(f => f.endsWith('.js'));
    
    expect(jsFiles.length).toBeGreaterThan(0);
    
    // 验证文件被压缩（没有多余空格和换行）
    const jsContent = fs.readFileSync(
      path.join(distDir, 'assets', jsFiles[0]),
      'utf-8'
    );
    expect(jsContent).not.toMatch(/\n\s+/);
  });
  
  it('应该生成带hash的文件名', () => {
    const files = fs.readdirSync(path.join(distDir, 'assets'));
    
    files.forEach(file => {
      expect(file).toMatch(/\.[a-f0-9]{8,}\.(js|css)$/);
    });
  });
  
  it('构建产物总大小应该小于5MB', () => {
    const totalSize = getTotalSize(distDir);
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
  });
});

function getTotalSize(dir: string): number {
  let size = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getTotalSize(filePath);
    } else {
      size += stat.size;
    }
  });
  
  return size;
}
```

### 性能测试

**性能指标测试**

```typescript
// performance.test.ts
describe('性能监控', () => {
  it('应该测量FCP时间', async () => {
    const metrics = await measurePerformance();
    expect(metrics).toHaveProperty('fcp');
    expect(metrics.fcp).toBeGreaterThan(0);
  });
  
  it('FCP超过2秒应该记录警告', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    
    checkPerformanceThresholds({ fcp: 2500, lcp: 1000, fid: 50, cls: 0.1 });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('FCP time exceeds 2s')
    );
  });
});
```

### 测试覆盖率目标

- 单元测试覆盖率：>80%
- 组件测试覆盖率：>90%
- 关键路径E2E测试：100%
- 属性测试：所有定义的正确性属性

### 持续集成

在CI/CD流程中自动运行所有测试：

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:property
      - run: pnpm build
      - run: pnpm test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```
