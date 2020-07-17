/**
 * 验证电子邮箱格式
 */
export const isEmail = value => {
  return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)
}

/**
 * 验证手机格式
 */
export const isMobile = value => {
  return /^1[23456789]\d{9}$/.test(value)
}

/**
 * 验证URL格式
 */
export const isUrl = value => {
  return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(
    value
  )
}

/**
 * 验证日期格式
 */
export const isDate = value => {
  return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 验证ISO类型的日期格式
 */
export const isDateISO = value => {
  return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
export const isNumber = value => {
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
}

/**
 * 验证整数
 */
export const isDigits = value => {
  return /^\d+$/.test(value)
}

/**
 * 验证身份证号码
 */
export const isIdCard = value => {
  return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
}

/**
 * 是否车牌号
 */
export const isCarNo = value => {
  // 新能源车牌
  const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
  // 旧车牌
  const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
  if (value.length === 7) {
    return creg.test(value)
  } else if (value.length === 8) {
    return xreg.test(value)
  } else {
    return false
  }
}

/**
 * 金额,只允许2位小数
 */
export const isAmount = value => {
  // 金额，只允许保留两位小数
  return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value)
}

/**
 * 中文
 */
export const isChinese = value => {
  let reg = /^[\u4e00-\u9fa5]+$/gi
  return reg.test(value)
}

/**
 * 只能输入字母
 */
export const letter = value => {
  return /^[a-zA-Z]*$/.test(value)
}

/**
 * 只能是字母或者数字
 */
export const isEnOrNum = value => {
  // 英文或者数字
  let reg = /^[0-9a-zA-Z]*$/g
  return reg.test(value)
}

/**
 * 验证一个值范围[min, max]
 */
export const range = (value, param) => {
  return value >= param[0] && value <= param[1]
}

/**
 * 验证一个长度范围[min, max]
 */
export const rangeLength = (value, param) => {
  return value.length >= param[0] && value.length <= param[1]
}

/**
 * 判断是否为空
 */
export const isEmpty = value => {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
      break
    case 'boolean':
      if (!value) return true
      break
    case 'number':
      if (0 === value || isNaN(value)) return true
      break
    case 'object':
      if (null === value || value.length === 0) return true
      for (var i in value) {
        return false
      }
      return true
  }
  return false
}
