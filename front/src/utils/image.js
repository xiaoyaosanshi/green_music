/**
 * 图片处理工具函数
 */

// 默认封面图片
export const DEFAULT_COVER = '/1309624.jpeg'

/**
 * 获取封面图片URL
 * @param {string} url - 图片URL
 * @returns {string} 处理后的图片URL
 */
export const getCoverUrl = (url) => {
  if (!url) return DEFAULT_COVER
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  return `${baseUrl}${url}`
}

/**
 * 图片加载失败处理
 * @param {Event} event - 错误事件
 */
export const handleImageError = (event) => {
  event.target.src = DEFAULT_COVER
}

