const currentYear = new Date().getFullYear()
const maxYear = currentYear + 30
const minYear = currentYear - 80

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  showTitle: true, // 是否显示title（默认：true）
  title: '日期选择', // 标题（默认：日期选择）
  titlePadding: '24rpx', // 标题 padding（默认：24rpx）
  type: 'date', // 日历的类型，date 单选，range 日历范围
  defaultValue: '', // 日期默认值，单选时候，传入Date，日历范围，传入Date[]
  minYear, // 可切换的最大年份（默认当前年份 - 30）
  maxYear, // 可切换的最大年份（默认当前年份 + 80）
  minDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  maxDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  showBackToday: true, // 是否显示回到今日，默认（true）
  todayActiveBorderColor: '#ff6a00', // 今日日期激活边框颜色，默认（'#ff6a00'）
  activeColor: '#ffffff', // 选中|起始结束日期字体颜色，默认（'#ffffff'）
  activeBg: '#ff6a00', // 选中|起始结束日期背景，默认（'#ff6a00'）
  activeBorderRadius: '8rpx', // 选中圆角效果（默认'0 0 0 0'）
  rangeColor: '#ff6a00', // 范围内日期字体颜色默认（'#ff6a00'）
  rangeBg: 'rgba(254, 106, 0, 0.1)', // 范围内日期背景色，默认（'rgba(254, 106, 0, 0.1)'）
  startText: '开始', // type=range时生效，起始日期自定义文案，默认（'开始'）
  endText: '结束', // type=range时生效，结束日期自定义文案，默认（'结束'）
  dateFormat: 'yyyy-mm-dd', // 已选择的时间格式化显示规则，默认（'yyyy-mm-dd'）
  /**
   * 弹窗的配置，默认选项请参照popup
   * -------------------------------------------------------------------------------------------------
   */
  borderRadius: '0 0 0 0', // 控制弹窗的圆角效果
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
