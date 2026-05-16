import { STORAGE_KEYS } from './constants'

/**
 * 获取管理员Token
 */
export function getAdminToken() {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
}

/**
 * 设置管理员Token
 */
export function setAdminToken(token) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token)
}

/**
 * 移除管理员Token
 */
export function removeAdminToken() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN)
}

/**
 * 获取管理员信息
 */
export function getAdminInfo() {
  const info = localStorage.getItem(STORAGE_KEYS.ADMIN_INFO)
  return info ? JSON.parse(info) : null
}

/**
 * 设置管理员信息
 */
export function setAdminInfo(info) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(info))
}

/**
 * 移除管理员信息
 */
export function removeAdminInfo() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO)
}

/**
 * 检查是否已登录
 */
export function isAuthenticated() {
  return !!getAdminToken()
}

