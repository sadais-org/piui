/**
 * 根据组件名称获取父级组件
 * @param componentScope 当前组件scope
 * @param componentName 组件名称
 * @returns {*|{$options}} 父级组件 | undefined
 */
export default function parent(componentScope, componentName) {
  let parent = componentScope.$parent
  while (parent && componentName) {
    if (parent.$options && parent.$options.name !== componentName) {
      parent = parent.$parent
    } else {
      return parent
    }
  }
  return parent
}
