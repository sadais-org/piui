<template>
  <view class="pi-collapse" :class="[customClass]" :style="[customStyle]">
    <pi-divider v-if="border" />
    <slot />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { collapse } = getConfig()
/**
 * collapse 折叠面板
 * @description 通过折叠面板收纳内容区域
 * @tutorial http://piui.sadais.com/docs/components/collapse.html
 * @event {Function}	change 		当前激活面板展开时触发(如果是手风琴模式，参数activeNames类型为String，否则为Array)
 * @example <pi-collapse />
 */
export default {
  name: 'PiCollapse',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 当前展开面板的name，非手风琴模式：[<string | number>]，手风琴模式：string | number
    value: {
      type: [String, Number, Array],
      default: collapse.value
    },
    // 是否手风琴模式
    accordion: {
      type: Boolean,
      // false
      default: collapse.accordion
    },
    // 是否显示外边框
    border: {
      type: Boolean,
      // true
      default: collapse.border
    },
    // 自定义折叠面板的样式类名
    customClass: {
      type: String,
      default: collapse.customClass
    },
    // 自定义折叠面板的样式
    customStyle: {
      type: Object,
      default: () => {
        return collapse.customStyle
      }
    }
  },
  computed: {
    needInit() {
      // 通过computed，同时监听accordion和value值的变化
      // 再通过watch去执行init()方法，进行再一次的初始化
      return [this.accordion, this.value]
    }
  },
  watch: {
    needInit: {
      deep: true,
      immediate: false,
      handler(value) {
        this.init()
      }
    },
    // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
    parentData() {
      if (this.children.length) {
        this.children.map(child => {
          // 判断子组件(pi-collapse-item)如果有updateParentData方法的话，就就执行(执行的结果是子组件重新从父组件拉取了最新的值)
          typeof child.updateParentData === 'function' && child.updateParentData()
        })
      }
    }
  },
  created() {
    this.children = []
  },
  methods: {
    // 重新初始化一次内部的所有子元素
    init() {
      console.log('折叠面板初始化')
      this.children &&
        this.children.map(child => {
          child.init()
        })
    },
    /**
     * collapse-item被点击时触发，由collapse统一处理各子组件的状态
     * @param {Object} target 被操作的面板的实例
     */
    onChange(target) {
      let changeArr = []
      this.children.map((child, index) => {
        // 如果是手风琴模式，将其他的折叠面板收起来
        if (this.accordion) {
          child.expanded = child === target ? !target.expanded : false
          child.setContentAnimate()
        } else {
          if (child === target) {
            child.expanded = !child.expanded
            child.setContentAnimate()
          }
        }
        // 拼接change事件中，数组元素的状态
        changeArr.push({
          // 如果没有定义name属性，则默认返回组件的index索引
          name: child.name || index,
          status: child.expanded ? 'open' : 'close'
        })
      })
      // 触发change事件
      this.val = changeArr
      this.handleEmitChange()
      this.$emit(target.expanded ? 'open' : 'close', target.name)
    }
  }
}
</script>

<style lang="scss" scoped></style>
