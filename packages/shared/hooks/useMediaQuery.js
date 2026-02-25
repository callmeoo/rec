import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 监听媒体查询变化
 * @param {string} query - 媒体查询字符串，如 '(max-width: 768px)'
 * @returns {boolean} - 是否匹配查询条件
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    // SSR或不支持matchMedia的浏览器
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);

    // 兼容旧版API
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // 旧版浏览器
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}
