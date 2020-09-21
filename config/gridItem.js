export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  col: 5, // 一行几列（平分宽度）
  square: false, // 宫格是否以正方形撑开
  border: true, // 是否显示边框（边框宽度，颜色通过scss变量声明，如需单独定制，请使用::v-deep）
  gap: 0, // 宫格之间间隔，（默认：0）
  bgColor: '', // 宫格背景色
  hoverClass: 'pi-hover-class', // 宫格按压时的样式类，"none"为无效果
  hoverStartTime: 10, // 按住后多久出现点击态，单位毫秒
  hoverStayTime: 100 // 手指松开后点击态保留时间，单位毫秒
}
