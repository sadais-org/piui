export default {
  type: 'primary', // 标签类型info、primary、success、warning、error （默认 'primary' ）
  disabled: false, // {Boolean | String} 不可用（默认 false ）
  size: 'medium', // 标签的大小，large，medium，mini （默认 'medium' ）
  shape: 'square', // tag的形状，circle（两边半圆形）, square（方形，带圆角）（默认 'square' ）
  text: '', // {String | Number} 标签的文字内容
  bgColor: '', // 背景颜色，默认为空字符串，即不处理
  color: '', // 标签字体颜色，默认为空字符串，即不处理
  borderColor: '', // 镂空形式标签的边框颜色
  closeColor: '#C6C7CB', // 关闭按钮图标的颜色（默认 #C6C7CB）
  name: '', // {String | Number} 点击时返回的索引值，用于区分遍历的数组哪个元素被点击了
  plainFill: false, // 镂空时是否填充背景色（默认 false ）
  plain: false, // 是否镂空（默认 false ）
  closable: false, // 是否可关闭，设置为true，文字右边会出现一个关闭图标（默认 false ）
  show: true, // 是否显示，设置为true
  icon: '', // 内置图标，或绝对路径的图片
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  tagWrapperClass: '', // 标签容器 自定义样式类，字符串形式（''）
  tagWrapperStyle: {} // 标签容器 自定义样式，对象形式（默认值：{}）
}
