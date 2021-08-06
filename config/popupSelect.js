import popup from './popup'
import Button from './button'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  toolbarPosition: 'bottom', // 操作条（确定，取消按钮）位置，可选值 'top', 'bottom', 'none' -- 不显示
  showTitle: false, // 是否显示title（默认：true）
  title: '弹出选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  width: '100%', // 弹出选择层的宽度（默认：'100%'）
  height: '60%', // 弹出选择层的高度（默认：'60%'）
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
    show: false, // 是否显示
    text: '取消', // 确认文案
    width: '100%',
    type: 'secondary'
  },
  /**
   * 弹窗的配置，默认选项请参照popup
   */
  popup
}
