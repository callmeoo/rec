import React, { useEffect, useState } from 'react';
import { runAllValidations } from './validateData';

const TestValidation = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const validationResults = runAllValidations();
    setResults(validationResults);
  }, []);

  if (!results) {
    return <div className="p-6">运行验证中...</div>;
  }

  const { dataValidation, tagTests } = results;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">推荐模块数据验证</h1>

      {/* 数据验证结果 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">车辆数据验证</h2>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-slate-600">总车辆数:</span>
              <span className="ml-2 font-semibold">{dataValidation.totalCars}</span>
            </div>
            <div>
              <span className="text-slate-600">有效车辆数:</span>
              <span className="ml-2 font-semibold text-green-600">{dataValidation.validCars}</span>
            </div>
          </div>
          
          {dataValidation.issues.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-semibold text-red-600 mb-2">发现问题:</h3>
              <ul className="list-disc list-inside space-y-1">
                {dataValidation.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600">{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-green-600 font-semibold">
              ✓ 所有车辆数据完整且在有效范围内
            </div>
          )}
        </div>
      </div>

      {/* 促销标签逻辑测试结果 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">促销标签逻辑测试</h2>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-slate-600">通过:</span>
              <span className="ml-2 font-semibold text-green-600">{tagTests.passed}</span>
            </div>
            <div>
              <span className="text-slate-600">失败:</span>
              <span className="ml-2 font-semibold text-red-600">{tagTests.failed}</span>
            </div>
          </div>
          
          {tagTests.failed > 0 ? (
            <div className="mt-4">
              <h3 className="font-semibold text-red-600 mb-2">失败的测试:</h3>
              <div className="space-y-3">
                {tagTests.details.map((detail, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-red-200">
                    <div className="font-semibold text-sm mb-1">{detail.name}</div>
                    <div className="text-xs text-slate-600">
                      <div>期望: {JSON.stringify(detail.expected)}</div>
                      <div>实际: {JSON.stringify(detail.actual)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-green-600 font-semibold">
              ✓ 所有促销标签逻辑测试通过
            </div>
          )}
        </div>
      </div>

      {/* 测试用例说明 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">测试用例说明</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 优先级1: viewUV ≥ 100 → "围观人数" (红色)</li>
          <li>• 优先级2: viewUV &lt; 100 且 bidderCount &gt; 3 → "多人意向" (橙色)</li>
          <li>• 优先级3: viewUV &lt; 100 且 bidderCount ≤ 3 且 turnoverScore &gt; 70 → "周转快" (绿色)</li>
          <li>• 不满足任何条件 → 无标签</li>
        </ul>
      </div>
    </div>
  );
};

export default TestValidation;
