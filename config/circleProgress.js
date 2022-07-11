export default {
  percent:50,    // 环形进度条，限制0-100之间，数字形式，默认值：50
  bgColor:'#ffffff', // 环形进度区域背景色，字符串形式，默认值:'#ffffff'
  inactiveColor: '#ececec', // 环形进度条底色，字符串形式，默认值：'#ececec'
  activeColor: '#19be6b', // 环形进度条激活的颜色，字符串形式，默认值：'#19be6b'
  borderWidth:14, //环形进度条的线条宽度，字符串/数字形式，默认值：14
  width:200,//环形进度条整个圆的宽度，字符串/数字形式，默认值：200
  duration: 1500, // 整个圆环执行至进度条所需的时间，单位ms，字符串/数字形式，默认值：1500
  type:'',//环形进度条的主题
  fontSize:'16px',//环形进度条中间显示文字的大小，字符串形式，默认值：'16px'
  text:'',//环形进度条中间显示的文字，字符串形式，默认值：''
 linearGradient:{
  show:false,
  colorStop:[]
 }
}
