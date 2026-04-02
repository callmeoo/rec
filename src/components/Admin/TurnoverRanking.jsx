import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown, ChevronRight, ExternalLink, Award, Clock, Percent, RefreshCw } from 'lucide-react';

const TurnoverRanking = ({ onVehicleClick }) => {
  const [rankings, setRankings] = useState([]);
  const [expandedSeries, setExpandedSeries] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 计算分页数据
  const totalPages = Math.ceil(rankings.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRankings = rankings.slice(startIndex, endIndex);

  // 模拟数据生成
  const generateMockData = () => {
    const seriesNames = [
      '奔驰E级', '宝马5系', '奥迪A6', '丰田凯美瑞', '本田雅阁',
      '大众帕萨特', '特斯拉Model 3', '比亚迪汉', '蔚来ET5', '理想L8',
      '奔驰C级', '宝马3系', '奥迪A4', '丰田RAV4', '本田CR-V',
      '大众途观', '特斯拉Model Y', '比亚迪宋', '蔚来ES6', '理想L7',
      '奔驰GLC', '宝马X3', '奥迪Q5', '丰田汉兰达', '本田皓影',
      '大众迈腾', '小鹏P7', '比亚迪秦', '蔚来ET7', '理想ONE',
      '奔驰A级', '宝马1系', '奥迪A3', '丰田卡罗拉', '本田思域',
      '大众朗逸', '小鹏G6', '比亚迪海豚', '极氪001', '哪吒S',
      '奔驰GLE', '宝马X5', '奥迪Q7', '丰田普拉多', '本田奥德赛',
      '大众ID.4', '小鹏G9', '比亚迪唐', '极氪007', '零跑C11'
    ];

    return seriesNames.map((name, index) => {
      const totalListings = Math.floor(Math.random() * 30) + 6;
      const totalDeals = Math.floor(Math.random() * (totalListings - 3)) + 3;
      const avgDealRate = ((totalDeals / totalListings) * 100).toFixed(1);
      const medianDealTime = Math.floor(Math.random() * 48) + 12; // 12-60小时
      const turnoverScore = avgDealRate * 0.7 + (100 - medianDealTime / 60 * 100) * 0.3;

      // 生成车型数据
      const models = Array.from({ length: 3 }, (_, i) => ({
        modelId: `${name}-M${i + 1}`,
        modelName: `${name} ${2020 + i}款`,
        dealRate: Math.floor(Math.random() * 30) + 60,
        medianDealTime: Math.floor(Math.random() * 48) + 12,
        turnoverScore: Math.floor(Math.random() * 30) + 60,
        activeCount: Math.floor(Math.random() * 20) + 5
      }));

      return {
        seriesId: `S${index + 1}`,
        seriesName: name,
        activeListings: totalListings,
        avgDealRate: avgDealRate,
        medianDealTime: medianDealTime.toFixed(1),
        turnoverScore: turnoverScore.toFixed(1),
        models
      };
    }).sort((a, b) => parseFloat(b.turnoverScore) - parseFloat(a.turnoverScore));
  };

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setRankings(generateMockData());
      setLoading(false);
    }, 800);
  }, []);

  const toggleSeries = (seriesId) => {
    setExpandedSeries(prev => ({
      ...prev,
      [seriesId]: !prev[seriesId]
    }));
  };

  const handleViewDetails = (modelId) => {
    console.log('查看车辆详情:', modelId);
    // 打开车辆详情弹窗
    if (onVehicleClick) {
      onVehicleClick(modelId);
    }
  };

  const handleManualUpdate = () => {
    console.log('手动更新周转分数据');
    setLoading(true);
    setCurrentPage(1); // 重置到第一页
    // 模拟重新加载数据
    setTimeout(() => {
      setRankings(generateMockData());
      setLoading(false);
    }, 1000);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedSeries({}); // 切换页面时收起所有展开的车系
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'text-green-600';
    if (numScore >= 70) return 'text-blue-600';
    if (numScore >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'bg-green-100 text-green-700';
    if (numScore >= 70) return 'bg-blue-100 text-blue-700';
    if (numScore >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={28} />
              全平台车系周转分排行
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              基于全站维度展示车源的周转效率排名，用于运营自查模型规则
            </p>
          </div>
          <button
            onClick={handleManualUpdate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>手动更新</span>
          </button>
        </div>
      </div>

      {/* Rules Description */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">周转分计算规则</h3>
            <div className="grid grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <Percent size={12} className="text-green-600" />
                  <span className="font-medium text-slate-700">成交率评分</span>
                </div>
                <p className="text-slate-500">（成交数 / 上架数）× 100</p>
                <p className="text-slate-400 mt-1">权重：70%</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={12} className="text-orange-600" />
                  <span className="font-medium text-slate-700">耗时评分</span>
                </div>
                <p className="text-slate-500">100 - （中位数 / 最大耗时）× 100</p>
                <p className="text-slate-400 mt-1">权重：30%</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp size={12} className="text-blue-600" />
                  <span className="font-medium text-slate-700">综合周转分</span>
                </div>
                <p className="text-slate-500">成交率评分 × 0.7 + 耗时评分 × 0.3</p>
                <p className="text-slate-400 mt-1">样本要求：上架数≥6 且 成交数≥3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">加载中...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-16">排名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">车系名称</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">在拍量</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">平均成交率</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">成交耗时中位数</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">综合周转分</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRankings.map((series, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <React.Fragment key={series.seriesId}>
                        {/* 车系行 */}
                        <tr className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center">
                              {globalIndex < 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                  globalIndex === 0 ? 'bg-yellow-500' : globalIndex === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                }`}>
                                  {globalIndex + 1}
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-slate-600 bg-slate-100">
                                {globalIndex + 1}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleSeries(series.seriesId)}
                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                          >
                            {expandedSeries[series.seriesId] ? (
                              <ChevronDown size={18} className="text-slate-400" />
                            ) : (
                              <ChevronRight size={18} className="text-slate-400" />
                            )}
                            <span className="font-medium text-slate-900">{series.seriesName}</span>
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                            {series.activeListings} 辆
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Percent size={14} className="text-slate-400" />
                            <span className="font-semibold">{series.avgDealRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock size={14} className="text-slate-400" />
                            <span className="font-semibold">{series.medianDealTime}小时</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(series.turnoverScore)}`}>
                            {series.turnoverScore}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleSeries(series.seriesId)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {expandedSeries[series.seriesId] ? '收起' : '展开'}
                          </button>
                        </td>
                      </tr>

                      {/* 车型行（展开时显示） */}
                      {expandedSeries[series.seriesId] && (
                        <tr>
                          <td colSpan="7" className="bg-slate-50 p-0">
                            <div className="px-12 py-4">
                              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200">
                                  <h4 className="text-sm font-semibold text-slate-700">车型详情</h4>
                                </div>
                                <table className="w-full">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">车型名称</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">成交率</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">成交耗时</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">周转分</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">在拍数量</th>
                                      <th className="px-4 py-2 text-center text-xs font-medium text-slate-500">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-200">
                                    {series.models.map((model) => (
                                      <tr key={model.modelId} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-2">
                                            <Award size={14} className="text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">{model.modelName}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">{model.dealRate}%</td>
                                        <td className="px-4 py-3 text-center text-sm">{model.medianDealTime}小时</td>
                                        <td className="px-4 py-3 text-center">
                                          <span className={`font-semibold text-sm ${getScoreColor(model.turnoverScore)}`}>
                                            {model.turnoverScore}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                            {model.activeCount} 辆
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          {model.activeCount <= 1 ? (
                                            <button
                                              onClick={() => handleViewDetails(model.modelId)}
                                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                                            >
                                              查看详情
                                              <ExternalLink size={12} />
                                            </button>
                                          ) : (
                                            <span className="text-xs text-slate-400">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span>共 {rankings.length} 条，每页</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>条</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    上一页
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        } text-sm`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurnoverRanking;
