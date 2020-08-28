/**
 * 获取系统信息（自执行完缓存起来）
 */
export const systemInfo = (() => {
  const info = uni.getSystemInfoSync()
  // 兼容某些平台没有safeArea参数
  if (!info.safeArea) {
    console.log('当前平台系统信息获取safeArea失败，自定义初始化')
    info.safeArea = {
      bottom: info.screenHeight,
      height: info.screenHeight - info.statusBarHeight,
      left: 0,
      right: info.screenWidth,
      top: info.statusBarHeight,
      width: info.screenWidth
    }
  }

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
