import dayjs from 'dayjs'

/**
 * 格式化日期时间
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化时间
 */
export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num) {
  if (!num && num !== 0) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 截取文本
 */
export function truncateText(text, length = 50) {
  if (!text) return '-'
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * 格式化播放量
 */
export function formatPlayCount(count) {
  if (!count && count !== 0) return '0'
  if (count < 10000) return count.toString()
  if (count < 100000000) return (count / 10000).toFixed(1) + '万'
  return (count / 100000000).toFixed(1) + '亿'
}

