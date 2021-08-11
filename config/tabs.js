export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  disabledField: 'disabled', // 禁用字段，默认为disabled
  itemPadding: 30, // 选项两边的padding，单位rpx
  stretch: false, // 标签是否自动撑开
  duration: 300, // 动画执行时间（毫秒）
  activeColor: '', // 激活颜色（不设置，默认主题色）
  activeTextColor: '', // 文字激活颜色（不设置，默认主题色）
  showItemSplitLine: false, // 是否显示每项分割线
  showSliderBar: true, // 是否显示底部的滑块
  showSliderBarGuide: false, // 是否显示底部滑块导轨
  sliderBarWidth: '', // 底部的滑块的宽度，单位rpx（如果不设置，默认按照当前item文字的宽度去适配）
  sliderBarHeight: 4, // 底部的滑块的高度，单位rpx
  sliderBarRadius: 4, // 底部的滑块的圆角，单位rpx
  height: 80, // 导航栏的高度，单位rpx
  itemStyle: {}, // 选项样式（默认：'{}'）
  sliderBarStyle: {}, // 滑块样式（默认：'{}'）
  activeItemStyle: {} // 激活选项样式（默认：'{}'）
}
