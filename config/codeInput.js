export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  itemStyle: {}, // 每项验证码样式，对象形式（默认值：{}）
  fillStyle: {}, // 已填项验证码样式，对象形式（默认值：{}）
  length: 4, // 验证码长度
  autoFocus: false, // 是否自动拉起键盘输入
  autoFocusDelay: 350, // 自动拉起键盘延时
  stretch: false, // 每项验证码是否均分宽度
  align: 'left', // 验证码对齐方向，可选值：left、center、right
  codeFormat: '' // 验证码显示格式化
}
