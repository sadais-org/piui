import icon from './icon'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  type: 'text', // 输入框类型
  placeholder: '请输入',
  placeholderStyle: 'color: #c0c4cc; font-weight: 400;', // 指定 placeholder 的样式
  placeholderClass: 'input-placeholder', // 指定 placeholder 的样式类，注意页面或组件的style中写了scoped时，需要在类名前写::v-deep
  disabled: false, // 是否禁用
  border: false, // 边框样式设置
  maxlength: 140, // 最大输入长度，设置为 -1 的时候不限制最大长度
  password: false,
  cursorSpacing: 0, // 指定光标与键盘的距离，单位 px
  focus: false, // 是否自动获得焦点
  confirmType: 'done', // 设置键盘右下角按钮的文字，仅在 type="text" 时生效。
  confirmHold: false, // 点击键盘右下角按钮时是否保持键盘不收起
  cursor: null, // 指定focus时的光标位置
  selectionStart: -1, // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
  selectionEnd: -1, // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
  adjustPosition: true, // 键盘弹起时，是否自动上推页面
  holdKeyboard: false, // focus时，点击页面的时候不收起键盘
  autoBlur: true, // 键盘收起时，是否自动失去焦点
  showConfirmbar: true, // 是否显示键盘上方带有”完成“按钮那一栏
  autoHeight: false, // 是否自动增高
  fixed: false, // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true
  disableDefaultPadding: false, // 是否去掉 iOS 下的默认内边距
  clearable: false, // 是否可以清空
  clearIcon: {
    // 清空图标设置
    ...icon,
    size: 36,
    name: 'close-line',
    color: '#999999'
  }
}
