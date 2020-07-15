<template>
  <view class="pi-w-100P" :style="{ height: `${statusBarHeight}px`, background: background }" />
</template>

<script>
/**
 * status-bar 状态栏
 * @description 移动端状态栏占位
 * @property {String} background 是否显示模态框 default: transparent
 * @example <status-bar />
 */
import { systemInfo } from '../../tools/system'
export default {
  name: 'PiStatusBar',
  props: {
    // 背景颜色（默认透明）
    background: {
      required: false,
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      statusBarHeight: systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0
    }
  }
}
</script>
