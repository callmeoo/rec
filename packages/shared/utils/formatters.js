/**
 * 格式化价格显示
 * @param {number} price - 价格（单位：元）
 * @returns {string} - 格式化后的价格字符串，如 "¥25.00万"
 */
export function formatPrice(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    return '¥0.00万';
  }
  return `¥${(price / 10000).toFixed(2)}万`;
}

/**
 * 格式化里程显示
 * @param {number} mileage - 里程（单位：米）
 * @returns {string} - 格式化后的里程字符串，如 "3.00万公里"
 */
export function formatMileage(mileage) {
  if (typeof mileage !== 'number' || isNaN(mileage)) {
    return '0.00万公里';
  }
  return `${(mileage / 10000).toFixed(2)}万公里`;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 获取车况等级
 * @param {number} score - 车况评分 (0-100)
 * @returns {string} - 车况等级 (A/B/C/D)
 */
export function getConditionGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  return 'D';
}

/**
 * 格式化车况评分显示
 * @param {number} score - 车况评分 (0-100)
 * @returns {string} - 格式化后的车况评分，如 "85B"
 */
export function formatConditionScore(score) {
  const grade = getConditionGrade(score);
  return `${score}${grade}`;
}
