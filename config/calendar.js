import popup from './popup'
import calendarPanel from './calendarPanel'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  showTitle: true, // 是否显示title（默认：true）
  title: '日期选择', // 标题（默认：日期选择）
  titlePadding: '32rpx', // 标题 padding（默认：32rpx）
  type: 'date', // 日历的类型，date 单选，range 日历范围
  /**
   * 日历面板的配置，默认选项请参照calendarPanel
   */
  calendarPanel,
  /**
   * 弹窗的配置，默认选项请参照popup
   */
  popup
}
