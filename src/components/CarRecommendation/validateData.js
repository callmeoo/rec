// 数据验证脚本
import { mockCars } from './recommendationEngine.js';

// 验证车辆数据完整性和范围
export const validateVehicleData = () => {
  const results = {
    totalCars: mockCars.length,
    validCars: 0,
    issues: []
  };

  mockCars.forEach((car, index) => {
    let hasIssue = false;

    // 检查必需字段
    if (car.viewUV === undefined) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) 缺少 viewUV 字段`);
      hasIssue = true;
    }
    if (car.bidderCount === undefined) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) 缺少 bidderCount 字段`);
      hasIssue = true;
    }
    if (car.turnoverScore === undefined) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) 缺少 turnoverScore 字段`);
      hasIssue = true;
    }

    // 检查数据范围
    if (car.viewUV !== undefined && (car.viewUV < 0 || car.viewUV > 500)) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) viewUV 超出范围 [0, 500]: ${car.viewUV}`);
      hasIssue = true;
    }
    if (car.bidderCount !== undefined && (car.bidderCount < 0 || car.bidderCount > 20)) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) bidderCount 超出范围 [0, 20]: ${car.bidderCount}`);
      hasIssue = true;
    }
    if (car.turnoverScore !== undefined && (car.turnoverScore < 50 || car.turnoverScore > 100)) {
      results.issues.push(`车辆 ${index + 1} (ID: ${car.id}) turnoverScore 超出范围 [50, 100]: ${car.turnoverScore}`);
      hasIssue = true;
    }

    if (!hasIssue) {
      results.validCars++;
    }
  });

  return results;
};

// 测试促销标签逻辑
export const testPromotionTagLogic = () => {
  const testCases = [
    {
      name: '优先级1: 围观人数',
      car: { viewUV: 150, bidderCount: 5, turnoverScore: 80 },
      expected: { text: '围观人数', color: 'bg-red-500' }
    },
    {
      name: '优先级2: 多人意向',
      car: { viewUV: 80, bidderCount: 5, turnoverScore: 80 },
      expected: { text: '多人意向', color: 'bg-orange-500' }
    },
    {
      name: '优先级3: 周转快',
      car: { viewUV: 80, bidderCount: 2, turnoverScore: 75 },
      expected: { text: '周转快', color: 'bg-green-500' }
    },
    {
      name: '无标签',
      car: { viewUV: 50, bidderCount: 2, turnoverScore: 60 },
      expected: null
    },
    {
      name: '边界值: viewUV = 100',
      car: { viewUV: 100, bidderCount: 2, turnoverScore: 60 },
      expected: { text: '围观人数', color: 'bg-red-500' }
    },
    {
      name: '边界值: bidderCount = 3',
      car: { viewUV: 50, bidderCount: 3, turnoverScore: 60 },
      expected: null
    },
    {
      name: '边界值: turnoverScore = 70',
      car: { viewUV: 50, bidderCount: 2, turnoverScore: 70 },
      expected: null
    }
  ];

  const getPromotionTag = (car) => {
    const viewUV = car.viewUV || 0;
    const bidderCount = car.bidderCount || 0;
    const turnoverScore = car.turnoverScore || 0;
    
    if (viewUV >= 100) {
      return { text: '围观人数', color: 'bg-red-500' };
    }
    
    if (bidderCount > 3) {
      return { text: '多人意向', color: 'bg-orange-500' };
    }
    
    if (turnoverScore > 70) {
      return { text: '周转快', color: 'bg-green-500' };
    }
    
    return null;
  };

  const results = {
    passed: 0,
    failed: 0,
    details: []
  };

  testCases.forEach(testCase => {
    const result = getPromotionTag(testCase.car);
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
    
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
      results.details.push({
        name: testCase.name,
        expected: testCase.expected,
        actual: result
      });
    }
  });

  return results;
};

// 运行所有验证
export const runAllValidations = () => {
  console.log('=== 车辆数据验证 ===');
  const dataValidation = validateVehicleData();
  console.log(`总车辆数: ${dataValidation.totalCars}`);
  console.log(`有效车辆数: ${dataValidation.validCars}`);
  if (dataValidation.issues.length > 0) {
    console.log('发现问题:');
    dataValidation.issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('✓ 所有车辆数据完整且在有效范围内');
  }

  console.log('\n=== 促销标签逻辑测试 ===');
  const tagTests = testPromotionTagLogic();
  console.log(`通过: ${tagTests.passed}`);
  console.log(`失败: ${tagTests.failed}`);
  if (tagTests.failed > 0) {
    console.log('失败的测试:');
    tagTests.details.forEach(detail => {
      console.log(`  - ${detail.name}`);
      console.log(`    期望: ${JSON.stringify(detail.expected)}`);
      console.log(`    实际: ${JSON.stringify(detail.actual)}`);
    });
  } else {
    console.log('✓ 所有促销标签逻辑测试通过');
  }

  return {
    dataValidation,
    tagTests
  };
};
