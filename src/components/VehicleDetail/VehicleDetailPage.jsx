import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import CoreDecisionCard from './CoreDecisionCard';
import ProfitCalculator from './ProfitCalculator';
import ConditionVisualization from './ConditionVisualization';
import MarketAnalysis from './MarketAnalysis';
import ImageGallery from './ImageGallery';
import BiddingDynamics from './BiddingDynamics';
import SimilarVehicles from './SimilarVehicles';
import MobileVehicleDetailPage from './MobileVehicleDetailPage';
import { trackEvent } from '../../utils/umengTracking';

const VehicleDetailPage = ({ vehicleId, onBack }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 如果是移动端，使用移动端组件
  if (isMobile) {
    return <MobileVehicleDetailPage vehicleId={vehicleId} onBack={onBack} />;
  }

  // PC端组件
  return <DesktopVehicleDetailPage vehicleId={vehicleId} onBack={onBack} />;
};

// PC端详情页组件
const DesktopVehicleDetailPage = ({ vehicleId, onBack }) => {
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('condition');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 记录详情页浏览
    trackEvent('detail_page_view', {
      vehicle_id: vehicleId,
      source: 'recommendation',
      device_type: window.innerWidth < 768 ? 'mobile' : 'pc'
    });

    // 加载车辆数据
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    setLoading(true);
    try {
      // TODO: 替换为真实API调用
      const mockData = generateMockVehicleData(vehicleId);
      setVehicle(mockData);
    } catch (error) {
      console.error('加载车辆数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">车辆不存在</p>
          <button 
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按钮 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      {/* 顶部区域 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：图片展示 */}
            <div className="lg:col-span-2">
              <ImageGallery images={vehicle.images} vehicleId={vehicle.id} />
            </div>

            {/* 右侧：核心决策卡片 */}
            <div className="lg:col-span-1">
              <CoreDecisionCard vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧主内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab切换 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'condition', label: '车况信息' },
                    { id: 'market', label: '市场行情' },
                    { id: 'bidding', label: '竞价动态' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'condition' && (
                  <ConditionVisualization 
                    condition={vehicle.condition}
                    inspection={vehicle.inspection}
                    vehicleId={vehicle.id}
                  />
                )}
                {activeTab === 'market' && (
                  <MarketAnalysis 
                    market={vehicle.market}
                    vehicle={vehicle}
                  />
                )}
                {activeTab === 'bidding' && (
                  <BiddingDynamics 
                    bidding={vehicle.bidding}
                    vehicleId={vehicle.id}
                  />
                )}
              </div>
            </div>

            {/* 相似车源推荐 */}
            <SimilarVehicles currentVehicle={vehicle} />
          </div>

          {/* 右侧：利润计算器（固定） */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ProfitCalculator vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    turnoverScore: 88,
    images: [
      { url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', type: 'exterior', alt: '车辆外观' },
      { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', type: 'interior', alt: '车辆内饰' },
      { url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop', type: 'engine', alt: '发动机舱' },
      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', type: 'exterior', alt: '车辆侧面' }
    ],
    condition: {
      exterior: 100,
      interior: 95,
      engine: 95,
      transmission: 90,
      chassis: 90,
      overall: 95
    },
    inspection: {
      reportId: 'ZJ20260125001',
      inspector: '李工',
      inspectionDate: '2026-01-25',
      agency: '中检集团',
      items: generateInspectionItems()
    },
    market: {
      priceDistribution: [
        { range: '30-32万', count: 5 },
        { range: '32-35万', count: 12 },
        { range: '35-38万', count: 18 },
        { range: '38-40万', count: 10 },
        { range: '40-42万', count: 5 }
      ],
      avgPrice: 380000,
      medianPrice: 370000,
      demandLevel: 'high',
      turnoverDays: 28,
      recentDeals: 45
    },
    bidding: {
      bidCount: 45,
      bidderCount: 8,
      viewCount: 1234,
      viewUV: 156,
      history: [
        { bidder: 'A****', amount: 350000, time: '刚刚' },
        { bidder: 'B****', amount: 348000, time: '2分钟前' },
        { bidder: 'C****', amount: 345000, time: '5分钟前' }
      ]
    }
  };
};

const generateInspectionItems = () => {
  return [
    {
      category: '发动机系统',
      totalItems: 50,
      passedItems: 50,
      status: 'excellent',
      details: [
        { name: '启动性能', status: 'excellent', note: '启动迅速，无异响' },
        { name: '怠速稳定性', status: 'good', note: '怠速平稳' },
        { name: '加速响应', status: 'excellent', note: '加速有力' },
        { name: '漏油检测', status: 'good', note: '无渗漏' }
      ]
    },
    {
      category: '变速箱系统',
      totalItems: 30,
      passedItems: 30,
      status: 'excellent',
      details: [
        { name: '换挡平顺性', status: 'excellent', note: '换挡顺畅' },
        { name: '异响检测', status: 'good', note: '无异响' },
        { name: '漏油检测', status: 'good', note: '无渗漏' }
      ]
    },
    {
      category: '底盘系统',
      totalItems: 40,
      passedItems: 39,
      status: 'good',
      details: [
        { name: '悬挂系统', status: 'good', note: '工作正常' },
        { name: '刹车系统', status: 'excellent', note: '制动有力' },
        { name: '轮胎磨损', status: 'warning', note: '建议更换，预估成本2000元' }
      ]
    }
  ];
};

export default VehicleDetailPage;
