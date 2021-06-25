import uni from './native'

/*
 * @Author: zhengyifan
 * @Date: 2021-04-13 11:46:23
 * @LastEditTime: 2021-06-18 09:47:21
 * @LastEditors: zhangzhenfei
 * @Description:
 * @FilePath: /piui-awesome/src/piui/tools/navi.js
 */
const routingMethods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] // 需要路由控制的方法
class PiuiRouter {
  routing = false // 控制重复打开页面

  beforeEachFnc = (to, from, next) => {
    console.log('路由守卫beforeEach', to, from)
    next()
  }
  beforeBackFnc = (to, from, next) => {
    console.log('路由守卫beforeBack', to, from)
    next()
  }

  constructor(options = {}) {
    if (options.beforeEach) {
      this.beforeEach(options.beforeEach)
    }
    if (options.beforeBack) {
      this.beforeBackFnc(options.beforeBack)
    }
  }
  /**
   * 将对象序列化成url字符串
   * @param  {Object} obj 参数对象
   * @param  {Boolean} encodeURI 对象值使用编码，默认为true
   * @param  {String} preConnectChat url前连接字符串，默认为？
   * @return {String} 转换之后的url参数
   */
  objToUrl(obj = {}, encodeURI = true, preConnectChat = '?') {
    const result = Object.keys(obj).map(prop => {
      const value = encodeURI ? encodeURIComponent(obj[prop]) : obj[prop]
      return `${prop}=${value}`
    })
    return result.length ? preConnectChat + result.join('&') : ''
  }

  /**
   * 将url字符串解析成对象
   * @param  {String} str 带url参数的地址
   * @param  {Boolean} decodeURI 使用解码，默认为true
   * @return {Object} 转换之后的url参数
   */
  urlToObj(str = '', decodeURI = true) {
    const strSplits = str.split('?')
    const query = strSplits.length === 2 ? strSplits[1] : str
    const params = query.split('&')
    const result = params.reduce((obj, param) => {
      const paramObj = param.split('=')
      const name = paramObj[0]
      const value = paramObj[1] || ''
      obj[name] = decodeURI ? decodeURIComponent(value) : value
      return obj
    }, {})
    return result || {}
  }

  /**
   * 对Object Params Props进行decode
   * @param {Object} params params
   */
  decodeParams(params) {
    const convertObject = {}
    for (const paramObject of Object.keys(params)) {
      convertObject[paramObject] = decodeURIComponent(params[paramObject])
    }
    return convertObject
  }

  /**
   * 页面跳转封装
   * @param {String} method 微信JS跳转方法
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  _openInterceptor(method, url, params) {
    return this.routerFilter(method, url, params, (method, url, params) => {
      if (this.routing && routingMethods.includes(method)) return
      if (url.indexOf('/') !== 0) {
        url = '/' + url
      }
      const stringParams = this.objToUrl(params)
      url = url + (url.indexOf('?') !== -1 ? stringParams.replace('?', '&') : stringParams)
      uni.hideKeyboard()
      console.log('使用导航：', method, url, params)
      return new Promise((resolve, reject) => {
        if (routingMethods.includes(method)) this.routing = true
        uni[method]({
          url,
          complete: res => {
            this.routing = false
            const isSuccess = res.errMsg && res.errMsg.includes(':ok')
            isSuccess ? resolve(res) : reject(res)
          }
        })
      })
    })
  }

  beforeEach = fnc => {
    if (typeof fnc !== 'function') {
      console.error('beforeEach is not a function')
      return
    }
    this.beforeEachFnc = fnc
  }
  beforeBack = fnc => {
    if (typeof fnc !== 'function') {
      console.error('beforeBack is not a function')
      return
    }
    this.beforeBackFnc = fnc
  }
  routerFilter(method, url, params, nextFnc) {
    const pages = getCurrentPages()
    const fromPage = pages[pages.length - 1].route
    const toPage = url
    let res
    this.beforeEachFnc.apply(pages[pages.length - 1], [
      toPage,
      fromPage,
      (nextUrl = toPage) => {
        if (!nextUrl) return false
        res = nextFnc(method, nextUrl, params)
      }
    ])
    return res
  }

  /**
   * 保留当前页面，跳转到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  navigateTo(url, params = {}) {
    return this._openInterceptor('navigateTo', url, params)
  }

  /**
   * 关闭当前页面，跳转到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  redirectTo(url, params = {}) {
    return this._openInterceptor('redirectTo', url, params)
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  switchTab(url, params = {}) {
    return this._openInterceptor('switchTab', url, params)
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  reLaunch(url, params = {}) {
    return this._openInterceptor('reLaunch', url, params)
  }

  /**
   * 页面后退
   * @param {String} url 页面路径
   * @param {Object} params 页面参数
   */
  navigateBack(...args) {
    const delta = args.delta || 1
    const pages = getCurrentPages()
    let res
    if (delta < 1) {
      return
    }
    let toPage = ''
    const fromPage = pages[pages.length - 1].route
    if (delta > pages.length) {
      toPage = pages[0].route
    } else {
      toPage = pages[pages.length - delta - 1].route
    }
    this.beforeBackFnc(toPage, fromPage, (nextUrl = toPage) => {
      if (!nextUrl) return false
      if (nextUrl !== toPage) {
        if (nextUrl.indexOf('/') !== 0) {
          nextUrl = '/' + nextUrl
        }
        res = uni.reLaunch.apply(this, [{ url: nextUrl }])
      } else {
        res = uni.navigateBack.apply(this, args)
      }
    })
    return res
  }
}
export default new PiuiRouter()
