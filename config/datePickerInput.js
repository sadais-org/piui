import input from './input'
import datePicker from './datePicker'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  // input输入设置
  input: {
    ...input,
    placeholder: '请选择',
    disabled: true // 是否禁用
  },
  // 日期弹窗的配置，默认选项请参照datePicker
  datePicker,
  dateFormat: 'YYYY-MM-DD', // 已选择的时间格式化显示规则，默认（'YYYY-MM-DD'）
  parseValueFn: null // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
}
