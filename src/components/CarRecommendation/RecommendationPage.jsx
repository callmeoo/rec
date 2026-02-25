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
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              为您推荐
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              基于您的浏览记录和偏好为您推荐
            </p>
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
                  基于您的浏览和出价记录，为您智能推荐更匹配的车辆
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
