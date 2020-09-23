export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  round: true, // 两端是否半圆（默认值：false）
  activeColor: '', // 激活部分的颜色（不设置默认为主题色）
  inactiveColor: '#ebeef5', // 未激活底色
  percent: 0, // 进度百分比，数值
  showPercent: true, // 是否在进度条内部显示百分比的值
  percentStyle: {}, // 当showPercent为true，设定百分比的样式
  width: 0, // 进度条的宽度，单位rpx，不设置默认为100%
  height: 20, // 进度条的高度，单位rpx
  striped: false, // 是否显示条纹
  stripedActive: false // 条纹是否具有动态效果
}
