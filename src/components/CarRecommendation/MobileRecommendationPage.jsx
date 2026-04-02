import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, MapPin, Calendar, Gauge, Clock, FileCheck, Home, Grid3X3, Tent, UserCircle, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { getRecommendations } from './recommendationEngine';
import MobileHomePage from './MobileHomePage';
import { trackRecommendationExposure, trackPageView, trackCarCardClick } from '../../utils/umengTracking';

/* ─── 移动端车辆卡片 ─── */
const MobileCarCard = ({ car, onLike, onView, onVehicleClick, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) onLike(car.id);
  };

  const handleCardClick = () => {
    onView(car.id);
    trackCarCardClick({
      userId: null,
      carId: car.id,
      carBrand: car.brand,
      carModel: car.model,
      position: car.position || 0,
      candidateSet: car.candidateSet || '未知',
      deviceType: 'Mobile',
    });
    if (car.status === 'removed') { alert('该车辆已下架，请刷新页面'); return; }
    if (car.status === 'ended') { alert('该车辆竞价已结束，请刷新页面'); return; }
    if (onVehicleClick) onVehicleClick(car.id);
  };

  const formatPrice = (p) => (p / 10000).toFixed(1) + '万';

  const getConditionGrade = () => {
    if (!car.conditionScore) return '';
    const s = car.conditionScore;
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    return 'D';
  };

  return (
    <div onClick={handleCardClick} className="bg-white rounded-lg overflow-hidden active:opacity-90 transition-opacity">
      {/* 图片 */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
        {/* 车况评分 */}
        {car.conditionScore && (
          <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            {car.conditionScore}{getConditionGrade()}
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="px-2 pt-2 pb-3">
        {/* 专业检测标签 + 车名 */}
        <div className="flex items-start gap-1 mb-1">
          <span className="flex-shrink-0 mt-0.5 text-[10px] bg-orange-500 text-white px-1 py-px rounded font-medium">专业检测</span>
          <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">{car.name}</h3>
        </div>

        {/* 参数行 */}
        <p className="text-[11px] text-gray-400 mt-1 truncate">
          {car.year}-01-01 | {(car.mileage / 10000).toFixed(2)}万公里 | {car.location} | {car.transferCount || 0}
        </p>

        {/* 价格 + 收藏 */}
        <div className="flex items-end justify-between mt-1.5">
          <span className="text-base font-bold text-red-600">{formatPrice(car.price)}起</span>
          <button
            onClick={handleLike}
            className={clsx('p-1 rounded-full', liked ? 'text-red-500' : 'text-gray-300')}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── 新样式车辆卡片（无专业检测、年月格式、含推荐标签） ─── */
const NewStyleCarCard = ({ car, onLike, onView, onVehicleClick, isLiked, index }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) onLike(car.id);
  };

  const handleCardClick = () => {
    onView(car.id);
    if (car.status === 'removed') { alert('该车辆已下架，请刷新页面'); return; }
    if (car.status === 'ended') { alert('该车辆竞价已结束，请刷新页面'); return; }
    if (onVehicleClick) onVehicleClick(car.id);
  };

  const formatPrice = (p) => (p / 10000).toFixed(1) + '万';
  const getConditionGrade = () => {
    if (!car.conditionScore) return '';
    const s = car.conditionScore;
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    return 'D';
  };

  // 模拟促销标签
  const showCrowd = index % 3 === 0 || index % 4 === 0;
  const showIntent = index % 2 === 0;
  const showTurnover = index % 3 !== 1;
  const crowdCount = 10 + (index * 7) % 30;

  return (
    <div onClick={handleCardClick} className="bg-white rounded-lg overflow-hidden active:opacity-90 transition-opacity">
      <div className="relative aspect-[4/3] bg-gray-100">
        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
        {car.conditionScore && (
          <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            {car.conditionScore}{getConditionGrade()}
          </div>
        )}
      </div>
      <div className="px-2 pt-2 pb-3">
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{car.name}</h3>
        <p className="text-[11px] text-gray-400 mt-1 truncate">
          {car.year}-01 | {(car.mileage / 10000).toFixed(2)}万公里 | {car.location} | {car.transferCount || 0}
        </p>
        {/* 推荐标签 */}
        <div className="flex gap-1 flex-wrap mt-1.5">
          {showCrowd && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-px rounded font-medium">{crowdCount}人围观</span>}
          {showIntent && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-px rounded font-medium">多人意向</span>}
          {showTurnover && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-px rounded font-medium">周转快</span>}
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <span className="text-base font-bold text-red-600">{formatPrice(car.price)}起</span>
          <button onClick={handleLike} className={clsx('p-1 rounded-full', liked ? 'text-red-500' : 'text-gray-300')}>
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── 底部 Tab 栏 ─── */
const BottomTabBar = () => (
  <div className="flex items-center justify-around bg-white border-t border-gray-200 py-2 px-2">
    <div className="flex flex-col items-center gap-0.5 text-red-600">
      <Home size={20} />
      <span className="text-[10px] font-medium">首页</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <Grid3X3 size={20} />
      <span className="text-[10px]">全部车源</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <Tent size={20} />
      <span className="text-[10px]">专场车源</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <UserCircle size={20} />
      <span className="text-[10px]">个人中心</span>
    </div>
  </div>
);

/* ─── 现有样式手机页面（无引导条、无个性化标签） ─── */
const MobilePhoneFrameOld = ({ recommendations, loading }) => (
  <div className="w-[375px] h-[812px] bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative">
    {/* 状态栏 */}
    <div className="h-11 bg-white flex items-end justify-between px-6 pb-1">
      <span className="text-xs font-semibold text-gray-900">9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-900 rounded-[1px]" />
        </div>
      </div>
    </div>

    {/* 可滚动内容 */}
    <div className="flex-1 overflow-y-auto">
      {/* 首页上半部分 */}
      <MobileHomePage />

      {/* 猜你喜欢标题（现有样式） */}
      <div className="flex items-center justify-center py-3">
        <span className="text-base font-bold text-gray-900">为您推荐</span>
      </div>

      {/* 车辆列表（无个性化，简单双列） */}
      <div className="px-3 pb-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {recommendations.map((car) => (
              <MobileCarCard
                key={car.id}
                car={car}
                onLike={() => {}}
                onView={() => {}}
                onVehicleClick={null}
                isLiked={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* 底部 Tab */}
    <BottomTabBar />
  </div>
);

/* ─── 单列完整手机页面（首页上半 + 为您推荐下半） ─── */
const MobilePhoneFrame = ({ isLoggedIn, recommendations, loading, onLike, onView, onVehicleClick, likedCars }) => (
  <div className="w-[375px] h-[812px] bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative">
    {/* 状态栏 */}
    <div className="h-11 bg-white flex items-end justify-between px-6 pb-1">
      <span className="text-xs font-semibold text-gray-900">9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-900 rounded-[1px]" />
        </div>
      </div>
    </div>

    {/* 可滚动内容 */}
    <div className="flex-1 overflow-y-auto">
      {/* 首页上半部分 */}
      <MobileHomePage />

      {/* 为您推荐标题 */}
      <div className="flex items-center justify-center pt-3 pb-1">
        <span className="text-base font-bold text-gray-900">为您推荐</span>
      </div>

      {/* 登录引导条（仅未登录时显示）— 放在"为您推荐"下方 */}
      {!isLoggedIn && (
        <div className="mx-4 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-blue-600" size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-900">登录后查看专属推荐</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-medium flex-shrink-0">
              登录
            </button>
          </div>
        </div>
      )}

      {/* 推荐车辆列表 */}
      <div className="px-3 pb-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-2.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {recommendations.map((car, idx) => (
              <NewStyleCarCard
                key={car.id}
                car={car}
                index={idx}
                onLike={onLike}
                onView={onView}
                onVehicleClick={onVehicleClick}
                isLiked={likedCars.includes(car.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    {/* 底部 Tab */}
    <BottomTabBar />
  </div>
);

/* ─── 搜索无结果底部Tab栏（全部车源高亮） ─── */
const SearchBottomTabBar = () => (
  <div className="flex items-center justify-around bg-white border-t border-gray-200 py-2 px-2">
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <Home size={20} />
      <span className="text-[10px]">首页</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-red-600">
      <Grid3X3 size={20} />
      <span className="text-[10px] font-medium">全部车源</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <Tent size={20} />
      <span className="text-[10px]">专场车源</span>
    </div>
    <div className="flex flex-col items-center gap-0.5 text-gray-400">
      <UserCircle size={20} />
      <span className="text-[10px]">个人中心</span>
    </div>
  </div>
);

/* ─── 搜索页顶部导航 ─── */
const SearchHeader = () => (
  <div className="bg-white">
    {/* 顶部Tab */}
    <div className="flex items-center px-4 pt-2 pb-1 gap-4">
      <span className="text-lg font-black text-gray-900">全部<span className="text-red-500">▼</span></span>
      <span className="text-sm text-gray-500">竞价大厅</span>
      <span className="text-sm text-gray-500">有保留价</span>
      <span className="ml-auto text-gray-400"><Search size={18} /></span>
    </div>
    {/* 筛选条 */}
    <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100 text-xs text-gray-600">
      <span>排序▾</span><span>品牌▾</span><span>车况▾</span><span>筛选▾</span>
    </div>
    {/* 已选条件 */}
    <div className="flex items-center justify-between px-4 py-1.5 text-[11px]">
      <span className="text-gray-600">车况评分:100 <span className="text-gray-400 ml-1">×</span></span>
      <span className="text-gray-400">重置条件</span>
    </div>
  </div>
);

/* ─── 搜索无结果-现有样式 ─── */
const SearchNoResultOld = () => (
  <div className="w-[320px] h-[692px] bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative">
    <div className="h-11 bg-white flex items-end justify-between px-6 pb-1">
      <span className="text-xs font-semibold text-gray-900">9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-900 rounded-[1px]" />
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      <SearchHeader />
      {/* 空状态 */}
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-6xl">🚗</span>
        </div>
        <p className="text-sm text-gray-400">没有找到您想要的车源</p>
      </div>
    </div>
    <SearchBottomTabBar />
  </div>
);

/* ─── 搜索无结果-新样式（带推荐列表） ─── */
const SearchNoResultNew = ({ isLoggedIn, recommendations }) => (
  <div className="w-[320px] h-[692px] bg-gray-50 rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative">
    <div className="h-11 bg-white flex items-end justify-between px-6 pb-1">
      <span className="text-xs font-semibold text-gray-900">9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-900 rounded-[1px]" />
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      <SearchHeader />
      {/* 引导文案 */}
      <div className="px-4 py-3">
        <p className="text-sm text-blue-600 text-center">未找到符合条件的车源，为您推荐以下车辆</p>
      </div>
      {/* 推荐车辆列表（横向卡片） */}
      <div className="px-3 pb-4 space-y-3">
        {recommendations.slice(0, 3).map((car, idx) => (
          <div key={car.id} className="bg-white rounded-lg overflow-hidden flex">
            {/* 左侧图片 */}
            <div className="w-28 h-24 flex-shrink-0 relative bg-gray-100">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              {car.conditionScore && (
                <div className="absolute top-1 left-1 bg-slate-800/80 text-white text-[9px] font-bold px-1 py-px rounded">
                  {car.conditionScore}{car.conditionScore >= 90 ? 'A' : car.conditionScore >= 80 ? 'B' : 'C'}
                </div>
              )}
              <div className="absolute bottom-1 left-1 flex items-center gap-1">
                <span className="text-[8px] bg-orange-500 text-white px-1 rounded">竞价中</span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">00:56:52结束</span>
              </div>
            </div>
            {/* 右侧信息 */}
            <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
              <div>
                <h4 className="text-xs font-semibold text-gray-900 leading-snug line-clamp-1 flex items-center gap-1">
                  <span className="text-red-500 flex items-center gap-0.5 flex-shrink-0"><MapPin size={10} />{car.location}</span>
                  <span className="truncate">{car.name}</span>
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                  {car.year}-01 | {(car.mileage / 10000).toFixed(2)}万公里
                </p>
              </div>
              <div>
                {/* 促销标签 */}
                <div className="flex gap-1 flex-wrap mb-1">
                  {idx === 0 && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-px rounded font-medium">20人围观</span>}
                  {idx < 2 && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-px rounded font-medium">多人意向</span>}
                  <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-px rounded font-medium">周转快</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-red-600">{(car.price / 10000).toFixed(1)}万起</span>
                  <Heart size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <SearchBottomTabBar />
  </div>
);

/* ─── 主组件：两列并排展示 ─── */
const MobileRecommendationPage = ({ onVehicleClick }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    viewedCars: [],
    likedCars: [],
    searchHistory: [],
  });

  useEffect(() => {
    loadRecommendations();
    trackPageView('recommendation_page_mobile', { device_type: 'Mobile', is_logged_in: false });
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const cars = getRecommendations(userPreferences, {
        priceRange: [0, 1000000],
        brands: [],
        years: [],
        mileage: [0, 300000],
      });
      setRecommendations(cars);
      trackRecommendationExposure({
        userId: null,
        deviceType: 'Mobile',
        carIds: cars.map((c) => c.id),
        exposureCount: cars.length,
      });
    } catch (e) {
      console.error('加载推荐失败:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (carId) => {
    setUserPreferences((prev) => ({ ...prev, likedCars: [...prev.likedCars, carId] }));
  };
  const handleView = (carId) => {
    setUserPreferences((prev) => ({ ...prev, viewedCars: [...prev.viewedCars, carId] }));
  };

  return (
    <div className="h-full bg-slate-100 overflow-y-auto">
      {/* 标题 */}
      <div className="text-center pt-6 pb-2">
        <h1 className="text-xl font-bold text-gray-900">为您推荐（移动端）</h1>
        <p className="text-sm text-gray-500 mt-1">现有样式 → 登录前（含引导条） → 登录后</p>
      </div>

      {/* 三列手机预览 */}
      <div className="flex items-start justify-center gap-8 px-6 py-6">
        {/* 左列：现有样式 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">现有样式</span>
          <MobilePhoneFrameOld recommendations={recommendations} loading={loading} />
        </div>

        {/* 中列：未登录 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">新样式-登录前</span>
          <MobilePhoneFrame
            isLoggedIn={false}
            recommendations={recommendations}
            loading={loading}
            onLike={handleLike}
            onView={handleView}
            onVehicleClick={onVehicleClick}
            likedCars={userPreferences.likedCars}
          />
        </div>

        {/* 右列：已登录 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">新样式-登录后</span>
          <MobilePhoneFrame
            isLoggedIn={true}
            recommendations={recommendations}
            loading={loading}
            onLike={handleLike}
            onView={handleView}
            onVehicleClick={onVehicleClick}
            likedCars={userPreferences.likedCars}
          />
        </div>
      </div>
      {/* 搜索无车源效果 */}
      <div className="text-center pt-8 pb-2 border-t border-gray-200 mt-6 mx-6">
        <h2 className="text-lg font-bold text-gray-900">搜索无车源</h2>
        <p className="text-sm text-gray-500 mt-1">现有样式 vs 新样式对比</p>
      </div>

      <div className="flex items-start justify-center gap-6 px-6 py-6 flex-wrap">
        {/* 现有样式 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">现有样式</span>
          <SearchNoResultOld />
        </div>

        {/* 新样式-登录前 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">新样式-搜索无结果（登录前）</span>
          <p className="text-xs text-gray-400 -mt-1">候选集2 + 候选集3</p>
          <SearchNoResultNew isLoggedIn={false} recommendations={recommendations} />
        </div>

        {/* 新样式-登录后 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">新样式-搜索无结果（登录后）</span>
          <p className="text-xs text-gray-400 -mt-1">候选集1 + 候选集2 + 候选集3</p>
          <SearchNoResultNew isLoggedIn={true} recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
};

export default MobileRecommendationPage;
