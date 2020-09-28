export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  timeStyle: {}, // 每一个项时间的自定义样式，对象形式（默认值：{}）
  separatorStyle: {}, // 每一个项时间的自定义样式，对象形式（默认值：{}）
  autoplay: true, // 是否自动开始倒计时，如果为false，需手动调用开始方法
  separator: 'colon', // 分隔符，colon为英文冒号，zh为中文
  showDay: true, // 是否显示天
  showHour: true, // 是否显示小时
  showMinute: true, // 是否显示分钟
  showSecond: true // 是否显示秒
}
