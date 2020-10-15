export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  toolbarPosition: 'bottom', // 操作条（确定，取消按钮）位置，可选值 'top', 'bottom'
  type: 'single', // 选择器类型：single：单列，multi 多列，multi-auto 多列联动
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  childName: 'children', // 自定义多列联动模式的children属性名
  defaultValue: null, // 默认值
  showTitle: false, // 是否显示title（默认：true）
  title: '弹出选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  height: '50vh', // 弹出选择层的高度，不可填百分比（默认：'50vh'）
  itemHeight: 110, // 行高（默认：'110rpx'）
  showItemBottomBorder: true, // 是否显示item下边框（默认：'true'）
  itemStyle: {}, // 行样式（默认：'{}'）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  /**
   * 弹窗的配置，默认选项请参照popup
   * -------------------------------------------------------------------------------------------------
   */
  borderRadius: '0 0 0 0', // 控制弹窗的圆角效果
  showCloseIcon: true, // 是否显示关闭图标，默认（true）
  closeIconName: 'close', // 关闭图标的名称，默认（close）
  closeIconPadding: '32rpx 32rpx', // 关闭图标的padding
  closeIconColor: '#666666', // 关闭图标的颜色，默认（'#666666'）
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
