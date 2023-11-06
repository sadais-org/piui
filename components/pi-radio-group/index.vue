<template>
  <view
    class="pi-radio-group"
    :style="[customStyle]"
    :class="[
      shape,
      { stretch: stretch },
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

const TAG = 'PiRadioGroup'
const { radioGroup } = getConfig()

export default {
  name: 'PiRadioGroup',
  // 混入自定义样式customStyle和customClass
  mixins: [
    Emitter,
    ValueSync,
    // parentInit 混入子组件要继承的属性
    parentInit([
      'val',
      'shape',
      'borderRadius',
      'stretch',
      'border',
      'disabled',
      'size',
      'iconSize',
      'activeColor',
      'activeMode',
      'canCancel',
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
      validator: function(value) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    // 形状
    shape: {
      // 'round', 'square', 'dot', 'text', 'button'
      type: String,
      // ''
      default: radioGroup.shape,
      validator: function(value) {
        return ['', 'square', 'round', 'dot', 'text', 'button'].includes(value)
      }
    },
    // 当shape为square的时候，设置圆角，值为数字时，单位默认rpx
    borderRadius: {
      type: [null, String, Number],
      // 8
      default: radioGroup.borderRadius
    },
    // 当shape为button的时候，选项否均分布局，可选值 `true`
    stretch: {
      type: Boolean,
      // `false`
      default() {
        return radioGroup.stretch
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
      validator: function(value) {
        return ['', 'line', 'line-circle', 'fill', 'fill-circle'].includes(value)
      }
    },
    // 能否取消选中状态
    canCancel: {
      type: [Boolean, null],
      // null
      default: radioGroup.canCancel
    },
    // 是否点击图标才能选中，默认点击整行都能选中
    onlyIconSelect: {
      type: [Boolean, null],
      // null
      default: radioGroup.onlyIconSelect
    }
  },
  methods: {
    /**
     * @vuese
     * 用于给子子组件pi-radio调用，从而更新value
     * @arg pi-radio的name属性值
     */
    emitChange(childName) {
      let canCancel = this.canCancel
      if (!canCancel) {
        this._children.forEach(child => {
          if (child.name === childName) {
            canCancel = child.getCanCancel
          }
        })
      }
      if (canCancel && this.val === childName) {
        this.val = ''
      } else {
        this.val = childName
      }
      this.handleEmitChange()
      this.dispatch('PiForm', 'form-change', this.val)
      this.dispatch('PiFormItem', 'form-change', this.val)
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
    align-items: flex-start;
    ::v-deep .pi-radio-wrap {
      margin-bottom: 24rpx;
    }
  }

  &.text {
    /*  #ifndef  MP */
    ::v-deep .pi-radio-wrap {
      .radio-label.text {
        margin-right: 24rpx;
      }
    }
    /*  #endif  */
    /*  #ifdef  MP */
    ::v-deep pi-radio {
      /* stylint-disable */
      &:not(:last-child) {
        margin-right: 24rpx;
      }
    }
    /*  #endif  */
  }

  // 按钮样式
  &.button {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;

    /*  #ifndef  MP */
    ::v-deep .pi-radio-wrap {
      &:first-child .radio-label.button {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        box-shadow: none !important;
      }
      &:last-child .radio-label.button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
      &:not(:first-child) .radio-label.button {
        border-left-width: 0 !important;
      }
      &:not(:first-child):not(:last-child) .radio-label.button {
        border-radius: 0 !important;
      }
    }
    &.stretch {
      ::v-deep .pi-radio-wrap {
        flex: 1;
      }
    }

    /*  #endif  */

    /*  #ifdef  MP */

    ::v-deep pi-radio {
      /* stylint-disable */
      &:first-child .pi-radio-wrap .radio-label.button {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        box-shadow: none !important;
      }
      &:last-child .pi-radio-wrap .radio-label.button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
      &:not(:first-child) .pi-radio-wrap .radio-label.button {
        border-left-width: 0 !important;
      }
      &:not(:first-child):not(:last-child) .pi-radio-wrap .radio-label.button {
        border-radius: 0 !important;
      }
    }
    &.stretch {
      ::v-deep pi-radio {
        flex: 1;
        .pi-radio-wrap {
          width: 100%;
        }
      }
    }

    /*  #endif  */
  }

  &.horizontal:not(.button) {
    flex-direction: row;
    align-items: center;
  }
}
</style>
