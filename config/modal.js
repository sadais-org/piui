import popup from './popup'
import Button from './button'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  showTitle: true, // 是否显示title（默认：true）
  title: '弹出选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  width: 600, // 弹窗宽度，可以是数值(rpx)，百分比，auto等
  content: '内容', // 弹窗内容
  contentPadding: '32rpx 0', // 内容 padding
  contentStyle: {}, // 内容样式
  onCancelClose: true, // 是否点击取消的时候关闭弹窗（默认：'true'）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  // 确认按钮配置
  confirmBtn: {
    ...Button,
    show: true, // 是否显示
    text: '确认', // 确认文案
    width: '100%',
    type: 'primary'
  },
  // 取消按钮配置
  cancelBtn: {
    ...Button,
    show: true, // 是否显示
    text: '取消', // 确认文案
    width: '100%',
    type: 'secondary'
  },
  /**
   * 弹窗的配置，默认选项请参照popup
   */
  popup
}
