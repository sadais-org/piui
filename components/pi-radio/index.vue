<template>
  <view
    class="pi-radio-wrap"
    :style="[customStyle]"
    :class="[
      getShape,
      getActiveMode,
      { disabled: getDisable },
      { active: val },
      { stretch: getStretch },
      customClass
    ]"
  >
    <view
      v-if="!['text', 'button'].includes(getShape)"
      class="radio-icon"
      :style="[radioStyle]"
      @tap="handleRadioToggle(false)"
    >
      <view v-if="getShape === 'dot'" class="dot" />
      <pi-icon v-else name="blod-check" :size="getIconSize" />
    </view>
    <view
      v-if="$slots.default || $slots.$default"
      class="radio-label"
      :class="[getShape]"
      :style="[textStyle]"
      @tap="handleRadioToggle(true)"
    >
      <slot />
    </view>
  </view>
</template>

<script>
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiRadio'
const { radio } = getConfig()
const extendRadioGroup = childInit('PiRadioGroup')

// Radio组件
export default {
  name: 'PiRadio',
  // 混入自定义样式customStyle和customClass
  mixins: [extendRadioGroup],
  options: {
    styleIsolation: 'shared'
  },
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return radio.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return radio.customClass
      }
    },
    // radio组件的标示符
    name: {
      type: [String, Number],
      // ''
      default: radio.name
    },
    // 形状
    shape: {
      // 'square', 'round', 'dot', 'text', 'button'
      type: String,
      // 'round'
      default: radio.shape,
      validator: function(value) {
        return ['square', 'round', 'dot', 'text', 'button'].includes(value)
      }
    },
    // 当shape为square的时候，设置圆角，值为数字时，单位默认rpx
    borderRadius: {
      type: [String, Number],
      // 8
      default: radio.borderRadius
    },
    // 边框大小，传数字时，单位默认rpx
    border: {
      type: [String, Number],
      // 4
      default: radio.border
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      // false
      default: radio.disabled
    },
    // 是否只读模式
    readonly: {
      type: Boolean,
      // false
      default: radio.readonly
    },
    // radio大小，数字时，单位默认rpx
    size: {
      type: [String, Number],
      // 40
      default: radio.size
    },
    // radio icon 大小，数字时，单位默认rpx
    iconSize: {
      type: [String, Number],
      // 24
      default: radio.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: String,
      // ''
      default: radio.activeColor
    },
    // 激活模式
    activeMode: {
      // `'line'-线框模式` `line-circle - 线环模式（无中间打钩和圆点）` `'fill'-实底模式`
      type: String,
      // 'line'
      default: radio.activeMode,
      validator: function(value) {
        return ['line', 'line-circle', 'fill', 'fill-circle'].includes(value)
      }
    },
    // 能否取消选中状态
    canCancel: {
      type: Boolean,
      // false
      default: radio.canCancel
    },
    // 是否点击图标才能选中，默认点击整行都能选中
    onlyIconSelect: {
      type: [Boolean],
      // null
      default: radio.onlyIconSelect
    }
  },
  data() {
    return {}
  },
  computed: {
    val() {
      const radioGroupValue = this.inheritProps.val
      return radioGroupValue === this.name
    },
    getShape() {
      return this.inheritProps.shape || this.shape
    },
    getStretch() {
      return this.inheritProps.stretch
    },
    getBorderRadius() {
      return this.inheritProps.borderRadius
        ? this.$pi.common.addUnit(this.inheritProps.borderRadius)
        : this.$pi.common.addUnit(this.borderRadius)
    },
    getBorder() {
      return this.inheritProps.border
        ? this.$pi.common.addUnit(this.inheritProps.border)
        : this.$pi.common.addUnit(this.border)
    },
    getDisable() {
      return this.inheritProps.disabled || this.disabled
    },
    getActiveMode() {
      return this.inheritProps.activeMode || this.activeMode
    },
    getActiveColor() {
      return this.inheritProps.activeColor || this.activeColor
    },
    getSize() {
      return this.inheritProps.size
        ? this.$pi.common.addUnit(this.inheritProps.size)
        : this.$pi.common.addUnit(this.size)
    },
    getIconSize() {
      return this.inheritProps.iconSize
        ? this.$pi.common.addUnit(this.inheritProps.iconSize)
        : this.$pi.common.addUnit(this.iconSize)
    },
    getCanCancel() {
      return this.inheritProps.canCancel !== null ? this.inheritProps.canCancel : this.canCancel
    },
    getOnlyIconSelect() {
      return this.inheritProps.onlyIconSelect !== null
        ? this.inheritProps.onlyIconSelect
        : this.onlyIconSelect
    },
    radioStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize,
        borderRadius: this.getBorderRadius,
        borderWidth: this.getBorder
      }
      if (['round', 'dot'].includes(this.getShape)) {
        style.borderRadius = '50%'
      }
      if (this.getActiveColor && this.val) {
        style.borderColor = this.getActiveColor
        if (this.getActiveMode === 'line') {
          style.color = this.getActiveColor
        } else {
          style.backgroundColor = this.getActiveColor
        }
      }
      return style
    },
    textStyle() {
      const style = {
        borderRadius: this.getBorderRadius,
        borderWidth: this.getBorder
      }

      if (this.getActiveColor && this.val) {
        style.borderColor = this.getActiveColor
        if (['text', 'button'].includes(this.getShape) && this.getActiveMode === 'fill') {
          style.backgroundColor = this.getActiveColor
        } else {
          style.color = this.getActiveColor
        }
      }
      if (this.getShape === 'button' && this.getActiveMode === 'fill') {
        if (!this.val) {
          style.color = this.getActiveColor
        }
        style.borderColor = this.getActiveColor
      }
      if (this.getActiveColor && this.getShape === 'button' && this.val) {
        style.boxShadow = `-${this.getBorder} 0 0 0 ${this.getActiveColor}`
      }
      return style
    }
  },
  methods: {
    handleRadioToggle(isTapRow) {
      if (this.getOnlyIconSelect && isTapRow) return
      if (this.getDisable) return
      if (this.readonly) return
      this._parent && this._parent.emitChange(this.name)
    }
  }
}
</script>

