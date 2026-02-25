import { useMediaQuery } from './useMediaQuery.js';
import { MEDIA_QUERIES } from '../constants/index.js';

/**
 * useBreakpoint Hook
 * 返回当前屏幕断点
 * @returns {'mobile' | 'tablet' | 'desktop'} - 当前断点
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isTablet = useMediaQuery(MEDIA_QUERIES.tablet);

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}
