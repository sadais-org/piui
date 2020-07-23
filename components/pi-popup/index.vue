<template>
  <pi-mask
    :value="val"
    :animation-show="mask.animationShow"
    :animation-hide="mask.animationHide"
    :duration="mask.duration"
    :mask-closable="mask.maskClosable"
    :hide-tab-bar="mask.hideTabBar"
    :append-to-body="mask.appendToBody"
    :z-index="mask.zIndex"
    :background="mask.background"
    @close="handleCloseMask"
  >
    <view
      class="pi-abso pi-of-hidden"
      :class="[
        customClass,
        show ? 'pi-ani-slide-' + position + '-show' : 'pi-ani-slide-' + position + '-hide'
      ]"
      :style="[
        { 'borderRadius': borderRadius, 'animation-duration': getDuration.css },
        positionStyle,
        customStyle
      ]"
      @tap.stop.prevent
    >
      <view
        class="pi-rela pi-w-100P pi-h-100P"
        :class="{ 'pi-safearea': position !== 'top' && safeAreaInsetBottom }"
        :style="{
          background: background,
          paddingTop: position !== 'bottom' && safeAreaInsetTop ? statusBarHeight : 0
        }"
      >
        <view
          v-if="showCloseIcon"
          class="pi-abso"
          :class="'pi-icon-' + closeIconName"
          :style="[closeIconStyle]"
          @tap="handleCloseMask"
        />
        <!-- default slot -->
        <slot />
      </view>
    </view>
  </pi-mask>
</template>

<script>
/**
 * 通过v-model控制蒙层是否显示
 * input	蒙层显示或者关闭的时候触发事件 value: boolean (蒙层是否显示)
 * closeing	蒙层关闭中事件，动画还没执行完毕
 * close 蒙层已关闭事件，动画已经执行完毕
 */
import ValueSync from '../../mixin/value-sync'
import { systemInfo } from '../../tools/system'
import { getConfig } from '../../config'
import { createCustomPropsByConfig } from '../../mixin/component-custom'

const TAG = 'PiPopup'
const { popup } = getConfig()
const {
  screenHeight,
  safeArea: { height: bodyHeight },
  statusBarHeight
} = systemInfo

export default {
  name: TAG,
  // 混入v-model
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync, createCustomPropsByConfig(popup)],
  props: {
    // 弹窗蒙层的配置，默认选项请参照mask
    mask: {
      type: Object,
      default() {
        return popup.mask
      }
    },
    // 弹出位置，可选值为 top bottom right left
    position: {
      type: String,
      default: popup.position,
      validator: function(value) {
        return ['top', 'bottom', 'right', 'left'].includes(value)
      }
    },
    // 背景颜色（默认'ffffff'）
    background: {
      type: String,
      default: popup.background
    },
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: '0 0 0 0'
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: popup.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: popup.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: popup.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#999999'）
    closeIconColor: {
      type: String,
      default: popup.closeIconColor
    },
    // 关闭图标的大小，默认（'32rpx'）
    closeIconSize: {
      type: [String, Number],
      default: popup.closeIconSize
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: popup.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeAreaInsetTop: {
      type: Boolean,
      default: popup.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: popup.safeAreaInsetBottom
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    statusBarHeight() {
      return `${statusBarHeight}px`
    },
    safeAreaBottom() {
      const bottomHeight = screenHeight - statusBarHeight - bodyHeight
      return `${bottomHeight}px`
    },
    positionStyle() {
      const positionStyleMap = {
        top: { top: 0, left: 0, right: 0 },
        bottom: { bottom: 0, left: 0, right: 0 },
        left: { top: 0, bottom: 0, left: 0 },
        right: { top: 0, bottom: 0, right: 0 }
      }
      return positionStyleMap[this.position]
    },
    getDuration() {
      const duration = parseInt(this.mask.duration || popup.mask.duration)
      return {
        js: duration,
        css: `${duration / 1000}s`
      }
    },
    getClosePosition() {
      // 若不指定，则按照弹出位置自动显示在合适的位置
      const closePositionMap = {
        top: 'br', // 右下角
        bottom: 'tr', // 右上角
        left: 'tr', // 右上角
        right: 'tl' // 左上角
      }
      const closePosition = this.closeIconPosition || closePositionMap[this.position]
      return closePosition
    },
    closeIconStyle() {
      const closePosition = this.getClosePosition
      const top =
        this.safeAreaInsetTop && this.position !== 'bottom' && closePosition.includes('t')
          ? this.statusBarHeight
          : 0
      const bottom =
        this.safeAreaInsetBottom && this.position !== 'top' && closePosition.includes('b')
          ? this.safeAreaBottom
          : 0
      const positionStyleMap = {
        tl: { top, left: 0 }, // 左上角
        tr: { top, right: 0 }, // 右上角
        bl: { bottom, left: 0 }, // 右下角
        br: { bottom, right: 0 } // 右下角
      }
      const style = {
        color: this.closeIconColor,
        padding: this.$pi.common.addUnit(this.closeIconPadding),
        fontSize: this.$pi.common.addUnit(this.closeIconSize),
        ...positionStyleMap[closePosition]
      }
      return style
    }
  },
  watch: {
    val: {
      deep: true,
      immediate: true,
      handler(value) {
        value ? this.openMask() : this.closeMask()
      }
    }
  },
  methods: {
    openMask() {
      if (this.show) return
      console.log(TAG, '显示弹窗层')
      this.show = true
      this.handleEmitChange()
    },
    closeMask() {
      if (!this.show) return
      console.log(TAG, '关闭弹窗层')
      this.show = false
      setTimeout(() => {
        this.val = false
        this.$emit('close')
        this.handleEmitChange()
      }, this.getDuration.js)
    },
    handleCloseMask() {
      if (!this.show) return
      this.closeMask()
    }
  }
}
</script>
