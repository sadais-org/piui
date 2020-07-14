import piTools from './tools'
import { getConfig, setConfig } from './config'

const install = (Vue, config = {}) => {
  const piConfig = piTools.object.mergeDeep(getConfig(), config)
  setConfig(piConfig)
  console.log('piui 已安装，使用配置为：', piConfig)
  console.log('piui tools已挂载，使用方法：this.$piTools.', piTools)
  Vue.prototype.$piConfig = piConfig
  Vue.prototype.$piTools = piTools
}

export default install
