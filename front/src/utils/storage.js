/**
 * 本地存储工具函数
 */

// 存储数据
export const setStorage = (key, value) => {
  try {
    const data = JSON.stringify(value)
    localStorage.setItem(key, data)
    return true
  } catch (error) {
    console.error('存储数据失败:', error)
    return false
  }
}

// 获取数据
export const getStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key)
    if (data === null) {
      return defaultValue
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('获取数据失败:', error)
    return defaultValue
  }
}

// 删除数据
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('删除数据失败:', error)
    return false
  }
}

// 清空所有数据
export const clearStorage = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('清空数据失败:', error)
    return false
  }
}

