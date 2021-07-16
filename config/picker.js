import popupSelect from './popupSelect'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  type: 'single', // 选择器类型：single：单列，multi 多列，multi-auto 多列联动
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  childField: 'children', // 自定义多列联动模式的children属性名
  defaultValue: null, // picker默认值
  itemHeight: 110, // 行高（默认：'110rpx'）
  itemStyle: {}, // 行样式（默认：{}）
  showItemBottomBorder: true, // 是否显示底部边线
  popupSelect: popupSelect, // popupSelect配置
  popup: popupSelect.popup, // 弹窗的配置，默认选项请参照popup
  confirmBtn: popupSelect.confirmBtn, // 确认按钮配置
  cancelBtn: popupSelect.cancelBtn // 取消按钮配置
}
