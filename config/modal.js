export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  showTitle: true, // 是否显示title（默认：true）
  title: '弹出选择', // 标题（默认：日期选择）
  titlePadding: '24rpx', // 标题 padding（默认：24rpx）
  width: 600, // 弹窗宽度，可以是数值(rpx)，百分比，auto等
  content: '内容', // 弹窗内容
  contentStyle: {}, // 内容样式
  showConfirmButton: true, // 是否显示确认按钮
  confirmText: '确认', // 确认文案
  confirmColor: '#ffffff', // 确认文字颜色
  confirmBgColor: '', // 确认按钮背景颜色
  showCancelButton: true, // 是否显示取消按钮
  cancelText: '取消', // 取消文案
  cancelColor: '#666666', // 取消文字颜色
  cancelBgColor: '', // 取消按钮背景颜色
  /**
   * 弹窗的配置，默认选项请参照popup
   * -------------------------------------------------------------------------------------------------
   */
  borderRadius: '8rpx', // 控制弹窗的圆角效果
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  closeIconName: 'close', // 关闭图标的名称，默认（close）
  closeIconPadding: '24rpx 24rpx', // 关闭图标的padding
  closeIconColor: '#c9c9c9', // 关闭图标的颜色，默认（'#c9c9c9'）
  closeIconSize: 42, // 关闭图标的大小，默认（'42rpx'）
  closeIconWeight: 800, // 关闭图标font-weight，默认（'800'）
  closeIconPosition: '', // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
  safeAreaInsetTop: true, // 顶部安全适配（状态栏高度，默认true）
  safeAreaInsetBottom: true, // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
  /**
   * 弹窗蒙层的配置，默认选项请参照mask
   * -------------------------------------------------------------------------------------------------
   */
  duration: 300, // 遮罩的过渡时间，单位为ms
  maskClosable: true, // 是否可以通过点击遮罩进行关闭
  hideTabBar: false, // 是否隐藏TabBar
  appendToBody: false, // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
  zIndex: 100, // 元素 z-index
  maskBackground: 'rgba(0, 0, 0, .5)' // 背景颜色（默认'#000000'）
}
