import input from './input'
import calendar from './calendar'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  // input输入设置
  input: {
    ...input,
    placeholder: '请选择',
    disabled: true // 是否禁用
  },
  // 日历弹窗的配置，默认选项请参照calendar
  calendar,
  dateFormat: 'YYYY-MM-DD', // 已选择的时间格式化显示规则，默认（'YYYY-MM-DD'）
  rangeSplit: '至', // 范围选择时间分隔符，默认（'至'）
  parseValueFn: null // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
}
