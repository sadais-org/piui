import popupSelect from './popupSelect'
import img from './img'
import checkbox from './checkbox'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  descField: 'desc', // 描述显示字段，默认为desc
  keyDefaultValue: false, // 是否只绑定keyField的默认值，默认false
  defaultValue: null, // 默认值，单选是传Object，多选时传Array，默认null
  isMulti: false, // 是否多选，（默认：false）
  showSelectAll: false, // 是否显示全选（多选isMulti开启的情况下）
  singleCancel: true, // 单选模式下，是否可取消选中
  singleConfirm: false, // 单选模式下，是否直接选中，不需要点击确认按钮（需要设置singleCancel：false）
  itemHeight: 110, // 行高（默认：'110rpx'）
  showItemBottomBorder: true, // 是否显示item下边框（默认：'true'）
  itemStyle: {}, // 行样式（默认：'{}'）
  selectedImg: img, // 选中图标的配置
  selectedCheckbox: {
    ...checkbox,
    shape: 'round',
    activeMode: 'fill-circle'
  }, // 选中复选框配置
  popupSelect: popupSelect, // popupSelect配置
  popup: popupSelect.popup, // 弹窗的配置，默认选项请参照popup
  confirmBtn: popupSelect.confirmBtn, // 确认按钮配置
  cancelBtn: popupSelect.cancelBtn // 取消按钮配置
}
