import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Phone, MessageCircle } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const MobileVehicleDetailPage = ({ vehicleId, onBack }) => {
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    trackEvent('detail_page_view', {
      vehicle_id: vehicleId,
      source: 'recommendation',
      device_type: 'mobile'
    });
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    setLoading(true);
    try {
      const mockData = generateMockVehicleData(vehicleId);
      setVehicle(mockData);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">车辆不存在</p>
          <button 
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-medium">车辆详情</span>
          <div className="flex items-center space-x-3">
            <button className="p-2">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="pt-14 pb-20">
        {/* 图片轮播 */}
        <ImageCarousel 
          images={vehicle.images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
        />

        {/* 价格信息 */}
        <PriceSection vehicle={vehicle} />

        {/* 车辆基本信息 */}
        <BasicInfoSection vehicle={vehicle} />

        {/* Tab切换 */}
        <TabSection 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab内容 */}
        <div className="px-4">
          {activeTab === 'basic' && <BasicDetails vehicle={vehicle} />}
          {activeTab === 'condition' && <ConditionDetails vehicle={vehicle} />}
          {activeTab === 'inspection' && <InspectionReport vehicle={vehicle} />}
        </div>

        {/* 相似推荐 */}
        <SimilarSection vehicle={vehicle} />
      </div>

      {/* 底部操作栏 */}
      <BottomActionBar vehicle={vehicle} />
    </div>
  );
};

// 图片轮播组件
const ImageCarousel = ({ images, currentIndex, onIndexChange }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // 向左滑动
      if (currentIndex < images.length - 1) {
        onIndexChange(currentIndex + 1);
      }
    }
    if (touchStart - touchEnd < -50) {
      // 向右滑动
      if (currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
    }
  };

  return (
    <div className="relative bg-black">
      <div
        className="aspect-[4/3] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* 指示器 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* 图片计数 */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
};

// 价格信息组件
const PriceSection = ({ vehicle }) => (
  <div className="bg-white px-4 py-4 border-b border-gray-200">
    <div className="flex items-baseline space-x-2 mb-2">
      <span className="text-3xl font-bold text-red-600">
        {(vehicle.currentPrice / 10000).toFixed(2)}
      </span>
      <span className="text-lg text-red-600">万</span>
      <span className="text-sm text-gray-500 line-through">
        {(vehicle.startPrice / 10000).toFixed(2)}万
      </span>
    </div>
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <span>起拍价 {(vehicle.startPrice / 10000).toFixed(2)}万</span>
      <span>•</span>
      <span className="text-orange-600">距结束 2小时</span>
    </div>
  </div>
);

// 基本信息组件
const BasicInfoSection = ({ vehicle }) => (
  <div className="bg-white px-4 py-4 border-b-8 border-gray-100">
    <h1 className="text-lg font-bold text-gray-900 mb-3">
      {vehicle.name}
    </h1>
    
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <div className="text-gray-500">表显里程</div>
        <div className="font-medium mt-1">{(vehicle.mileage / 10000).toFixed(1)}万公里</div>
      </div>
      <div>
        <div className="text-gray-500">上牌时间</div>
        <div className="font-medium mt-1">{vehicle.year}年</div>
      </div>
      <div>
        <div className="text-gray-500">所在地</div>
        <div className="font-medium mt-1">{vehicle.location}</div>
      </div>
    </div>

    {/* 标签 */}
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
        个人一手车
      </span>
      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
        4S店保养
      </span>
      <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full">
        无重大事故
      </span>
    </div>
  </div>
);

