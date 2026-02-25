import React, { useState, useEffect } from 'react';
import { Heart, Eye, Clock, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import CarCard from './CarCard';
import FilterPanel from './FilterPanel';
import { getRecommendations } from './recommendationEngine';

const RecommendationPage = () => {
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

  useEffect(() => {
    loadRecommendations();
  }, [filters, userPreferences]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      const cars = getRecommendations(userPreferences, filters);
      setRecommendations(cars);
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
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={28} />
              猜你喜欢
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              基于您的浏览记录和偏好为您推荐
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Filter size={18} />
              <span>筛选</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              <span>换一批</span>
            </button>
          </div>
        </div>
      </div>

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
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-slate-600">
                为您找到 <span className="font-semibold text-blue-600">{recommendations.length}</span> 辆推荐车辆
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onLike={handleLike}
                    onView={handleView}
                    isLiked={userPreferences.likedCars.includes(car.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
