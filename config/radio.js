export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  name: '', // 标识符
  shape: 'round', // 形状，可选值为 square round dot text
  borderRadius: 8, // 当shape为square的时候，设置圆角，单位rpx
  border: 4, // 边框大小，单位rpx
  disabled: false, // 是否禁用复选框
  readonly: false, // 是否只读模式
  size: 40, // checkbox大小，单位rpx
  iconSize: 24, // checkbox icon 大小，单位rpx
  activeColor: '', // 选中时图标的颜色
  activeMode: 'line' // 激活模式（line: 线框模式，fill: 实底模式）
}
