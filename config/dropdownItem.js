import icon from './icon'
import img from './img'
import checkbox from './checkbox'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  showIcon: false, // 是否显示图标，默认值 false
  iconOption: {
    ...icon,
    size: 36
  }, // 图标配置
  title: '',
  disabled: false, // 是否禁用
  option: [], // 选项列表，默认（[]）
  itemHeight: 110, // 行高（默认：'110rpx'）
  keyField: 'id', // 选项id字段，默认为id
  displayField: 'text', // 选项显示字段，默认为text
  disabledField: 'disabled', // 选项禁用字段，默认为disabled
  selectedImg: img, // 选中图标的配置
  selectedCheckbox: {
    ...checkbox,
    shape: 'round',
    activeMode: 'fill-circle'
  } // 选中复选框配置
}
