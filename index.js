import tools from './tools'
import { getConfig, setConfig } from './config'

const logStyle = 'color:#ff6a00;'

const install = function(Vue, config = {}) {
  const piConfig = tools.lang.mergeDeep(getConfig(), config)
  setConfig(piConfig)
  Vue.prototype.$piConfig = piConfig
  Vue.prototype.$pi = tools
  Vue.prototype.$uni = tools.uni // 统一uniapi调用入口
  Vue.prototype.$toast = tools.toast.info
  Vue.prototype.$loading = tools.toast.loading
  Vue.prototype.$hideLoading = tools.toast.hideLoading

  // #ifdef  H5
  // 方便调试，把$pi挂载到window上
  window.$pi = tools
  // h5环境 解决vh高度兼容性问题
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

  console.log('%cpiui 已安装，教程：https://piui.sadais.com/docs/components/Config.html', logStyle)
  console.log('%cpiui 组件全局配置：', logStyle, piConfig)
  console.log('%cpiui tools 已挂载，使用方式 this.$pi.xxx：', logStyle, tools)

  console.groupEnd && console.groupEnd('piui')
  // #endif
}

export default install
