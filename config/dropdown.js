import mask from './mask'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {
    height: '80rpx'
  }, // 自定义样式，对象形式（默认值：{}）
  halfline: true, // 是否使用0.5px线
  contentStyle: {}, // 内容自定义样式
  mask, // 弹窗蒙层的配置，默认选项请参照mask
  activeColor: '#f90' // 默认选中色
}
