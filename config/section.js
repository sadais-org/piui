export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  lineStyle: {}, // 自定义竖线样式，对象形式（默认值：{}）
  title: '', // 标题
  titleStyle: {}, // 标题自定义样式，对象形式（默认值：{}）
  desc: '', // 描述
  descStyle: {}, // 描述自定义样式，对象形式（默认值：{}）
  extraText: '', // 右侧文字
  extraStyle: {}, // 右侧文字自定义样式，对象形式（默认值：{}）
  border: false, // 是否显示下边框
  line: true, // 是否显示左侧竖线
  padding: '24rpx 0', // padding
  showRightIcon: false, // 是否显示右边icon，默认是箭头（可以自定义设置成其他图标）
  rightIcon: {
    name: 'right', // 图标名称或图片链接
    dot: false, // 是否显示图标右上角小红点，默认值 false
    badge: '', // 图标右上角徽标的内容
    color: '#cccccc', // 图标颜色
    size: '', // 图标字体大小，单位rpx
    classPrefix: 'pi-icon-' // 类名前缀，用于使用自定义图标，默认为（pi-icon-）
  }
}
