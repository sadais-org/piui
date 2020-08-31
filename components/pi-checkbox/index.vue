<template>
  <view class="pi-check-wrap" @tap="handleCheckboxToggle">
    <view class="check-icon" :style="[checkboxStyle, customStyle]" :class="[iconClass]">
      <pi-icon name="check" :size="iconSize" />
    </view>
    <view class="checkbox-label"><slot /></view>
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
  data() {
    return {
      // 初始化组件时，默认为加载中状态
      loading: true,
      // 图片是否加载错误，如果是，则显示错误占位图
      error: false
    }
  },
  computed: {
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    checkboxStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      this.shape === 'round' && (style.borderRadius = '50%')
      if (this.activeColor && this.value) {
        style.borderColor = this.activeColor
        if (this.activeMode === 'line') {
          style.color = this.activeColor
        } else {
          style.backgroundColor = this.activeColor
        }
      }
      return style
    },
    iconClass() {
      const classes = [this.activeMode]
      if (this.value) classes.push('active')
      if (this.disabled) classes.push('disabled')
      return classes.join(' ')
    }
  },
  methods: {
    handleCheckboxToggle() {
      this.val = !this.val
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-check-wrap {
  display: inline-flex;
  align-items: center;
  .check-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-weight: 800;
    color: transparent;
    border: 1px solid #c8c9cc;
    border-radius: 4rpx;
    transition: all $pi-animation-duration ease-in-out;
    &.line.active {
      color: $pi-primary-color;
      border-color: $pi-primary-color;
    }
    &.fill.active {
      color: #ffffff;
      background: $pi-primary-color;
      border-color: $pi-primary-color;
    }
  }
  .checkbox-label {
    margin-right: 24rpx;
    margin-left: 10rpx;
    word-wrap: break-word;
  }
}
</style>