// Tab切换组件
const TabSection = ({ activeTab, onTabChange }) => (
  <div className="sticky top-14 z-40 bg-white border-b border-gray-200">
    <div className="flex">
      {[
        { id: 'basic', label: '基本信息' },
        { id: 'condition', label: '车况描述' },
        { id: 'inspection', label: '检测报告' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

// 基本详情
const BasicDetails = ({ vehicle }) => (
  <div className="bg-white rounded-lg p-4 mt-4">
    <h3 className="font-bold text-gray-900 mb-4">车辆参数</h3>
    <div className="space-y-3">
      {[
        { label: '车辆品牌', value: vehicle.brand },
        { label: '车系', value: vehicle.series },
        { label: '车型', value: vehicle.model },
        { label: '车牌号', value: vehicle.licensePlate },
        { label: '国别', value: vehicle.country },
        { label: '车况评分', value: `${vehicle.conditionScore}分（A级）` }
      ].map((item, index) => (
        <div key={index} className="flex justify-between text-sm">
          <span className="text-gray-600">{item.label}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// 车况详情
const ConditionDetails = ({ vehicle }) => (
  <div className="space-y-4 mt-4">
    {/* 车况评分 */}
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-bold text-gray-900 mb-4">车况评分</h3>
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-green-600">{vehicle.conditionScore}</div>
        <div className="text-sm text-gray-600 mt-1">综合评分（A级）</div>
      </div>
      
      {/* 评分条 */}
      <div className="space-y-3">
        {[
          { name: '外观', score: 100 },
          { name: '内饰', score: 95 },
          { name: '发动机', score: 95 },
          { name: '变速箱', score: 90 },
          { name: '底盘', score: 90 }
        ].map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.name}</span>
              <span className="font-medium">{item.score}分</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 核心车况 */}
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-bold text-gray-900 mb-4">核心车况</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          '✓ 无事故',
          '✓ 非泡水',
          '✓ 非火烧',
          '✓ 一手车',
          '✓ 4S保养',
          '✓ 手续齐全'
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <span className="text-green-600">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 检测报告
const InspectionReport = ({ vehicle }) => (
  <div className="bg-white rounded-lg p-4 mt-4">
    <h3 className="font-bold text-gray-900 mb-4">300项检测报告</h3>
    <div className="space-y-3">
      {[
        { name: '发动机系统', total: 50, passed: 50, status: 'good' },
        { name: '变速箱系统', total: 30, passed: 30, status: 'good' },
        { name: '底盘系统', total: 40, passed: 39, status: 'warning' }
      ].map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{item.name}</span>
            <span className={`text-sm ${
              item.status === 'good' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {item.passed}/{item.total}项正常
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                item.status === 'good' ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(item.passed / item.total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
    
    <button className="w-full mt-4 py-3 border border-blue-600 text-blue-600 rounded-lg">
      查看完整报告
    </button>
  </div>
);

// 相似推荐
const SimilarSection = ({ vehicle }) => (
  <div className="mt-4 px-4">
    <h3 className="font-bold text-gray-900 mb-3">相似车源</h3>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-white rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-200"></div>
          <div className="p-2">
            <div className="text-sm font-medium truncate">奔驰 E300L</div>
            <div className="text-red-600 font-bold mt-1">35.00万</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 底部操作栏
const BottomActionBar = ({ vehicle }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
    <div className="flex items-center space-x-3">
      <button className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium">
        <Phone className="w-5 h-5 inline mr-1" />
        电话咨询
      </button>
      <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium">
        立即出价
      </button>
    </div>
  </div>
);

// 生成模拟数据
const generateMockVehicleData = (id) => {
  return {
    id,
    name: '奔驰 E300L 2022款 豪华版',
    brand: '奔驰',
    series: 'E级',
    model: '2022款 豪华版',
    licensePlate: '京A12345',
    country: '德国',
    location: '北京',
    year: 2022,
    mileage: 25000,
    conditionScore: 95,
    startPrice: 320000,
    currentPrice: 350000,
    images: [
      { url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', alt: '外观' },
      { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', alt: '内饰' },
      { url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop', alt: '发动机' },
      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', alt: '侧面' }
    ]
  };
};

export default MobileVehicleDetailPage;
