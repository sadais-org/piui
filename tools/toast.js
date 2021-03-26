export default {
  /**
   * 成功提示
   */
  success(title, duration = 1500, mask = true) {
    return uni.showToast({
      title: `${title}`,
      icon: 'success',
      duration,
      mask
    })
  },
  /**
   * 失败提示
   */
  info(title, duration = 1500, mask = true) {
    return uni.showToast({
      title: `${title}`,
      icon: 'none',
      duration,
      mask
    })
  },
  /**
   * 加载提示
   */
  load(title, duration = 1500, mask = true) {
    return uni.showToast({
      title: `${title}`,
      icon: 'loading',
      duration,
      mask
    })
  },
  /**
   * 隐藏消息提示框
   */
  hideToast() {
    uni.hideToast()
  },
  /**
   * 加载中
   * @param title
   */
  loading(title = '请稍后...', mask = true) {
    return uni.showLoading({
      title: `${title}`,
      mask
    })
  },

  /**
   * 隐藏 loading 提示框
   */
  hideLoading() {
    uni.hideLoading()
  }
}
