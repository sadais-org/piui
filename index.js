import tools from './tools'
import { getConfig, setConfig } from './config'

const logStyle = 'color:#ff6a00;font-size:20px;font-weight:500;'

const install = function(Vue, config = {}) {
  const piConfig = this.lang.mergeDeep(getConfig(), config)
  setConfig(piConfig)
  Vue.prototype.$piConfig = piConfig
  Vue.prototype.$pi = this
  Vue.prototype.$uni = this.uni // 统一uniapi调用入口
  Vue.prototype.$toast = this.toast.info
  Vue.prototype.$loading = this.toast.loading
  Vue.prototype.$hideLoading = this.toast.hideLoading

  // #ifdef  H5
  const setVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  window.addEventListener('load', setVh)
  window.addEventListener('resize', setVh)
  // #endif

  console.log('%c欢迎使用piui，官网地址：https://www.sadais.com', logStyle)
  console.log('%cpiui 已安装，使用配置为：', logStyle, piConfig)
  console.log('%cpiui tools 已挂载：', logStyle, this)
  console.log('%cpiui tools 模板使用方法 {{ $pi.xxx }}', logStyle)
  console.log('%cpiui tools js使用方法：this.$pi.xxx', logStyle)
}

export default {
  ...tools,
  install
}
