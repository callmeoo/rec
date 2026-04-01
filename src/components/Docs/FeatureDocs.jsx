import React from 'react';
import { Info, BookOpen, Target, BarChart3, Settings, Rocket } from 'lucide-react';

// 概要
export const FeatureOverview = () => (
  <DocPage
    title="概要"
    icon={<BookOpen className="text-blue-600" size={28} />}
    subtitle="推荐模块功能概述"
  >
    <div className="text-slate-500 text-center py-12">
      <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
      <p>内容待补充，请提供截图</p>
    </div>
  </DocPage>
);

// 推荐策略
export const RecommendStrategy = () => (
  <DocPage
    title="推荐策略"
    icon={<Target className="text-blue-600" size={28} />}
    subtitle="推荐算法与策略说明"
  >
    <div className="text-slate-500 text-center py-12">
      <Target size={48} className="mx-auto mb-4 opacity-50" />
      <p>内容待补充，请提供截图</p>
    </div>
  </DocPage>
);

// 埋点
export const TrackingDocs = () => (
  <DocPage
    title="埋点"
    icon={<BarChart3 className="text-blue-600" size={28} />}
    subtitle="埋点事件与数据采集说明"
  >
    <div className="text-slate-500 text-center py-12">
      <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
      <p>内容待补充，请提供截图</p>
    </div>
  </DocPage>
);

// 可配置参数
export const ConfigParams = () => (
  <DocPage
    title="可配置参数"
    icon={<Settings className="text-blue-600" size={28} />}
    subtitle="系统可配置参数说明"
  >
    <div className="text-slate-500 text-center py-12">
      <Settings size={48} className="mx-auto mb-4 opacity-50" />
      <p>内容待补充，请提供截图</p>
    </div>
  </DocPage>
);

// 发布策略
export const ReleaseStrategy = () => (
  <DocPage
    title="发布策略"
    icon={<Rocket className="text-blue-600" size={28} />}
    subtitle="版本发布与上线策略"
  >
    <div className="text-slate-500 text-center py-12">
      <Rocket size={48} className="mx-auto mb-4 opacity-50" />
      <p>内容待补充，请提供截图</p>
    </div>
  </DocPage>
);

// 通用文档页面布局
const DocPage = ({ title, icon, subtitle, children }) => (
  <div className="h-full flex flex-col bg-slate-50">
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
        {icon}
        {title}
      </h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
    <div className="flex-1 overflow-y-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {children}
      </div>
    </div>
  </div>
);
