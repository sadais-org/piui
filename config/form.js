import icon from './icon'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '', // 表单面板标题
  desc: '', // 表单描述
  titleStyle: {}, // 表单自定义样式，对象形式（默认值：{}）
  height: 100, // 表单项高度
  padding: '32rpx', // padding
  labelWidth: 120, // 表单项 label 宽度，默认单位为rpx
  itemVerticalAlign: 'center', // 表单项垂直对齐方式，可选值为 top center bottom
  labelAlign: 'left', // 表单项 label 对齐方式，可选值为 left center right
  labelStyle: {}, // 表单项 label样式
  inputAlign: 'right', // 表单输入区域 label 对齐方式，可选值为 left center right
  wrap: false, // 是否以换行样式显示表单
  wrapBottomGap: false, // wrap模式下是否在底部增加表单项之间的间距
  labelWrapBorder: false, // wrap样式label是否显示边框
  colon: false, // 是否在 label 后面添加冒号
  disabled: false, // 是否禁用
  border: false, // 是否显示边框
  errorType: 'message',
  showRightIcon: false, // 是否显示右边icon，默认是箭头（可以自定义设置成其他图标）
  rightIcon: {
    ...icon,
    name: 'right',
    color: '#cccccc'
  } // 右侧箭头配置
}
