/*
 * @Author: zhangzhenfei
 * @Date: 2022-05-20 16:47:46
 * @LastEditTime: 2022-05-20 17:54:52
 * @LastEditors: zhangzhenfei
 * @Description:
 * @FilePath: /hfmp-checkin-front/Users/feilin/workspace/piui/piui-awesome/src/piui/config/regionsSelectInput.js
 */
import input from './input'
import regionsSelect from './regionsSelect'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  // input输入设置
  input: {
    ...input,
    placeholder: '请选择',
    disabled: true // 是否禁用
  },
  // 地区弹窗的配置，默认选项请参照regionsSelect
  regionsSelect: {
    ...regionsSelect,
    keyDefaultValue: true
  },
  rangeSplit: '/', // 地区分隔符，默认（'/'）
  parseValueFn: null // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
}
