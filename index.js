import piTools from './tools'
import { getConfig, setConfig } from './config'

const logStyle = 'color:#ff6a00;font-size:20px;font-weight:500;'

const install = (Vue, config = {}) => {
  const piConfig = piTools.lang.mergeDeep(getConfig(), config)
  setConfig(piConfig)
  console.log('%c欢迎使用piui，官网地址：https://www.sadais.com', logStyle)
  console.log('%cpiui 已安装，使用配置为：', logStyle, piConfig)
  console.log('%cpiui tools 已挂载：', logStyle, piTools)
  console.log('%cpiui tools 模板使用方法 {{ $pi.xxx }}', logStyle)
  console.log('%cpiui tools js使用方法：this.$pi.xxx', logStyle)
  Vue.prototype.$piConfig = piConfig
  Vue.prototype.$pi = piTools
  Vue.prototype.$toast = piTools.toast.info
  Vue.prototype.$loading = piTools.toast.loading
  Vue.prototype.$hideLoading = piTools.toast.hideLoading
}

export default install
