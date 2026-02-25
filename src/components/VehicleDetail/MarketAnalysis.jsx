import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, DollarSign } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const MarketAnalysis = ({ market, vehicle }) => {
  React.useEffect(() => {
    trackEvent('market_data_view', {
      vehicle_id: vehicle.id
    });
  }, []);

  const priceComparison = calculatePriceComparison(vehicle.currentPrice, market.avgPrice);

  return (
    <div className="space-y-6">
      {/* 价格对比卡片 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">价格对比分析</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <PriceCard
            label="当前价"
            value={vehicle.currentPrice}
            highlight
          />
          <PriceCard
            label="市场均价"
            value={market.avgPrice}
          />
          <PriceCard
            label="中位价"
            value={market.medianPrice}
          />
        </div>

        <div className="flex items-center justify-center space-x-2 text-lg">
          {priceComparison.isLower ? (
            <>
              <TrendingDown className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-green-600">
                低于市场均价 {Math.abs(priceComparison.percentage)}%
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="w-6 h-6 text-red-600" />
              <span className="font-semibold text-red-600">
                高于市场均价 {priceComparison.percentage}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* 价格分布图 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">同款车近30天成交价格分布</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <PriceDistributionChart 
            distribution={market.priceDistribution}
            currentPrice={vehicle.currentPrice}
          />
        </div>
      </div>

      {/* 市场需求分析 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">市场需求分析</h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            label="近30天成交"
            value={`${market.recentDeals}辆`}
            trend="high"
          />
          <MetricCard
            icon={<Clock className="w-6 h-6 text-green-600" />}
            label="平均成交周期"
            value={`${market.turnoverDays}天`}
            trend="low"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6 text-red-600" />}
            label="需求热度"
            value={market.demandLevel === 'high' ? '高🔥' : '中等'}
            trend="high"
          />
          <MetricCard
            icon={<DollarSign className="w-6 h-6 text-purple-600" />}
            label="价格趋势"
            value="稳定"
            trend="stable"
          />
        </div>
      </div>

      {/* 本地市场数据 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">本地市场（{vehicle.location}）</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <LocalMarketItem
            label="在售同款车"
            value="12辆"
            note="竞争程度：中等"
          />
          <LocalMarketItem
            label="平均售价"
            value={`${(market.avgPrice * 1.08 / 10000).toFixed(1)}万`}
            note="比采购价高8%"
          />
          <LocalMarketItem
            label="平均周转"
            value={`${market.turnoverDays + 4}天`}
            note="略高于全国平均"
          />
        </div>
      </div>

      {/* 市场建议 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">💡 市场建议</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              该车型市场需求旺盛，近30天成交{market.recentDeals}辆，平均周转仅需{market.turnoverDays}天。
              当前价格{priceComparison.isLower ? '低于' : '高于'}市场均价{Math.abs(priceComparison.percentage)}%，
              {priceComparison.isLower ? '具有较好的利润空间' : '建议谨慎出价'}。
              预计{market.turnoverDays}天内可售出，建议出价不超过{(vehicle.currentPrice * 1.1 / 10000).toFixed(1)}万。
            </p>
          </div>
        </div>
      </div>

      {/* 历史成交案例 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">近期成交案例</h3>
        <div className="space-y-3">
          {generateRecentDeals(vehicle, market).map((deal, index) => (
            <DealCard key={index} deal={deal} />
          ))}
        </div>
      </div>
    </div>
  );
};

// 价格卡片
const PriceCard = ({ label, value, highlight }) => (
  <div className={`text-center p-4 rounded-lg ${highlight ? 'bg-blue-600 text-white' : 'bg-white'}`}>
    <p className={`text-sm mb-1 ${highlight ? 'text-blue-100' : 'text-gray-600'}`}>{label}</p>
    <p className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
      {(value / 10000).toFixed(1)}万
    </p>
  </div>
);

// 价格分布图
const PriceDistributionChart = ({ distribution, currentPrice }) => {
  const maxCount = Math.max(...distribution.map(d => d.count));

  return (
    <div className="space-y-3">
      {distribution.map((item, index) => {
        const percentage = (item.count / maxCount) * 100;
        const isCurrentRange = isInPriceRange(currentPrice, item.range);

        return (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${isCurrentRange ? 'text-blue-600' : 'text-gray-700'}`}>
                {item.range}
                {isCurrentRange && ' ← 当前价'}
              </span>
              <span className="text-sm text-gray-600">{item.count}辆</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full transition-all ${isCurrentRange ? 'bg-blue-600' : 'bg-gray-400'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 指标卡片
const MetricCard = ({ icon, label, value, trend }) => {
  const trendColors = {
    high: 'border-red-200 bg-red-50',
    low: 'border-green-200 bg-green-50',
    stable: 'border-blue-200 bg-blue-50'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${trendColors[trend]}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

// 本地市场项
const LocalMarketItem = ({ label, value, note }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600 mt-1">{note}</p>
    </div>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

// 成交案例卡片
const DealCard = ({ deal }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{deal.name}</span>
          <span className="text-sm text-gray-500">{deal.year}年 • {(deal.mileage / 10000).toFixed(1)}万公里</span>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
          <span>成交价：<span className="font-semibold text-green-600">{(deal.price / 10000).toFixed(1)}万</span></span>
          <span>周转：{deal.turnoverDays}天</span>
          <span>{deal.location}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{deal.date}</p>
      </div>
    </div>
  </div>
);

// 计算价格对比
const calculatePriceComparison = (currentPrice, avgPrice) => {
  const diff = currentPrice - avgPrice;
  const percentage = Math.abs((diff / avgPrice) * 100).toFixed(1);
  return {
    isLower: diff < 0,
    percentage: parseFloat(percentage)
  };
};

// 判断是否在价格区间内
const isInPriceRange = (price, range) => {
  const [min, max] = range.replace('万', '').split('-').map(v => parseFloat(v) * 10000);
  return price >= min && price <= max;
};

// 生成近期成交案例
const generateRecentDeals = (vehicle, market) => {
  return [
    {
      name: `${vehicle.brand} ${vehicle.series}`,
      year: vehicle.year,
      mileage: 28000,
      price: market.avgPrice * 0.98,
      turnoverDays: 25,
      location: vehicle.location,
      date: '3天前'
    },
    {
      name: `${vehicle.brand} ${vehicle.series}`,
      year: vehicle.year - 1,
      mileage: 35000,
      price: market.avgPrice * 0.95,
      turnoverDays: 32,
      location: vehicle.location,
      date: '1周前'
    },
    {
      name: `${vehicle.brand} ${vehicle.series}`,
      year: vehicle.year,
      mileage: 22000,
      price: market.avgPrice * 1.02,
      turnoverDays: 18,
      location: vehicle.location,
      date: '2周前'
    }
  ];
};

export default MarketAnalysis;
