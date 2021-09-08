<template>
  <view
    class="pi-width-100P"
    :style="[customStyle, { height: `${statusBarHeight}px`, background: background }]"
    :class="[customClass]"
  />
</template>

<script>
/**
 * status-bar 状态栏
 * @description 移动端状态栏占位
 * @property {String} background 是否显示模态框 default: transparent
 * @example <status-bar />
 */
import { systemInfo } from '@sadais/piui-tool/tools/system'

import { getConfig } from '../../config'
const { statusBar } = getConfig()

const TAG = 'PiStatusBar'

export default {
  name: 'PiStatusBar',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return statusBar.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // `''`
      default() {
        return statusBar.customClass
      }
    },
    // 背景颜色
    background: {
      required: false,
      type: String,
      // `transparent`
      default: statusBar.background
    }
  },
  computed: {
    statusBarHeight() {
      return systemInfo.statusBarHeight
    }
  }
}
</script>
