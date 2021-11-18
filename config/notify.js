export default {
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  customClass: '', // 自定义样式类，字符串形式（''）
  message: '', // 显示的消息文本（默认值：''）
  type: 'primary', // 类型： 'primary'-主要通知` `'success'-成功通知` `'danger'-危险通知` `'warning'-警告通知` `'info'-消息通知
  duration: 3000, // 展示时长,默认 3000ms
  color: '', // 自定义颜色消息通知文本（默认值：''）
  bgColor: '', // 自定义背景色消息通知文本（默认值：''）
  zIndex: 9999, // 通知 z-index
  appendToBody: true, // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
  autoHide: true, // 是否自动隐藏，默认 true
  singleLine: false // 是否单行显示，默认 false
}
