import popup from './popup'
import regionsData from './regionsData'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  toolbarPosition: 'bottom', // 操作条（确定，取消按钮）位置，可选值 'top', 'bottom'
  regionsData, // 区域数据（考虑到体积，只包含了部分演示数据）
  keyField: 'code', // 选项id字段，默认为code
  displayField: 'name', // 选项显示字段，默认为name
  defaultValue: null, // 默认值，单选是传Object，多选时传Array，默认null
  showTitle: false, // 是否显示title（默认：true）
  title: '地区选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  height: '50vh', // 弹出选择层的高度，不可填百分比（默认：'50vh'）
  itemHeight: 110, // 行高（默认：'110rpx'）
  showItemBottomBorder: true, // 是否显示item下边框（默认：'true'）
  itemStyle: {}, // 行样式（默认：'{}'）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  /**
   * 弹窗的配置，默认选项请参照popup
   */
  popup
}
