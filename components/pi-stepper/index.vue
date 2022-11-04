<template>
  <view
    class="pi-stepper"
    :style="[customStyle]"
    :class="[customClass, theme, shape, { disabled }]"
  >
    <view
      v-if="showAdd"
      class="pi-stepper-icon pi-icon-subtract"
      :class="[{ disabled: disableSubtract }]"
      hover-class="pi-hover-class"
      :hover-start-time="10"
      :hover-stay-time="100"
      :style="[iconStyle]"
      @tap="handleChange(-1)"
    />
    <input
      :value="value"
      type="digit"
      class="step-input"
      :disabled="disabled || disableInput"
      :style="[inputStyle, { width: getInputWidth }]"
      @input="handleInputChange"
    />
    <view
      v-if="showSubtract"
      class="pi-stepper-icon pi-icon-add"
      :class="[{ disabled: disableAdd }]"
      hover-class="pi-hover-class"
      :hover-start-time="10"
      :hover-stay-time="100"
      :style="[iconStyle]"
      @tap="handleChange(1)"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { stepper } = getConfig()

const TAG = 'PiStepper'

export default {
  name: 'PiStepper',
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
      // round, square
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
    disableAdd() {
      return this.max !== null && this.val >= this.max
    },
    disableSubtract() {
      return this.min !== null && this.val <= this.min
    },
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
        lineHeight: this.getButtonSize,
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
      return style
    }
  },
  methods: {
    // 点击减少按钮时触发
    minus() {
      this.computeVal('minus')
    },
    // 点击增加按钮时触发
    plus() {
      this.computeVal('plus')
    },
    // 为了保证小数相加出现精度溢出的问题
    numAdd(num1, num2) {
      let baseNum, baseNum1, baseNum2
      try {
        baseNum1 = num1.toString().split('.')[1].length
      } catch (e) {
        baseNum1 = 0
      }
      try {
        baseNum2 = num2.toString().split('.')[1].length
      } catch (e) {
        baseNum2 = 0
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
      let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2 // 精度
      return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision)
    },
    // 为了保证小数相减出现精度溢出的问题
    numSub(num1, num2) {
      let baseNum, baseNum1, baseNum2
      try {
        baseNum1 = num1.toString().split('.')[1].length
      } catch (e) {
        baseNum1 = 0
      }
      try {
        baseNum2 = num2.toString().split('.')[1].length
      } catch (e) {
        baseNum2 = 0
      }
      baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
      let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
      return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
    },
    computeVal(type) {
      if (this.disabled) return
      let value = 0
      // 减
      if (type === 'minus') {
        // this.value 当前值  this.step 增加步长后的值
        value = this.numSub(this.value, this.step)
      } else if (type === 'plus') {
        value = this.numAdd(this.value, this.step)
      }
      // 判断是否小于最小值和大于最大值
      if (value < this.min || value > this.max) {
        return
      }
      // this.inputVal = value
    },
    handleChange(range) {
      if (this.disabled) return
      // 增加/减少步长后的值
      // let val = this.val + range * this.step
      let val = range === 1 ? this.numAdd(this.val, this.step) : this.numSub(this.val, this.step)
      if (this.max !== null && val > this.max) {
        val = this.max
      }
      if (this.min !== null && val < this.min) {
        val = this.min
      }
      this.handleInputChange({ detail: { value: `${val}` } })
    },
    handleInputChange(e) {
      const val = e.detail.value
      const reg = /^(\d+)(\.)?(?:(.+)$)?/
      const result = val.match(reg)
      const decimal = this.decimal
      if (!result) {
        // 说明开头就不是数字 直接初始化为0
        this.val = this.min != null ? this.min : 0
        this.handleEmitChange()
      } else {
        // 分离出 小数点、及其左右2边的数字
        const left = result[1]
        const dot = result[2]
        const right = result[3]
        let tmpVal = ''
        if (!dot || !right) {
          tmpVal = dot ? `${left}${dot}` : left
        } else if (/^\d+/.test(right)) {
          // 限制小数点位数
          const digit = right.match(/^\d+/)[0]
          const len = Math.min(digit.length, decimal)
          tmpVal = `${left}${dot}${digit.substr(0, len)}`
        } else {
          // 若小数点右边不是以数字开头
          tmpVal = `${left}${dot}`
        }
        // target.value = tmpVal
        console.log(`tmpVal = ${tmpVal}`)
        this.val = 0
        // this.handleEmitChange()
        this.$nextTick(() => {
          let tmp = parseFloat(tmpVal)
          if (this.integer) {
            tmp = parseInt(tmpVal)
          }
          tmp = tmp <= this.max ? tmp : this.max
          tmp = tmp >= this.min ? tmp : this.min
          this.val = tmp
          this.handleEmitChange()
        })
      }
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
    &::before {
      transform: scale(0.8);
    }
    &::after {
      content: '';
    }
    &.disabled {
      opacity: $pi-disabled-opacity;
    }
  }
  &.disabled {
    opacity: $pi-disabled-opacity;
  }
  &.round {
    .pi-stepper-icon {
      border-radius: 5000rpx;
      &::after {
        border-radius: 5000rpx;
      }
    }
  }
  &.square {
    .pi-stepper-icon {
      border-radius: 8rpx;
      &::after {
        border-radius: 8rpx;
      }
    }
  }
  &.fill {
    .pi-stepper-icon {
      color: #ffffff;
      background: $pi-primary-color;
    }
  }
}
</style>
