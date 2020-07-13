import piTools from './tools'

const install = Vue => {
  console.log('piui 已安装')
  console.log('piui tools已挂载，使用方法：this.$piTools.', piTools)
  Vue.prototype.$piTools = piTools
}

export default install
