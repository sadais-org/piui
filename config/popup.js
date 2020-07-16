export default {
  position: 'bottom', // 弹出位置，可选值为 top bottom right left
  duration: 300, // 遮罩的过渡时间，单位为ms
  appendToBody: false, // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
  zIndex: 1099, // 元素 z-index
  maskBackground: 'rgba(0, 0, 0, .5)', // 蒙层背景颜色（默认'#000000'）
  background: '#ffffff', // 背景颜色（默认'#ffffff'）
  popupStyle: {}, // 指定popupStyle样式（默认{}）
  safeAreaInsetTop: true, // 顶部安全适配（状态栏高度，默认true）
  safeAreaInsetBottom: true // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
}
