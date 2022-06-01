export default {
  items: [], // tab的数据
  value: 0, // 当前活动的tab的index（默认 0 ）
  activeColor: '#5a7dff', // 激活时的颜色（默认 '#5a7dff' ）
  inactiveColor: '#303133', // 未激活时的颜色（默认 '#303133' ）
  mode: 'button', // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式（默认 'button' ）
  round: false, // 圆角模式 默认 false
  fontSize: 24, // 字体大小，单位px（默认 24rpx ）
  bold: true, // 激活选项的字体是否加粗（默认 true ）
  bgColor: '', // 组件背景颜色，mode为button时有效（默认 '#eeeeef' ）
  keyField: 'name', // 从`list`元素对象中读取的键名（默认 'name' ）
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {} // 自定义样式，对象形式（默认值：{}）
}
