/*
 * @Author: zhangzhenfei
 * @Date: 2022-05-18 16:52:21
 * @LastEditTime: 2022-05-19 11:53:43
 * @LastEditors: zhangzhenfei
 * @Description:
 * @FilePath: /hfmp-checkin-front/Users/feilin/workspace/piui/piui-awesome/src/piui/config/selectInput.js
 */
import input from './input'
import select from './select'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  // input输入设置
  input: {
    ...input,
    placeholder: '请选择',
    disabled: true // 是否禁用
  },
  // select弹窗的配置，默认选项请参照select
  select: {
    ...select,
    keyDefaultValue: true
  },
  rangeSplit: ',', // 范围选择时间分隔符，默认（','）
  parseValueFn: null // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
}
