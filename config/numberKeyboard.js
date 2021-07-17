import popupSelect from './popupSelect'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  show: false, // 是否显示键盘
  extraKey: '', // 左下角额外的键
  backgroundColor: '#ffffff', // 键盘背景颜色
  keyBackgroundColor: '#f5f5f5', // 按键背景颜色
  keyStyle: {}, // 按键样式（默认：'{}'）
  popupSelect: {
    ...popupSelect,
    title: '数字键盘',
    height: 'auto',
    toolbarPosition: 'none' // 操作条（确定，取消按钮）位置，可选值 'top', 'bottom', 'none'
  }, // popupSelect配置
  popup: {
    ...popupSelect.popup,
    borderRadius: '24rpx 24rpx 0 0' // 控制弹窗的四个角圆角效果
  } // 弹窗的配置，默认选项请参照popup
}