<style lang="scss" scoped>
$disable-color: #c8c9cc;
$unactive-color: #cccccc;

.pi-radio-wrap {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .radio-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: $unactive-color;
    border: 4rpx solid $disable-color;
    transition: all $pi-animation-duration $pi-animation-timing-function;
    .dot {
      display: inline-flex;
      width: 50%;
      height: 50%;
      border-radius: 50%;
    }

    ::v-deep pi-icon {
      display: inline-flex;
    }
  }
  &.line-circle,
  &.fill-circle {
    .radio-icon {
      color: transparent;
    }
  }
  .radio-label {
    flex: 1;
    padding: 0 24rpx 0 16rpx;
    line-height: 1.5;
    word-wrap: break-word;
    transition: $pi-animation-duration $pi-animation-timing-function;
    transition-property: border, color, background-color;
    &.text {
      padding: 12rpx 24rpx;
      border-color: transparent;
      border-style: solid;
      background-color: #f5f5f5;
    }
    &.button {
      padding: 24rpx;

      line-height: 1;
      color: $unactive-color;
      border-color: transparent;
      border-style: solid;
    }
  }
  &.stretch {
    .radio-label {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 84rpx;
      padding: 0;
      text-align: center;
    }
  }
  &.disabled {
    cursor: not-allowed;
    .radio-icon {
      opacity: $pi-disabled-opacity;
    }
    .radio-label {
      color: $unactive-color;
    }
  }
  &.line {
    .radio-label.button {
      border-color: $unactive-color;
    }
  }
  &.fill {
    .radio-icon {
      color: #ffffff;
      background-color: $unactive-color;
      border-color: $unactive-color;
      .dot {
        background-color: #ffffff;
      }
    }
    .radio-label.text {
      color: #ffffff;
      background: $unactive-color;
    }
    .radio-label.button {
      color: $pi-primary-color;
      border-color: $pi-primary-color;
    }
  }
  &.active {
    .radio-label {
      color: $pi-primary-color;
      &.button {
        box-shadow: -4rpx 0 0 0 $pi-primary-color;
      }
    }
    &.line,
    &.line-circle {
      .radio-icon {
        color: $pi-primary-color;
        background-color: #ffffff;
        border-color: $pi-primary-color;
        .dot {
          background-color: $pi-primary-color;
        }
      }
      .radio-label.text {
        color: $pi-primary-color;
        border-color: $pi-primary-color;
      }
      .radio-label.button {
        color: $pi-primary-color;
        border-color: $pi-primary-color;
      }
    }
    &.fill,
    &.fill-circle {
      .radio-icon {
        color: #ffffff;
        background: $pi-primary-color;
        border-color: $pi-primary-color;
        .dot {
          background-color: #ffffff;
        }
      }
      .radio-label.text {
        color: #ffffff;
        background: $pi-primary-color;
      }
      .radio-label.button {
        color: #ffffff;
        background: $pi-primary-color;
      }
    }
  }
}
</style>
