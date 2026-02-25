import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Bell } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const BiddingDynamics = ({ bidding, vehicleId }) => {
  const [showProxyBid, setShowProxyBid] = useState(false);
  const [proxyAmount, setProxyAmount] = useState('');
  const [increment, setIncrement] = useState(2000);

  return (
    <div className="space-y-6">
      {/* 实时数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          label="出价次数"
          value={bidding.bidCount}
          unit="次"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          label="出价人数"
          value={bidding.bidderCount}
          unit="人"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          label="浏览次数"
          value={bidding.viewCount}
          unit="次"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-purple-600" />}
          label="关注人数"
          value={bidding.viewUV}
          unit="人"
        />
      </div>

      {/* 竞价提示 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bell className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">竞价提示</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 已有 {bidding.bidderCount} 位买家关注此车</li>
              <li>• 最近10分钟内有 {Math.min(3, bidding.bidderCount)} 次出价</li>
              <li>• 建议尽快出价，避免错过</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 出价记录 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">出价记录（实时更新）</h3>
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {bidding.history.map((record, index) => (
            <BidRecord key={index} record={record} isLatest={index === 0} />
          ))}
        </div>
        <button
          onClick={() => {
            trackEvent('view_all_bids', { vehicle_id: vehicleId });
            alert('查看全部出价记录');
          }}
          className="w-full mt-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          查看全部出价记录
        </button>
      </div>

      {/* 代理出价 */}
      <div>
        <button
          onClick={() => setShowProxyBid(!showProxyBid)}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          {showProxyBid ? '取消代理出价' : '设置代理出价'}
        </button>

        {showProxyBid && (
          <div className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">代理出价设置</h4>
              <p className="text-sm text-gray-600">
                设置您的最高出价，系统将自动帮您竞价
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最高出价（万元）
              </label>
              <input
                type="number"
                value={proxyAmount}
                onChange={(e) => setProxyAmount(e.target.value)}
                placeholder="请输入最高出价"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                加价幅度
              </label>
              <select
                value={increment}
                onChange={(e) => setIncrement(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={1000}>0.1万</option>
                <option value={2000}>0.2万</option>
                <option value={5000}>0.5万</option>
                <option value={10000}>1万</option>
              </select>
            </div>

            <div className="bg-white rounded-lg p-4 space-y-2 text-sm text-gray-600">
              <p className="font-medium text-gray-900">代理规则：</p>
              <ul className="space-y-1">
                <li>• 当有人出价时，系统自动加价 {(increment / 10000).toFixed(1)}万</li>
                <li>• 不会超过您设置的最高出价</li>
                <li>• 出价成功后短信/APP通知</li>
                <li>• 可随时修改或取消代理</li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (!proxyAmount) {
                  alert('请输入最高出价');
                  return;
                }
                trackEvent('proxy_bid_set', {
                  vehicle_id: vehicleId,
                  max_bid: parseFloat(proxyAmount) * 10000
                });
                alert(`代理出价设置成功：最高${proxyAmount}万，加价幅度${(increment / 10000).toFixed(1)}万`);
                setShowProxyBid(false);
              }}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              确认设置
            </button>
          </div>
        )}
      </div>

      {/* 出价策略建议 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">💡 出价策略建议</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• 当前竞争激烈度：<span className="font-semibold text-orange-600">中等</span></p>
          <p>• 建议出价区间：<span className="font-semibold text-green-600">35-38万</span></p>
          <p>• 最佳出价时机：<span className="font-semibold text-blue-600">结束前30分钟</span></p>
        </div>
      </div>
    </div>
  );
};

// 统计卡片
const StatCard = ({ icon, label, value, unit }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value}<span className="text-sm font-normal text-gray-600 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);

// 出价记录
const BidRecord = ({ record, isLatest }) => (
  <div className={`p-4 ${isLatest ? 'bg-orange-50' : 'hover:bg-gray-50'} transition-colors`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {isLatest && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
            最新
          </span>
        )}
        <div>
          <p className="font-medium text-gray-900">{record.bidder}</p>
          <p className="text-sm text-gray-500">{record.time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">
          {(record.amount / 10000).toFixed(1)}万
        </p>
      </div>
    </div>
  </div>
);

export default BiddingDynamics;
