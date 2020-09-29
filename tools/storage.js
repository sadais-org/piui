const EXPIRY_DATE = 'EXPIRY_DATE'

/**
 * 保存到缓存中
 * @param {String} storeKey key
 * @param {Object} value value
 * @param {Date} expiryDate 过期时间
 */
export const setStorage = (storeKey, value, expiryDate) => {
  uni.setStorageSync(storeKey, value)
  if (expiryDate) {
    const timestamp = new Date(expiryDate).getTime()
    uni.setStorageSync(storeKey + '_' + EXPIRY_DATE, timestamp)
  }
}

/**
 * 获取缓存
 * @param {String} storeKey storeKey
 */
export const getStorage = storeKey => {
  let value = uni.getStorageSync(storeKey)
  if (value) {
    // 如果缓存获取到内容，判断有没有失效
    const timestamp = uni.getStorageSync(storeKey + '_' + EXPIRY_DATE)
    // 已设置缓存时间
    const now = new Date().getTime()
    if (timestamp && now > timestamp) {
      // 如果已过期，则返回空
      value = null
    }
  }
  return value
}
