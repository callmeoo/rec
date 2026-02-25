import { useState, useEffect, useCallback } from 'react';

/**
 * useVehicleData Hook
 * 获取车辆数据
 * @param {string} apiUrl - API地址（可选）
 * @returns {Object} - { vehicles, loading, error, refetch }
 */
export function useVehicleData(apiUrl) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 如果提供了API URL，从API获取数据
      if (apiUrl) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setVehicles(data.vehicles || data);
      } else {
        // 使用模拟数据
        const mockData = generateMockVehicles();
        setVehicles(mockData);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError(new Error('请求超时，请检查网络连接'));
      } else {
        setError(new Error('加载车辆数据失败，请稍后重试'));
      }
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  };
}

// 生成模拟车辆数据
function generateMockVehicles() {
  const brands = ['奔驰', '宝马', '奥迪', '特斯拉', '保时捷', '雷克萨斯'];
  const models = ['C200', 'X5', 'A6', 'Model 3', '911', 'ES300h'];
  const colors = ['黑色', '白色', '银色', '蓝色', '红色'];
  const cities = ['上海', '北京', '深圳', '广州', '杭州', '成都'];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `vehicle-${i + 1}`,
    brand: brands[i % brands.length],
    model: models[i % models.length],
    year: 2020 + (i % 4),
    price: 200000 + Math.floor(Math.random() * 300000),
    mileage: 10000 + Math.floor(Math.random() * 90000),
    color: colors[i % colors.length],
    location: cities[i % cities.length],
    transmission: i % 2 === 0 ? '自动' : '手动',
    fuelType: i % 3 === 0 ? '电动' : i % 3 === 1 ? '汽油' : '混动',
    images: [
      `https://via.placeholder.com/400x300?text=Car+${i + 1}`,
    ],
    thumbnail: `https://via.placeholder.com/200x150?text=Car+${i + 1}`,
    condition: ['excellent', 'good', 'fair'][i % 3],
    conditionScore: 70 + Math.floor(Math.random() * 30),
    bidCount: Math.floor(Math.random() * 20),
    viewCount: 100 + Math.floor(Math.random() * 500),
    isFastTurnover: i % 4 === 0,
  }));
}
