import popupSelect from './popupSelect'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  childrenField: 'children', // 描述显示字段，默认为children
  defaultValue: null, // 默认值，单选是传Object，多选时传Array，默认null
  itemHeight: 110, // 行高（默认：'110rpx'）
  showItemBottomBorder: false, // 是否显示item下边框（默认：'true'）
  itemStyle: {}, // 行样式（默认：'{}'）
  parentCanSelect: false, // 父节点是否可选（默认：'false'）
  popupSelect: popupSelect, // popupSelect配置
  popup: popupSelect.popup, // 弹窗的配置，默认选项请参照popup
  confirmBtn: popupSelect.confirmBtn, // 确认按钮配置
  cancelBtn: {
    ...popupSelect.cancelBtn,
    show: true
  } // 取消按钮配置
}
