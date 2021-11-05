<template>
  <view
    v-if="show"
    class="pi-notify"
    :style="[{ color, background: bgColor }, customStyle]"
    :class="[`pi-notify-${type}`, customClass]"
  >
    <!-- 内容插槽 -->
    <slot v-if="$slots.default || $slots.$default" />
    <!-- message prop -->
    <template v-else>{{ message }}</template>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiNotify'
const { notify } = getConfig()
let timer = null

export default {
  name: TAG,
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
      // `'primary'-主要通知` `'success'-成功通知` `'base'/'danger'-危险通知` `'warning'-警告通知` `'info'-提示通知`
      type: String,
      // `'base'`
      default: notify.type,
      validator: function(value) {
        return [
          'base',
          'primary',
          'success',
          'danger',
          'warning',
          'info',
          'customDuration',
          ''
        ].includes(value)
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
    }
  },
  data() {
    return {
      show: false, // 是否显示 notify 消息通知
      clearTimer: () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    }
  },
  methods: {
    showNotify(props = {}) {
      const duration = props.duration || this.duration
      this.clearTimer()
      this.show = true

      timer = setTimeout(() => {
        this.show = false
      }, duration)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-notify {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20rpx 30rpx;
  color: $pi-background-color;
  font-size: $pi-font-size;
  z-index: 9999;
  overflow-y: auto;
  transition: all 0.35s linear;
  box-sizing: border-box;
  white-space: pre-wrap;
  text-align: center;
  word-wrap: break-word;

  &-primary {
    background: $pi-primary-color;
  }

  &-success {
    background: $pi-fourth-color;
  }

  &-customDuration,
  &-base,
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
