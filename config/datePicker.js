import popup from './popup'

const currentYear = new Date().getFullYear()
const startYear = currentYear - 30
const endYear = currentYear
export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  startYear, // 开始年份（默认当前年份 - 30）
  endYear, // 结束年份（默认当前年份）
  field: 'day', // 选择器的粒度 year、month、day、hour、minute、second
  defaultValue: '', // 日期默认值
  format: 'YYYY-MM-DD', // 返回的日期格式
  toolbarPosition: 'bottom', // 操作条（确定，取消按钮）位置，可选值 'top', 'bottom'
  showTitle: false, // 是否显示title（默认：true）
  title: '日期选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  height: '50vh', // 弹出选择层的高度，不可填百分比（默认：'50vh'）
  itemHeight: 110, // 行高（默认：'110rpx'）
  onConfirmClose: true, // 是否点击确认的时候关闭弹窗（默认：'true'）
  showItemBottomBorder: true,
  itemStyle: {},
  /**
   * 弹窗的配置，默认选项请参照popup
   * -------------------------------------------------------------------------------------------------
   */
  popup
}
