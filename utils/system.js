import { STORAGE_KEY_SYSTEM_INFO } from '../consts'

export function getSystemInfo() {
  let systemInfo = uni.getStorageSync(STORAGE_KEY_SYSTEM_INFO)
  if (!systemInfo) {
    systemInfo = uni.getSystemInfoSync()
    uni.setStorageSync(STORAGE_KEY_SYSTEM_INFO, systemInfo)
  }
  return systemInfo
}

/**
 * 获取标题+顶部bar的高度,单位px
 */
export function getNaviWrapHeight() {
  const systemInfo = getSystemInfo()
  const statusBarHeight = systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0
  return 44 + statusBarHeight
}
