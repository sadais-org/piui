import mask from './mask'

export default {
  // 自定义样式类，字符串形式（''）
  customClass: '',
  // 内容自定义样式，对象形式（默认值：{}）
  customStyle: {},
  contentStyle: {},
  // 弹窗蒙层的配置，默认选项请参照mask
  mask: {
    ...mask,
    zIndex: 100
  },
  activeColor: null, // 默认选中色
  itemHeight: null, // 行高（默认：'110rpx'）
  keyField: null, // 选项id字段，默认为id
  displayField: null, // 选项显示字段，默认为text
  disabledField: null, // 选项禁用字段，默认为disabled
  selectedImg: null, // 选中图标的配置
  selectedCheckbox: null, // 选中复选框配置
  stretch: false, // 标签是否均分布局，可选值 `true`
  tabHeight: 80, // 标签的高度，单位rpx
  maskAlignTop: true // 是否需要蒙层顶部对齐组件，可选值 `false`
}
