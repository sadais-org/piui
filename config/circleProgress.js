export default {
  percent: 50, // 环形进度条，限制0-100之间，数字形式，默认值：50
  bgColor: '', // 环形进度区域背景色，字符串形式，默认值:'#ffffff'
  inactiveColor: '', // 环形进度条底色，字符串形式，默认值：'#ececec'
  activeColor: '', // 环形进度条激活的颜色，字符串形式，默认值：'#19be6b'
  borderWidth: 14, // 环形进度条的线条宽度，字符串/数字形式，默认值：14
  width: 200, // 环形进度条整个圆的宽度，字符串/数字形式，默认值：200
  duration: 1500, // 整个圆环执行至进度条所需的时间，单位ms，字符串/数字形式，默认值：1500
  type: 'success', // 环形进度条的主题 'success', 'error', 'info', 'primary', 'warning'
  // 主题列表
  typeList: {
    success: { bgColor: '#ffffff', activeColor: '#67c23a', inactiveColor: '#ececec' },
    error: { bgColor: '#fef0f0', activeColor: '#f56c6c', inactiveColor: '#fbc4c4' },
    info: { bgColor: '#f4f4f5', activeColor: '#909399', inactiveColor: '#ececec' },
    primary: { bgColor: '#ecf5ff', activeColor: '#409eff', inactiveColor: '#b3d8ff' },
    warning: { bgColor: '#fdf6ec', activeColor: '#e6a23c', inactiveColor: '#f5dab1' }
  },
  fontSize: '16px', // 环形进度条中间显示文字的大小，字符串形式，默认值：'16px'
  text: '' // 环形进度条中间显示的文字，字符串形式，默认值：''
}
