import icon from './icon'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  height: 110, // 表格高度
  title: '', // 标题
  titleStyle: {}, // 标题自定义样式，对象形式（默认值：{}）
  desc: '', // 描述
  descStyle: {}, // 描述自定义样式，对象形式（默认值：{}）
  extraText: '', // 右侧文字
  extraStyle: {}, // 右侧文字自定义样式，对象形式（默认值：{}）
  disabled: false, // 是否禁用
  border: true, // 是否显示边框
  padding: '24rpx 32rpx', // padding
  hoverClass: 'pi-hover-class', // 宫格按压时的样式类，"none"为无效果
  hoverStartTime: 10, // 按住后多久出现点击态，单位毫秒
  hoverStayTime: 100, // 手指松开后点击态保留时间，单位毫秒
  showRightIcon: true, // 是否显示右边icon，默认是箭头（可以自定义设置成其他图标）
  rightIcon: {
    ...icon,
    name: 'right',
    color: '#cccccc'
  } // 右侧箭头配置
}
