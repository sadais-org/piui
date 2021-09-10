export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  value: false, // 是否显示骨架屏
  animation: true, // 是否显示加载动画
  containerSkeletonSelector: '.pi-skeleton', // 骨架容器选择器
  rectSkeletonSelector: '.pi-skeleton-rect', // 矩形骨架选择器
  circleSkeletonSelector: '.pi-skeleton-circle', // 圆形骨架选择器
  roundSkeletonSelector: '.pi-skeleton-round', // 圆角骨架选择器
  background: '#ffffff', // 容器背景颜色
  nodeBackground: '#f5f5f5', // 骨架背景颜色
  borderRadius: 12 // round 圆角骨架的圆角大小
}
