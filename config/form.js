import icon from './icon'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '', // 表单面板标题
  desc: '', // 表单描述
  titleStyle: {}, // 表单自定义样式，对象形式（默认值：{}）
  height: null, // 高度
  padding: null, // padding
  labelWidth: 120, // 表单项 label 宽度，默认单位为rpx
  labelAlign: null, // 表单项 label 对齐方式，可选值为 left center right
  labelStyle: null, // 表单项 label样式
  inputAlign: null, // 表单输入区域 label 对齐方式，可选值为 left center right
  wrap: null, // 是否以换行样式显示表单
  labelWrapBorder: null, // wrap样式label是否显示边框
  colon: null, // 是否在 label 后面添加冒号
  disabled: null, // 是否禁用
  border: null, // 是否显示边框
  errorType: 'message',
  showRightIcon: null, // 是否显示右边icon，默认是箭头（可以自定义设置成其他图标）
  rightIcon: {
    ...icon,
    name: 'right',
    color: '#cccccc'
  } // 右侧箭头配置
}
