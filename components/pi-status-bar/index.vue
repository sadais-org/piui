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
import { systemInfo } from '../../tools/system'
import { createCustomPropsByConfig } from '../../mixin/component-custom'
import { getConfig } from '../../config'
const { statusBar } = getConfig()

export default {
  name: 'PiStatusBar',
  // 混入自定义样式customStyle和customClass
  mixins: [createCustomPropsByConfig(statusBar)],
  props: {
    // 背景颜色（默认透明）
    background: {
      required: false,
      type: String,
      default: 'transparent'
    }
  },
  computed: {
    statusBarHeight() {
      return systemInfo.statusBarHeight
    }
  }
}
</script>
