import React, { useState } from 'react';
import { Info, BookOpen, Target, BarChart3, Settings, Rocket, ChevronDown, ChevronRight } from 'lucide-react';

// 可折叠章节组件
const CollapsibleSection = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        {open ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
        <span className="text-lg font-bold text-slate-900">{title}</span>
      </button>
      {open && <div className="px-4 py-4">{children}</div>}
    </div>
  );
};

// 概要
export const FeatureOverview = () => (
  <DocPage
    title="概要"
    icon={<BookOpen className="text-blue-600" size={28} />}
    subtitle="推荐模块功能概述"
  >
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      {/* 一、项目介绍 */}
      <CollapsibleSection title="一、项目介绍" defaultOpen={true}>
        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、背景与目标</h3>
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
        <p className="text-slate-700 mb-2">
          系统每日 0 点更新画像数据。
        </p>
      </CollapsibleSection>

      {/* 二、数据基础 */}
      <CollapsibleSection title="二、数据基础" defaultOpen={true}>
        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、买家画像</h3>
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
            src={new URL('/buyer-profile-screenshot.png', import.meta.url).href}
            alt="买家画像需求截图" 
            className="w-1/2 rounded border border-slate-200"
            onError={(e) => { e.target.style.display = 'none'; }}
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
      </CollapsibleSection>

    </div>
  </DocPage>
);

