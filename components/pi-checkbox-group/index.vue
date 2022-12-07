<template>
  <view
    class="pi-checkbox-group"
    :style="[customStyle]"
    :class="[
      { horizontal: direction === 'horizontal' },
      { vertical: direction === 'vertical' },
      customClass
    ]"
  >
    <slot />
  </view>
</template>

<script>
import Emitter from '../../mixin/emitter'
import ValueSync from '../../mixin/value-sync'
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiCheckboxGroup'
const { checkboxGroup } = getConfig()

export default {
  name: 'PiCheckboxGroup',
  // 混入自定义样式customStyle和customClass
  mixins: [
    Emitter,
    ValueSync,
    parentInit([
      'value',
      'shape',
      'border',
      'disabled',
      'size',
      'iconSize',
      'activeColor',
      'activeMode',
      'onlyIconSelect'
    ])
  ], // 注入value与val，进行双向绑定
  options: {
    styleIsolation: 'shared'
  },
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return checkboxGroup.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return checkboxGroup.customClass
      }
    },
    // 最大可选数，0为无限制
    max: {
      type: [String, Number],
      // 0
      default: checkboxGroup.max
    },
    // 排列方向
    direction: {
      // `''` `'horizontal'` `'vertical'`
      type: String,
      // `''`
      default: checkboxGroup.direction,
      validator: function(value) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    // 形状
    shape: {
      // `'round'` `'square'` `'dot'` `'text'`
      type: String,
      // `''`
      default: checkboxGroup.shape,
      validator: function(value) {
        return ['', 'square', 'round', 'dot', 'text'].includes(value)
      }
    },
    // 边框大小，单位rpx
    border: {
      type: [String, Number],
      // 0
      default: checkboxGroup.border
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      // false
      default: checkboxGroup.disabled
    },
    // checkbox大小，单位rpx
    size: {
      type: [String, Number],
      // 0
      default: checkboxGroup.size
    },
    // checkbox icon 大小，单位rpx
    iconSize: {
      type: [String, Number],
      // 0
      default: checkboxGroup.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: [String],
      // ''
      default: checkboxGroup.activeColor
    },
    // 激活模式
    activeMode: {
      // `''` `'line'` `'fill'`
      type: [String],
      // `''`
      default: checkboxGroup.activeMode,
      validator: function(value) {
        return ['', 'line', 'line-circle', 'fill', 'fill-circle'].includes(value)
      }
    },
    // 是否点击图标才能选中，默认点击整行都能选中
    onlyIconSelect: {
      type: [Boolean, null],
      // null
      default: checkboxGroup.onlyIconSelect
    }
  },
  computed: {
    getMax() {
      return parseInt(this.max, 10)
    }
  },
  watch: {
    val: {
      handler(value) {
        this.handleValChange()
      }
    }
  },
  methods: {
    handleValChange() {
      // 同步checkbox子组件
      this._children.forEach(child => {
        // 对设置了name属性的checkbox才做同步
        if (child.name) {
          child.val = this.val.includes(child.name)
        }
      })
    },
    /**
     * @vuese
     * 切换选择值
     * @selected 是否勾选
     * @nodes 需要改变的节点，不填默认全部
     */
    toggleSelect(selected = true, nodes = []) {
      const toggleSelect = this._children.filter(child => {
        let toggleNode = true
        if (nodes.length) {
          toggleNode = child.name && nodes.includes(child.name)
        }
        return toggleNode && !child.disabled
      })
      if (!toggleSelect.length) return
      toggleSelect.forEach(child => {
        child.val = selected
        child.handleEmitChange()
      })
      this.emitChange()
    },
    emitChange() {
      const vals = []
      this._children.forEach(child => {
        console.log(child.val, child.name)
        if (child.val && !this.$pi.lang.isEmpty(child.name)) vals.push(child.name)
      })
      this.val = vals
      this.handleEmitChange()
      this.dispatch('PiForm', 'form-change', this.val)
      this.dispatch('PiFormItem', 'form-change', this.val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-checkbox-group {
  display: inline-flex;
  flex-wrap: wrap;
  &.vertical {
    flex-direction: column;
    align-items: flex-start;
    ::v-deep .pi-check-wrap,
    pi-checkbox {
      margin-bottom: 28rpx;
    }
  }

  &.horizontal {
    flex-direction: row;
    align-items: center;
  }
}
</style>
