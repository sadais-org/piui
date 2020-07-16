<template>
  <!-- 蒙层禁止触摸滚动 -->
  <view
    v-if="val"
    class="pi-fixed-top pi-w-100P pi-h-100P"
    :class="show ? animationShow : animationHide"
    :style="{ 'zIndex': zIndex, 'background': background, 'animation-duration': getDuration.css }"
    @touchmove.stop.prevent
    @tap="handleCloseMask"
  >
    <slot />
  </view>
</template>

<script>
/**
 * 通过v-model控制蒙层是否显示
 * input	蒙层显示或者关闭的时候触发事件 value: boolean (蒙层是否显示)
 * close	蒙层关闭中事件，动画还没执行完毕
 * closed 蒙层已关闭事件，动画已经执行完毕
 */
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const TAG = 'PiMask'
const { mask } = getConfig()

export default {
  name: TAG,
  mixins: [ValueSync],
  props: {
    // 显示的时候执行的动画，默认（'pi-ani-fade-show'）
    animationShow: {
      type: String,
      default: mask.animationShow
    },
    // 隐藏的时候执行的动画，默认（'pi-ani-fade-hide'）
    animationHide: {
      type: String,
      default: mask.animationHide
    },
    // 遮罩的过渡时间，单位为ms，默认（300）
    duration: {
      type: [Number, String],
      default: mask.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: mask.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: mask.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: mask.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: mask.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    background: {
      type: String,
      default: mask.background
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
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
  destroyed() {
    // #ifdef H5
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    // #endif
  },
  methods: {
    openMask() {
      if (this.show) return
      console.log(TAG, '显示遮罩层')
      this.show = true
      this.handleEmitChange()
      uni.hideKeyboard()
      this.hideTabBar && uni.hideTabBar()
      // #ifdef H5
      if (this.appendToBody) {
        console.log(this.$el)
        document.body.appendChild(this.$el)
      }
      // #endif
    },
    closeMask() {
      if (!this.show) return
      console.log(TAG, '关闭遮罩层')
      this.show = false
      this.$emit('close')
      setTimeout(() => {
        this.val = false
        this.$emit('closed')
        this.handleEmitChange()
        uni.showTabBar()
      }, this.getDuration.js)
    },
    handleCloseMask() {
      if (!this.maskClosable || !this.show) return
      this.closeMask()
    }
  }
}
</script>
