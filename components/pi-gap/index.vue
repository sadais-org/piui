<template>
  <view class="pi-gap" :style="[customStyle, gapStyle]" :class="[customClass]">
    <slot />
  </view>
</template>

<script>
/**
 * 间隔槽
 */
import { getConfig } from '../../config'
const { gap } = getConfig()

const TAG = 'PiGap'

export default {
  name: 'PiGap',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return gap.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return gap.customClass
      }
    },
    // 背景颜色
    background: {
      required: false,
      type: String,
      // #f4f4f4
      default: gap.background
    },
    // 高度
    height: {
      type: [String, Number],
      // 24
      default: gap.height
    },
    // 与上一个组件的距离
    marginTop: {
      type: [String, Number],
      // 0
      default: gap.marginTop
    },
    // 与下一个组件的距离
    marginBottom: {
      type: [String, Number],
      // 0
      default: gap.marginBottom
    }
  },
  computed: {
    gapStyle() {
      return {
        backgroundColor: this.background,
        height: this.$pi.common.addUnit(this.height),
        marginTop: this.$pi.common.addUnit(this.marginTop),
        marginBottom: this.$pi.common.addUnit(this.marginBottom)
      }
    }
  }
}
</script>
