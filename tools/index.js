import tool from '@sadais/piui-tool'

tool.expand = {
  /**
   * 获取属性值
   * @param {Object} inheritProp 继承属性
   * @param {Object} prop 属性
   * @returns 目标属性值
   */
  getPropValue(inheritProp, prop) {
    // 如果属性不存在，则返回继承属性值
    if (prop === null && inheritProp !== null) return inheritProp
    // 如果属性值和继承属性不一致，以属性值为准
    else if (inheritProp !== prop) return prop
    return inheritProp
  }
}

export default tool
