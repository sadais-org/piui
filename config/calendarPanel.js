const current = new Date()
const currentYear = current.getFullYear()
const maxYear = currentYear + 30
const minYear = currentYear - 80

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  type: 'date', // 日历的类型，date 单选，range 日历范围
  minYear, // 可切换的最大年份（默认当前年份 - 30）
  maxYear, // 可切换的最大年份（默认当前年份 + 80）
  minDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  maxDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  showBackToday: true, // 是否显示回到今日，默认（true）
  todayActiveBorderColor: '#5a7dff', // 今日日期激活边框颜色，默认（'#5a7dff'）
  activeColor: '#ffffff', // 选中|起始结束日期字体颜色，默认（'#ffffff'）
  activeBg: '#5a7dff', // 选中|起始结束日期背景，默认（'#5a7dff'）
  activeBorderRadius: '8rpx', // 选中圆角效果（默认'0 0 0 0'）
  rangeColor: '#5a7dff', // 范围内日期字体颜色默认（'#5a7dff'）
  rangeBg: '#5A7DFF25', // 范围内日期背景色，默认（'#5A7DFF25'）
  startText: '开始', // type=range时生效，起始日期自定义文案，默认（'开始'）
  endText: '结束', // type=range时生效，结束日期自定义文案，默认（'结束'）
  dateFormat: 'YYYY-MM-DD', // 已选择的时间格式化显示规则，默认（'YYYY-MM-DD'）
  canChangeWeekView: false, // 是否可切换周视图，默认（false）
  defalutWeekView: false, // 是否默认显示周视图，默认（false）
  marks: [] // 日期标记，数组形式，默认（[]）
}
