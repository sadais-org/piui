export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  count: 5, // 评分总数
  size: 36, // 图标的尺寸
  gutter: 12, // 星星之间的间距，单位rpx
  unselectedColor: '#b2b2b2', // 未选中的颜色
  selectedColor: '', // 选中的颜色，不设置默认为主题色
  unselectedIcon: 'biaoxing', // 未选中的图标名称
  selectedIcon: 'biaoxingfill', // 选中的颜色，不设置默认为主题色
  disabled: false, // 是否禁用评分
  disabledColor: '#c8c9cc', // 禁用时的颜色
  readonly: false, // 是否只读
  classPrefix: 'pi-icon-' // 类名前缀，用于使用自定义图标，默认为（pi-icon-）
}
