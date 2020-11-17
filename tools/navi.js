/**
 * 将对象序列化成url字符串
 * @param  {Object} obj 参数对象
 * @param  {Boolean} encodeURI 对象值使用编码
 * @param  {String} preConnectChat url前连接字符串，默认为？
 * @return {String} 转换之后的url参数
 */
export const objToUrl = (obj = {}, encodeURI = true, preConnectChat = '?') => {
  const result = Object.keys(obj).map(prop => {
    const value = encodeURI ? encodeURIComponent(obj[prop]) : obj[prop]
    return `${prop}=${value}`
  })
  return result.length ? preConnectChat + result.join('&') : ''
}

/**
 * 将url字符串解析成对象
 * @param  {String} str 带url参数的地址
 * @param  {Boolean} decodeURI 使用解码
 * @return {Object} 转换之后的url参数
 */
export const urlToObj = (str = '', decodeURI) => {
  const strSplits = str.split('?')
  const query = strSplits.length === 2 ? strSplits[1] : str
  const params = query.split('&')
  const result = params.map(param => {
    const paramObj = param.split('=')
    const name = paramObj[0]
    const value = paramObj[1] || ''
    return {
      [name]: decodeURI ? decodeURIComponent(value) : value
    }
  })
  return result || {}
}

/**
 * 对Object Params Props进行decode
 * @param {Object} params params
 */
export const decodeParams = params => {
  const convertObject = {}
  for (const paramObject of Object.keys(params)) {
    convertObject[paramObject] = decodeURIComponent(params[paramObject])
  }
  return convertObject
}

let routing = false // 控制重复打开页面
const routingMethods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] // 需要路由控制的方法

/**
 * 页面跳转封装
 * @param {String} method 微信JS跳转方法
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
const _openInterceptor = (method, url, params) => {
  if (routing && routingMethods.includes(method)) return
  if (url.indexOf('/') !== 0) {
    url = '/' + url
  }
  const stringParams = objToUrl(params)
  url = url + (url.indexOf('?') !== -1 ? stringParams.replace('?', '&') : stringParams)
  uni.hideKeyboard()
  console.log('使用导航：', method, url, params)
  return new Promise((resolve, reject) => {
    if (routingMethods.includes(method)) routing = true
    uni[method]({
      url,
      complete: res => {
        routing = false
        const isSuccess = res.errMsg && res.errMsg.includes(':ok')
        isSuccess ? resolve(res) : reject(res)
      }
    })
  })
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
export const navigateTo = (url, params = {}) => {
  return _openInterceptor('navigateTo', url, params)
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
export const redirectTo = (url, params = {}) => {
  return _openInterceptor('redirectTo', url, params)
}

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
export const switchTab = (url, params = {}) => {
  return _openInterceptor('switchTab', url, params)
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
export const reLaunch = (url, params = {}) => {
  return _openInterceptor('reLaunch', url, params)
}

/**
 * 页面后退
 * @param {String} url 页面路径
 * @param {Object} params 页面参数
 */
export const navigateBack = (...args) => {
  return uni.navigateBack.apply(this, args)
}
