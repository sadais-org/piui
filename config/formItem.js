export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  required: false, // 是否必填
  requiredStyle: {}, // 必填标志自定义样式，对象形式（默认值：{}）
  height: 100, // 表单项高度
  padding: '32rpx', // padding
  labelWidth: null, // 表单项 label 宽度，默认单位为rpx
  labelAlign: 'left', // 表单项 label 对齐方式，可选值为 left center right
  labelStyle: {}, // 表单项 label样式
  inputAlign: 'right', // 表单输入区域 label 对齐方式，可选值为 left center right
  wrap: false, // 是否以换行样式显示表单
  labelWrapBorder: false, // wrap样式label是否显示边框
  colon: false, // 是否在 label 后面添加冒号
  disabled: false, // 是否禁用
  border: false // 是否显示边框
}
