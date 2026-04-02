import React, { useState } from 'react';
import { Search, User, TrendingUp, Eye, DollarSign, MapPin, Calendar, Gauge, Award, Clock, Globe, Car, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const BuyerRecommendationVerify = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileCollapsed, setProfileCollapsed] = useState(false);

  // 模拟买家数据（支持ID、姓名、手机号查询）
  const mockBuyers = [
    { id: 'B001', name: '张三', phone: '13812345678', region: '北京' },
    { id: 'B002', name: '李四', phone: '13956781234', region: '上海' },
    { id: 'B003', name: '王五', phone: '13690129876', region: '广州' }
  ];

  // 模拟买家画像数据
  const mockBuyerProfiles = {
    'B001': {
      countries: [
        { name: '日系', percentage: 80 },
        { name: '德系', percentage: 15 },
        { name: '美系', percentage: 5 }
      ],
      brands: [
        { name: '大众', percentage: 60 },
        { name: '丰田', percentage: 20 },
        { name: '本田', percentage: 15 },
        { name: '其他', percentage: 5 }
      ],
      series: [
        { name: '大众迈腾', percentage: 55 },
        { name: '丰田凯美瑞', percentage: 30 },
        { name: '本田雅阁', percentage: 10 },
        { name: '其他', percentage: 5 }
      ],
      priceRanges: [
        { name: '0-3万', percentage: 35 },
        { name: '3-5万', percentage: 28 },
        { name: '5-8万', percentage: 20 },
        { name: '8-15万', percentage: 12 },
        { name: '其他', percentage: 5 }
      ],
      ageRanges: [
        { name: '4-6年', percentage: 61 },
        { name: '2-4年', percentage: 25 },
        { name: '6-8年', percentage: 10 },
        { name: '其他', percentage: 4 }
      ],
      bidCount: 45,
      bidVehicleCount: 32
    },
    'B002': {
      countries: [
        { name: '德系', percentage: 70 },
        { name: '日系', percentage: 25 },
        { name: '美系', percentage: 5 }
      ],
      brands: [
        { name: '奔驰', percentage: 45 },
        { name: '宝马', percentage: 35 },
        { name: '奥迪', percentage: 15 },
        { name: '其他', percentage: 5 }
      ],
      series: [
        { name: '奔驰E级', percentage: 40 },
        { name: '宝马5系', percentage: 35 },
        { name: '奥迪A6', percentage: 20 },
        { name: '其他', percentage: 5 }
      ],
      priceRanges: [
        { name: '15-20万', percentage: 45 },
        { name: '20万+', percentage: 30 },
        { name: '8-15万', percentage: 20 },
        { name: '其他', percentage: 5 }
      ],
      ageRanges: [
        { name: '2-4年', percentage: 55 },
        { name: '4-6年', percentage: 30 },
        { name: '0-2年', percentage: 10 },
        { name: '其他', percentage: 5 }
      ],
      bidCount: 38,
      bidVehicleCount: 28
    },
    'B003': {
      countries: [
        { name: '日系', percentage: 65 },
        { name: '德系', percentage: 25 },
        { name: '国产', percentage: 10 }
      ],
      brands: [
        { name: '丰田', percentage: 50 },
        { name: '本田', percentage: 30 },
        { name: '大众', percentage: 15 },
        { name: '其他', percentage: 5 }
      ],
      series: [
        { name: '丰田凯美瑞', percentage: 45 },
        { name: '本田雅阁', percentage: 30 },
        { name: '丰田汉兰达', percentage: 15 },
        { name: '其他', percentage: 10 }
      ],
      priceRanges: [
        { name: '5-8万', percentage: 40 },
        { name: '8-15万', percentage: 35 },
        { name: '3-5万', percentage: 20 },
        { name: '其他', percentage: 5 }
      ],
      ageRanges: [
        { name: '4-6年', percentage: 50 },
        { name: '6-8年', percentage: 30 },
        { name: '2-4年', percentage: 15 },
        { name: '其他', percentage: 5 }
      ],
      bidCount: 52,
      bidVehicleCount: 41
    }
  };

  // 模拟推荐数据
  const generateMockRecommendations = () => {
    const reasons = [
      '画像匹配-主打车系',
      '候选车源-同车系高频成交',
      '兜底-平台热销'
    ];

    const brands = ['奔驰', '宝马', '奥迪', '丰田', '本田', '大众'];
    const series = ['E级', '5系', 'A6', '凯美瑞', '雅阁', '帕萨特'];
    const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];

    return Array.from({ length: 16 }, (_, i) => {
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      // 根据推荐理由设置候选集
      let candidateSet;
      if (reason.includes('画像匹配')) {
        candidateSet = 1;
      } else if (reason.includes('候选车源')) {
        candidateSet = 2;
      } else {
        candidateSet = 3;
      }

      // 生成结束时间（随机在未来1-48小时内）
      const hoursFromNow = Math.random() * 48;
      const endTime = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);

      return {
        position: i + 1,
        auctionId: `AUC${String(Math.floor(Math.random() * 900000) + 100000)}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        series: series[Math.floor(Math.random() * series.length)],
        model: `2022款 豪华版`,
        plate: `京A${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        mileage: Math.floor(Math.random() * 100000) + 10000,
        age: Math.floor(Math.random() * 5) + 1,
        conditionScore: Math.floor(Math.random() * 41) + 60,
        startPrice: Math.floor(Math.random() * 300000) + 100000,
        currentPrice: Math.floor(Math.random() * 350000) + 120000,
        endTime: endTime.toISOString(),
        viewCount: Math.floor(Math.random() * 1000) + 100,
        viewUV: Math.floor(Math.random() * 500) + 50,
        bidCount: Math.floor(Math.random() * 50) + 5,
        bidderCount: Math.floor(Math.random() * 20) + 2,
        reason: reason,
        candidateSet: candidateSet
      };
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 支持买家ID、姓名、手机号查询
      const buyer = mockBuyers.find(b => 
        b.id === searchQuery || 
        b.name === searchQuery || 
        b.phone === searchQuery ||
        b.phone.replace(/\D/g, '') === searchQuery.replace(/\D/g, '')
      );
      
      if (buyer) {
        setBuyerInfo(buyer);
        setBuyerProfile(mockBuyerProfiles[buyer.id] || null);
        setRecommendations(generateMockRecommendations(buyer.id));
      } else {
        setBuyerInfo({ id: searchQuery, name: '未知买家', phone: '-', region: '-' });
        setBuyerProfile(null);
        setRecommendations(generateMockRecommendations(searchQuery));
      }
      setLoading(false);
    }, 800);
  };

  const formatPrice = (price) => {
    return (price / 10000).toFixed(2) + '万元';
  };

  // 格式化结束时间（整点或半点）
  const formatEndTime = (endTimeStr) => {
    if (!endTimeStr) return '';
    
    const endDate = new Date(endTimeStr);
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

  const getReasonColor = (reason) => {
    if (reason.includes('画像匹配')) return 'bg-blue-100 text-blue-700';
    if (reason.includes('候选车源')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <User className="text-blue-600" size={28} />
              推荐算法验证（买家维度）
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              模拟展示特定买家当前看到的"为您推荐"列表
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Award size={16} className="text-slate-600" />
              <div className="text-left">
                <div className="text-xs text-slate-500">策略版本</div>
                <div className="text-sm font-semibold text-slate-900">v2.1.0</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">更新时间：2026-01-28</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              买家查询
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="请输入买家用户名、姓名或手机号"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Search size={18} />
                查询
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              💡 Demo提示：输入 "B001" 查看示例数据
            </p>
          </div>

          {buyerInfo && (
            <div className="flex gap-6 text-sm items-center">
              <div>
                <span className="text-slate-500">买家用户名：</span>
                <a 
                  href={`/buyer/${buyerInfo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {buyerInfo.id}
                </a>
              </div>
              <div>
                <span className="text-slate-500">买家姓名：</span>
                <span className="font-medium">{buyerInfo.name}</span>
              </div>
              <div>
                <span className="text-slate-500">联系电话：</span>
                <span className="font-medium">{buyerInfo.phone}</span>
              </div>
              <div>
                <span className="text-slate-500">所在地区：</span>
                <span className="font-medium">{buyerInfo.region}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buyer Profile Section */}
      {buyerProfile && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <User className="text-blue-600" size={18} />
              买家画像分析
              <span className="text-xs font-normal text-slate-500">
                （基于最近90天 {buyerProfile.bidCount} 次出价，{buyerProfile.bidVehicleCount} 台车辆）
              </span>
            </h2>
            <button
              onClick={() => setProfileCollapsed(!profileCollapsed)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
            >
              {profileCollapsed ? (
                <>
                  <ChevronDown size={16} />
                  <span>展开</span>
                </>
              ) : (
                <>
                  <ChevronUp size={16} />
                  <span>收起</span>
                </>
              )}
            </button>
          </div>

          {!profileCollapsed && (
          <div className="grid grid-cols-5 gap-3">
            {/* 主打国别 */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Globe size={14} className="text-blue-600" />
                <h3 className="font-semibold text-slate-900 text-sm">主打国别</h3>
              </div>
              <div className="space-y-1.5">
                {buyerProfile.countries.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700">{item.name}</span>
                      <span className="text-xs font-semibold text-blue-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主打品牌 */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={14} className="text-green-600" />
                <h3 className="font-semibold text-slate-900 text-sm">主打品牌</h3>
              </div>
              <div className="space-y-1.5">
                {buyerProfile.brands.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700">{item.name}</span>
                      <span className="text-xs font-semibold text-green-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主打车系 */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Car size={14} className="text-purple-600" />
                <h3 className="font-semibold text-slate-900 text-sm">主打车系</h3>
              </div>
              <div className="space-y-1.5">
                {buyerProfile.series.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700">{item.name}</span>
                      <span className="text-xs font-semibold text-purple-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主打价位段 */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign size={14} className="text-orange-600" />
                <h3 className="font-semibold text-slate-900 text-sm">主打价位段</h3>
              </div>
              <div className="space-y-1.5">
                {buyerProfile.priceRanges.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700">{item.name}</span>
                      <span className="text-xs font-semibold text-orange-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-orange-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 主打车龄 */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar size={14} className="text-red-600" />
                <h3 className="font-semibold text-slate-900 text-sm">主打车龄</h3>
              </div>
              <div className="space-y-1.5">
                {buyerProfile.ageRanges.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700">{item.name}</span>
                      <span className="text-xs font-semibold text-red-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">加载中...</p>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">
                推荐列表（共 {recommendations.length} 条）
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">排序</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">推荐车源</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">AuctionID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">基本参数</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">起拍价/状态</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">互动性</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">推荐逻辑</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recommendations.map((item) => (
                    <tr key={item.position} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                          {item.position}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <a 
                            href={`/vehicle/${item.brand}-${item.series}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {item.brand} {item.series}
                          </a>
                          <div className="text-sm text-slate-600">{item.model}</div>
                          <div className="text-xs text-slate-500">{item.plate}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-mono text-slate-600">{item.auctionId}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin size={14} />
                            {item.location}
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Gauge size={14} />
                            {(item.mileage / 10000).toFixed(1)}万公里
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar size={14} />
                            {item.age}年车龄
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Award size={14} />
                            评分定级 {item.conditionScore}{item.conditionScore >= 90 ? 'A' : item.conditionScore >= 80 ? 'B' : item.conditionScore >= 70 ? 'C' : 'D'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-slate-600">
                            起拍价：<span className="font-semibold text-slate-900">{formatPrice(item.startPrice)}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            当前价：<span className="font-semibold text-red-600">{formatPrice(item.currentPrice)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <Clock size={12} />
                            {formatEndTime(item.endTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Eye size={14} />
                            浏览 {item.viewCount}次 / {item.viewUV}人
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <TrendingUp size={14} />
                            出价 {item.bidCount}次 / {item.bidderCount}人
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getReasonColor(item.reason)}`}>
                            {item.reason}
                          </span>
                          <div className="text-xs text-slate-500">
                            候选集 {item.candidateSet}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>请输入买家ID查询推荐列表</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerRecommendationVerify;
