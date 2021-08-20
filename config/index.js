import { dynamicImport } from '@sadais/piui-tool/tools/common'

/**
 * 配置各组件默认属性，可以在install中进行覆盖，达到全局配置的效果
 */

let config = dynamicImport(require.context('./', false, /\.js$/))

/**
 * 获取配置
 */
export const getConfig = () => {
  return config
}

/**
 * 设置配置（piui install 的时候，会注入config merge一次）
 * @param {Object} updateConfig 配置
 */
export const setConfig = updateConfig => {
  config = updateConfig
  return config
}

export default {
  getConfig,
  setConfig
}
