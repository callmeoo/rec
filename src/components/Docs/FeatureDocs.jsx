import React from 'react';
import { Info, BookOpen, Target, BarChart3, Settings, Rocket } from 'lucide-react';

// 概要
export const FeatureOverview = () => (
  <DocPage
    title="概要"
    icon={<BookOpen className="text-blue-600" size={28} />}
    subtitle="推荐模块功能概述"
  >
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">
      {/* 原型访问链接 */}
      <p className="text-slate-700">
        原型访问链接：<a href="https://rec-swart.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://rec-swart.vercel.app/</a>
      </p>

      <hr className="my-6 border-slate-200" />

      {/* 二、项目介绍 */}
      <h2 className="text-lg font-bold text-slate-900 mt-6 mb-4">二、项目介绍</h2>

      <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">1、背景与目标</h3>
      <p className="text-slate-700 mb-2">
        在B2B二手车拍卖中，信息分散与效率瓶颈是核心痛点。目前平台缺乏个性化引擎，获客成本高。
      </p>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
        <li>核心目标：推荐模块到场出价率（基线：X%，取上线前30天均值）在正式上线14天后达到 X+110%。</li>
        <li>辅助目标：猜你喜欢模块的CTR较基线提升 &gt; 5%。</li>
      </ul>
      <p className="text-slate-700 mb-2">
        统计口径：出价率 = 直接/间接出价台次 / 推荐模块曝光台次，同一买家同一车辆仅计1次。
      </p>

      <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">曝光定义：</h4>
      <p className="text-slate-700 mb-2">
        车辆推荐卡片至少50%的面积进入用户可视区域，触发一次曝光事件。
      </p>
      <p className="text-slate-700 mb-4">
        同一用户在同一会话内对同一车辆重复浏览，不重复计曝光。
      </p>

      <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、业务逻辑</h3>
      <p className="text-slate-700 mb-2">
        遵循"生物画像识别 → 候选拉取 → 过滤排序 → 前端展示 → 反馈回收"闭环。
      </p>
      <p className="text-slate-700 mb-4">
        系统每日 0 点更新画像数据。
      </p>

      {/* 三、数据基础 */}
      <h2 className="text-lg font-bold text-slate-900 mt-8 mb-4">三、数据基础</h2>

      <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">1、买家画像</h3>
      <p className="text-slate-700 mb-2">
        位置：BMS管理后台 - 买家管理 - 买家详情：用户画像tab
      </p>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
        <li>（1）、新增标签：国别（按占比排序）、出价次数（1台车出价N次计为N）、出价台次</li>
        <li>（2）、价格段调整：0-3万、3-5万、5-8万、8-15万、15-20万、20万以上；系统按新的价格段重跑一遍已有画像数据</li>
        <li>（3）、新增"出价偏好"：集中度标签由系统自动根据选定属性值（国别、品牌车系、车龄、价格段）占比，选出占比由高到低累加，直到覆盖 60–80% 的出价量，组成长期出价偏好标签</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-4">
        <p className="text-xs text-amber-700 mb-2 font-semibold">📌 参考截图（黄色遮罩层为新增功能点或已有功能调整点）</p>
        <img 
          src="/buyer-profile-screenshot.png" 
          alt="买家画像需求截图" 
          className="w-full rounded border border-slate-200"
        />
      </div>

      <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、车辆周转分计算（候选集2）</h3>
      <p className="text-slate-700 mb-2">
        车辆周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3
      </p>
      <p className="text-slate-700 mb-2">
        耗时取值：取成交耗时的中位数，异常值（浮点数）向上取整
      </p>

      <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">2.1、<span className="text-red-600">基础定义（按车系维度，可能每天上拍量不足200台）</span></h4>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
        <li>统计周期：默认近60天，支持配置 60/90/120/180 天。</li>
        <li>统计范围：车系 = 价位段 + 车龄段 + 品牌级别。</li>
        <li>样本充足<span className="text-blue-600 font-semibold">可配置</span>阈值：上架数 &gt; 6 且 成交数 &gt; 3 才认为样本充足并参与评分</li>
      </ul>

      <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">2.2、统计指标</h4>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
        <li>（1）、上架数：周期内首次上架（上拍计审核）为上架/该车系的车辆数。</li>
        <li>（2）、成交数：周期内该车系成交车辆数。</li>
        <li>（3）、成交率：成交数 / 上架数，保留2位小数点。</li>
        <li>（4）、车辆平均成交耗时（小时）：保留2位小数点。</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
        <p className="text-sm text-blue-800 font-semibold mb-2">
          ● 单车成交耗时 = 成交时间 – 首次有效上架时间（首次上架被批准审核通过的时间）：主持完成后出成交，流拍纳入到拍出周期统计中
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 ml-4">
          <li>无成交/流拍的：车辆被纳入成交率分母但不作为成交，不作为计算周期的起点。</li>
          <li>车辆在拍的时间段内如果有暂停拍卖的情况，视为"二次拍"，需要重新开始计算。</li>
          <li>判定条件：本次上架到 – 上次流拍审核/拍卖结束/流拍时间间隔 &gt; <span className="text-red-600 font-semibold">10天（可配置）</span>。</li>
          <li>如果满足，本次上架所有的成交记录，以本次上架到（上拍至审核通过的时间）作为新的起点重新上架时间计算 T_new</li>
        </ul>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">● 判定流程（按序执行）</h4>
      <p className="text-slate-700 mb-2">
        取本次上架时间 T_new
      </p>
      <p className="text-slate-700 mb-2">
        追找同车辆上一次拍卖结束时间 T_prev（拍卖时间/流拍时间）
      </p>
      <p className="text-slate-700 mb-2">
        若 D = 二选择判定阈值（默认10天=240小时），则按D &gt; 门槛，重置车辆上架起始时间为 T_new
      </p>
      <p className="text-slate-700 mb-2">
        若 D &lt; 阈值，沿用首次有效上架时间作为耗时计算起点法：无场次限制（入场或系统启动）不计入 T_prev，视为"流拍后"继续。
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4">
        <p className="text-sm text-slate-700">
          ● 该车系平均耗时 = 所有已成交车辆归属车系耗时，取中位数。
        </p>
        <p className="text-sm text-slate-500 mt-2">
          取中位数原因：（不用平均数，因为价格异常值会干扰结果）
        </p>
        <p className="text-sm text-slate-500 mt-1">
          目的是观察出大多数人，验证在某个车系在某个周期中，该数据在某部分区间的分布的平均值。
        </p>
      </div>

      <p className="text-slate-700 mb-2">
        各个维度：按近5个周期统计：车 A 2次、车 B 1次、车 C 0.5次、车 E（拍卖期）20天。
      </p>
      <p className="text-slate-700 mb-2">
        取中位数（80.5小时）：满足条件 3 个（80.5小时）、筛选 2 台有效车辆。
      </p>
      <p className="text-slate-700 mb-4">
        如果中位数出现偶数台车的情况，取中间上面（取中间两个值的较大值，向下取整）。
      </p>

      <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">2.3、综合周转分</h4>
      <p className="text-slate-700 mb-2">
        目的：将成交率 × 成交耗时 × 合理权"合成一个 0~100 的分数，便于排序及展示。
      </p>
      <p className="text-slate-700 mb-2">
        （1）、得分公式
      </p>
      <p className="text-slate-700 mb-2 font-semibold">
        周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3（<span className="text-red-600">可配置</span>）。
      </p>
      <p className="text-slate-700 mb-2">
        在本次交易在车系集合中：<span className="text-red-600">建模场景统一化都是使用百分位数方法，请技术开发使用</span>
      </p>
      <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
        <li>对成交率值 0~100 分进行归一化：
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>成交率评分 = (成交率-最小成交率)/(最大成交率-最小成交率)×100</li>
          </ul>
        </li>
        <li>对平均成交耗时做"反向"归一（越快分越高），归一 0~100 分
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>耗时评分 = (最大耗时-某车系耗时)/(最大耗时-最小耗时)×100</li>
          </ul>
        </li>
        <li>周转分范围：0~100，数值越高，表示该车系在近期更"好卖且快转"。</li>
      </ul>
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
