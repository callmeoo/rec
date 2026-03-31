import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Eye, MousePointer, ShoppingCart, Users, Calendar } from 'lucide-react';

const DataDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // 7天、30天、90天
  const [dashboardData, setDashboardData] = useState(null);

  // 根据日期范围生成模拟数据
  const generateMockData = (days) => {
    const daysNum = parseInt(days);
    const dates = [];
    const exposure = [];
    const clicks = [];
    const bids = [];
    
    // 生成日期和数据
    const today = new Date();
    for (let i = daysNum - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${month}-${day}`);
      
      // 生成随机但合理的数据
      const baseExposure = 15000 + Math.random() * 5000;
      const baseClicks = baseExposure * (0.06 + Math.random() * 0.02);
      const baseBids = baseClicks * (0.10 + Math.random() * 0.05);
      
      exposure.push(Math.round(baseExposure));
      clicks.push(Math.round(baseClicks));
      bids.push(Math.round(baseBids));
    }
    
    // 计算总数
    const totalExposure = exposure.reduce((a, b) => a + b, 0);
    const totalClicks = clicks.reduce((a, b) => a + b, 0);
    const totalBids = bids.reduce((a, b) => a + b, 0);
    const ctr = ((totalClicks / totalExposure) * 100).toFixed(2);
    const bidRate = ((totalBids / totalClicks) * 100).toFixed(2);
    
    return {
      overview: {
        totalExposure: totalExposure,
        totalClicks: totalClicks,
        ctr: parseFloat(ctr),
        bidRate: parseFloat(bidRate),
        avgBidAmount: (6 + Math.random() * 4).toFixed(1)
      },
      trend: {
        dates: dates,
        exposure: exposure,
        clicks: clicks,
        bids: bids
      },
      candidateSetDistribution: [
        { name: '画像匹配', exposureCount: 4500, clickCount: 600, color: 'bg-blue-500' },
        { name: '平台周转', exposureCount: 3500, clickCount: 300, color: 'bg-green-500' },
        { name: '全站兜底', exposureCount: 2000, clickCount: 100, color: 'bg-gray-500' }
      ],
      positionPerformance: [
        { position: '1-3位', exposure: 38000, clicks: 3420, ctr: 9.0, bidRate: 15.2 },
        { position: '4-6位', exposure: 35000, clicks: 2800, ctr: 8.0, bidRate: 13.5 },
        { position: '7-10位', exposure: 32000, clicks: 2240, ctr: 7.0, bidRate: 11.8 },
        { position: '10位后', exposure: 20680, clicks: 485, ctr: 2.3, bidRate: 5.2 }
      ]
    };
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData(generateMockData(dateRange));
      setLoading(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="text-blue-600" size={24} />
              推荐数据看板（移动端）
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              监控移动端推荐模块的核心指标和转化效果
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="7">近7天</option>
              <option value="30">近30天</option>
              <option value="90">近90天</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">总曝光量</span>
              <Eye size={18} className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.overview.totalExposure.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 12.5% vs 上周</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">总点击量</span>
              <MousePointer size={18} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.overview.totalClicks.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 8.3% vs 上周</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">点击率(CTR)</span>
              <TrendingUp size={18} className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.overview.ctr}%
            </div>
            <div className="text-xs text-red-600 mt-1">↓ 0.5% vs 上周</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">出价台次</span>
              <ShoppingCart size={18} className="text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.overview.bidRate}%
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 2.1% vs 上周</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">平均出价</span>
              <Users size={18} className="text-red-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.overview.avgBidAmount}万
            </div>
            <div className="text-xs text-green-600 mt-1">↑ 5.2% vs 上周</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">趋势分析</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">日期</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">曝光量</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">点击量</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">点击率</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">出价台次</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">出价率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dashboardData.trend.dates.map((date, index) => {
                  const exposure = dashboardData.trend.exposure[index];
                  const clicks = dashboardData.trend.clicks[index];
                  const bids = dashboardData.trend.bids[index];
                  const ctr = ((clicks / exposure) * 100).toFixed(2);
                  const bidRate = ((bids / clicks) * 100).toFixed(2);
                  
                  return (
                    <tr key={date} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{date}</td>
                      <td className="px-4 py-4 text-sm text-center text-slate-600">
                        {exposure.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-slate-600">
                        {clicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-center">
                        <span className={`font-semibold ${parseFloat(ctr) >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                          {ctr}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-center text-slate-600">
                        {bids.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-center">
                        <span className={`font-semibold ${parseFloat(bidRate) >= 12 ? 'text-green-600' : 'text-orange-600'}`}>
                          {bidRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900">合计/平均</td>
                  <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">
                    {dashboardData.overview.totalExposure.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">
                    {dashboardData.overview.totalClicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-bold text-green-600">
                    {dashboardData.overview.ctr}%
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">
                    {dashboardData.trend.bids.reduce((a, b) => a + b, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-bold text-green-600">
                    {dashboardData.overview.bidRate}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Candidate Set Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">候选集效果分析（移动端）</h3>
          
          {/* 计算总曝光和总点击 */}
          {(() => {
            const totalExposure = dashboardData.candidateSetDistribution.reduce((sum, item) => sum + item.exposureCount, 0);
            const totalClicks = dashboardData.candidateSetDistribution.reduce((sum, item) => sum + item.clickCount, 0);
            
            return (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">候选集类型</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">单车曝光次数</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">曝光占比</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">单车点击次数</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">点击占比</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">候选集CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dashboardData.candidateSetDistribution.map((item, index) => {
                      const exposurePercent = ((item.exposureCount / totalExposure) * 100).toFixed(1);
                      const clickPercent = ((item.clickCount / totalClicks) * 100).toFixed(1);
                      const ctr = ((item.clickCount / item.exposureCount) * 100).toFixed(2);
                      
                      return (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm font-medium text-slate-900 flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${item.color}`}></div>
                            {item.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-slate-600">
                            {item.exposureCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className="font-semibold text-slate-900">{exposurePercent}%</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-center text-slate-600">
                            {item.clickCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className="font-semibold text-slate-900">{clickPercent}%</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-center">
                            <span className={`font-semibold ${parseFloat(ctr) >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                              {ctr}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                    <tr>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">合计</td>
                      <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">
                        {totalExposure.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">100.0%</td>
                      <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">
                        {totalClicks.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-center font-bold text-slate-900">100.0%</td>
                      <td className="px-4 py-4 text-sm text-center font-bold text-green-600">
                        {((totalClicks / totalExposure) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })()}
          
          {/* 计算公式说明 */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">计算逻辑说明</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="mb-3">
                <strong>统计粒度：</strong>以"单车卡片（Item）"为最小统计单位
              </p>
              <p>
                <strong>单车曝光次数：</strong>单台推荐车辆进入用户手机视口被有效看见的次数（埋点事件：rec_show_m）
              </p>
              <p>
                <strong>总曝光次数：</strong>统计周期内，推荐模块下所有单车曝光次数的总和
              </p>
              <p>
                <strong>曝光占比：</strong>特定候选集曝光占比 = （该候选集类型的单车曝光次数 / 总曝光次数）× 100%
              </p>
              <p>
                <strong>点击占比：</strong>特定候选集点击占比 = （该候选集类型的单车点击次数 / 总点击次数）× 100%（埋点事件：rec_click_m）
              </p>
              <p>
                <strong>候选集CTR：</strong>特定候选集CTR = （该候选集类型的单车点击次数 / 该候选集的单车曝光次数）× 100%
              </p>
              <p className="mt-3 pt-3 border-t border-slate-200 text-slate-700">
                <strong>计算示例：</strong>
              </p>
              <p className="text-slate-500">
                假设今日移动端推荐模块共刷出 10,000 张车辆卡片（总曝光=10,000），产生 1,000 次点击（总点击=1,000）。
              </p>
              <p className="text-slate-500">
                其中画像匹配（rec_type=1）的卡片曝光 4,500 次，被点击 600 次：
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1 text-slate-500">
                <li>画像匹配曝光占比 = 4,500 / 10,000 = 45%（该策略争取到的展示份额）</li>
                <li>画像匹配点击占比 = 600 / 1,000 = 60%（该策略贡献的点击份额）</li>
                <li>画像匹配CTR = 600 / 4,500 = 13.33%（该策略召回车源的实际吸引力）</li>
              </ul>
              <p className="mt-2 text-slate-500">
                <strong>数据来源：</strong>每个推荐车辆在埋点时会标记其候选集类型（candidateSet字段：1=画像匹配，2=平台周转，3=全站兜底），
                统计时按候选集类型分组计算各项指标。
              </p>
            </div>
          </div>
        </div>

        {/* Position Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">推荐位效果分析（移动端）</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">推荐位</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">曝光量</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">点击量</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">点击率</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">出价率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dashboardData.positionPerformance.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900">{item.position}</td>
                    <td className="px-4 py-4 text-sm text-center text-slate-600">{item.exposure.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-center text-slate-600">{item.clicks.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-center">
                      <span className={`font-semibold ${item.ctr >= 7 ? 'text-green-600' : 'text-orange-600'}`}>
                        {item.ctr}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <span className={`font-semibold ${item.bidRate >= 12 ? 'text-green-600' : 'text-orange-600'}`}>
                        {item.bidRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Umeng Integration Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">友盟数据集成说明</h4>
              <div className="space-y-2 text-xs text-blue-700">
                <p>
                  <strong>当前状态：</strong>展示模拟数据。实际使用时，数据将从友盟统计平台获取（非实时，有1天延迟）。
                </p>
                <p>
                  <strong>数据范围：</strong>仅统计移动端数据（PC端流量较低，不纳入统计）。
                </p>
                <p>
                  <strong>日期范围：</strong>可选择近7天、30天或90天的数据趋势，数据会根据选择的日期范围动态生成。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;
