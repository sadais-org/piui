import popupSelect from './popupSelect'

const currentYear = new Date().getFullYear()
const startYear = currentYear - 30
const endYear = currentYear

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  startYear, // 开始年份（默认当前年份 - 30）
  endYear, // 结束年份（默认当前年份）
  field: 'day', // 选择器的粒度 year、month、day、hour、minute、second
  dateType: 'datetime', // 日期类型，date、datetime、time（默认值：datetime）
  defaultValue: '', // 日期默认值
  units: ['年', '月', '日', '时', '分', '秒'], // 单位数组，默认值：['年', '月', '日', '时', '分', '秒']
  format: '', // 返回的日期格式，为空的时候，返回的是日期对象
  itemHeight: 110, // 行高（默认：'110rpx'）
  itemStyle: {}, // 行样式（默认：{}）
  showItemBottomBorder: true, // 是否显示底部边线
  popupSelect: popupSelect, // popupSelect配置
  popup: popupSelect.popup, // 弹窗的配置，默认选项请参照popup
  confirmBtn: popupSelect.confirmBtn, // 确认按钮配置
  cancelBtn: popupSelect.cancelBtn // 取消按钮配置
}
