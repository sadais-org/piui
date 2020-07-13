/**
 * 动态import文件
 * @param {*} context require.context
 * @param {*} excludeIndexJs 是否排除index文件
 */
export const dynamicImport = (context, excludeIndex = true) => {
  const importFileMap = {}
  for (const key of context.keys()) {
    const keyArray = key.split('/')
    keyArray.shift() // 移除
    const name = keyArray
      .join('.')
      .replace(/\.js$/g, '')
      .replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
    if (excludeIndex && key === 'index') return
    importFileMap[name] = context(key)
  }
  return importFileMap
}

/**
 * 默认导出导入本目录下，排除index.js的所有js
 */
export default dynamicImport(require.context('./', false, /\.js$/))
