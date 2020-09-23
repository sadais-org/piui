<template>
  <view class="pi-gap" :style="[gapStyle]">
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
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return gap.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return gap.customClass
      }
    },
    // 背景颜色（默认透明）
    background: {
      required: false,
      type: String,
      default: gap.background
    },
    // 高度
    height: {
      type: [String, Number],
      default: gap.height
    },
    // 与上一个组件的距离
    marginTop: {
      type: [String, Number],
      default: gap.marginTop
    },
    // 与下一个组件的距离
    marginBottom: {
      type: [String, Number],
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
