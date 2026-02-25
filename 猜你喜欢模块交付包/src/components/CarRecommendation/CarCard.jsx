import React, { useState } from 'react';
import { Heart, Eye, Clock, MapPin, Gauge, Calendar, Award } from 'lucide-react';
import { clsx } from 'clsx';

const CarCard = ({ car, onLike, onView, isLiked }) => {
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
    // 这里可以跳转到详情页
    console.log('查看车辆详情:', car.id);
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
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={clsx(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all",
            liked
              ? "bg-red-500 text-white"
              : "bg-white/80 text-slate-600 hover:bg-white"
          )}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Recommendation Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs rounded-md flex items-center gap-1">
          <Award size={12} />
          <span>推荐</span>
        </div>

        {/* Auction Status */}
        {car.auctionStatus && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded-md flex items-center gap-1">
            <Clock size={12} />
            <span>{car.auctionStatus}</span>
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
            {formatPrice(car.price)}
          </span>
          {car.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(car.originalPrice)}
            </span>
          )}
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
            <Eye size={14} />
            <span>{car.views}次浏览</span>
          </div>
        </div>

        {/* Recommend Reason */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-xs text-blue-600 flex items-center gap-1">
            <Award size={12} />
            {getRecommendReason()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
