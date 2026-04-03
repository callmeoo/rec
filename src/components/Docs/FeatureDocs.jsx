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

// 目标和数据基础
export const FeatureOverview = () => {
  const [activeInnerTab, setActiveInnerTab] = useState('项目介绍');
  const [activeDataTab, setActiveDataTab] = useState('买家画像');
  const tabs = ['项目介绍', '数据基础'];
  const dataTabs = ['买家画像', '平台周转率'];

  return (
    <DocPage
      title="目标和数据基础"
      icon={<BookOpen className="text-blue-600" size={28} />}
      subtitle="推荐模块目标与数据基础"
    >
      {/* Tab 切换 */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveInnerTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              activeInnerTab === tab
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab1: 项目介绍 */}
      {activeInnerTab === '项目介绍' && (
        <div className="prose prose-slate max-w-none text-sm leading-relaxed">
          <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、背景与目标</h3>
          <p className="text-slate-700 mb-2">
            在B2B二手车拍卖中，信息分散与效率瓶颈是核心痛点。目前平台缺乏个性化引擎，获客成本高。
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
            <li>核心目标：推荐模块曝光出价率（基线：X%，取上线前30天均值）在正式上线14天后达到 X+110%。</li>
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
        </div>
      )}

      {/* Tab2: 数据基础 */}
      {activeInnerTab === '数据基础' && (
        <div className="prose prose-slate max-w-none text-sm leading-relaxed">

          {/* 数据基础子 Tab */}
          <div className="flex gap-1 mb-5 bg-slate-100 rounded-lg p-1 w-fit">
            {dataTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDataTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeDataTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 买家画像 */}
          {activeDataTab === '买家画像' && (
            <div className="flex gap-6">
              {/* 左侧：图片 */}
              <div className="flex-shrink-0" style={{ width: '30%' }}>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-700 mb-2 font-semibold">📌 参考截图</p>
                  <div className="relative">
                    <img 
                      src={new URL('/buyer-profile-screenshot.png', import.meta.url).href}
                      alt="买家画像需求截图" 
                      className="w-full rounded border border-slate-200"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* 生成月份黄色遮罩层 */}
                    <div className="absolute top-0 right-0 w-3/5 bg-yellow-300/60 border-2 border-yellow-500 rounded px-1.5 py-1 flex items-center gap-1" style={{ top: '2%', right: '2%' }}>
                      <span className="text-xs text-yellow-800 font-semibold whitespace-nowrap">调整年月日格式</span>
                      <span className="text-xs text-slate-700">生成日期</span>
                      <span className="text-xs text-slate-600 bg-white border border-slate-300 rounded px-1">2025年12月01日</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">黄色遮罩层为新增功能点或已有功能调整点</p>
                </div>
              </div>
              {/* 右侧：说明 */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 mb-2">
                  位置：BMS管理后台 - 买家管理 - 买家详情：用户画像tab
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
                  <li>（1）、新增标签：国别（按占比排序）、出价次数（1台车出价N次计为N）、出价台次</li>
                  <li>（2）、价格段调整：0-3万、3-5万、5-8万、8-15万、15-20万、20万以上；系统按新的价格段重跑一遍已有画像数据</li>
                  <li>（3）、新增"出价偏好"：集中度标签由系统自动根据选定属性值（国别、品牌车系、车龄、价格段）占比，选出占比由高到低累加，直到覆盖 60–80% 的出价量，组成长期出价偏好标签</li>
                  <li>（4）、生成月份：时间格式调整为"年月日"格式（如：2025年12月01日）</li>
                </ul>
              </div>
            </div>
          )}

          {/* 平台周转率 */}
          {activeDataTab === '平台周转率' && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">车辆周转分计算（候选集2）</h3>
              <p className="text-slate-700 mb-2">
                车辆周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3
              </p>
              <p className="text-slate-700 mb-2">
                耗时取值：取成交耗时的中位数，异常值（浮点数）向上取整
              </p>

              <CollapsibleSection title="1、基础定义" defaultOpen={true}>
                <p className="text-red-600 text-xs mb-2">（按车系维度，可能每天上拍量不足200台）</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
                  <li>统计周期：默认近60天，支持配置 60/90/120/180 天。</li>
                  <li>统计范围：车系 = 价位段 + 车龄段 + 品牌级别。</li>
                  <li>样本充足<span className="text-blue-600 font-semibold">可配置</span>阈值：上架数 &gt; 6 且 成交数 &gt; 3 才认为样本充足并参与评分</li>
                </ul>
              </CollapsibleSection>

              <CollapsibleSection title="2、统计指标" defaultOpen={true}>
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
                <p className="text-slate-700 mb-2">取本次上架时间 T_new</p>
                <p className="text-slate-700 mb-2">追找同车辆上一次拍卖结束时间 T_prev（拍卖时间/流拍时间）</p>
                <p className="text-slate-700 mb-2">若 D = 二选择判定阈值（默认10天=240小时），则按D &gt; 门槛，重置车辆上架起始时间为 T_new</p>
                <p className="text-slate-700 mb-2">若 D &lt; 阈值，沿用首次有效上架时间作为耗时计算起点法：无场次限制（入场或系统启动）不计入 T_prev，视为"流拍后"继续。</p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4">
                  <p className="text-sm text-slate-700">● 该车系平均耗时 = 所有已成交车辆归属车系耗时，取中位数。</p>
                  <p className="text-sm text-slate-500 mt-2">取中位数原因：（不用平均数，因为价格异常值会干扰结果）</p>
                  <p className="text-sm text-slate-500 mt-1">目的是观察出大多数人，验证在某个车系在某个周期中，该数据在某部分区间的分布的平均值。</p>
                </div>

                <p className="text-slate-700 mb-2">各个维度：按近5个周期统计：车 A 2次、车 B 1次、车 C 0.5次、车 E（拍卖期）20天。</p>
                <p className="text-slate-700 mb-2">取中位数（80.5小时）：满足条件 3 个（80.5小时）、筛选 2 台有效车辆。</p>
                <p className="text-slate-700 mb-4">如果中位数出现偶数台车的情况，取中间上面（取中间两个值的较大值，向下取整）。</p>
              </CollapsibleSection>

              <CollapsibleSection title="3、综合周转分" defaultOpen={true}>
                <p className="text-slate-700 mb-2">目的：将成交率 × 成交耗时 × 合理权"合成一个 0~100 的分数，便于排序及展示。</p>
                <p className="text-slate-700 mb-2">（1）、得分公式</p>
                <p className="text-slate-700 mb-2 font-semibold">周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3（<span className="text-red-600">可配置</span>）。</p>
                <p className="text-slate-700 mb-2">在本次交易在车系集合中：<span className="text-red-600">建模场景统一化都是使用百分位数方法，请技术开发使用</span></p>
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
          )}

        </div>
      )}
    </DocPage>
  );
};

