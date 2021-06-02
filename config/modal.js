import popup from './popup'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  showTitle: true, // 是否显示title（默认：true）
  title: '弹出选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  width: 600, // 弹窗宽度，可以是数值(rpx)，百分比，auto等
  content: '内容', // 弹窗内容
  contentStyle: {}, // 内容样式
  // 确认按钮配置
  confirmBtn: {
    show: true, // 是否显示
    text: '确认', // 确认文案
    color: '#ffffff', // 文字颜色
    bgColor: '' // 背景颜色
  },
  // 取消按钮配置
  cancelBtn: {
    show: true, // 是否显示
    text: '取消', // 确认文案
    color: '#666666', // 文字颜色
    bgColor: '' // 背景颜色
  },
  showConfirmButton: true, // 是否显示确认按钮
  confirmText: '确认', // 确认文案
  confirmColor: '#ffffff', // 确认文字颜色
  confirmBgColor: '', // 确认按钮背景颜色
  showCancelButton: true, // 是否显示取消按钮
  cancelText: '取消', // 取消文案
  cancelColor: '#666666', // 取消文字颜色
  cancelBgColor: '', // 取消按钮背景颜色
  /**
   * 弹窗的配置，默认选项请参照popup
   */
  popup
}
