/**
 * 判断arr是否为数组
 * @param {Array} arr 数据
 */
export const isArray = arr => {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * 深度克隆
 * @param {Object} obj 对象
 */
export const cloneDeep = obj => {
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) return obj
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    // 原始类型直接返回
    return obj
  }
  var o = isArray(obj) ? [] : {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? cloneDeep(obj[i]) : obj[i]
    }
  }
  return o
}

/**
 * 对象深度合并
 * @param {Object} target 目标
 * @param {Object} source 合并源
 */
export const mergeDeep = (target = {}, source = {}) => {
  target = cloneDeep(target)
  if (typeof target !== 'object' || typeof source !== 'object') return false
  for (var prop in source) {
    if (!source.hasOwnProperty(prop)) continue
    if (prop in target) {
      if (typeof target[prop] !== 'object') {
        target[prop] = source[prop]
      } else {
        if (typeof source[prop] !== 'object') {
          target[prop] = source[prop]
        } else {
          if (target[prop].concat && source[prop].concat) {
            target[prop] = target[prop].concat(source[prop])
          } else {
            target[prop] = mergeDeep(target[prop], source[prop])
          }
        }
      }
    } else {
      target[prop] = source[prop]
    }
  }
  return target
}