// 推荐策略
export const RecommendStrategy = () => {
  const [strategyTab, setStrategyTab] = useState('数据筛选');
  const tabs = ['数据筛选', '候选集', '排序与异常处理'];

  return (
    <DocPage
      title="推荐策略"
      icon={<Target className="text-blue-600" size={28} />}
      subtitle="数据筛选、候选集、排序与异常处理"
    >
      {/* Tab 切换 */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStrategyTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              strategyTab === tab
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      {/* Tab1: 数据筛选 */}
      {strategyTab === '数据筛选' && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-3">1、数据筛选和过滤</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 mb-6">
            <li>车辆状态：<span className="font-semibold">预展中、拍卖中</span></li>
            <li>过滤车况评级D和火烧车、泡水车（含"水泡"标签）</li>
            <li>过滤已登录账号已出价车辆</li>
          </ul>

          <h3 className="text-base font-semibold text-slate-800 mb-2">2、前端展示</h3>
          <p className="text-slate-700">
            全平台上拍车辆的15%：（按照每日上架不足200台，为您推荐展示<span className="font-semibold text-blue-700">16台-28台</span>车，<span className="text-red-600">后台可配</span>）
          </p>
        </div>
      )}

      {/* Tab2: 候选集 */}
      {strategyTab === '候选集' && (
        <div>
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h4 className="text-sm font-bold text-blue-700 mb-2">候选集 1（画像匹配）</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-blue-800">Step 1 — 强匹配（优先）</p>
              <p className="text-slate-700 mt-1">匹配维度：主打车系 + 主打价格段 + 主打车龄（三维全匹配）</p>
              <p className="text-slate-600 mt-1 text-xs">例如买家标签为"大众迈腾 + 3-5万 + 4-6年"，则严格拉取该交集下的车源。</p>
              <p className="text-slate-700 mt-1">若结果 ≥ 目标数量 → 直接使用，反之进入 Step 2</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-indigo-800">Step 2 — 双维容差匹配（解决临界值流失）</p>
              <p className="text-slate-700 mt-1">匹配条件：【主打车系】+【价位容差：金额±10%】+【车龄容差：±1年】</p>
              <p className="text-slate-700 mt-1">触发条件：Step 1 结果 &lt; 16 台。需排除 Step 1 已有的车（按vid去重）。</p>
              <div className="mt-2 space-y-2 text-xs text-slate-600">
                <div className="bg-white rounded p-2">
                  <p className="font-semibold text-slate-700">价格容差逻辑：</p>
                  <p>在原价位段基础上，允许上下浮动10%的绝对金额。价格不可为负：当最低价格段为"0-3万"时，向下容差不可出现负数（0万的-10%应设底线为0）。</p>
                  <p className="mt-1">举例：买家标签 3-5万 → 允许推荐起拍价 2.7万（3万-10%）至 5.5万（5万+10%）之间的同车系、同车龄车源。</p>
                </div>
                <div className="bg-white rounded p-2">
                  <p className="font-semibold text-slate-700">车龄容差逻辑：</p>
                  <p>在买家主打车龄标签的上下限，各放宽1年。</p>
                  <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                    <li>主打 4-6年 → 容差扩充为 3-7年</li>
                    <li>主打 2年以内（0-2年）→ 向下不可为负，容差扩充为 0-3年</li>
                    <li>主打 10年以上 → 向下放宽1年，向上无上限，容差扩充为 9年以上</li>
                  </ul>
                </div>
              </div>
              <p className="text-slate-700 mt-2">若结果 ≥ 目标数量 → 直接使用，反之进入 Step 3</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-purple-800">Step 3 — 放弃车系（一级扩展）</p>
              <p className="text-slate-700 mt-1">匹配维度：主打价格段 + 主打车龄（去掉车系限制）</p>
              <p className="text-slate-700 mt-1">若结果 ≥ 目标数量 → 使用，反之进入 Step 4</p>
            </div>
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 mb-3">
              <p className="text-sm font-semibold text-slate-800">Step 4 — 兜底（二级扩展）</p>
              <p className="text-slate-700 mt-1">匹配维度：无约束，从候选集2（平台周转TOP50）中补充剩余缺口</p>
              <p className="text-slate-700 mt-1">若候选集2也不足，则从候选集3（全站兜底）补至目标数量</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700"><span className="font-semibold">去重机制：</span>在经历 Step 1 到 Step 4 的漏斗过滤时，需做去重处理（按vid去重），避免同一台车在前端展示两次。</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4 mb-6">
            <h4 className="text-sm font-bold text-green-700 mb-2">候选集 2（平台周转）</h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700">
              <li>全站周转分 <span className="font-semibold">TOP 50</span> 车系</li>
              <li>同品牌占比 <span className="font-semibold text-red-600">≤ 40%</span></li>
              <li>候选集内的车辆周转分要 <span className="font-semibold text-red-600">大于 60</span></li>
            </ul>
          </div>

          <div className="border-l-4 border-gray-400 pl-4 mb-6">
            <h4 className="text-sm font-bold text-gray-700 mb-2">候选集 3（全站兜底）</h4>
            <p className="text-slate-700 mb-2">若以上候选结果集都不足，剩余车辆推荐位用"全站热销兜底"。</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700">
              <li>全站热销：在拍车辆按照<span className="font-semibold">出价次数从高到低</span>排序</li>
              <li>出价次数一致，按<span className="font-semibold">竞价结束时间升序</span>排列</li>
              <li>若拍卖结束时间和出价次数都完全相同，则采用<span className="font-semibold">随机排序打散</span></li>
              <li>在全局过滤规则外，候选集3<span className="font-semibold text-red-600">排除当前出价次数为0的车辆</span></li>
            </ul>
          </div>

          <h4 className="text-sm font-semibold text-slate-800 mt-4 mb-2">用户未登录情况下的推荐集</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">取：<span className="font-semibold">候选集2 &amp; 候选集3</span> 数据</p>
          </div>
        </div>
      )}

      {/* Tab3: 排序与异常处理 */}
      {strategyTab === '排序与异常处理' && (
        <div>
          <h3 className="text-base font-semibold text-slate-800 mb-2">排序规则</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 mb-3">
            <li>同一个候选集：按【拍卖结束时间（升序）】</li>
            <li>拍卖结束时间相同，按出价次数（降序）</li>
            <li>若拍卖结束时间和出价次数相同，随机排序</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-amber-700"><span className="font-semibold">打散策略：</span>前 10 位中，同一品牌连续 ≤ 3 台，同一车系连续 ≤ 3 台。</p>
          </div>

          <h3 className="text-base font-semibold text-slate-800 mb-2">异常处理</h3>
          <p className="text-slate-700 mb-2">为保障系统高可用，当推荐服务出现故障，接口超时未返回，则直接调用<span className="font-semibold">缓存</span>中的上一次计算结果。</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700">
            <li>在读取缓存列表后，将状态不符（已拍卖结束）的车辆从缓存中过滤</li>
            <li>若数量不足，则用候选集3（全站热销兜底）进行补充</li>
            <li>三个候选集合并后仍不足16台时，<span className="font-semibold">保持实际数量展示，不强制补满</span></li>
          </ul>
        </div>
      )}

      </div>
    </DocPage>
  );
};

