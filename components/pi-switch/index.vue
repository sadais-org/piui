<template>
  <view
    class="pi-switch pi-round"
    :style="[customStyle, switchStyle]"
    :class="[type, { active: val === activeValue }, customClass]"
    @tap.stop="handleSwitchToggle"
  >
    <view class="switch-node" :style="[nodeStyle]">
      <pi-loading
        v-if="loading"
        :show="loading"
        :type="loadingType"
        :size="getLoadingSize"
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
import { getConfig } from '../../config'

const TAG = 'PiSwitch'
const { switch: switchConfig } = getConfig()

export default {
  name: 'PiSwitch',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false,
      // false
      default: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      // {}
      default() {
        return switchConfig.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return switchConfig.customClass
      }
    },
    // 线条类型
    type: {
      // line: 线框模式，fill: 实底模式
      type: String,
      // fill
      default: switchConfig.type,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    },
    // 是否为加载状态
    loading: {
      type: Boolean,
      // false
      default() {
        return switchConfig.loading
      }
    },
    // loading类型
    loadingType: {
      // 'spinner'-菊花 'round'-圆环
      type: String,
      // 'round'
      default: switchConfig.loadingType,
      validator: function(value) {
        return ['spinner', 'round'].includes(value)
      }
    },
    // 是否为禁用状态
    disabled: {
      type: Boolean,
      // false
      default() {
        return switchConfig.disabled
      }
    },
    // 开关尺寸 默认单位为rpx
    size: {
      type: [String, Number],
      // 50
      default() {
        return switchConfig.size
      }
    },
    // 激活颜色，不设置时候，为主题色
    activeColor: {
      type: String,
      // ''
      default() {
        return switchConfig.activeColor
      }
    },
    // 打开开关时对应的值
    activeValue: {
      type: [String, Number, Boolean],
      // true
      default() {
        return switchConfig.activeValue
      }
    },
    // 关闭开关时对应的值
    inactiveValue: {
      type: [String, Number, Boolean],
      // false
      default() {
        return switchConfig.inactiveValue
      }
    },
    // 是否使手机发生短促震动，iOS的微信小程序有效
    vibrateShort: {
      type: Boolean,
      // true
      default() {
        return switchConfig.vibrateShort
      }
    }
  },
  computed: {
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    getLoadingSize() {
      let newSize = this.size
      if (typeof newSize === 'number') {
        newSize *= 0.6
      } else {
        // 正则匹配 类似10.23px 分离数字和单位
        const reg = /(\d+(?:\.\d+)?)([\D]*)/i
        const matches = newSize.match(reg)
        if (matches && matches.length === 3) {
          newSize = parseFloat(matches[1])
          newSize = `${newSize * 0.6}${matches[2]}`
        }
      }
      return newSize
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
      // 禁用开关
      if (this.disabled) return
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
  border: 2rpx solid #e5e5e5;
  transition: background-color $pi-animation-duration;
  .switch-node {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border-radius: 50%;
    /* stylelint-disable */
    box-shadow: -2rpx 4rpx 4rpx 0 rgba(0, 0, 0, 0.1), 0 4rpx 23rpx 0 rgba(0, 0, 0, 0.08),
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
