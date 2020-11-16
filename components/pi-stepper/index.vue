<template>
  <view class="pi-stepper" :style="[customStyle]" :class="[customClass, { disabled }, theme]">
    <view class="pi-stepper-icon pi-icon-subtract" :style="[iconStyle]" @tap="handleChange(-1)" />
    <input
      :value="val"
      type="digit"
      class="step-input"
      :disabled="disabled || disableInput"
      :style="[inputStyle, { width: getInputWidth }]"
      @input="handleInputChange"
    />
    <view class="pi-stepper-icon pi-icon-add" :style="[iconStyle]" @tap="handleChange(1)" />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { stepper } = getConfig()

const TAG = 'PiStepper'

export default {
  name: 'Stepper',
  // 混入v-model
  mixins: [ValueSync],
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
        return stepper.customStyle
      }
    },
    // 自定义输入样式，对象形式（默认值：{}）
    inputStyle: {
      type: Object,
      // {}
      default() {
        return stepper.inputStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return stepper.customClass
      }
    },
    // 最小值
    min: {
      type: Number,
      // 1
      default() {
        return stepper.min
      }
    },
    // 最大值
    max: {
      type: Number,
      // -
      default() {
        return stepper.max
      }
    },
    // 步长，每次点击时改变的值
    step: {
      type: Number,
      // 1
      default() {
        return stepper.step
      }
    },
    // 输入框宽度，默认单位为rpx
    inputWidth: {
      type: [String, Number],
      // 64
      default() {
        return stepper.inputWidth
      }
    },
    // 按钮大小
    buttonSize: {
      type: [String, Number],
      // 32
      default() {
        return stepper.buttonSize
      }
    },
    // 按钮颜色
    buttonColor: {
      type: [String, Number],
      // -
      default() {
        return stepper.buttonColor
      }
    },
    // 小数位
    decimal: {
      type: Number,
      // 0
      default() {
        return stepper.decimal
      }
    },
    // 形状
    shape: {
      // round || square
      type: String,
      // round
      default: stepper.shape,
      validator: function(value) {
        return ['square', 'round'].includes(value)
      }
    },
    // 主题模式
    theme: {
      // line: 线框模式，fill: 实底模式
      type: String,
      // 'line'
      default: stepper.theme,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    },
    // 是否只允许输入整数
    integer: {
      type: Boolean,
      // false
      default() {
        return stepper.integer
      }
    },
    // 是否显示增加按钮
    showAdd: {
      type: Boolean,
      // true
      default() {
        return stepper.showAdd
      }
    },
    // 是否显示减少按钮
    showSubtract: {
      type: Boolean,
      // false
      default() {
        return stepper.showSubtract
      }
    },
    // 是否禁用步进器
    disabled: {
      type: Boolean,
      // false
      default() {
        return stepper.disabled
      }
    },
    // 是否禁用增加按钮
    disableAdd: {
      type: Boolean,
      // false
      default() {
        return stepper.disableAdd
      }
    },
    // 是否禁用减少按钮
    disableSubtract: {
      type: Boolean,
      // false
      default() {
        return stepper.disableSubtract
      }
    },
    // 是否禁用输入框
    disableInput: {
      type: Boolean,
      // true
      default() {
        return stepper.disableInput
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    getInputWidth() {
      return this.$pi.common.addUnit(this.inputWidth)
    },
    getButtonSize() {
      return this.$pi.common.addUnit(this.buttonSize)
    },
    iconStyle() {
      const style = {
        width: this.getButtonSize,
        height: this.getButtonSize,
        fontSize: this.getButtonSize
      }
      if (this.buttonColor) {
        if (this.theme === 'line') {
          style.color = this.buttonColor
          style.borderColor = this.buttonColor
        } else {
          style.backgroundColor = this.buttonColor
        }
      }
      if (this.shape === 'square') {
        style.borderRadius = '8rpx'
      }
      return style
    }
  },
  methods: {
    handleChange(range) {
      if (this.disabled) return
      const val = this.val + range * this.step
      if (range === 1 && this.max !== null && val > this.max) return
      if (range === -1 && this.min !== null && val < this.min) return
      this.val = val
      this.handleEmitChange()
    },
    handleInputChange(e) {
      setTimeout(() => {
        const val = e.detail.value
        if (!this.$pi.validate.isNumerical(val)) {
          this.val = val.replace(/[^0-9]/gi, '')
        } else {
          this.val = val
        }
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-stepper {
  display: inline-flex;
  align-items: center;

  .step-input {
    text-align: center;
  }
  .pi-stepper-icon {
    color: $pi-primary-color;
    border: 2rpx solid $pi-primary-color;
    border-radius: 50000px;
    &::before {
      transform: scale(0.8);
    }
  }
  &.disabled {
    opacity: 0.4;
  }
  &.fill {
    .pi-stepper-icon {
      color: #ffffff;
      background: $pi-primary-color;
    }
  }
}
</style>
