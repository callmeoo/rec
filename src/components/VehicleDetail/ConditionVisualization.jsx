import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const ConditionVisualization = ({ condition, inspection, vehicleId }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    trackEvent('condition_report_view', {
      vehicle_id: vehicleId,
      report_type: category
    });
  };

  return (
    <div className="space-y-6">
      {/* 核心车况标签 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">核心车况</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ConditionBadge icon="✓" label="无事故" status="good" />
          <ConditionBadge icon="✓" label="非泡水" status="good" />
          <ConditionBadge icon="✓" label="非火烧" status="good" />
          <ConditionBadge icon="✓" label="一手车" status="good" />
          <ConditionBadge icon="✓" label="4S保养" status="good" />
          <ConditionBadge icon="✓" label="手续齐全" status="good" />
          <ConditionBadge icon="✓" label="可过户" status="good" />
          <ConditionBadge icon="✓" label="质保中" status="good" />
        </div>
      </div>

      {/* 车况雷达图 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">车况评分</h3>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          <ConditionRadar condition={condition} />
          <div className="mt-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{condition.overall}分</p>
            <p className="text-sm text-gray-600 mt-1">
              综合评分 {getConditionGrade(condition.overall)} • 超越平台92%的同款车型
            </p>
          </div>
        </div>
      </div>

      {/* AI智能解析 */}
      <div>
        <button
          onClick={() => {
            setShowAIAnalysis(!showAIAnalysis);
            trackEvent('ai_analysis_toggle', {
              vehicle_id: vehicleId,
              action: showAIAnalysis ? 'close' : 'open'
            });
          }}
          className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI智能车况解析</span>
          </div>
          {showAIAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showAIAnalysis && (
          <div className="mt-4 bg-white border-2 border-purple-200 rounded-lg p-6 space-y-4">
            <AIAnalysisSection 
              title="整体评价"
              content="这是一辆车况优秀的准新车。发动机和变速箱工作状态良好，底盘系统正常，仅轮胎有轻微磨损需要更换。内外饰保养良好，无明显使用痕迹。"
              type="success"
            />
            <AIAnalysisSection 
              title="优势亮点"
              content="• 一手车源，使用记录清晰\n• 4S店全程保养，保养记录完整\n• 发动机和变速箱状态优秀\n• 无事故、泡水、火烧记录\n• 车况评分95分，属于A级车况"
              type="success"
            />
            <AIAnalysisSection 
              title="需要注意"
              content="• 轮胎磨损达到更换标准，建议更换四条轮胎（预估成本2000元）\n• 刹车片剩余厚度5mm，短期内需要更换（预估成本800元）"
              type="warning"
            />
            <AIAnalysisSection 
              title="采购建议"
              content="综合车况评估，该车属于优质车源，适合采购。建议出价时预留3000元维修成本用于更换轮胎和刹车片。预计整备后可快速售出，周转周期约30天。"
              type="info"
            />
          </div>
        )}
      </div>

      {/* 检测报告详情 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">300项检测报告</h3>
          <div className="text-sm text-gray-600">
            检测机构：{inspection.agency} | 检测师：{inspection.inspector} | {inspection.inspectionDate}
          </div>
        </div>

        <div className="space-y-3">
          {inspection.items.map((item, index) => (
            <InspectionCategory
              key={index}
              item={item}
              isExpanded={expandedCategory === item.category}
              onToggle={() => toggleCategory(item.category)}
            />
          ))}
        </div>

        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => {
              trackEvent('download_inspection_report', { vehicle_id: vehicleId });
              alert('下载功能开发中');
            }}
            className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            下载完整报告
          </button>
          <button
            onClick={() => {
              trackEvent('view_inspection_video', { vehicle_id: vehicleId });
              alert('视频功能开发中');
            }}
            className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            查看检测视频
          </button>
        </div>
      </div>
    </div>
  );
};

// 车况标签组件
const ConditionBadge = ({ icon, label, status }) => {
  const colors = {
    good: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bad: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 ${colors[status]}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

// 车况雷达图组件
const ConditionRadar = ({ condition }) => {
  const categories = [
    { key: 'exterior', label: '外观', value: condition.exterior },
    { key: 'interior', label: '内饰', value: condition.interior },
    { key: 'engine', label: '发动机', value: condition.engine },
    { key: 'transmission', label: '变速箱', value: condition.transmission },
    { key: 'chassis', label: '底盘', value: condition.chassis }
  ];

  return (
    <div className="space-y-3">
      {categories.map(cat => (
        <div key={cat.key}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            <span className="text-sm font-bold text-gray-900">{cat.value}分</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getScoreColor(cat.value)}`}
              style={{ width: `${cat.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// AI分析区块
const AIAnalysisSection = ({ title, content, type }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Sparkles className="w-5 h-5" />
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[type]}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="text-sm whitespace-pre-line">{content}</p>
        </div>
      </div>
    </div>
  );
};

// 检测分类组件
const InspectionCategory = ({ item, isExpanded, onToggle }) => {
  const statusConfig = {
    excellent: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: '全部正常' },
    good: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: '全部正常' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '需注意' }
  };

  const config = statusConfig[item.status];
  const Icon = config.icon;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${config.bg}`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <div className="text-left">
            <h4 className="font-semibold text-gray-900">{item.category}（{item.totalItems}项）</h4>
            <p className={`text-sm ${config.color}`}>
              {item.passedItems === item.totalItems ? config.label : `${item.passedItems}/${item.totalItems}项正常`}
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
          {item.details.map((detail, idx) => (
            <DetailItem key={idx} detail={detail} />
          ))}
        </div>
      )}
    </div>
  );
};

// 检测详情项
const DetailItem = ({ detail }) => {
  const statusIcons = {
    excellent: <CheckCircle className="w-4 h-4 text-green-600" />,
    good: <CheckCircle className="w-4 h-4 text-blue-600" />,
    warning: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    bad: <XCircle className="w-4 h-4 text-red-600" />
  };

  return (
    <div className="flex items-start space-x-2 text-sm">
      <div className="flex-shrink-0 mt-0.5">{statusIcons[detail.status]}</div>
      <div className="flex-1">
        <span className="font-medium text-gray-900">{detail.name}</span>
        <span className="text-gray-600 ml-2">{detail.note}</span>
      </div>
    </div>
  );
};

// 获取分数颜色
const getScoreColor = (score) => {
  if (score >= 95) return 'bg-green-500';
  if (score >= 90) return 'bg-blue-500';
  if (score >= 85) return 'bg-yellow-500';
  return 'bg-red-500';
};

// 获取车况等级
const getConditionGrade = (score) => {
  if (score >= 90) return 'A级';
  if (score >= 80) return 'B级';
  if (score >= 70) return 'C级';
  return 'D级';
};

export default ConditionVisualization;
