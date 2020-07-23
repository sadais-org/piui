import mask from './mask'

export default {
  mask, // 弹窗蒙层的配置，默认选项请参照mask
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  position: 'bottom', // 弹出位置，可选值为 top bottom right left
  background: '#ffffff', // 背景颜色（默认'#ffffff'）
  borderRadius: '0 0 0 0', // 控制弹窗的四个角圆角效果
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  closeIconName: 'close', // 关闭图标的名称，默认（close）
  closeIconPadding: '24rpx 24rpx', // 关闭图标的padding
  closeIconColor: '#999999', // 关闭图标的颜色，默认（'#999999'）
  closeIconSize: 36, // 关闭图标的大小，默认（'32rpx'）
  closeIconPosition: '', // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
  safeAreaInsetTop: true, // 顶部安全适配（状态栏高度，默认true）
  safeAreaInsetBottom: true // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
}
