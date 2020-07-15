export default {
  shape: 'round', // 搜索框形状 round || square
  background: '#f2f2f2', // 搜索框背景颜色（默认#f2f2f2）
  clearable: true, // 是否启用清除控件（默认true）
  clearTrigger: 'always', // 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
  focus: false, // 是否自动获得焦点（默认false）
  placeholder: '', // 占位提示文字
  placeholderStyle: {}, // 指定 placeholder 的样式
  maxlength: null, // 输入的最大字符数
  showAction: true, // 是否在搜索框右侧显示文字
  actionText: '取消', // 右侧显示文字
  actionStyle: {}, // 右侧显示文字样式
  inputAlign: 'left', // 'left' || 'center' || 'right'
  searchLabel: '', // 搜索框左侧文本
  searchIcon: 'search', // 输入框左边的图标，可以为icon名称或图片路径
  searchIconColor: '#333333', // 输入框左边的图标颜色
  disabled: false, // 是否禁用输入框
  value: '', // 输入框初始值
  height: '88rpx', // 输入框高度
  color: '#333333' // 输入框颜色
}
