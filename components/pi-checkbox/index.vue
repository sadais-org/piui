<template>
  <view
    class="pi-check-wrap"
    :style="[customStyle]"
    :class="[getShape, getActiveMode, { disabled: getDisable }, { active: val }, customClass]"
    @tap="handleCheckboxToggle"
  >
    <view v-if="getShape !== 'text'" class="check-icon" :style="[checkStyle]">
      <view v-if="getShape === 'dot'" class="dot" />
      <pi-icon v-else name="blod-check" :size="getIconSize" />
    </view>
    <view class="check-label" :class="{ text: getShape === 'text' }" :style="[textStyle]">
      <!-- checkbox 内容 -->
      <slot />
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiCheckbox'
const { checkbox } = getConfig()
const extendCheckboxGroup = childInit('CheckboxGroup')

export default {
  name: 'Checkbox',
  mixins: [ValueSync, extendCheckboxGroup], // 注入value与val，进行双向绑定、混入自定义样式customStyle和customClass
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
      default() {
        // {}
        return checkbox.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return checkbox.customClass
      }
    },
    // checkbox组件的标示符
    name: {
      type: [String, Number],
      // -
      default: checkbox.name
    },
    // 形状
    shape: {
      // square || round || dot || text
      type: String,
      // round
      default: checkbox.shape,
      validator: function(value) {
        return ['square', 'round', 'dot', 'text'].includes(value)
      }
    },
    // 当shape为square的时候，设置圆角，单位rpx
    borderRadius: {
      type: [String, Number],
      // 8
      default: checkbox.borderRadius
    },
    // 边框大小，单位rpx
    border: {
      type: [String, Number],
      // 4
      default: checkbox.border
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      // false
      default: checkbox.disabled
    },
    // 是否只读模式
    readonly: {
      type: Boolean,
      // false
      default: checkbox.readonly
    },
    // checkbox大小，单位rpx
    size: {
      type: [String, Number],
      // 40
      default: checkbox.size
    },
    // checkbox icon 大小，单位rpx
    iconSize: {
      type: [String, Number],
      // 24
      default: checkbox.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: String,
      // ''
      default: checkbox.activeColor
    },
    // 激活模式
    activeMode: {
      // line: 线框模式，fill: 实底模式
      type: String,
      // 'line'
      default: checkbox.activeMode,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    }
  },
  data() {
    return {}
  },
  computed: {
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
    checkStyle() {
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const checkboxGroupValue = this.inheritProps.value
      if (checkboxGroupValue && checkboxGroupValue.includes(this.name)) {
        this.val = true
      }
    },
    handleCheckboxToggle() {
      if (this.getDisable) return
      if (this.readonly) return
      // 如果父组件做了可选数量限制
      if (!this.val && this._parent && this._parent.getMax > 0) {
        const max = this._parent.getMax
        const currentCount = this._parent._children.filter(c => c.val).length
        if (max === currentCount) return
      }
      this.val = !this.val
      this.handleEmitChange()
      this._parent && this._parent.emitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
$disable-color: #c8c9cc;
.pi-check-wrap {
  display: inline-flex;
  align-items: center;
  .check-icon {
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
  .check-label {
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
    .check-label.text {
      border-color: #cccccc;
    }
  }
  &.fill {
    .check-icon {
      color: #ffffff;
      background-color: #cccccc;
      border-color: #cccccc;
      .dot {
        background-color: #ffffff;
      }
    }
    .check-label.text {
      color: #ffffff;
      background: #cccccc;
    }
  }
  &.disabled {
    cursor: not-allowed;
    .check-icon {
      opacity: 0.4;
    }
    .check-label {
      color: #cccccc;
    }
  }
  &.active {
    &.line {
      .check-icon {
        color: $pi-primary-color;
        background-color: #ffffff;
        border-color: $pi-primary-color;
        .dot {
          background-color: $pi-primary-color;
        }
      }
      .check-label.text {
        color: $pi-primary-color;
        border-color: $pi-primary-color;
      }
    }
    &.fill {
      .check-icon {
        color: #ffffff;
        background: $pi-primary-color;
        border-color: $pi-primary-color;
        .dot {
          background-color: #ffffff;
        }
      }
      .check-label.text {
        color: #ffffff;
        background: $pi-primary-color;
      }
    }
  }
}
</style>
