import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const ProfitCalculator = ({ vehicle }) => {
  const [bidAmount, setBidAmount] = useState(vehicle.currentPrice);
  const [calculation, setCalculation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    calculateProfit(bidAmount);
  }, [bidAmount]);

  const calculateProfit = (amount) => {
    // 成本计算
    const vehicleCost = amount;
    const repairCost = estimateRepairCost(vehicle.conditionScore);
    const taxFee = amount * 0.02; // 过户税费2%
    const logisticsCost = 2000; // 物流成本
    const totalCost = vehicleCost + repairCost + taxFee + logisticsCost;

    // 售价预估
    const estimatedSalePrice = vehicle.market.avgPrice;
    
    // 利润计算
    const netProfit = estimatedSalePrice - totalCost;
    const profitRate = (netProfit / totalCost) * 100;
    
    // 周转预测
    const turnoverDays = Math.round(100 - vehicle.turnoverScore);
    const annualizedReturn = (netProfit / totalCost) * (365 / turnoverDays) * 100;

    setCalculation({
      vehicleCost,
      repairCost,
      taxFee,
      logisticsCost,
      totalCost,
      estimatedSalePrice,
      netProfit,
      profitRate,
      turnoverDays,
      annualizedReturn
    });

    // 埋点
    trackEvent('profit_calculator_use', {
      vehicle_id: vehicle.id,
      bid_amount: amount,
      profit: netProfit
    });
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    setBidAmount(value);
  };

  if (!calculation) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 标题栏 */}
      <div 
        className="bg-gradient-to-r from-green-600 to-green-700 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <h3 className="font-semibold">利润计算器</h3>
          </div>
          <button className="text-white hover:text-green-100">
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* 出价滑块 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">我的出价</label>
              <span className="text-2xl font-bold text-blue-600">
                {(bidAmount / 10000).toFixed(1)}万
              </span>
            </div>
            <input
              type="range"
              min={vehicle.startPrice}
              max={vehicle.currentPrice * 1.3}
              step={1000}
              value={bidAmount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{(vehicle.startPrice / 10000).toFixed(1)}万</span>
              <span>{(vehicle.currentPrice * 1.3 / 10000).toFixed(1)}万</span>
            </div>
          </div>

          {/* 成本明细 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">成本明细</h4>
            <div className="space-y-2">
              <CostItem 
                label="车辆成本" 
                amount={calculation.vehicleCost}
                icon={<DollarSign className="w-4 h-4" />}
              />
              <CostItem 
                label="维修成本" 
                amount={calculation.repairCost}
                note="系统预估"
              />
              <CostItem 
                label="过户税费" 
                amount={calculation.taxFee}
                note="约2%"
              />
              <CostItem 
                label="物流成本" 
                amount={calculation.logisticsCost}
                note={`${vehicle.location}→本地`}
              />
              <div className="pt-2 border-t border-gray-200">
                <CostItem 
                  label="总成本" 
                  amount={calculation.totalCost}
                  bold
                />
              </div>
            </div>
          </div>

          {/* 预估售价 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">预估售价</h4>
            <p className="text-2xl font-bold text-blue-600 mb-2">
              {(calculation.estimatedSalePrice / 10000).toFixed(1)}万
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>• 同款车近30天成交：{(vehicle.market.medianPrice / 10000).toFixed(1)}-{(vehicle.market.avgPrice / 10000).toFixed(1)}万</p>
              <p>• 本地市场需求：{vehicle.market.demandLevel === 'high' ? '高🔥' : '中等'}</p>
              <p>• 建议售价：{(calculation.estimatedSalePrice * 0.98 / 10000).toFixed(1)}-{(calculation.estimatedSalePrice * 1.02 / 10000).toFixed(1)}万</p>
            </div>
          </div>

          {/* 利润分析 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">净利润</p>
                <p className={`text-2xl font-bold ${calculation.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculation.netProfit > 0 ? '+' : ''}{(calculation.netProfit / 10000).toFixed(2)}万
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">利润率</p>
                <p className={`text-2xl font-bold ${calculation.profitRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculation.profitRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">周转周期</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculation.turnoverDays}天
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">年化收益</p>
                <p className="text-xl font-bold text-purple-600">
                  {calculation.annualizedReturn.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* 智能建议 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">💡 智能建议：</span>
              {getRecommendation(calculation, vehicle)}
            </p>
          </div>

          {/* 快速出价按钮 */}
          <button
            onClick={() => {
              trackEvent('quick_bid_from_calculator', {
                vehicle_id: vehicle.id,
                bid_amount: bidAmount
              });
              alert(`出价 ${(bidAmount / 10000).toFixed(1)}万`);
            }}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            按此价格出价
          </button>
        </div>
      )}
    </div>
  );
};

// 成本项组件
const CostItem = ({ label, amount, note, icon, bold }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
      {note && <span className="text-xs text-gray-400">({note})</span>}
    </div>
    <span className={`${bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
      {amount.toLocaleString()}元
    </span>
  </div>
);

// 预估维修成本
const estimateRepairCost = (conditionScore) => {
  if (conditionScore >= 95) return 3000;
  if (conditionScore >= 90) return 5000;
  if (conditionScore >= 85) return 8000;
  if (conditionScore >= 80) return 12000;
  return 15000;
};

// 获取建议
const getRecommendation = (calc, vehicle) => {
  if (calc.profitRate < 3) {
    return '利润空间较小，建议谨慎出价或寻找其他车源';
  }
  if (calc.profitRate < 6) {
    return '利润空间一般，建议控制出价在当前价格以内';
  }
  if (calc.profitRate < 10) {
    return `该车型周转快，利润空间合理，建议出价${(calc.vehicleCost * 0.98 / 10000).toFixed(1)}-${(calc.vehicleCost / 10000).toFixed(1)}万`;
  }
  return `利润空间大，市场需求旺盛，建议尽快出价锁定车源`;
};

export default ProfitCalculator;
