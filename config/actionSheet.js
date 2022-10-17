import popupSelect from './popupSelect'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  items: [], // 选项列表，默认（[]）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  itemHeight: 110, // 行高（默认：'110rpx'）
  itemStyle: {}, // 行样式（默认：{}）
  itemAlign: 'center', // 行对齐方式，默认值：'center'
  showItemBottomBorder: true, // 是否显示底部边线
  popupSelect: {
    ...popupSelect,
    height: 'auto',
    toolbarPosition: 'none'
  }, // popupSelect配置
  popup: {
    ...popupSelect.popup,
    borderRadius: '24rpx 24rpx 0 0'
  }, // 弹窗的配置，默认选项请参照popup
  description: '', // 选项上方的描述信息，不填则不显示
  cancelText: '' // 取消按钮文字，不填则不显示
}
