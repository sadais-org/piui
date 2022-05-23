import popupSelect from './popupSelect'
import regionsData from './regionsData'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  regionsData, // 区域数据（考虑到体积，只包含了部分演示数据）
  keyField: 'code', // 选项id字段，默认为code
  displayField: 'name', // 选项显示字段，默认为name
  keyDefaultValue: false, // 是否只绑定keyField的默认值，默认false
  defaultValue: null, // 默认值
  itemHeight: 110, // 行高（默认：'110rpx'）
  showItemBottomBorder: true, // 是否显示item下边框（默认：'true'）
  itemStyle: {}, // 行样式（默认：'{}'）
  popupSelect: popupSelect, // popupSelect配置
  popup: popupSelect.popup, // 弹窗的配置，默认选项请参照popup
  confirmBtn: popupSelect.confirmBtn, // 确认按钮配置
  cancelBtn: popupSelect.cancelBtn // 取消按钮配置
}
