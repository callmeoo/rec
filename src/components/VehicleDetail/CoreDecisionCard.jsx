import React from 'react';
import { Clock, Eye, Gavel, TrendingUp, Award } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const CoreDecisionCard = ({ vehicle }) => {
  const countdown = getCountdown(vehicle.endTime);
  const estimatedProfit = calculateEstimatedProfit(vehicle);

  const handleBidClick = () => {
    trackEvent('bid_button_click', {
      vehicle_id: vehicle.id,
      current_price: vehicle.currentPrice
    });
    // TODO: 打开出价弹窗
    alert('出价功能开发中');
  };

  const handleFavorite = () => {
    trackEvent('add_to_favorite', {
      vehicle_id: vehicle.id
    });
    alert('已加入收藏');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* 车辆标题 */}
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
          {vehicle.conditionScore >= 90 && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              优质车源
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {vehicle.licensePlate} | {vehicle.country} | {vehicle.location} | {(vehicle.mileage / 10000).toFixed(1)}万公里 | {new Date().getFullYear() - vehicle.year}年车龄
        </p>
      </div>

      {/* 核心数据网格 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 起拍价 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">起拍价</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {(vehicle.startPrice / 10000).toFixed(1)}万
          </p>
        </div>

        {/* 当前价 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600">当前价</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {(vehicle.currentPrice / 10000).toFixed(1)}万
          </p>
        </div>

        {/* 预估利润 */}
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600">预估利润</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {estimatedProfit.min}-{estimatedProfit.max}万
          </p>
        </div>

        {/* 周转预测 */}
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600">周转预测</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {Math.round(100 - vehicle.turnoverScore)}天
          </p>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 车况评分 */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">车况评分</p>
            <p className="text-lg font-semibold text-gray-900">
              {getConditionGrade(vehicle.conditionScore)} {vehicle.conditionScore}分
            </p>
          </div>
        </div>

        {/* 竞价热度 */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Gavel className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">竞价热度</p>
            <p className="text-lg font-semibold text-gray-900">
              {vehicle.bidding.bidderCount}人出价
            </p>
          </div>
        </div>

        {/* 市场需求 */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">市场需求</p>
            <p className="text-lg font-semibold text-gray-900">
              {vehicle.market.demandLevel === 'high' ? '高🔥' : '中等'}
            </p>
          </div>
        </div>

        {/* 结束时间 */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">结束时间</p>
            <p className="text-lg font-semibold text-red-600">
              {countdown}
            </p>
          </div>
        </div>
      </div>

      {/* 浏览数据 */}
      <div className="flex items-center justify-between py-3 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>{vehicle.bidding.viewCount}次浏览</span>
          <span className="text-gray-400">|</span>
          <span>{vehicle.bidding.viewUV}人关注</span>
        </div>
        <div className="text-sm text-gray-600">
          {vehicle.bidding.bidCount}次出价
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <button
          onClick={handleBidClick}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          立即出价
        </button>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleFavorite}
            className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            收藏
          </button>
          <button
            onClick={() => {
              trackEvent('add_to_compare', { vehicle_id: vehicle.id });
              alert('已加入对比');
            }}
            className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            对比
          </button>
          <button
            onClick={() => {
              trackEvent('contact_service', { vehicle_id: vehicle.id });
              alert('客服功能开发中');
            }}
            className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            咨询
          </button>
        </div>
      </div>

      {/* 智能提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <span className="font-medium">智能建议：</span>
          该车型市场需求旺盛，当前价格低于市场均价8%，预计{Math.round(100 - vehicle.turnoverScore)}天内可售出，建议出价不超过{(vehicle.currentPrice * 1.1 / 10000).toFixed(1)}万
        </p>
      </div>
    </div>
  );
};

// 计算倒计时
const getCountdown = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;
  
  if (diff <= 0) return '已结束';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
};

// 计算预估利润
const calculateEstimatedProfit = (vehicle) => {
  const cost = vehicle.currentPrice;
  const marketPrice = vehicle.market.avgPrice;
  const profit = marketPrice - cost;
  
  return {
    min: (profit * 0.8 / 10000).toFixed(1),
    max: (profit * 1.2 / 10000).toFixed(1)
  };
};

// 获取车况等级
const getConditionGrade = (score) => {
  if (score >= 90) return 'A级';
  if (score >= 80) return 'B级';
  if (score >= 70) return 'C级';
  return 'D级';
};

export default CoreDecisionCard;
