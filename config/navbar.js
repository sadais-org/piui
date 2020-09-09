export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '', // 标题
  titleStyle: { fontSize: '36rpx', fontWeight: 500, color: '#333333' }, // 标题样式
  height: '44px', // 导航栏高度
  fixed: true, // 导航栏是否固定在顶部
  placeholder: true, // 固定在顶部时，是否在标签位置生成一个等高的占位元素
  borderBottom: true, // 是否显示导航栏的下边框
  statusBarBackground: 'transparent', // 状态栏的背景色
  background: '#ffffff', // 背景颜色（默认白色）
  showBack: true, // 是否显示后退按钮
  showHome: false, // 是否显示主页按钮
  backIconColor: '#333333', // 返回箭头的颜色
  backIconName: 'back', // 左边返回的图标名称
  backIconSize: '32rpx', // 左边返回图标的大小
  backIconPadding: '24rpx 12rpx 24rpx 24rpx', // 左边返回图标的padding
  backText: '', // 返回的文字提示
  backTextStyle: { color: '#333333' }, // 返回的文字的 样式
  homeIconColor: '#333333', // 主页icon的颜色
  homeIconName: 'homefill', // 主页icon的图标名称
  homeIconSize: '36rpx', // 主页icon图标的大小
  homeIconPadding: '24rpx 12rpx 24rpx 24rpx', // 主页icon图标的padding
  homePage: '', // 主页路径
  homePageMethod: 'switchTab', // 跳转主页方法 navigateTo redirectTo switchTab reLaunch
  zIndex: 99 // 元素 z-index
}
