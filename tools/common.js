import { isNumber } from './validate'
import lodashDebounce from './debounce'
import lodashThrottle from './throttle'

export const debounce = lodashDebounce
export const throttle = lodashThrottle

/**
 * 动态import文件
 * 默认取export default对象，如果export default对象不存在的情况下，取本身的export
 * @param {*} context require.context
 * @param {*} excludeIndexJs 是否排除index文件
 */
export const dynamicImport = (context, excludeIndex = true) => {
  const importFileMap = {}
  for (const key of context.keys()) {
    const keyArray = key.split('/')
    keyArray.shift() // 移除
    const name = keyArray
      .join('.')
      .replace(/\.js$/g, '')
      .replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
    if (excludeIndex && name === 'index') continue // 排除index文件
    const importContext = context(key)
    importFileMap[name] = importContext.default || importContext
  }
  return importFileMap
}

/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number}    如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。0当然是两个版本都相等拉。
 */
export const compareVersion = (v1, v2) => {
  var _v1 = v1.split('.'),
    _v2 = v2.split('.'),
    _r = _v1[0] - _v2[0]

  return _r == 0 && v1 != v2 ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.')) : _r
}

// 添加单位，如果非数值类型，直接返回，否则加上rpx单位结尾
export const addUnit = (value = 'auto', unit = 'rpx') => {
  return isNumber(value) ? `${value}${unit}` : value
}

/**
 * 查询节点信息
 * @param {Object} scope 传this
 * @param {String} selector 查询节点表达式
 * @param {Boolean} all 是否查询多个节点
 * @return Promise
 */
export const queryRect = function(scope, selector, all) {
  return new Promise(resolve => {
    const method = all ? 'selectAll' : 'select'
    const nodesRef = uni
      .createSelectorQuery()
      .in(scope)
      [method](selector)
    nodesRef
      .boundingClientRect(rect => {
        resolve(rect)
      })
      .exec()
  })
}

/**
 * 生成一个从 start 到 end 的连续数组
 * @param start 开始
 * @param end 结束
 */
export function generateArray(start = 0, end = 0) {
  return Array.from(new Array(end + 1).keys()).slice(start)
}

/**
 * 解析时长 方便组件中的duration属性的解析
 * @param {string | number} duration
 * @param {number} defaultDuration 默认300ms
 * @desc
 * duration:
 * 1. 为数字 则单位默认为ms 例如1000 返回 {jsDuration: 1000, cssDuration: '1s' }
 * 2. 为字符串
 *    1）'500' ===> {jsDuration: 500, cssDuration: '0.5s'}
 *    2) '0.5s' ===> {jsDuration: 500, cssDuration: '0.5s'}
 *    3) '440ms' ==> {jsDuration: 440, cssDuration: '0.44s'}
 *    4) 故意写错单位 则默认ms为单位 '450kg' ==> {jsDuration: 450, cssDuration: '0.45s'}
 * 3. 不是以数字开头 非法值 则默认
 * @return {
 *  jsDuration: 数字(单位ms 等于xxx*1000),
 *  cssDuration: 字符串  格式：`${xxx}s`
 * }
 */
export function parseDuration(duration, defaultDuration = 300) {
  let jsDuration = ''
  let cssDuration = ''
  if (typeof duration === 'string' || duration.constructor === String.prototype.constructor) {
    // 若duration 是字符串类型 分离出数字和单位
    const results = duration.match(/(\d+(\.\d+)?)(.*)/i)
    if (results) {
      // 0-整个匹配 1-整数部分 2-小数点部分 3-单位
      const time = results[2] ? parseFloat(results[1]) : parseInt(results[1], 10)
      // 单位可能没有则默认ms
      let unit = (results[3] || 'ms').trim()
      if (!/^m?s$/.test(unit)) {
        // 如果单位不是ms 或者 s 则默认ms
        unit = 'ms'
      }
      if (unit === 'ms') {
        // 将单位转为s
        cssDuration = `${time / 1000}s`
        jsDuration = time
      } else {
        cssDuration = `${time}s`
        jsDuration = time * 1000
      }
    } else {
      // 如果属性duration 是非法值 则使用默认值
      cssDuration = `${defaultDuration / 1000}s`
      jsDuration = defaultDuration
    }
  } else {
    // 属性duration为数字 则单位默认ms
    cssDuration = `${this.duration / 1000}s`
    jsDuration = this.duration
  }
  return {
    js: jsDuration,
    css: cssDuration
  }
}
