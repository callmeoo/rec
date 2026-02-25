import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, RefreshCw, MapPin, Calendar, Gauge, Clock, FileCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { getRecommendations } from './recommendationEngine';
import { trackRecommendationExposure, trackPageView, trackCarCardClick } from '../../utils/umengTracking';

const MobileCarCard = ({ car, onLike, onView, onVehicleClick, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) {
      onLike(car.id);
    }
  };

  const handleCardClick = () => {
    onView(car.id);
    
    // 车辆卡片点击埋点
    trackCarCardClick({
      userId: null, // 实际使用时从用户状态获取
      carId: car.id,
      carBrand: car.brand,
      carModel: car.model,
      position: car.position || 0,
      candidateSet: car.candidateSet || '未知',
      deviceType: 'Mobile'
    });
    
    if (car.status === 'removed') {
      alert('该车辆已下架，请刷新页面');
      return;
    }
    if (car.status === 'ended') {
      alert('该车辆竞价已结束，请刷新页面');
      return;
    }
    
    // 跳转到详情页
    if (onVehicleClick) {
      onVehicleClick(car.id);
    }
  };

  const formatPrice = (price) => {
    return (price / 10000).toFixed(2) + '万';
  };

  // 格式化结束时间（整点或半点）
  const formatEndTime = () => {
    if (!car.endTime) return '';
    
    const endDate = new Date(car.endTime);
    const now = new Date();
    const diffMs = endDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // 如果≤2小时，显示倒计时
    if (diffHours <= 2 && diffHours > 0) {
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);
      return `${hours}小时${minutes}分钟`;
    }
    
    // 否则显示具体结束时间（整点或半点）
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    const hour = String(endDate.getHours()).padStart(2, '0');
    // 分钟只显示00或30
    const minute = endDate.getMinutes() >= 30 ? '30' : '00';
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  // 获取促销标签（只保留周转快）
  const getPromotionTag = () => {
    if (car.turnoverScore && car.turnoverScore > 70) {
      return { text: '周转快', color: 'bg-green-500' };
    }
    return null;
  };

  // 获取车况评分等级
  const getConditionGrade = () => {
    if (!car.conditionScore) return '';
    
    const score = car.conditionScore;
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const promotionTag = getPromotionTag();

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm active:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative h-40 bg-slate-200">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        
        {/* 车况评分 - 右上角 */}
        {car.conditionScore && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs font-semibold">
            {car.conditionScore}{getConditionGrade()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-1">
          {car.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(car.price)}起
          </span>
        </div>

        {/* Details */}
        <div className="flex gap-3 mb-2 text-xs text-slate-600">
          <div className="flex items-center gap-0.5">
            <MapPin size={12} />
            <span>{car.location}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Calendar size={12} />
            <span>{car.year}年</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Gauge size={12} />
            <span>{(car.mileage / 10000).toFixed(1)}万公里</span>
          </div>
          <div className="flex items-center gap-0.5">
            <FileCheck size={12} />
            <span>{car.transferCount || 0}次过户</span>
          </div>
        </div>

        {/* End Time */}
        {car.endTime && (
          <div className="flex items-center gap-0.5 text-xs text-orange-600 mb-2">
            <Clock size={12} />
            <span>{formatEndTime()}</span>
          </div>
        )}

        {/* Transfer Count and Interaction */}
        <div className="flex gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
          {car.viewUV && (
            <span>{car.viewUV}人围观</span>
          )}
          {car.bidderCount > 0 && (
            <span className="px-1.5 py-0.5 bg-green-500 text-white rounded text-xs">
              多人意向
            </span>
          )}
          {promotionTag && (
            <span className={`px-1.5 py-0.5 ${promotionTag.color} text-white rounded text-xs`}>
              {promotionTag.text}
            </span>
          )}
        </div>

        {/* 收藏按钮 - 右下角 */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleLike}
            className={clsx(
              "p-1.5 rounded-full",
              liked ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"
            )}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileRecommendationPage = ({ onVehicleClick }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    viewedCars: [],
    likedCars: [],
    searchHistory: []
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 模拟登录状态

  useEffect(() => {
    loadRecommendations();
    
    // 页面浏览埋点
    trackPageView('recommendation_page_mobile', {
      device_type: 'Mobile',
      is_logged_in: isLoggedIn
    });
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const cars = getRecommendations(userPreferences, {
        priceRange: [0, 1000000],
        brands: [],
        years: [],
        mileage: [0, 300000]
      });
      setRecommendations(cars);
      
      // 推荐模块曝光埋点
      trackRecommendationExposure({
        userId: isLoggedIn ? 'user_123' : null,
        deviceType: 'Mobile',
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
      device_type: 'Mobile',
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              为您推荐
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              基于您的浏览记录和偏好
            </p>
          </div>
        </div>
      </div>

      {/* Login Prompt Banner - 未登录引导条 */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-blue-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900">
                  登录后查看专属推荐
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  智能匹配更适合您的车源
                </p>
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex-shrink-0"
            >
              登录
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recommendations.map((car) => (
              <MobileCarCard
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
  );
};

export default MobileRecommendationPage;
