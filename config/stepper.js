export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  inputStyle: {}, // 自定义输入样式，对象形式（默认值：{}）
  min: 1, // 最小值
  max: null, // 最大值
  step: 1, // 步长，每次点击时改变的值
  inputWidth: 84, // 输入框宽度，默认单位为rpx
  buttonSize: 50, // 按钮大小
  buttonColor: '', // 按钮颜色
  decimal: 0, // 小数位
  shape: 'round', // 形状 round || square
  theme: 'line', // 主题模式（line: 线框模式，fill: 实底模式）
  integer: false, // 是否只允许输入整数
  showAdd: true, // 是否显示增加按钮
  showSubtract: true, // 是否显示减少按钮
  disableSubtract: false, // 是否禁用减少按钮
  disableInput: true // 是否禁用输入框
}
