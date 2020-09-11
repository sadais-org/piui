<template>
  <view
    class="pi-switch pi-round"
    :style="[customStyle, switchStyle]"
    :class="[type, { active: val === activeValue }, customClass]"
    @tap="handleSwitchToggle"
  >
    <view class="switch-node" :style="[nodeStyle]">
      <pi-loading
        v-if="loading"
        :show="loading"
        :type="loadingType"
        :size="size * 0.6"
        custom-class="pi-abso-center"
      />
    </view>
  </view>
</template>

<script>
/**
 * switch 开关
 */
import ValueSync from '../../mixin/value-sync'
import { systemInfo } from '../../tools/system'
import { getConfig } from '../../config'

const TAG = 'PiSwitch'
const { switch: switchConfig } = getConfig()

export default {
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return switchConfig.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return switchConfig.customClass
      }
    },
    // 类型（line: 线框模式，fill: 实底模式）
    type: {
      type: [String],
      default: switchConfig.type,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    },
    // 是否为加载状态
    loading: {
      type: Boolean,
      default() {
        return switchConfig.loading
      }
    },
    // 类型： spinner 菊花 round 圆环
    loadingType: {
      type: String,
      default: switchConfig.loadingType,
      validator: function(value) {
        return ['spinner', 'round'].includes(value)
      }
    },
    // 是否为禁用状态
    disabled: {
      type: Boolean,
      default() {
        return switchConfig.disabled
      }
    },
    // 开关尺寸，默认单位为rpx
    size: {
      type: [String, Number],
      default() {
        return switchConfig.size
      }
    },
    // 激活颜色，不设置时候，为主题色
    activeColor: {
      type: String,
      default() {
        return switchConfig.activeColor
      }
    },
    // 打开开关时对应的值
    activeValue: {
      type: [String, Number, Boolean],
      default() {
        return switchConfig.activeValue
      }
    },
    // 关闭开关时对应的值
    inactiveValue: {
      type: [String, Number, Boolean],
      default() {
        return switchConfig.inactiveValue
      }
    },
    // 是否使手机发生短促震动，iOS的微信小程序有效
    vibrateShort: {
      type: Boolean,
      default() {
        return switchConfig.vibrateShort
      }
    }
  },
  computed: {
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    switchStyle() {
      const style = {
        fontSize: this.getSize
      }
      if (this.type === 'line') style.padding = '4rpx'
      if (this.val === this.activeValue && this.activeColor && this.type === 'fill') {
        style.backgroundColor = this.activeColor
        style.borderColor = this.activeColor
      }
      return style
    },
    nodeStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize,
        lineHeight: this.getSize
      }
      if (this.type === 'line') style.boxShadow = 'unset'
      if (this.val === this.activeValue && this.activeColor && this.type === 'line') {
        style.backgroundColor = this.activeColor
      }
      return style
    }
  },
  methods: {
    handleSwitchToggle() {
      this.val = this.val === this.activeValue ? this.inactiveValue : this.activeValue
      if (this.vibrateShort) uni.vibrateShort()
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-switch {
  box-sizing: initial;
  display: inline-block;
  width: 2em;
  height: 1em;
  border: 4rpx solid #e5e5e5;
  transition: background-color $pi-animation-duration;
  .switch-node {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border-radius: 50%;
    /* stylelint-disable */
    box-shadow: -2rpx 4rpx 4rpx 0 rgba(0, 0, 0, 0.1),
      0 4rpx 23rpx 0 rgba(0, 0, 0, 0.08),
      0 0 4rpx 0 rgba(0, 0, 0, 0.2);
    transition: all cubic-bezier(0.3, 1.05, 0.4, 1.05) $pi-animation-duration;
  }

  &.line .switch-node {
    background-color: #e5e5e5;
  }

  &.active {
    .switch-node {
      transform: translateX(100%);
    }

    &.fill {
      background-color: $pi-primary-color;
      border-color: $pi-primary-color;
    }

    &.line .switch-node {
      background-color: $pi-primary-color;
    }
  }
}
</style>
