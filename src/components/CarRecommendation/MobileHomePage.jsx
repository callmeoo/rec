import React from 'react';
import { Search, ChevronRight, Shield, Clock, BarChart3 } from 'lucide-react';

/**
 * 移动端首页上半部分 — 搜索栏、公告、品牌/价格筛选、专场车源
 * 设计参考：二手车拍卖平台移动端首页截图
 */
const MobileHomePage = () => {
  const brands = [
    { name: '大众', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
    { name: '本田', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { name: '丰田', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Toyota_logo_%28Red%29.svg' },
    { name: '日产', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Nissan_logo_2020.svg' },
    { name: '更多', logo: null },
  ];

  const priceFilters = ['3万以下', '3-5万', '5-8万', '8-15万', '15-20万'];
  const quickFilters = ['新能源', '广州', '深圳', '惠州', '更多条件'];

  return (
    <div className="bg-white">
      {/* 搜索栏 */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400">搜一搜 品牌/车系/车型</span>
        </div>
      </div>

      {/* 公告横幅 */}
      <div className="mx-4 mt-2 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 100%)' }}>
        <div className="flex items-stretch">
          <div className="flex-1 p-4">
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              平台竞买须知重要规则调整公告
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">2026年4月1日起生效</p>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                一、竞价保证金及违约金调整（政企专场除外）
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                二、原交转让登记材料的违约责任重要说明
              </p>
            </div>
          </div>
          <div className="w-28 flex items-center justify-center pr-3">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* 平台信息条 */}
      <div className="flex items-center justify-center gap-6 px-4 py-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Shield size={12} className="text-gray-400" />
          <span>国企基因</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-gray-400" />
          <span>20年行业深耕</span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 size={12} className="text-gray-400" />
          <span>股票代码872019</span>
        </div>
      </div>

      {/* 品牌筛选 */}
      <div className="mx-4 mt-1 border border-gray-100 rounded-xl p-4">
        {/* 品牌图标行 */}
        <div className="flex items-center justify-between mb-4">
          {brands.map((brand, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                {brand.logo ? (
                  <span style={{ display: 'none' }} className="text-lg text-gray-400">···</span>
                ) : (
                  <span className="text-lg text-gray-400">···</span>
                )}
              </div>
              <span className="text-xs text-gray-700">{brand.name}</span>
            </div>
          ))}
        </div>

        {/* 价格筛选 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {priceFilters.map((filter, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700 border border-gray-100 cursor-pointer active:bg-gray-100"
            >
              {filter}
            </span>
          ))}
        </div>

        {/* 快捷筛选 */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700 border border-gray-100 cursor-pointer active:bg-gray-100"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      {/* 专场车源 */}
      <div className="mx-4 mt-4 mb-2">
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: 'auto auto' }}>
          {/* 左侧大卡片 - 跨2行 */}
          <div
            className="row-span-2 rounded-xl p-3 flex flex-col justify-between"
            style={{ background: 'linear-gradient(160deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)' }}
          >
            <div>
              <h3 className="text-white font-bold text-base leading-tight">专场车源</h3>
              <div className="mt-2 space-y-0.5">
                <p className="text-white/80 text-[10px]">顺序拍  比亚迪专场</p>
                <p className="text-white/80 text-[10px]">报废车专场  政企专场</p>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-3xl">🚗</span>
              </div>
            </div>
          </div>

          {/* 右上 - 比亚迪专场 */}
          <div className="col-span-2 bg-gray-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-900">比亚迪专场</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">厂家车源</p>
            </div>
            <div className="flex -space-x-2">
              <div className="w-12 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-lg">🚙</div>
              <div className="w-12 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-lg">🏎️</div>
            </div>
          </div>

          {/* 右下两个小卡片 */}
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="font-bold text-xs text-gray-900">报废车专场</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">需报废资质</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="font-bold text-xs text-gray-900">我要卖车</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">直卖好价</p>
          </div>
        </div>
      </div>

      {/* 底部服务条 */}
      <div className="flex items-center justify-between mx-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">唯车转报告</span>
          <span className="text-[10px] text-gray-400">查维保出险电池</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">唯普国际版</span>
          <span className="text-[10px] text-gray-400">和世界分享中国新能源车</span>
        </div>
      </div>
    </div>
  );
};

export default MobileHomePage;
