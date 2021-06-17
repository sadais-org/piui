import { isString } from './lang'

const weekDayZh = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 获取星期中文数组
 */
export const getWeekDayZh = () => {
  return weekDayZh
}

/**
 * 解析日期信息
 * @param {*} value Date 日期
 * @param {*} weekPrefix 星期前缀
 */
export const parseDate = (value = new Date(), weekPrefix = '星期') => {
  // ! 如果传入的日期格式是xxxx-xx-xx，在ios会报错，使用/进行替换
  const val = isString(value) ? value.replace(/\.|-/g, '/') : value
  const date = val ? new Date(val) : new Date()
  return {
    year: date.getFullYear(), // 年份
    month: date.getMonth() + 1, // 月份
    date: date.getDate(), // 当前日(1-31)
    day: date.getDay(), // 当前星期X(0-6,0代表星期天)
    week: weekPrefix + weekDayZh[date.getDay()], // 星期几，要显示周X，或者星期X，自己拼前缀
    hour: date.getHours(), // 时
    minute: date.getMinutes(), // 分
    second: date.getSeconds(), // 秒
    time: date,
    timestamp: date.getTime(), // 时间戳
    format(fmt = 'YYYY-MM-DD hh:mm:ss') {
      return formatDate(date, fmt)
    }
  }
}

/**
 * 日期格式化
 * @param {*} value Date 日期
 * @param {*} fmt 格式化规则
 */
export const formatDate = (value = new Date(), fmt = 'YYYY-MM-DD') => {
  let date = parseDate(value)
  let ret
  let opt = {
    'y+|Y+': date.year, // 年
    'M+': date.month, // 月
    'd+|D+': date.date, // 日
    'h+|H+': date.hour, // 时
    'm+': date.minute, // 分
    's+': date.second // 秒
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].toString().padStart(ret[1].length, '0')
      )
    }
  }
  return fmt
}

/**
 * 计算剩余时间
 * @param {*} timestamp 时间差
 * @param {*} showDay 是否显示天数
 */
export const calcuLeftTime = (timestamp, showDay = true) => {
  const defaultValue = [0, 0, 0, 0]
  let [day, hour, minute, second] = defaultValue

  if (timestamp <= 0) return defaultValue

  day = Math.floor(timestamp / (60 * 60 * 24))
  hour = Math.floor(timestamp / (60 * 60)) - day * 24
  minute = Math.floor(timestamp / 60) - hour * 60 - day * 24 * 60
  second = Math.floor(timestamp) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60

  day = day < 10 ? '0' + day : day
  let formatHour = showDay ? hour : Math.floor(timestamp / (60 * 60))
  formatHour = formatHour < 10 ? '0' + formatHour : formatHour
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second

  return { day, hour: formatHour, minute, second }
}
