export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  type: 'text', // 输入框类型
  placeholder: '请输入',
  placeholderStyle: 'color: #c0c4cc; font-weight: 400;', // 指定 placeholder 的样式
  placeholderClass: 'input-placeholder', // 指定 placeholder 的样式类，注意页面或组件的style中写了scoped时，需要在类名前写/deep/
  disabled: false, // 是否禁用
  maxlength: -1, // 最大输入长度，设置为 -1 的时候不限制最大长度
  password: false,
  autoHeight: false // textArea是否自动增高
}