export const TrackingDocs = () => {
  const mobileEvents = [
    { name: 'rec_show_m', trigger: '移动端曝光次数：推荐位进入用户视口（曝光），能看到2台车辆；搜索无结果页曝光。曝光定义：车辆推荐卡片至少50%的面积进入用户可视区域，触发一次曝光事件；同一用户在同一会话内对同一车辆重复浏入，不重复计曝光。', fields: 'rec_version(推荐算法版本), rec_source(首页home、搜索无结果search_no_result), item_id(推荐排位), rec_type(候选集类型：初始default、画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)', platform: '移动端' },
    { name: 'rec_click_m', trigger: 'Mob点击次数：用户点击推荐卡片', fields: 'rec_version(推荐算法版本), rec_source(首页home、搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'aucdetail_view_m', trigger: '移动端详情页：进入车辆详情页', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_start_m', trigger: '移动端点击出价次数：点击"我要出价"按钮', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_submit_m', trigger: '移动端出价成功（同台车仅计算1次）：出价成功', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_success_m', trigger: '移动端车辆中标：车辆中标', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: '移动端', disabled: true },
  ];
  const pcEvents = [
    { name: 'rec_show_pc', trigger: 'PC端曝光次数：搜索结果页页底展示', fields: 'rec_version(推荐算法版本), rec_source(搜索无结果search_no_result), item_id(推荐排位), rec_type(候选集类型：初始default、画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)', platform: 'PC端' },
    { name: 'rec_click_pc', trigger: 'PC端点击次数：用户点击推荐卡片', fields: 'rec_version(推荐算法版本), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'aucdetail_view_pc', trigger: 'PC端详情页：进入车辆详情页', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_start_pc', trigger: 'PC端点击出价次数：点击"我要出价"按钮', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_submit_pc', trigger: 'PC端出价成功（同台车仅计算1次）：出价成功', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_success_pc', trigger: 'PC端车辆中标：车辆中标', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页home/搜索无结果search_no_result), item_id(推荐排位), (候选集类型：初始default、画像匹配、平台周转、全站兜底)', platform: 'PC端' },
  ];

  return (
    <DocPage
      title="埋点说明"
      icon={<BarChart3 className="text-blue-600" size={28} />}
      subtitle="埋点事件与数据采集说明"
    >
      <div className="prose prose-slate max-w-none text-sm leading-relaxed">

        {/* 技术确定埋点方式 */}
        <div className="mb-4">
          <p className="text-red-600 font-semibold mb-2">技术确定埋点方式：</p>
          <p className="text-slate-700 mb-2">
            1期可以仅做移动端埋点，暂不做PC端埋点，以 auction_id + buyer_id 为唯一键
          </p>
          <a
            href="https://doc.weixin.qq.com/sheet/e3_AUEAhwa7AKcCNkvFjEA9WQrSBTH0y?scode=AG4AJAc6AAgreGuAYwAUEAhwa7AKc&tab=BB08J2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            【企微文档】推荐位埋点
          </a>
        </div>

        {/* 一、补充基准线 */}
        <CollapsibleSection title="一、补充基准线" defaultOpen={true}>
          <p className="text-slate-700 mb-4">
            埋点数据需功能开发后上线，目的是获取现有"为您推荐"基础数据（曝光次数、点击次数、出价次数）
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-800 w-1/4">指标名称</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-800">出价率 (Bid Rate)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">统计口径</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">出价台次 / 曝光台次，以移动端推荐模块为统计范围（一期）</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">当前基线值</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">取上线前 21 天数据均值，精确到小数后两位</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">数据来源</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">现有唯车拍 app &amp; 小程序移动端推荐位的曝光/出价事件</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">统计粒度</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">以"台次"为单位，同一买家对同一车辆的多次出价仅计 1 次</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* 二、埋点事件清单 */}
        <CollapsibleSection title="二、埋点事件清单" defaultOpen={true}>
          <p className="text-slate-700 mb-3">
            唯一键：<code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">auction_id + buyer_id</code>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">事件名称</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">触发时机</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">属性字段</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">端</th>
                </tr>
              </thead>
              <tbody>
                {/* 移动端埋点 */}
                {mobileEvents.map((evt) => (
                  <tr key={evt.name} className={evt.disabled ? 'bg-gray-100 text-gray-400' : ''}>
                    <td className={`border border-slate-300 px-3 py-2 font-mono text-xs whitespace-nowrap ${evt.disabled ? '' : 'text-slate-700'}`}>{evt.name}</td>
                    <td className={`border border-slate-300 px-3 py-2 text-xs ${evt.disabled ? '' : 'text-slate-700'}`}>{evt.trigger}</td>
                    <td className={`border border-slate-300 px-3 py-2 text-xs ${evt.disabled ? '' : 'text-slate-700'}`}>{evt.fields}</td>
                    <td className="border border-slate-300 px-3 py-2 whitespace-nowrap">
                      {evt.disabled ? (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-500">{evt.platform}（不展示效果分析）</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{evt.platform}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* PC端埋点 - 置灰，一期不开发 */}
                {pcEvents.map((evt) => (
                  <tr key={evt.name} className="bg-gray-100 text-gray-400">
                    <td className="border border-slate-300 px-3 py-2 font-mono text-xs whitespace-nowrap">{evt.name}</td>
                    <td className="border border-slate-300 px-3 py-2 text-xs">{evt.trigger}</td>
                    <td className="border border-slate-300 px-3 py-2 text-xs">{evt.fields}</td>
                    <td className="border border-slate-300 px-3 py-2 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-500">{evt.platform}（一期不开发）</span>
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
export const ConfigParams = () => {
  const [configTab, setConfigTab] = useState('配置总览');
  const configTabs = ['配置总览', '周转分相关', '推荐数量', '变更记录'];

  return (
    <DocPage
      title="为您推荐配置"
      icon={<Settings className="text-blue-600" size={28} />}
      subtitle="BMS → 推荐管理 → 参数配置（无需发布代码即可调整推荐策略）"
    >
      <div className="flex border-b border-slate-200 mb-6">
        {configTabs.map((tab) => (
          <button key={tab} onClick={() => setConfigTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${configTab === tab ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >{tab}</button>
        ))}
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      {/* 配置总览 */}
      {configTab === '配置总览' && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700">🔵 次日0点生效 — 需重跑离线任务（画像、周转分），定时任务触发</p>
            <p className="text-xs text-blue-700 mt-1">🟢 立即生效 — 仅更新缓存/配置，下次推荐请求即生效</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">参数名称</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">默认值</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">取值范围</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">配置类型</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">生效时机</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">影响模块</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['二进宫判定周期', '30天', '14~90天', '整数输入框', '🔵 次日0点', '周转分计算'],
                  ['周转分权重', '成交率0.7 / 耗时0.3', '各0~1，和为1', '双滑块（互斥）', '🔵 次日0点', '周转分计算'],
                  ['用户画像统计周期', '60天', '60/90/120/180', '下拉单选', '🔵 次日0点', '买家画像'],
                  ['样本充足判定', '上架≥6 / 成交≥3', '上架3~20 / 成交2~10', '双整数输入框', '🔵 次日0点', '周转分计算'],
                  ['推荐数量-最小值', '16台', '15~30', '整数输入框', '🟢 立即生效', '推荐位数量'],
                  ['推荐数量-最大值', '40台', '30~60', '整数输入框', '🟢 立即生效', '推荐位数量'],
                  ['库存覆盖率', '15%', '10~20%', '滑块', '🟢 立即生效', '推荐位数量'],
                ].map(([name, def, range, type, effect, module], i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                    <td className="border border-slate-200 px-3 py-2 font-medium text-slate-800">{name}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-600">{def}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-600">{range}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-500">{type}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">{effect}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-500">{module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <p className="font-semibold mb-1">权限说明：</p>
            <p>产品经理/运营管理员：可查看、可编辑 · 系统管理员：可查看、可编辑、可查看变更记录 · 数据分析师：仅可查看</p>
          </div>
        </div>
      )}

      {/* 周转分相关 */}
      {configTab === '周转分相关' && (
        <div className="space-y-6">
          <CollapsibleSection title="二进宫判定周期" defaultOpen={true}>
            <p className="text-slate-700 mb-2">参数键名：<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">second_listing_interval_days</code></p>
            <p className="text-slate-700 mb-2">判定车辆是否为"二进宫"（重新上架）的时间间隔阈值。</p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mt-2">
              <p>如果（本次上架时间 - 上次结束时间）&gt; 该配置值 → 判定为"二进宫"，重置成交耗时计算周期</p>
              <p>否则 → 视为连续拍卖，累计计算成交耗时</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">默认值：30天 · 范围：14~90天 · 🔵 次日0点生效</p>
          </CollapsibleSection>

          <CollapsibleSection title="周转分权重" defaultOpen={true}>
            <p className="text-slate-700 mb-2">参数键名：<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">turnover_score_weights</code></p>
            <p className="text-slate-700 mb-2">周转分 = 成交率评分 × 权重A + 耗时评分 × 权重B（权重A + 权重B = 1.0）</p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mt-2">
              <p>• 成交率权重越高 → 越倾向"能卖出"的车型</p>
              <p>• 耗时权重越高 → 越倾向"卖得快"的车型</p>
              <p className="mt-1">拖动成交率滑块，耗时权重自动调整为 1 - 成交率权重</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">默认值：成交率0.7 / 耗时0.3 · 步长0.1 · 🔵 次日0点生效 · 支持模拟计算TOP100车型变化</p>
          </CollapsibleSection>

          <CollapsibleSection title="用户画像统计周期" defaultOpen={true}>
            <p className="text-slate-700 mb-2">参数键名：<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">user_profile_stat_days</code></p>
            <p className="text-slate-700 mb-2">买家画像统计出价行为的回溯天数，统计内容包括：国别、品牌、车系、价格段、车龄偏好。</p>
            <p className="text-xs text-slate-500 mt-2">默认值：60天 · 可选：60/90/120/180天 · 🔵 次日0点生效</p>
          </CollapsibleSection>

          <CollapsibleSection title="样本充足判定" defaultOpen={true}>
            <p className="text-slate-700 mb-2">参数键名：<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">sample_sufficient_threshold</code></p>
            <p className="text-slate-700 mb-2">车型周转分计算的最小样本量要求。满足两个条件的车型才参与周转分计算。</p>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mt-2">
              <p>• 阈值过高 → 有效车型减少</p>
              <p>• 阈值过低 → 数据不稳定</p>
              <p className="mt-1">验证规则：成交数下限 ≤ 上架数下限</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">默认值：上架≥6台 / 成交≥3台 · 🔵 次日0点生效 · 支持模拟计算样本充足车型数变化</p>
          </CollapsibleSection>
        </div>
      )}

      {/* 推荐数量 */}
      {configTab === '推荐数量' && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-700">🟢 以下配置保存后立即生效，下次推荐请求即使用新配置</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">推荐数量动态调整</h4>
            <p className="text-slate-700 mb-3 text-xs">
              公式：最终推荐位数量 = max(最小值, min(最大值, 当前库存 × 库存覆盖率))
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">最小推荐位数量</p>
                <p className="text-lg font-bold text-slate-900">16 台</p>
                <p className="text-xs text-slate-400">范围：15~30</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">最大推荐位数量</p>
                <p className="text-lg font-bold text-slate-900">40 台</p>
                <p className="text-xs text-slate-400">范围：30~60</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">库存覆盖率</p>
                <p className="text-lg font-bold text-slate-900">15%</p>
                <p className="text-xs text-slate-400">范围：10~20%</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <p className="font-semibold">计算示例（当前库存200辆）：</p>
              <p>基础数量 = 200 × 15% = 30台 → 最终数量 = max(16, min(40, 30)) = 30台</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">验证规则：最小值 &lt; 最大值 · 库存覆盖率步长1%</p>
        </div>
      )}

      {/* 变更记录 */}
      {configTab === '变更记录' && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">变更时间</th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">操作人</th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">变更内容</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">生效时间</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">状态</th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['2026-01-22 10:30', '张三', '周转分权重：0.7/0.3 → 0.6/0.4', '2026-01-23 00:00', '待生效', true],
                  ['2026-01-22 09:15', '李四', '推荐数量最大值：40台 → 45台', '立即', '已生效', false],
                  ['2026-01-20 14:20', '王五', '二进宫判定周期：30天 → 45天', '2026-01-21 00:00', '已生效', false],
                ].map(([time, op, content, effect, status, canRollback], i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                    <td className="border border-slate-200 px-3 py-2 text-slate-600 whitespace-nowrap">{time}</td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">{op}</td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-700">{content}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center text-slate-600">{effect}</td>
                    <td className="border border-slate-200 px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${status === '待生效' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{status}</span>
                    </td>
                    <td className="border border-slate-200 px-3 py-2 text-center">
                      <span className="text-blue-600 text-xs cursor-pointer">查看</span>
                      {canRollback && <span className="text-red-600 text-xs cursor-pointer ml-2">回滚</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <p>回滚规则：仅"待生效"或"草稿"状态可回滚，回滚后恢复为上一个"已生效"的配置值。</p>
          </div>
        </div>
      )}

      </div>
    </DocPage>
  );
};

// 发布策略
export const ReleaseStrategy = () => {
  const [activePhase, setActivePhase] = useState('阶段一');
  const phases = ['阶段一', '阶段二', '回滚方案'];

  return (
    <DocPage
      title="发布策略"
      icon={<Rocket className="text-blue-600" size={28} />}
      subtitle="版本发布与上线策略"
    >
      {/* Tab 切换 */}
      <div className="flex border-b border-slate-200 mb-6">
        {phases.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePhase(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
              activePhase === tab
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed">

        {/* 阶段一 */}
        {activePhase === '阶段一' && (
          <div>
            <p className="text-slate-700 mb-4">
              上线 BMS 推荐管理功能，上线推荐埋点，使用 2–3 周进行规则验证和微调。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-center font-semibold text-slate-800" colSpan={2}>阶段一：内部验证（2-3 周）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50 w-28">准入条件</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">推荐算法验证页（BMS）通过测试 + PM + 研发三方功能验收</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">测试范围</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">仅限 BMS 内部账号可见推荐数据，前端不对外展示</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">验证内容</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">①推荐列表数量是否达标 ②候选集来源标签是否正确 ③缓存降级是否正常触发</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">验收指标</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">连续 7 个工作日 BMS 验证无明显错误推荐（如已成交车辆出现在推荐列表）</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">阶段一结束条件</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">三方确认验收通过，方可进入阶段二</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 阶段二 */}
        {activePhase === '阶段二' && (
          <div>
            <p className="text-slate-700 mb-4">
              全端发布「为您推荐」模块。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-center font-semibold text-slate-800" colSpan={2}>阶段二：正式上线与监控</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50 w-28">上线方式</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">全量发布（一期不做灰度，因推荐模块为新增功能不影响现有流程）</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">上线时间窗口</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">选择周二至周四工作日下午 19:00-20:00，避开周末与流量高峰</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">核心监控指标</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">CTR（目标≥基线）、推荐接口 P99 响应时间（告警阈值：&gt;500ms）、接口错误率（告警阈值：&gt;1%）</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium text-slate-700 bg-slate-50">上线后观察期</td>
                    <td className="border border-slate-300 px-4 py-2 text-slate-700">上线后 72 小时内每 4 小时看一次数据看板，测试 + 产品共同值守</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 回滚方案 */}
        {activePhase === '回滚方案' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-red-50">
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800 w-12">步骤</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800 w-28">操作</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800">执行内容</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-semibold text-slate-800 w-20">责任人</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">1</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">触发回滚判断</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">接口错误率 &gt; 1% 持续 10 分钟 或 推荐列表为空率 &gt; 10% 或 PM 决策</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">研发</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">2</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">关闭推荐功能开关</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">BMS 功能开关页将"为您推荐"状态置为"关闭"（前端降级为原有为您推荐逻辑）</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">研发</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">3</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">确认前端降级</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">验证移动端"为您推荐"模块已显示"原有为您推荐逻辑"</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">前端研发</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">4</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">通知相关方</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">在项目群通知 PM，说明回滚原因与预计修复时间</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">研发</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">5</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">问题排查</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">查看推荐服务日志、Redis 缓存状态等状态</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">后端研发</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DocPage>
  );
};

// 展示规则
export const DisplayRules = () => (
  <DocPage
    title="展示规则"
    icon={<Info className="text-blue-600" size={28} />}
    subtitle="前端展示要求与推荐位规则"
  >
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      <CollapsibleSection title="1、模块位置与行为" defaultOpen={true}>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700">
          <li>页面位置：原有为您推荐模块。搜索无结果，新增"为您推荐"数据</li>
          <li>吸顶逻辑：非初始吸顶。当买家向上滑动页面，推荐模块到达顶部时，触发吸顶。</li>
        </ul>
      </CollapsibleSection>

      <CollapsibleSection title="2、卡片设计" defaultOpen={true}>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700">
          <li>卡片元素：基本样式同"全部车源列表页车辆卡片"，不同点如下</li>
          <li>标签区：</li>
        </ul>
        <p className="text-slate-700 mt-2 ml-4">
          仅展示促销标签类型，优先级：围观人数、多人意向、周转快；
        </p>
        <p className="text-slate-700 ml-4">
          如果促销标签都没有出现，则不展示；
        </p>
        <div className="ml-4 mt-2 space-y-1 text-slate-700">
          <p>促销标签1（热度）："x人围观" —— 车辆浏览人数*2。</p>
          <p>促销标签2（供需）："多人意向" —— 车辆对应出价人数 &gt; 3。</p>
          <p>促销标签3（周转）："周转快" —— 车系对应周转分 &gt; 70分。</p>
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ● 适配细节：使用列表预加载 或 异步加载，确保滑动过程无白块。
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="3、引导逻辑" defaultOpen={true}>
        <p className="text-slate-700 mb-2">
          未登录状态下，插入"登录查看您的匹配车源"的引导。
        </p>
        <p className="text-slate-700 mb-2">
          点击引导条，跳转至登录页，登录成功后调整至 为您推荐
        </p>
      </CollapsibleSection>

      <CollapsibleSection title="4、拍卖结束/车辆下架" defaultOpen={true}>
        <p className="text-slate-700 mb-2">
          当买家在浏览过程中，推荐流中的某台车被撤拍或竞价结束
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700">
          <li>非浏览状态：列表刷新时，自动剔除。</li>
          <li>当前浏览状态：</li>
        </ul>
        <div className="ml-6 mt-2 space-y-1.5 text-slate-700">
          <p>● 点击处理：toast提示"车辆状态有更新"后，"局部移除/置灰"该失效卡片，并自动将下方卡片上移补位；</p>
          <p>或者在顶部出现"有新车源，点击刷新"的提示条，买家点击"刷新"系统执行刷新。</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="5、搜索无结果" defaultOpen={true}>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700">
          <li>移动端：当买家主动搜索后无结果，</li>
        </ul>
        <p className="text-slate-700 mt-1 ml-4">
          搜索结果页底部应自动衔接"为您推荐"模块；pc端已有此逻辑，数据用新数据覆盖。
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-slate-700 mt-2">
          <li>文案引导：展示"未找到符合条件的车源，为您推荐以下车辆"。</li>
          <li>设计样式：以设计稿为准</li>
        </ul>
      </CollapsibleSection>

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