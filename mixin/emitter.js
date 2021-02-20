/**
 * 广播
 * @desc 向下广播
 * @param {String} componentName 组件名
 * @param {String} eventName 事件名
 * @param {Object} params 参数
 */
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.componentName
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}

/**
 * 发布订阅
 * 该组件参考 https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js
 * 鸣谢 element团队
 */
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
