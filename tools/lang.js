const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 判断对象是否对象类型
 * @param {*} value The value to query.
 * @returns {string} Returns the `isObjectLike`.
 */
export const isObjectLike = value => {
  return typeof value === 'object' && value !== null
}

/**
 * 获取对象标志
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
export const getTag = value => {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

/**
 * 检查对象是否一个prototype object
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
export const isPrototype = value => {
  const ctor = value && value.constructor
  const proto = (typeof Ctor === 'function' && ctor.prototype) || Object.prototype

  return value === proto
}

/**
 * 判断对象是否字符串
 * @param {*} value
 */
export const isString = value => {
  const type = typeof value
  return (
    type === 'string' ||
    (type === 'object' &&
      value != null &&
      !Array.isArray(value) &&
      getTag(value) == '[object String]')
  )
}

/**
 * 判断对象是否数值类型
 * @param {*} value The value to query.
 */
export const isNumber = value => {
  return typeof value === 'number' || (isObjectLike(value) && getTag(value) == '[object Number]')
}

/**
 * 判断是否为对象
 * @param {Object} value
 */
export const isObject = value => {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

/**
 * 判断是否为数组
 * @param {Array} value 数据
 */
export const isArray = value => {
  return getTag(value) === '[object Array]'
}

/**
 * 判断是否为函数
 * @param {Array} value 数据
 */
export const isFunction = value => {
  return getTag(value) === '[object Function]'
}

/**
 * 判断对象，数组是否为空
 * @param {*} value value
 */
export const isEmpty = value => {
  if (value == null) {
    return true
  }
  if (isArray(value)) {
    return !value.length
  }
  const tag = getTag(value)
  if (tag == '[object Map]' || tag == '[object Set]') {
    return !value.size
  }
  if (isPrototype(value)) {
    return !Object.keys(value).length
  }
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
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
