import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const SimilarVehicles = ({ currentVehicle }) => {
  const similarVehicles = generateSimilarVehicles(currentVehicle);

  const handleVehicleClick = (vehicle) => {
    trackEvent('similar_car_click', {
      vehicle_id: currentVehicle.id,
      similar_id: vehicle.id,
      position: vehicle.position
    });
    // TODO: 跳转到车辆详情页
    window.location.href = `/vehicle/${vehicle.id}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">相似车源推荐</h3>
        <button
          onClick={() => {
            trackEvent('view_more_similar', { vehicle_id: currentVehicle.id });
            alert('查看更多相似车源');
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <span>查看更多</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarVehicles.map((vehicle, index) => (
          <SimilarVehicleCard
            key={index}
            vehicle={vehicle}
            onClick={() => handleVehicleClick(vehicle)}
          />
        ))}
      </div>

      <button
        onClick={() => {
          trackEvent('add_to_compare', { vehicle_id: currentVehicle.id });
          alert('对比功能开发中');
        }}
        className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        加入对比
      </button>
    </div>
  );
};

// 相似车辆卡片
const SimilarVehicleCard = ({ vehicle, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError) {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%234A90E2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3E${vehicle.name}%3C/text%3E%3C/svg%3E`;
    }
    return vehicle.image;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* 图片 */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={getImageUrl()}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={() => setImageError(true)}
        />
        {vehicle.tag && (
          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${vehicle.tagColor}`}>
            {vehicle.tag}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-gray-900 truncate">{vehicle.name}</h4>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{(vehicle.mileage / 10000).toFixed(1)}万公里</span>
          <span>{new Date().getFullYear() - vehicle.year}年</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            {(vehicle.price / 10000).toFixed(1)}万
          </span>
          <span className={`text-xs px-2 py-1 rounded ${getConditionColor(vehicle.conditionScore)}`}>
            {getConditionGrade(vehicle.conditionScore)}
          </span>
        </div>

        {/* 推荐理由 */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-blue-600 font-medium">{vehicle.reason}</p>
        </div>
      </div>
    </div>
  );
};

// 生成相似车辆
const generateSimilarVehicles = (current) => {
  return [
    {
      id: 'V002',
      name: `${current.brand} ${current.series} 2021款`,
      year: current.year - 1,
      mileage: 35000,
      price: current.currentPrice * 0.92,
      conditionScore: 92,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop',
      tag: '价格更低',
      tagColor: 'bg-green-500 text-white',
      reason: '同款车型，价格更优惠',
      position: 1
    },
    {
      id: 'V003',
      name: `${current.brand} ${current.series} 2023款`,
      year: current.year + 1,
      mileage: 12000,
      price: current.currentPrice * 1.08,
      conditionScore: 98,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      tag: '车况更好',
      tagColor: 'bg-blue-500 text-white',
      reason: '准新车，车况优秀',
      position: 2
    },
    {
      id: 'V004',
      name: '宝马 5系 2022款',
      year: current.year,
      mileage: 28000,
      price: current.currentPrice * 0.95,
      conditionScore: 90,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      tag: '同价位',
      tagColor: 'bg-purple-500 text-white',
      reason: '同价位，更多选择',
      position: 3
    },
    {
      id: 'V005',
      name: '奥迪 A6L 2022款',
      year: current.year,
      mileage: 32000,
      price: current.currentPrice * 0.88,
      conditionScore: 88,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
      tag: '高性价比',
      tagColor: 'bg-orange-500 text-white',
      reason: '性价比高，值得考虑',
      position: 4
    }
  ];
};

// 获取车况等级
const getConditionGrade = (score) => {
  if (score >= 90) return 'A级';
  if (score >= 80) return 'B级';
  if (score >= 70) return 'C级';
  return 'D级';
};

// 获取车况颜色
const getConditionColor = (score) => {
  if (score >= 90) return 'bg-green-100 text-green-700';
  if (score >= 80) return 'bg-blue-100 text-blue-700';
  if (score >= 70) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

export default SimilarVehicles;
