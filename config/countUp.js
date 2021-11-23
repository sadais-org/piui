export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  startNum: 0, // 起始值
  endNum: 0, // 终止值
  duration: 2000, // 滚动到目标数值的动画持续时间，单位为毫秒（ms）
  autoplay: true, // 是否自动播放
  decimals: 0, // 要显示的小数位数
  thousands: '', // 千位符分隔符，默认为空
  isEase: true, // 是否在即将到达目标数值的时候，使用缓慢滚动的效果
  fontColor: '#333333', // 字体颜色
  fontSize: 38 // 字体大小，单位rpx
}
