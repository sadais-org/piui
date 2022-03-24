export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  width: '', // 按钮宽度，不设置默认自动撑开，如果需要占满一行，填写’100%‘
  size: 'default', // 按钮尺寸，default，large medium small tiny mini
  type: 'default', // 按钮的预置样式，`'default'` `'primary'` `'warn'` `'secondary'` `'line'` `text`（默认值：'default'）
  plain: false, // 按钮是否镂空（默认值：false）
  disabled: false, // 是否禁止状态（默认值：false）
  loading: false, // 是否加载中（默认值：false）
  formType: '', // 取值为submit（提交表单），reset（重置表单）（默认值：''）
  openType: '', // 开放能力，具体请看uniapp稳定关于button组件部分说明（默认值：''）
  hoverClass: 'button-hover', // 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果，默认（button-hover）
  hoverStartTime: 10, // 按住后多久出现点击态，单位毫秒（默认值：10）
  hoverStayTime: 100, // 手指松开后点击态保留时间，单位毫秒（默认值：100）
  appParameter: '', // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效（默认值：''）
  hoverStopPropagation: false, // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效（默认值：false）
  lang: 'en', // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效（默认值：'en'）
  sessionFrom: '', // 会话来源，open-type="contact"时有效。只微信小程序有效（默认值：''）
  sendMessageTitle: '', // 会话内消息卡片标题，open-type="contact"时有效（默认值：''）
  sendMessagePath: '', // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效（默认值：''）
  sendMessageImg: '', // 会话内消息卡片图片，open-type="contact"时有效（默认值：''）
  showMessageCard: false, // 用户点击后可以快速发送小程序消息，open-type="contact"时有效（默认值：'false'）
  color: '', // 自定义颜色按钮（type为default，可自定义设置）
  bgColor: '', // 自定义背景色按钮（type为default，可自定义设置）
  round: false, // 按钮是否椭圆（默认值：false）
  ripple: true, // 是否开启水波纹效果（默认值：true）
  rippleBgColor: '', // 水波纹的背景颜色（默认值：''）
  debounceTimeout: 50 // 按钮防抖默认延时50
}
