export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  title: '', // 标题
  titleStyle: { fontSize: '36rpx', fontWeight: 500, color: '#333333' }, // 标题样式
  height: '44px', // 导航栏高度
  throughTitleWidth: 'auto', // 贯穿布局title宽度，auto：自动撑开
  fixed: true, // 导航栏是否固定在顶部
  placeholder: true, // 固定在顶部时，是否在标签位置生成一个等高的占位元素
  borderBottom: true, // 是否显示导航栏的下边框
  statusBarBackground: '#ffffff', // 状态栏的背景色
  background: '#ffffff', // 背景颜色（默认白色）
  showBack: null, // 是否显示后退按钮，默认不设置，根据当前页面堆栈自动判断
  showHome: false, // 是否显示主页按钮
  capsuleButton: true, // 在微信小程序中，当showBack和showHome同时显示的时候，以胶囊按钮样式显示
  capsuleTheme: 'light', // 胶囊按钮主题， light or dark
  backIconColor: '#333333', // 返回箭头的颜色
  backIconName: 'back', // 左边返回的图标名称
  backIconSize: '36rpx', // 左边返回图标的大小
  backIconPadding: '10rpx 24rpx', // 左边返回图标的padding
  backText: '', // 返回的文字提示
  backTextStyle: { color: '#333333' }, // 返回的文字的 样式
  customBackFunc: false, // 是否自定义返回函数
  homeIconColor: '#333333', // 主页icon的颜色
  homeIconName: 'homefill', // 主页icon的图标名称
  homeIconSize: '36rpx', // 主页icon图标的大小
  homeIconPadding: '10rpx 24rpx', // 主页icon图标的padding
  homePage: '', // 主页路径
  homePageMethod: 'switchTab', // 跳转主页方法 navigateTo redirectTo switchTab reLaunch
  customHomeFunc: false, // 是否自定义返回函数
  zIndex: 99 // 元素 z-index
}
