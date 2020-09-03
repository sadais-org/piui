import { isNumber } from './validate'

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
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function} 需要调用的函数
 * @param delay {number} 延迟时间，单位毫秒
 * @param immediate {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return { Function }实际调用函数
 */
export const throttle = function(fn, delay, immediate, debounce) {
  var curr = +new Date(), // 当前事件
    last_call = 0,
    last_exec = 0,
    timer = null,
    diff, // 时间差
    context, // 上下文
    args,
    exec = function() {
      last_exec = curr
      fn.apply(context, args)
    }
  return function() {
    curr = +new Date()
    ;(context = this),
      (args = arguments),
      (diff = curr - (debounce ? last_call : last_exec) - delay)
    clearTimeout(timer)
    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    last_call = curr
  }
}

/** 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function} 要调用的函数
 * @param delay {number} 空闲时间
 * @param immediate {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return { Function } 实际调用函数
 */
export const debounce = function(fn, delay, immediate) {
  return throttle(fn, delay, immediate, true)
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
