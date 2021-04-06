<template>
  <view
    class="pi-radio-group"
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
import ValueSync from '../../mixin/value-sync'
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiRadioGroup'
const { radioGroup } = getConfig()

export default {
  name: TAG,
  // 混入自定义样式customStyle和customClass
  mixins: [
    ValueSync,
    // parentInit 混入子组件要继承的属性
    parentInit([
      'val',
      'shape',
      'border',
      'disabled',
      'size',
      'iconSize',
      'activeColor',
      'activeMode'
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
        return radioGroup.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return radioGroup.customClass
      }
    },
    // 最大可选数，0为无限制
    max: {
      type: [String, Number],
      // 0
      default: radioGroup.max
    },
    // 排列方向
    direction: {
      // '', horizontal', 'vertical'
      type: String,
      // ''
      default: radioGroup.direction,
      validator: function (value) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    // 形状
    shape: {
      // 'round', 'square', 'dot', 'text'
      type: String,
      // ''
      default: radioGroup.shape,
      validator: function (value) {
        return ['', 'square', 'round', 'dot', 'text'].includes(value)
      }
    },
    // 边框大小，单位rpx
    border: {
      type: [String, Number],
      // 0
      default: radioGroup.border
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      // false
      default: radioGroup.disabled
    },
    // radio大小，单位rpx
    size: {
      type: [String, Number],
      // 0
      default: radioGroup.size
    },
    // radio icon 大小，单位rpx
    iconSize: {
      type: [String, Number],
      // 0
      default: radioGroup.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: [String],
      // ''
      default: radioGroup.activeColor
    },
    // 激活模式
    activeMode: {
      // '', 'line', 'fill'
      type: [String],
      // 'line'
      default: radioGroup.activeMode,
      validator: function (value) {
        return ['', 'line', 'fill'].includes(value)
      }
    }
  },
  methods: {
    /**
     * @vuese
     * 用于给子子组件pi-radio调用，从而更新value
     * @arg pi-radio的name属性值
     */
    emitChange(childName) {
      this.val = childName
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;

  &.vertical {
    flex-direction: column;
    /deep/ .pi-radio-wrap,
    pi-radio {
      margin-bottom: 28rpx;
    }
  }

  &.horizontal {
    flex-direction: row;
    align-items: center;
    /deep/ .pi-radio-wrap:not(:last-child) {
      margin-right: 28rpx;
    }
    // 兼容小程序
    /deep/ pi-radio:not(:last-child) {
      margin-right: 28rpx;
    }
  }
}
</style>
