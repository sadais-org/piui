<template>
  <!-- 蒙层禁止触摸滚动 @touchmove.stop.prevent -->
  <view
    v-if="val"
    class="pi-fixed-top pi-w-100P pi-h-100P"
    :class="[customClass, show ? animationShow : animationHide]"
    :style="[
      customStyle,
      { 'zIndex': zIndex, 'background': background, 'animation-duration': getDuration.css }
    ]"
    @touchmove.stop.prevent
    @tap.stop.prevent="handleCloseMask"
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
import { parseDuration } from '../../tools/common'

const TAG = 'PiMask'
const { mask } = getConfig()

export default {
  name: 'Mask',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      // {}
      default() {
        return mask.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return mask.customClass
      }
    },
    // 显示的时候执行的动画
    animationShow: {
      type: String,
      // 'pi-ani-fade-show'
      default: mask.animationShow
    },
    // 隐藏的时候执行的动画
    animationHide: {
      type: String,
      // 'pi-ani-fade-hide'
      default: mask.animationHide
    },
    // 遮罩的过渡时间 i.e '0.56s' 、'560ms' 、'560'、560
    duration: {
      type: [Number, String],
      // 300
      default: mask.duration
    },
    // 是否可以通过点击遮罩进行关闭
    maskClosable: {
      type: Boolean,
      // true
      default: mask.maskClosable
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      // false
      default: mask.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: mask.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 100
      default: mask.zIndex
    },
    // 背景颜色
    background: {
      type: String,
      // 'rgba(0, 0, 0, .5)'
      default: mask.background
    }
  },
  data() {
    return {
      show: false,
      showed: false // 是否动画执行完毕
    }
  },
  computed: {
    getDuration() {
      return parseDuration(this.duration, mask.duration)
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
      this.showed = false
      this.show = true
      this.handleEmitChange()
      uni.hideKeyboard()
      this.hideTabBar && uni.hideTabBar()
      setTimeout(() => {
        this.showed = true
        console.log(TAG, '遮罩层已显示')
      }, this.getDuration.js)
      // #ifdef H5
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
      // #endif
    },
    closeMask() {
      if (!this.show || !this.showed) return
      console.log(TAG, '关闭遮罩层')
      this.show = false
      this.showed = false
      // 即将关闭弹窗
      this.$emit('close')
      setTimeout(() => {
        /**
         * 已经关闭弹窗
         */
        this.$emit('closed')
        this.val = false
        this.handleEmitChange()
        this.hideTabBar && uni.showTabBar()
        console.log(TAG, '遮罩层已关闭')
      }, this.getDuration.js)
    },
    handleCloseMask() {
      if (!this.maskClosable) return
      this.closeMask()
    }
  }
}
</script>
