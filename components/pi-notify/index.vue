<template>
  <view
    v-if="!closed"
    class="pi-notify pi-fixed-top pi-w-100P pi-text-ellipsis"
    :style="[getNotifyStyle]"
    :class="[`pi-notify-${type}`, getAniClass]"
  >
    <!-- 状态栏占位 -->
    <pi-status-bar :background="bgColor" />
    <!-- 内容插槽 -->
    <div
      class="pi-notify-container pi-text-ellipsis"
      :style="[customStyle, getContainerStyle]"
      :class="[customClass]"
    >
      <!-- message prop -->
      <template v-if="message">{{ message }}</template>
      <slot v-else-if="$slots.default || $slots.$default" />
    </div>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import { parseDuration } from '@sadais/piui-tool/tools/common'

const TAG = 'PiNotify'
const { notify } = getConfig()

export default {
  name: TAG,
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false,
      type: Boolean
    },
    // 自定义样式
    customStyle: {
      type: Object,
      // {}
      default() {
        return notify.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return notify.customClass
      }
    },
    // 显示的消息文本
    message: {
      type: String,
      // ''
      default: notify.message
    },
    // notify 类型
    type: {
      type: String,
      // 'primary'
      default: notify.type,
      validator: function(value) {
        return ['primary', 'success', 'danger', 'warning', 'info', 'customDuration', ''].includes(
          value
        )
      }
    },
    // 展示时长,默认单位 ms
    duration: {
      type: [String, Number],
      // 3000
      default: notify.duration
    },
    // 字体颜色
    color: {
      type: String,
      // ''
      default: notify.color
    },
    // 背景颜色
    bgColor: {
      type: String,
      // ''
      default: notify.bgColor
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 999
      default: notify.zIndex
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: notify.appendToBody
    },
    // 是否自动隐藏，默认 true
    autoHide: {
      type: Boolean,
      // true
      default: notify.autoHide
    },
    // 是否单行显示，默认 false
    singleLine: {
      type: Boolean,
      // false
      default: notify.singleLine
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
    getDuration() {
      return parseDuration(this.duration)
    },
    getNotifyStyle() {
      const { color, bgColor, zIndex } = this
      return {
        zIndex,
        color,
        background: bgColor
      }
    },
    getAniClass() {
      return this.show ? 'pi-ani-slide-top-show' : 'pi-ani-slide-top-hide'
    },
    getContainerStyle() {
      const style = {}
      style.whiteSpace = this.singleLine ? 'nowrap' : 'pre-wrap'

      // #ifdef  MP-WEIXIN
      const buttonRect = wx.getMenuButtonBoundingClientRect()
      style.paddingRight = `${buttonRect.width}px`
      // #endif

      return style
    }
  },
  watch: {
    val: {
      deep: true,
      immediate: true,
      handler(value) {
        value ? this.showNotify() : this.hideNotify()
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
    showNotify() {
      if (this.show) return
      console.log(TAG, '显示通知栏')
      this.closed = false
      this.show = true
      this.showed = false
      this.handleEmitChange()
      setTimeout(() => {
        // 动画执行完毕
        this.showed = true
        // 自动关闭
        this.autoHide &&
          setTimeout(() => {
            this.hideNotify()
          }, this.getDuration.js)
      }, 300)
      // #ifdef H5
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
      // #endif
    },
    hideNotify() {
      if (!this.show || !this.showed) return
      console.log(TAG, '隐藏通知栏')
      this.show = false
      this.showed = false
      setTimeout(() => {
        this.$emit('closed')
        this.closed = true
        this.val = false
        this.handleEmitChange()
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-notify {
  color: $pi-background-color;
  font-size: $pi-font-size;
  padding: 24rpx 32rpx;
  overflow: hidden;

  transition: all $pi-animation-duration $pi-animation-timing-function;

  .pi-notify-container {
    text-align: center;
    min-width: 0;
  }

  &-primary {
    background: $pi-primary-color;
  }

  &-success {
    background: $pi-fourth-color;
  }

  &-danger {
    background: #e64340;
  }

  &-warning {
    background: #f90;
  }

  &-info {
    background: #909399;
  }
}
</style>
