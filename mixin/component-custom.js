/**
 * 根据配置创建自定义样式
 * @param {*} config 配置
 */
export const createCustomPropsByConfig = config => {
  return {
    props: {
      // 自定义样式，对象形式（默认值：{}）
      customStyle: {
        type: Object,
        default() {
          return config.customStyle
        }
      },
      // 自定义样式类，字符串形式（''）
      customClass: {
        type: String,
        default() {
          return config.customClass
        }
      }
    }
  }
}
