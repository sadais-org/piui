import tool from '@sadais/piui-tool'

tool.expand = {
  getPropValue(inheritProp, prop) {
    if (inheritProp === null) return prop
    else if (inheritProp !== prop) return prop
    return inheritProp
  }
}

export default tool
