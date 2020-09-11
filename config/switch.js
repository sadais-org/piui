export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  type: 'fill', // 类型（line: 线框模式，fill: 实底模式）
  loading: false, // 是否为加载状态
  loadingType: 'round', // 类型： spinner 菊花 round 圆环
  disabled: false, // 是否为禁用状态
  size: 50, // 开关宽度，默认单位为rpx
  activeColor: '', // 激活颜色，不设置时候，为主题色
  activeValue: true, // 打开开关时对应的值
  inactiveValue: false, // 关闭开关时对应的值
  vibrateShort: true // 是否使手机发生短促震动，iOS的微信小程序有效
}
