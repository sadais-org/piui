import popup from './popup'

const currentYear = new Date().getFullYear()
const maxYear = currentYear + 30
const minYear = currentYear - 80

export default {
  popup, // 弹窗的配置，默认选项请参照popup
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '日期选择', // title
  titlePadding: '24rpx', // title padding
  type: 'date', // 日历的类型，date 单选，range 日历范围
  defaultValue: '', // 日期默认值，单选时候，传入Date，日历范围，传入Date[]
  minYear, // 可切换的最大年份（默认当前年份 - 30）
  maxYear, // 可切换的最大年份（默认当前年份 + 80）
  minDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  maxDate: '', // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
  showBackToday: true, // 是否显示回到今日，默认（true）
  todayActiveBorderColor: '#ff6a00', // 今日日期激活边框颜色，默认（'#ff6a00'）
  activeColor: '#ffffff', // 选中|起始结束日期字体颜色，默认（'#ffffff'）
  activeBg: '#ff6a00', // 选中|起始结束日期背景，默认（'#ff6a00'）
  activeBorderRadius: '8rpx', // 选中圆角效果（默认'0 0 0 0'）
  rangeColor: '#ff6a00', // 范围内日期字体颜色默认（'#ff6a00'）
  rangeBg: 'rgba(254, 106, 0, 0.1)', // 范围内日期背景色，默认（'rgba(254, 106, 0, 0.1)'）
  startText: '开始', // type=range时生效，起始日期自定义文案，默认（'开始'）
  endText: '结束', // type=range时生效，结束日期自定义文案，默认（'结束'）
  dateFormat: 'yyyy-mm-dd' // 已选择的时间格式化显示规则，默认（'yyyy-mm-dd'）
}
