<template>
  <view
    class="pi-radio-wrap"
    :style="[customStyle]"
    :class="[getShape, getActiveMode, { disabled: getDisable }, { active: val }, customClass]"
    @tap="handleRadioToggle"
  >
    <view v-if="getShape !== 'text'" class="radio-icon" :style="[radioStyle]">
      <view v-if="getShape === 'dot'" class="dot" />
      <pi-icon v-else name="blod-check" :size="getIconSize" />
    </view>
    <view class="radio-label" :class="{ text: getShape === 'text' }" :style="[textStyle]">
      <slot />
    </view>
  </view>
</template>

<script>
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiRadio'
const { radio } = getConfig()
const extendRadioGroup = childInit('RadioGroup')

// Radio组件
export default {
  name: 'Radio',
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
      // 'square', 'round', 'dot', 'text'
      type: String,
      // 'round'
      default: radio.shape,
      validator: function(value) {
        return ['square', 'round', 'dot', 'text'].includes(value)
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
      // line: 线框模式，fill: 实底模式
      type: String,
      // 'line'
      default: radio.activeMode,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
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
    getBorderRadius() {
      return this._parent && this._parent.borderRadius
        ? this.$pi.common.addUnit(this._parent.borderRadius)
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
        if (this.getShape === 'text' && this.getActiveMode === 'line') {
          style.color = this.getActiveColor
        }
        if (this.getShape === 'text' && this.getActiveMode === 'fill') {
          style.backgroundColor = this.getActiveColor
        }
      }
      return style
    }
  },
  methods: {
    handleRadioToggle() {
      if (this.getDisable) return
      if (this.readonly) return
      this._parent && this._parent.emitChange(this.name)
    }
  }
}
</script>

<style lang="scss" scoped>
$disable-color: #c8c9cc;
.pi-radio-wrap {
  display: inline-flex;
  align-items: center;
  .radio-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: #cccccc;
    border: 4rpx solid $disable-color;
    transition: all $pi-animation-duration $pi-animation-timing-function;
    .dot {
      display: inline-flex;
      width: 50%;
      height: 50%;
      border-radius: 50%;
    }

    /deep/ pi-icon {
      display: inline-flex;
    }
  }
  .radio-label {
    margin-left: 16rpx;
    word-wrap: break-word;
    transition: $pi-animation-duration $pi-animation-timing-function;
    transition-property: border, color, background-color;
    &.text {
      padding: 12rpx 24rpx;
      margin-left: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
  &.line {
    .radio-label.text {
      border-color: #cccccc;
    }
  }
  &.fill {
    .radio-icon {
      color: #ffffff;
      background-color: #cccccc;
      border-color: #cccccc;
      .dot {
        background-color: #ffffff;
      }
    }
    .radio-label.text {
      color: #ffffff;
      background: #cccccc;
    }
  }
  &.disabled {
    cursor: not-allowed;
    .radio-icon {
      opacity: 0.4;
    }
    .radio-label {
      color: #cccccc;
    }
  }
  &.active {
    &.line {
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
    }
    &.fill {
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
    }
  }
}
</style>
