const currentYear = new Date().getFullYear()
const maxYear = currentYear + 30
const minYear = currentYear - 80

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '日期选择', // title
  type: 'date', // 日历的类型，date 单选，range 日历范围
  defaultValue: '', // 日期默认值，单选时候，传入Date，日历范围，传入Date[]
  minYear, // 可切换的最大年份（默认当前年份 - 30）
  maxYear, // 可切换的最大年份（默认当前年份 + 80）
  zIndex: 1099, // 元素 z-index
  popupBorderRadius: '0 0 0 0', // 控制弹窗的四个角圆角效果
  activeBorderRadius: '8rpx',
  safeAreaInsetBottom: true, // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
  maskClosable: true, // 是否可以通过点击遮罩进行关闭，默认（true）
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  closeIconName: 'close', // 关闭图标的名称，默认（close）
  closeIconPadding: '24rpx 24rpx', // 关闭图标的padding
  closeIconColor: '#999999', // 关闭图标的颜色，默认（'#999999'）
  closeIconSize: 36 // 关闭图标的大小，默认（'32rpx'）
}
