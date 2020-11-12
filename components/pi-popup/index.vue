<template>
  <!-- 蒙层禁止触摸滚动 @touchmove.stop.prevent -->
  <view
    v-if="!closed"
    class="pi-fixed-top pi-w-100P pi-h-100P"
    :class="[show ? 'pi-ani-fade-show' : 'pi-ani-fade-hide']"
    :style="[
      { 'zIndex': zIndex, 'background': maskBackground, 'animation-duration': getDuration.css }
    ]"
    @touchmove.stop.prevent
    @tap.stop.prevent="handleCloseMask"
  >
    <view
      class="pi-abso pi-of-hidden"
      :class="[customClass, aniClass]"
      :style="[
        { 'borderRadius': getBorderRadius, 'animation-duration': getDuration.css },
        positionStyle,
        customStyle
      ]"
      @tap.stop.prevent
    >
      <view
        class="pi-rela pi-w-100P pi-h-100P"
        :class="{ 'pi-safearea': !['top', 'center'].includes(position) && safeAreaInsetBottom }"
        :style="[contentStyle]"
      >
        <view
          v-if="showCloseIcon"
          class="pi-abso"
          :class="'pi-icon-' + closeIconName"
          :style="[closeIconStyle, { fontWeight: closeIconWeight }]"
          @tap.stop="handleCloseMask"
        />
        <!-- default slot -->
        <slot />
      </view>
    </view>
  </view>
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
const {
  screenHeight,
  safeArea: { height: bodyHeight },
  statusBarHeight
} = systemInfo

// 弹出窗
export default {
  name: 'Popup',
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
        return popup.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return popup.customClass
      }
    },
    // 弹出位置，可选值为 top bottom right left center
    position: {
      type: String,
      default: popup.position,
      validator: function(value) {
        return ['top', 'bottom', 'right', 'left', 'center'].includes(value)
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
    // 关闭图标的颜色，默认（'#666666'）
    closeIconColor: {
      type: String,
      default: popup.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: popup.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: popup.closeIconWeight
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
    },
    /**
     * mask props
     * -------------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: popup.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: popup.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: popup.hideTabBar
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
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: popup.maskBackground
    }
  },
  data() {
    return {
      show: false, // 是否显示节点
      showed: false, // 是否显示动画执行完毕
      closed: true // 是否已关闭（用来防止val为false的情况，动画无法执行）
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
    getBorderRadius() {
      return this.$pi.common.addUnit(this.borderRadius)
    },
    positionStyle() {
      const positionStyleMap = {
        top: { top: 0, left: 0, right: 0 },
        bottom: { bottom: 0, left: 0, right: 0 },
        left: { top: 0, bottom: 0, left: 0 },
        right: { top: 0, bottom: 0, right: 0 },
        center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
      }
      return positionStyleMap[this.position]
    },
    contentStyle() {
      return {
        background: this.background,
        paddingTop:
          !['bottom', 'center'].includes(this.position) && this.safeAreaInsetTop
            ? this.statusBarHeight
            : 0
      }
    },
    getDuration() {
      const duration = parseInt(this.duration)
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
        right: 'tl', // 左上角
        center: 'tr' // 右上角
      }
      const closePosition = this.closeIconPosition || closePositionMap[this.position]
      return closePosition
    },
    closeIconStyle() {
      const closePosition = this.getClosePosition
      const top =
        this.safeAreaInsetTop &&
        !['bottom', 'center'].includes(this.position) &&
        closePosition.includes('t')
          ? this.statusBarHeight
          : 0
      const bottom =
        this.safeAreaInsetBottom &&
        !['top', 'center'].includes(this.position) &&
        closePosition.includes('b')
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
    },
    aniClass() {
      if (this.position === 'center') {
        return this.show ? 'ani-scale-center-up' : 'ani-scale-center-down'
      } else {
        return this.show
          ? 'pi-ani-slide-' + this.position + '-show'
          : 'pi-ani-slide-' + this.position + '-hide'
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
      console.log(TAG, '显示弹窗层')
      this.closed = false
      this.show = true
      this.showed = false
      this.handleEmitChange()
      uni.hideKeyboard()
      this.hideTabBar && uni.hideTabBar()
      setTimeout(() => {
        this.showed = true
      }, this.getDuration.js)
      // #ifdef H5
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
      // #endif
    },
    closeMask() {
      if (!this.show || !this.showed) return
      console.log(TAG, '关闭弹窗层')
      this.show = false
      this.showed = false
      this.$emit('close')
      setTimeout(() => {
        this.$emit('closed')
        this.closed = true
        // 此处设置this.val是为了触发v-model双向绑定
        this.val = false
        this.handleEmitChange()
        this.hideTabBar && uni.showTabBar()
      }, this.getDuration.js)
    },
    handleCloseMask() {
      if (!this.maskClosable) return
      this.closeMask()
    }
  }
}
</script>

<style lang="scss" scoped>
.ani-scale-center-up {
  animation: scale-center-up $pi-animation-duration $pi-animation-timing-function both;
}

.ani-scale-center-down {
  animation: scale-center-down $pi-animation-duration $pi-animation-timing-function both;
}

@keyframes scale-center-up {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes scale-center-down {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
}
</style>
