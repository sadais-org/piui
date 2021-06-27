import tools from './tools'
import { getConfig, setConfig } from './config'

const logStyle = 'color:#ff6a00;'

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

  // app 防止日志输出过多，禁用日志
  // #ifndef APP-PLUS
  console.group && console.group('piui')

  console.log('%cpiui 已安装，教程：https://github.com/sadais-org/piui', logStyle)
  console.log('%cpiui 组件全局配置：', logStyle, piConfig)
  console.log('%cpiui tools 已挂载：', logStyle, this)

  console.groupEnd && console.groupEnd('piui')
  // #endif
}

export default {
  ...tools,
  install
}
