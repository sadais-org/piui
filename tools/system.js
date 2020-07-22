/**
 * 获取系统信息（自执行完缓存起来）
 */
export const systemInfo = (() => {
  const info = uni.getSystemInfoSync()
  console.log('当前系统信息为：', info)
  return info || {}
})()

/**
 * 是否iPhone X系列机型
 */
export const isIpx = (() => systemInfo.model && systemInfo.model.includes('iPhone X'))()

/**
 * 获取内部安全区域数据
 */
export const safeAreaInsets = (() => systemInfo.safeAreaInsets)()
