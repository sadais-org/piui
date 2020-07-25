export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  src: '', // 图片地址（默认值：''）
  mode: 'widthFix', // 裁剪模式（默认值：'widthFix'）
  width: '100%', // 宽度（默认值：'100%'）
  height: 'auto', // 高度（默认值：'auto'）
  shape: 'square', // 图片形状，circle-圆形，square-方形（默认值：'square'）
  borderRadius: 8, // shape为square的时候设置（默认值：'8rpx'）
  lazyLoad: true, // 是否懒加载（默认值：'true'）
  showMenuByLongpress: true, // 开启长按图片显示识别微信小程序码菜单（默认值：'true'）
  showLoading: true, // 是否显示加载中的图标或者自定义的slot（默认值：'true'）
  loadingColor: '#c1c1c1', // 加载中颜色（默认值：'#c1c1c1'）
  loadingType: 'spinner', // 类型： spinner 菊花 circle 圆环（默认值：'spinner'）
  loadingSize: 32, // 尺寸，默认32rpx
  showError: true, // 是否显示加载中的图标或者自定义的slot（默认值：true）
  webp: false // 默认不解析 webP 格式，只支持网络资源（默认值：false）
}
