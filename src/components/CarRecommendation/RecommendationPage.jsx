import React, { useState, useEffect } from 'react';
import { Heart, Eye, Clock, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import CarCard from './CarCard';
import FilterPanel from './FilterPanel';
import { getRecommendations } from './recommendationEngine';
import { trackRecommendationExposure, trackPageView, trackFilterUsage } from '../../utils/umengTracking';

const RecommendationPage = ({ onVehicleClick }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    brands: [],
    years: [],
    mileage: [0, 300000]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    viewedCars: [],
    likedCars: [],
    searchHistory: []
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 模拟登录状态

  useEffect(() => {
    loadRecommendations();
    
    // 页面浏览埋点
    trackPageView('recommendation_page_pc', {
      device_type: 'PC',
      is_logged_in: isLoggedIn
    });
  }, [filters, userPreferences]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      const cars = getRecommendations(userPreferences, filters);
      setRecommendations(cars);
      
      // 推荐模块曝光埋点
      trackRecommendationExposure({
        userId: isLoggedIn ? 'user_123' : null, // 实际使用时从用户状态获取
        deviceType: 'PC',
        carIds: cars.map(car => car.id),
        exposureCount: cars.length
      });
    } catch (error) {
      console.error('加载推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (carId) => {
    setUserPreferences(prev => ({
      ...prev,
      likedCars: [...prev.likedCars, carId]
    }));
  };

  const handleView = (carId) => {
    setUserPreferences(prev => ({
      ...prev,
      viewedCars: [...prev.viewedCars, carId]
    }));
  };

  const handleRefresh = () => {
    loadRecommendations();
    
    // 刷新按钮点击埋点
    trackPageView('recommendation_refresh', {
      device_type: 'PC',
      user_id: isLoggedIn ? 'user_123' : null
    });
  };

  const handleLogin = () => {
    // 模拟登录
    console.log('跳转到登录页面');
    // 实际项目中这里应该跳转到登录页面
    // window.location.href = '/login';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">

      {/* ═══ 现有样式 ═══ */}
      <div className="border-b-4 border-slate-200">
        <div className="text-center pt-4 pb-2">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">现有样式</span>
        </div>

        {/* 搜索条件栏 */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-3 text-sm">
          <span className="text-slate-500">当前筛选：</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">搜索词：劳斯莱斯 <span className="text-slate-400 ml-1 cursor-pointer">×</span></span>
          <span className="text-slate-400 cursor-pointer">重置条件</span>
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
            <span>竞价须知 &gt;</span>
            <span>充值保证金 &gt;</span>
          </div>
        </div>

        {/* Tab栏 */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">全部竞价车辆</span>
            <span className="text-slate-500">未出价车辆</span>
            <span className="text-slate-500">已出价车辆</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="text-red-500">默认排序 ▾</span>
            <span>上牌时间 ▾</span>
            <span>竞价价格 ▾</span>
          </div>
        </div>

        {/* 空状态 */}
        <div className="bg-white flex flex-col items-center justify-center py-16">
          <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl text-slate-300">🔍</span>
          </div>
          <p className="text-sm text-slate-400">未找到搜索车辆</p>
        </div>

        {/* 为您推荐标题 */}
        <div className="bg-white flex items-center justify-center py-4 gap-2">
          <span className="text-red-400 text-lg">❝</span>
          <span className="text-xl font-bold text-slate-900">为您推荐</span>
          <span className="text-red-400 text-lg">❞</span>
        </div>

        {/* 现有样式推荐卡片 */}
        <div className="bg-white px-6 pb-6">
          {loading ? (
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {recommendations.slice(0, 4).map((car) => (
                <div key={car.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">专业检测</span>
                    {car.conditionScore && (
                      <span className="absolute top-2 right-2 text-[10px] bg-slate-800/80 text-white px-1.5 py-0.5 rounded font-bold">
                        {car.conditionScore}{car.conditionScore >= 90 ? 'A' : 'B'}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 px-2 py-1">
                      <span className="text-[10px] text-orange-400 font-semibold">竞价中</span>
                      <span className="text-[10px] text-white/80">{car.conditionScore}A</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-red-500 mb-0.5">📍{car.location}</p>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">{car.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">
                      粤A | {car.year}-01 | {(car.mileage / 10000).toFixed(2)}万公里 | 0次过户
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-px rounded">竞价大厅</span>
                      {car.price > 100000 && <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-px rounded">上新</span>}
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <span className="text-sm font-bold text-red-600">¥{(car.price / 10000).toFixed(1)}</span>
                        <span className="text-xs text-slate-500 ml-0.5">万起</span>
                      </div>
                      <span className="text-[10px] text-slate-400">4月2日 15:00结束</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ 新样式 ═══ */}
      <div className="text-center pt-6 pb-2">
        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">新样式</span>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              为您推荐
            </h1>

          </div>
        </div>
      </div>

      {/* Login Prompt Banner - 未登录引导条 */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 md:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-blue-600" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-slate-900">
                  登录后查看您的专属推荐车源
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  搜索结果页底部展示推荐车辆
                </p>
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              立即登录
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {recommendations.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onLike={handleLike}
                  onView={handleView}
                  onVehicleClick={onVehicleClick}
                  isLiked={userPreferences.likedCars.includes(car.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
