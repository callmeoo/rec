import React, { useState } from 'react';
import { Heart, Clock, MapPin, Gauge, Calendar, FileCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { trackCarCardClick } from '../../utils/umengTracking';

const CarCard = ({ car, onLike, onView, onVehicleClick, isLiked }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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
      deviceType: 'PC'
    });
    
    // 检查车辆状态
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

  const getRecommendReason = () => {
    if (car.recommendReason) {
      return car.recommendReason;
    }
    return '根据您的浏览记录推荐';
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

  // 获取促销标签（只显示周转快）
  const getPromotionTag = () => {
    const turnoverScore = car.turnoverScore || 0;
    
    // 周转快（周转分 > 70）
    if (turnoverScore > 70) {
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
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={car.image}
          alt={car.name}
          onLoad={() => setImageLoaded(true)}
          className={clsx(
            "w-full h-full object-cover transition-transform duration-300 group-hover:scale-110",
            !imageLoaded && "opacity-0"
          )}
        />
        
        {/* 车况评分 - 右上角 */}
        {car.conditionScore && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600 text-white rounded text-sm font-semibold">
            {car.conditionScore}{getConditionGrade()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-1">
          {car.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-red-600">
            {formatPrice(car.price)}起
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{car.year}年</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={14} />
            <span>{(car.mileage / 10000).toFixed(1)}万公里</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{car.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileCheck size={14} />
            <span>{car.transferCount || 0}次过户</span>
          </div>
        </div>

        {/* End Time */}
        {car.endTime && (
          <div className="flex items-center gap-1 text-xs text-orange-600 mb-3">
            <Clock size={14} />
            <span>{formatEndTime()}</span>
          </div>
        )}

        {/* Interaction Data */}
        {car.viewUV && (
          <div className="flex gap-3 mb-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>{car.viewUV}人围观</span>
            {car.bidderCount > 0 && (
              <span className="px-2 py-0.5 bg-green-500 text-white rounded">
                多人意向
              </span>
            )}
            {promotionTag && (
              <span className={`px-2 py-0.5 ${promotionTag.color} text-white rounded`}>
                {promotionTag.text}
              </span>
            )}
          </div>
        )}

        {/* 收藏按钮 - 右下角 */}
        <div className="flex justify-end">
          <button
            onClick={handleLike}
            className={clsx(
              "p-2 rounded-full transition-all",
              liked
                ? "bg-red-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
