<template>
  <view class="status-bar" :style="{ height: `${statusBarHeight}px`, background: background }" />
</template>

<script>
import { getSystemInfo } from '../utils/system.js'
export default {
  name: 'PiStatusBar',
  props: {
    // 背景颜色
    background: {
      required: false,
      type: String
    }
  },
  data() {
    let systemInfo = getSystemInfo()
    return {
      statusBarHeight: systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0
    }
  }
}
</script>

<style lang="scss" scoped>
.status-bar {
  width: 100%;
  background-color: $pi-status-bar-bg;
}
</style>
