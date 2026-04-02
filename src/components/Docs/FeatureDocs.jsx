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
                  <img 
                    src={new URL('/buyer-profile-screenshot.png', import.meta.url).href}
                    alt="买家画像需求截图" 
                    className="w-full rounded border border-slate-200"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
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
export const RecommendStrategy = () => (
  <DocPage
    title="推荐策略"
    icon={<Target className="text-blue-600" size={28} />}
    subtitle="推荐算法与候选集策略说明"
  >
    <div className="prose prose-slate max-w-none text-sm leading-relaxed">

      {/* 一、推荐整体流程 */}
      <CollapsibleSection title="一、推荐整体流程" defaultOpen={true}>
        <p className="text-slate-700 mb-3">
          推荐系统遵循 <span className="font-semibold text-slate-900">"画像识别 → 候选拉取 → 过滤排序 → 打散 → 前端展示"</span> 的流程。
        </p>
        <p className="text-slate-700 mb-3">
          每位买家最终展示 <span className="font-semibold text-blue-700">16 台</span> 推荐车辆，由三个候选集按优先级依次填充。
        </p>

        {/* 流程图 */}
        <div className="flex items-center gap-2 flex-wrap my-4">
          {['买家画像', '候选集1\n画像匹配', '候选集2\n平台周转', '候选集3\n全站兜底', '打散策略', '前端展示\n16台'].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-lg text-xs font-semibold text-center whitespace-pre-line leading-tight ${
                i === 0 ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                i <= 3 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                i === 4 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {step}
              </div>
              {i < arr.length - 1 && <span className="text-slate-400 text-lg">→</span>}
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-slate-600">
            <span className="font-semibold">填充规则：</span>优先从候选集1填充；候选集1不足16台时，从候选集2补充；候选集1+2仍不足16台时，从候选集3补充；若三个候选集合计仍不足16台，有多少展示多少。
          </p>
        </div>
      </CollapsibleSection>

      {/* 二、候选集1：画像匹配 */}
      <CollapsibleSection title="二、候选集 1：画像匹配（买家主打偏好）" defaultOpen={true}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">优先级最高</span>
          <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">基于买家画像</span>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、匹配逻辑</h3>
        <p className="text-slate-700 mb-2">
          从买家画像中提取 <span className="font-semibold">出价偏好标签</span>（国别、品牌车系、车龄、价格段），强匹配当前在拍车辆。
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>匹配维度：买家主打 <span className="font-semibold text-blue-700">车系 + 价位段 + 车龄段</span></li>
          <li>匹配范围：当前平台所有 <span className="font-semibold">在拍状态</span> 的车辆</li>
          <li>排序规则：匹配度由高到低排列</li>
        </ul>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、匹配优先级</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">优先级</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">匹配条件</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-5 h-5 bg-blue-600 text-white text-xs rounded-full text-center leading-5">1</span></td>
                <td className="border border-slate-200 px-3 py-2">车系 + 价位段 + 车龄段 全匹配</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500">三维度完全命中，推荐权重最高</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-5 h-5 bg-blue-500 text-white text-xs rounded-full text-center leading-5">2</span></td>
                <td className="border border-slate-200 px-3 py-2">车系 + 价位段 匹配</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500">两维度命中</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-5 h-5 bg-blue-400 text-white text-xs rounded-full text-center leading-5">3</span></td>
                <td className="border border-slate-200 px-3 py-2">车系匹配</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500">仅车系命中</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">3、推荐标注</h3>
        <p className="text-slate-700 mb-2">
          候选集1命中的车辆，在推荐逻辑列标注为：
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">画像匹配-主打车型</span>
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">候选集 1</span>
        </div>
      </CollapsibleSection>

      {/* 三、候选集2：平台周转 */}
      <CollapsibleSection title="三、候选集 2：平台周转（高周转车型）" defaultOpen={true}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">优先级第二</span>
          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">基于周转分</span>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、选取规则</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>从全站车型中，按 <span className="font-semibold text-green-700">综合周转分</span> 从高到低排序</li>
          <li>取 <span className="font-semibold">TOP 50</span> 车型对应的在拍车辆</li>
          <li>同一车系在候选集2中的占比 <span className="font-semibold text-red-600">≤ 50%</span></li>
        </ul>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、周转分参考</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-green-800">
            <span className="font-semibold">周转分 = 成交率评分 × 0.7 + 耗时评分 × 0.3</span>
          </p>
          <p className="text-xs text-green-600 mt-1">
            详见「概要 → 数据基础 → 车辆周转分计算」章节
          </p>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">3、去重规则</h3>
        <p className="text-slate-700 mb-2">
          候选集2中的车辆如果已在候选集1中出现，则 <span className="font-semibold">自动去重</span>，不重复推荐。
        </p>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">4、推荐标注</h3>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">候选车源-同车型高频成交</span>
          <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs rounded">候选集 2</span>
        </div>
      </CollapsibleSection>

      {/* 四、候选集3：全站兜底 */}
      <CollapsibleSection title="四、候选集 3：全站兜底（平台热销）" defaultOpen={true}>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">优先级第三</span>
          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded">兜底策略</span>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、触发条件</h3>
        <p className="text-slate-700 mb-3">
          当候选集1 + 候选集2的车辆数不足16台时，启用候选集3进行补充。
        </p>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、排序规则</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">排序优先级</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">字段</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">排序方向</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-5 h-5 bg-slate-600 text-white text-xs rounded-full text-center leading-5">1</span></td>
                <td className="border border-slate-200 px-3 py-2 font-semibold">结束时间</td>
                <td className="border border-slate-200 px-3 py-2">升序 ↑</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500">即将结束的优先展示</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-5 h-5 bg-slate-500 text-white text-xs rounded-full text-center leading-5">2</span></td>
                <td className="border border-slate-200 px-3 py-2 font-semibold">出价次数</td>
                <td className="border border-slate-200 px-3 py-2">降序 ↓</td>
                <td className="border border-slate-200 px-3 py-2 text-slate-500">热度高的优先展示</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">3、去重规则</h3>
        <p className="text-slate-700 mb-2">
          候选集3中的车辆如果已在候选集1或候选集2中出现，则自动去重。
        </p>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">4、推荐标注</h3>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">兜底-平台热销</span>
          <span className="inline-block px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">候选集 3</span>
        </div>
      </CollapsibleSection>

      {/* 五、打散策略 */}
      <CollapsibleSection title="五、打散策略" defaultOpen={true}>
        <p className="text-slate-700 mb-3">
          为避免推荐列表中同品牌/车型过于集中，影响用户体验，对最终推荐列表执行打散处理。
        </p>

        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、打散规则</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">规则</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">作用范围</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">限制条件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-semibold">品牌打散</td>
                <td className="border border-slate-200 px-3 py-2">前 10 位</td>
                <td className="border border-slate-200 px-3 py-2">同一品牌连续出现 <span className="font-semibold text-red-600">≤ 3 台</span></td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 font-semibold">车型打散</td>
                <td className="border border-slate-200 px-3 py-2">前 10 位</td>
                <td className="border border-slate-200 px-3 py-2">同一车型连续出现 <span className="font-semibold text-red-600">≤ 2 台</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、打散执行逻辑</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>在三个候选集合并、去重、排序完成后执行</li>
          <li>检测前10位中是否存在违反规则的连续排列</li>
          <li>若违反，将多余车辆后移至下一个不违反规则的位置</li>
          <li>打散后不改变候选集归属标注</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">💡 示例：</span>若前10位中出现"宝马3系、宝马5系、宝马X3、宝马X5"连续4台宝马，则将第4台（宝马X5）后移，插入其他品牌车辆。
          </p>
        </div>
      </CollapsibleSection>

      {/* 六、推荐列表更新与补充 */}
      <CollapsibleSection title="六、推荐列表更新与补充" defaultOpen={false}>
        <h3 className="text-base font-semibold text-slate-800 mt-2 mb-2">1、实时更新</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>推荐列表中的互动数据（浏览次数、出价次数）实时更新</li>
          <li>拍卖倒计时实时刷新</li>
        </ul>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">2、失效车辆处理</h3>
        <ul className="list-disc list-inside space-y-1 text-slate-700 mb-3">
          <li>车辆下架或竞价结束后，点击卡片提示"该车辆已下架/竞价已结束，请刷新页面"</li>
          <li>刷新后系统自动补充新的推荐车辆，保持列表数量</li>
        </ul>

        <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">3、画像更新频率</h3>
        <p className="text-slate-700 mb-2">
          系统每日 0 点更新买家画像数据，推荐列表随之更新。
        </p>
      </CollapsibleSection>

      {/* 七、候选集汇总 */}
      <CollapsibleSection title="七、候选集汇总对照" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">候选集</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">数据来源</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">排序依据</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">推荐标注</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">标签颜色</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-semibold">候选集 1</td>
                <td className="border border-slate-200 px-3 py-2">买家画像偏好</td>
                <td className="border border-slate-200 px-3 py-2">匹配度高→低</td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">画像匹配-主打车型</span></td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span> 蓝色</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 font-semibold">候选集 2</td>
                <td className="border border-slate-200 px-3 py-2">全站周转分 TOP50</td>
                <td className="border border-slate-200 px-3 py-2">周转分高→低</td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">候选车源-同车型高频成交</span></td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span> 绿色</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-semibold">候选集 3</td>
                <td className="border border-slate-200 px-3 py-2">全站在拍车辆</td>
                <td className="border border-slate-200 px-3 py-2">结束时间↑ + 出价次数↓</td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">兜底-平台热销</span></td>
                <td className="border border-slate-200 px-3 py-2"><span className="inline-block w-3 h-3 bg-gray-500 rounded-full"></span> 灰色</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

    </div>
  </DocPage>
);

// 埋点
export const TrackingDocs = () => {
  const mobileEvents = [
    { name: 'rec_show_m', trigger: '移动端曝光次数：推荐位进入用户视口（曝光），能看到2台车辆；搜索无结果页曝光。曝光定义：车辆推荐卡片至少50%的面积进入用户可视区域，触发一次曝光事件；同一用户在同一会话内对同一车辆重复浏入，不重复计曝光。', fields: 'rec_version(推荐算法版本), rec_source(首页、搜索无结果), item_id(推荐排位), rec_type(候选集类型：画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)', platform: '移动端' },
    { name: 'rec_click_m', trigger: 'Mob点击次数：用户点击推荐卡片', fields: 'rec_version(推荐算法版本), rec_source(首页、搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'aucdetail_view_m', trigger: '移动端详情页：进入车辆详情页', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_start_m', trigger: '移动端点击出价次数：点击"我要出价"按钮', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_submit_m', trigger: '移动端出价成功（同台车仅计算1次）：出价成功', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: '移动端' },
    { name: 'bid_success_m', trigger: '移动端车辆中标：车辆中标', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: '移动端' },
  ];
  const pcEvents = [
    { name: 'rec_show_pc', trigger: 'PC端曝光次数：搜索结果页页底展示', fields: 'rec_version(推荐算法版本), rec_source(搜索无结果), item_id(推荐排位), rec_type(候选集类型：画像匹配profile_match、平台周转platform_cycle、全站兜底global_backup)', platform: 'PC端' },
    { name: 'rec_click_pc', trigger: 'PC端点击次数：用户点击推荐卡片', fields: 'rec_version(推荐算法版本), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'aucdetail_view_pc', trigger: 'PC端详情页：进入车辆详情页', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_start_pc', trigger: 'PC端点击出价次数：点击"我要出价"按钮', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_submit_pc', trigger: 'PC端出价成功（同台车仅计算1次）：出价成功', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: 'PC端' },
    { name: 'bid_success_pc', trigger: 'PC端车辆中标：车辆中标', fields: 'rec_version(推荐算法版本), auction_id(拍卖ID), vid(车辆ID), rec_source(首页/搜索无结果), item_id(推荐排位), (候选集类型：画像匹配、平台周转、全站兜底)', platform: 'PC端' },
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
                  <tr key={evt.name}>
                    <td className="border border-slate-300 px-3 py-2 font-mono text-xs text-slate-700 whitespace-nowrap">{evt.name}</td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700 text-xs">{evt.trigger}</td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700 text-xs">{evt.fields}</td>
                    <td className="border border-slate-300 px-3 py-2 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{evt.platform}</span>
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