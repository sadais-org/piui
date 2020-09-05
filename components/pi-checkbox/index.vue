<template>
  <view
    class="pi-check-wrap"
    :style="[customStyle]"
    :class="[customClass, { disabled: getDisable }]"
    @tap="handleCheckboxToggle"
  >
    <view class="check-icon" :style="[checkboxStyle]" :class="[iconClass]">
      <pi-icon name="check" :size="getIconSize" />
    </view>
    <view class="checkbox-label">
      <slot />
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiCheckbox'
const { checkbox } = getConfig()

export default {
  name: TAG,
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync], // 注入value与val，进行双向绑定
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return checkbox.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return checkbox.customClass
      }
    },
    // checkbox组件的标示符
    name: {
      type: [String, Number],
      default: checkbox.name
    },
    // 形状 round || square（默认'round'）
    shape: {
      type: String,
      default: checkbox.shape,
      validator: function(value) {
        return ['square', 'round'].includes(value)
      }
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      default: checkbox.disabled
    },
    // checkbox大小，单位rpx
    size: {
      type: [String, Number],
      default: checkbox.size
    },
    // checkbox icon 大小，单位rpx
    iconSize: {
      type: [String, Number],
      default: checkbox.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: [String],
      default: checkbox.activeColor
    },
    // 激活模式（line: 线框模式，fill: 实底模式）
    activeMode: {
      type: [String],
      default: checkbox.activeMode,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    }
  },
  inject: {
    piCheckboxGroup: { default: undefined }
  },
  data() {
    return {
      // 初始化组件时，默认为加载中状态
      loading: true,
      // 图片是否加载错误，如果是，则显示错误占位图
      error: false
    }
  },
  computed: {
    getShape() {
      return this.piCheckboxGroup && this.piCheckboxGroup.shape
        ? this.piCheckboxGroup.shape
        : this.shape
    },
    getDisable() {
      return this.piCheckboxGroup && this.piCheckboxGroup.disabled ? true : this.disabled
    },
    getActiveMode() {
      return this.piCheckboxGroup && this.piCheckboxGroup.activeMode
        ? this.piCheckboxGroup.activeMode
        : this.activeMode
    },
    getActiveColor() {
      return this.piCheckboxGroup && this.piCheckboxGroup.activeColor
        ? this.piCheckboxGroup.activeColor
        : this.activeColor
    },
    getSize() {
      return this.piCheckboxGroup && this.piCheckboxGroup.size
        ? this.$pi.common.addUnit(this.piCheckboxGroup.size)
        : this.$pi.common.addUnit(this.size)
    },
    getIconSize() {
      return this.piCheckboxGroup && this.piCheckboxGroup.iconSize
        ? this.$pi.common.addUnit(this.piCheckboxGroup.iconSize)
        : this.$pi.common.addUnit(this.iconSize)
    },
    checkboxStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      this.getShape === 'round' && (style.borderRadius = '50%')
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
    iconClass() {
      const classes = [this.getActiveMode]
      if (this.val) classes.push('active')
      return classes.join(' ')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.piCheckboxGroup) return
      this.piCheckboxGroup.children.push(this)
      const checkboxGroupValue = this.piCheckboxGroup.value
      if (checkboxGroupValue && checkboxGroupValue.includes(this.name)) {
        this.val = true
      }
    },
    handleCheckboxToggle() {
      if (this.getDisable) return
      // 如果父组件做了可选数量限制
      if (!this.val && this.piCheckboxGroup && this.piCheckboxGroup.getMax > 0) {
        const max = this.piCheckboxGroup.getMax
        const currentCount = this.piCheckboxGroup.children.filter(c => c.val).length
        if (max === currentCount) return
      }
      this.val = !this.val
      this.handleEmitChange()
      this.piCheckboxGroup && this.piCheckboxGroup.emitChange()
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-weight: 900;
    color: #cccccc;
    border: 1px solid $disable-color;
    border-radius: 4rpx;
    transition: all $pi-animation-duration ease-in-out;
    &.line {
      &.active {
        color: $pi-primary-color;
        background-color: #ffffff;
        border-color: $pi-primary-color;
      }
    }
    &.fill {
      color: #ffffff;
      background-color: #cccccc;
      border-color: #cccccc;
      &.active {
        color: #ffffff;
        background: $pi-primary-color;
        border-color: $pi-primary-color;
      }
    }
  }
  .checkbox-label {
    margin-left: 10rpx;
    word-wrap: break-word;
  }
  &.disabled {
    cursor: not-allowed;
    .check-icon {
      opacity: 0.4;
    }
    .checkbox-label {
      color: #cccccc;
    }
  }
}
</style>
