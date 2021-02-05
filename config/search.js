export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  shape: 'round', // 搜索框形状 round || square
  background: '#f5f5f5', // 背景颜色（默认#f2f2f2）
  clearable: true, // 是否启用清除控件（默认true）
  clearIconStyle: {}, // 清除图标自定义样式
  focus: false, // 是否自动获得焦点（默认false）
  placeholder: '请输入搜索关键词', // 占位提示文字
  placeholderStyle: 'color: #cccccc;', // 指定 placeholder 的样式
  maxlength: -1, // 输入的最大字符数
  showAction: false, // 是否在搜索框右侧显示文字
  actionText: '取消', // 右侧显示文字
  actionStyle: {}, // 右侧显示文字样式
  inputAlign: 'left', // 输入框内容对齐方式，可选值为 left|center|right
  searchLabel: '', // 搜索框左侧文本
  searchLabelStyle: {}, // 搜索框左侧文本样式
  showSearchIcon: true, // 是否显示搜索icon
  searchIcon: 'search', // 输入框左边的图标，可以为icon名称或图片路径
  searchIconColor: '#333333', // 输入框左边的图标颜色
  searchIconStyle: {}, // 输入框左侧的图标自定义样式，对象形式（默认值：{}）
  searchIconPosition: 'left', // 搜索icon的位置
  disabled: false, // 是否禁用输入框
  inputStyle: {}, // 指定 input 的样式
  height: 58, // 输入框高度，单位默认rpx
  color: '#333333' // 输入框颜色
}
