export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  max: 0, // 最大可选数，0为无限制
  direction: 'horizontal', // 排列方向，可选值为 horizontal vertical
  shape: '', // 形状，可选值为 square round dot text button
  stretch: false, // 当shape为button的时候，选项否均分布局，可选值 `true`
  borderRadius: null, // 当shape为square的时候，设置圆角，单位rpx
  border: 0, // 边框大小，单位rpx
  disabled: false, // 是否禁用复选框
  size: 0, // checkbox大小，单位rpx
  iconSize: 0, // checkbox icon 大小，单位rpx
  activeColor: '', // 选中时图标的颜色
  activeMode: '', // 激活模式（line: 线框模式，fill: 实底模式）
  canCancel: null, // 能否取消选中状态
  onlyIconSelect: null // 是否点击图标才能选中，默认点击整行都能选中
}
