<template>
  <pi-mask
    :value="val"
    :duration="duration"
    :append-to-body="appendToBody"
    :background="maskBackground"
    @close="handleCloseMask"
  >
    <view
      class="pi-abso"
      :class="show ? 'pi-ani-slide-' + position + '-show' : 'pi-ani-slide-' + position + '-hide'"
      :style="[
        { 'zIndex': zIndex, 'animation-duration': getDuration.css },
        positionStyle,
        popupStyle
      ]"
      @tap.stop.prevent
    >
      <view
        class="pi-w-100P pi-h-100P"
        :class="{ 'pi-safearea': position !== 'top' && safeAreaInsetBottom }"
        :style="{
          background: background,
          paddingTop: position !== 'bottom' && safeAreaInsetTop ? `${statusBarHeight}px` : 0
        }"
      >
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
const TAG = 'PiPopup'
const { popup } = getConfig()

export default {
  name: TAG,
  mixins: [ValueSync],
  props: {
    // 弹出位置，可选值为 top bottom right left
    position: {
      type: String,
      default: popup.position,
      validator: function(value) {
        return ['top', 'bottom', 'right', 'left'].includes(value)
      }
    },
    // 遮罩的过渡时间，单位为ms，默认（300）
    duration: {
      type: [Number, String],
      default: popup.duration
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: popup.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: popup.zIndex
    },
    // 蒙层背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: popup.maskBackground
    },
    // 背景颜色（默认'ffffff'）
    background: {
      type: String,
      default: popup.background
    },
    // 指定popupStyle样式（默认{}）
    popupStyle: {
      type: Object,
      default() {
        return popup.popupStyle
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
      return systemInfo.statusBarHeight
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
      const duration = parseInt(this.duration)
      return {
        js: duration,
        css: `${duration / 1000}s`
      }
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