// 推荐策略
export const RecommendStrategy = () => (
  <DocPage
    title="四、推荐策略"
    icon={<Target className="text-blue-600" size={28} />}
    subtitle="数据筛选、候选集生成与打散规则"
  >
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      {/* 1、数据筛选和过滤 */}
      <CollapsibleSection title="1、数据筛选和过滤" defaultOpen={true}>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>车辆状态：预展中、拍卖中</li>
          <li>过滤车况评级D和火烧车、泡水车(含"水泡"标签)</li>
          <li>过滤已登录账号已出价车辆</li>
        </ul>
      </CollapsibleSection>

      {/* 2、推荐数据 */}
      <CollapsibleSection title="2、推荐数据" defaultOpen={true}>

        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-3">
          2.1、前端展示全平台上拍车辆的15%：（按照每日上架不足200台，为您推荐<span className="text-red-600 underline decoration-red-400">固定展示16台车，可配</span>）
        </h3>

        <h3 className="text-base font-semibold text-slate-800 mt-6 mb-3">2.2、候选集</h3>

        {/* 候选集1 */}
        <div className="ml-2 mb-6">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">● 候选集 1</h4>

          {/* Step 1 */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-slate-800 mb-2">Step 1 — 强匹配（优先）</h5>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>匹配维度：主打车系 + 主打价格段 + 主打车龄（三维全匹配）
                <br />
                <span className="ml-6 text-slate-600">例如买家标签为"大众迈腾 + 3-5万 + 4-6年"，则严格拉取该交集下的车源。若满16台则停止向下寻找。</span>
              </li>
              <li>若结果 ≥ 目标数量 → 直接使用，反之进入Step 2</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-slate-800 mb-2">Step 2 — 双维容差匹配（解决临界值流失）</h5>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>匹配条件：【主打车系】+【价位容差：金额±10%】+【车龄容差：±1年】。</li>
              <li>动作：将符合该条件的车辆补充进列表（需排除第1层级已有的车，按vid去重）。</li>
            </ul>
          </div>
        </div>

      </CollapsibleSection>

      {/* 候选集2、3、打散等后续章节保持 */}
      <CollapsibleSection title="2.2（续）、候选集 2：平台周转（高周转车型）" defaultOpen={true}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">优先级第二</span>
          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">基于周转分</span>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-3">
          <li>从全站车型中，按 <span className="font-semibold text-green-700">综合周转分</span> 从高到低排序</li>
          <li>取 <span className="font-semibold">TOP 50</span> 车型对应的在拍车辆</li>
          <li>同一车系在候选集2中的占比 <span className="font-semibold text-red-600">≤ 50%</span></li>
          <li>去重：候选集2中的车辆如果已在候选集1中出现，则自动去重，不重复推荐</li>
        </ul>
        <div className="flex gap-2 flex-wrap mt-3">
          <span className="text-xs text-slate-500">推荐标注：</span>
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">候选车源-同车型高频成交</span>
          <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs rounded">候选集 2</span>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="2.2（续）、候选集 3：全站兜底（平台热销）" defaultOpen={true}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">优先级第三</span>
          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded">兜底策略</span>
        </div>
        <p className="text-slate-700 mb-3">
          当候选集1 + 候选集2的车辆数不足16台时，启用候选集3进行补充。
        </p>
        <p className="text-slate-700 mb-2 font-semibold">排序规则：按【结束时间(升序) + 出价次数(降序)】排序</p>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>即将结束的优先展示</li>
          <li>热度高的优先展示</li>
          <li>去重：排除已在候选集1或候选集2中出现的车辆</li>
        </ul>
        <div className="flex gap-2 flex-wrap mt-3">
          <span className="text-xs text-slate-500">推荐标注：</span>
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">兜底-平台热销</span>
          <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">候选集 3</span>
        </div>
      </CollapsibleSection>

      {/* 3、打散策略 */}
      <CollapsibleSection title="3、打散策略" defaultOpen={true}>
        <p className="text-slate-700 mb-3">
          前 10 位中：
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 mb-3">
          <li>同一品牌连续 <span className="font-semibold text-red-600">≤ 3 台</span></li>
          <li>同一车型连续 <span className="font-semibold text-red-600">≤ 2 台</span></li>
        </ul>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-slate-600">
            在三个候选集合并、去重、排序完成后执行打散。若违反规则，将多余车辆后移至下一个不违反规则的位置，打散后不改变候选集归属标注。
          </p>
        </div>
      </CollapsibleSection>

    </div>
  </DocPage>
);

// 埋点
export const TrackingDocs = () => {
  const trackingEvents = [
    {
      name: 'rec_show_m',
      trigger: '移动端曝光次数：推荐位进入用户视口（曝光），能看到2台车辆；搜索无结果页曝光。曝光定义：车辆推荐卡片至少50%的面积进入用户可视区域，触发一次曝光事件；同一用户在同一会话内对同一车辆重复浏入，不重复计曝光。',
      fields: 'rec_version(推荐算法版本), rec_source(首页、搜索无结果), item_id(推荐排位), rec_type(候选集类型：画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)',
      platform: '移动端'
    },
    {
      name: 'rec_show_pc',
      trigger: 'PC端曝光次数：搜索结果页页底展示',
      fields: 'rec_version(推荐算法版本), rec_source(搜索无结果), item_id(推荐排位), rec_type(候选集类型：画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)',
      platform: 'PC端'
    },
    {
      name: 'rec_click_m',
      trigger: 'Mob点击次数：用户点击推荐卡片',
      fields: 'rec_version(推荐算法版本), rec_source(首页、搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: '移动端'
    },
    {
      name: 'rec_click_pc',
      trigger: 'PC端点击次数：用户点击推荐卡片',
      fields: 'rec_version(推荐算法版本), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: 'PC端'
    },
    {
      name: 'aucdetail_view_pc',
      trigger: 'PC端详情页：进入车辆详情页',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: 'PC端'
    },
    {
      name: 'aucdetail_view_m',
      trigger: '移动端详情页：进入车辆详情页',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: '移动端'
    },
    {
      name: 'bid_start_m',
      trigger: '移动端点击出价次数：点击"我要出价"按钮',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: '移动端'
    },
    {
      name: 'bid_start_pc',
      trigger: 'PC端点击出价次数：点击"我要出价"按钮',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: 'PC端'
    },
    {
      name: 'bid_submit_m',
      trigger: '移动端出价成功（同台车仅计算1次）：出价成功',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: '移动端'
    },
    {
      name: 'bid_submit_pc',
      trigger: 'PC端出价成功（同台车仅计算1次）：出价成功',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: 'PC端'
    },
    {
      name: 'bid_success_m',
      trigger: '移动端车辆中标：车辆中标',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: '移动端'
    },
    {
      name: 'bid_success_pc',
      trigger: 'PC端车辆中标：车辆中标',
      fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)',
      platform: 'PC端'
    }
  ];

  return (
    <DocPage
      title="埋点"
      icon={<BarChart3 className="text-blue-600" size={28} />}
      subtitle="埋点事件与数据采集说明"
    >
      <div className="space-y-6">
        {/* 一、埋点文档 */}
        <CollapsibleSection title="一、埋点文档" defaultOpen={true}>
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-slate-700 text-sm mb-2">技术看下有什么方式进行埋点：</p>
              <a
                href="https://doc.weixin.qq.com/sheet/e3_AUEAhwa7AKcCNkvFjEA9WQrSBTH0y?scode=AG4AJAc6AAgreGuAYwAUEAhwa7AKc&tab=BB08J2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
              >
                【企微文档】推荐位埋点
              </a>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold text-sm">
                1期可以仅做移动端埋点，暂不做PC端埋点，以 auction_id + buyer_id 为唯一键
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 二、补充基准线 */}
        <CollapsibleSection title="二、补充基准线" defaultOpen={true}>
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                功能开发后，前端先发版，统计现有为您推荐数据（移动端）
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 bg-slate-50 font-semibold text-slate-700 w-32 border-r border-slate-200">指标名称</td>
                    <td className="py-3 px-4 text-slate-800">出价率 (Bid Rate)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">统计口径</td>
                    <td className="py-3 px-4 text-slate-800">出价台次 / 曝光台次，以移动端推荐模块为统计范围（一期）</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">当前基线值</td>
                    <td className="py-3 px-4 text-slate-800">取上线前 21 天数据均值，精确到小数点后两位</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">数据来源</td>
                    <td className="py-3 px-4 text-slate-800">现有唯车拍 app &amp; 小程序移动端推荐位的曝光/出价事件</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">统计粒度</td>
                    <td className="py-3 px-4 text-slate-800">以"台次"为单位，同一买家对同一车辆的多次出价仅计 1 次</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CollapsibleSection>

        {/* 三、埋点事件清单 */}
        <CollapsibleSection title="三、埋点事件清单" defaultOpen={true}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="py-2.5 px-3 font-semibold text-slate-700 border-b border-r border-slate-200 whitespace-nowrap">事件名称</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 border-b border-r border-slate-200">触发时机</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 border-b border-r border-slate-200">属性字段</th>
                  <th className="py-2.5 px-3 font-semibold text-slate-700 border-b border-slate-200 whitespace-nowrap">端</th>
                </tr>
              </thead>
              <tbody>
                {trackingEvents.map((evt, idx) => (
                  <tr key={evt.name} className={idx < trackingEvents.length - 1 ? 'border-b border-slate-200' : ''}>
                    <td className="py-2.5 px-3 text-slate-800 font-mono text-xs border-r border-slate-200 whitespace-nowrap">{evt.name}</td>
                    <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200 text-xs">{evt.trigger}</td>
                    <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200 text-xs">{evt.fields}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${evt.platform === '移动端' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {evt.platform}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      </div>
    </DocPage>
  );
};

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