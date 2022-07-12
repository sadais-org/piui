import icon from './icon'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  items: [], // 选项列表，默认（[]）
  mode: 'dot', // 步骤条的类型，默认（'dot'）
  activeColor: '#5a7dff', // 激活步骤的颜色
  color: '#cccccc', // 未激活的颜色
  currentColor: '#666666', // 当前步骤的颜色
  direction: 'row', // 排列方向
  size: '24', // 图标大小
  itemStyle: {}, // 行样式（默认：'{}'）
  itemClass: '', // 行样式（默认：''）
  icon: {
    ...icon,
    size: 40
  } // 图标配置
}
