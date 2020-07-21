export default {
  position: 'bottom', // 弹出位置，可选值为 top bottom right left
  duration: 300, // 遮罩的过渡时间，单位为ms
  appendToBody: false, // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
  zIndex: 1099, // 元素 z-index
  maskBackground: 'rgba(0, 0, 0, .5)', // 蒙层背景颜色（默认'#000000'）
  background: '#ffffff', // 背景颜色（默认'#ffffff'）
  borderRadius: '0 0 0 0', // 控制弹窗的四个角圆角效果
  popupStyle: {}, // 指定popupStyle样式（默认{}）
  maskClosable: true, // 是否可以通过点击遮罩进行关闭，默认（true）
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  closeIconName: 'close', // 关闭图标的名称，默认（close）
  closeIconPadding: '24rpx 24rpx', // 关闭图标的padding
  closeIconColor: '#999999', // 关闭图标的颜色，默认（'#999999'）
  closeIconSize: 36, // 关闭图标的大小，默认（'32rpx'）
  closeIconPosition: '', // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
  safeAreaInsetTop: true, // 顶部安全适配（状态栏高度，默认true）
  safeAreaInsetBottom: true // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
}
