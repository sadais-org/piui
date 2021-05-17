import mask from './mask'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  position: 'bottom', // 弹出位置，可选值为 top bottom right left
  background: '#ffffff', // 背景颜色（默认'#ffffff'）
  borderRadius: '0 0 0 0', // 控制弹窗的四个角圆角效果
  safeAreaInsetTop: true, // 顶部安全适配（状态栏高度，默认true）
  safeAreaInsetBottom: true, // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  // 关闭按钮配置
  closeIcon: {
    name: 'close', // 关闭图标的名称，默认（close）
    padding: '32rpx 32rpx', // 关闭图标的padding
    color: '#666666', // 关闭图标的颜色，默认（'#666666'）
    size: 42, // 关闭图标的大小，默认（'42rpx'）
    weight: 800, // 关闭图标font-weight，默认（'800'）
    position: '' // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
  },
  // 弹窗蒙层的配置，默认选项请参照mask
  mask
}
