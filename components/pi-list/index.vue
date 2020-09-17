<template>
  <view class="pi-list" :style="[customStyle]" :class="[{ border: showBorder }, customClass]">
    <slot />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiList'
const { list } = getConfig()

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return list.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return list.customClass
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default() {
        return list.border
      }
    },
    // 列按压时的样式类，"none"为无效果
    hoverClass: {
      type: String,
      default: list.hoverClass
    }
  },
  provide() {
    return {
      piList: this
    }
  },
  computed: {
    showBorder() {
      return this.border && !this.gap
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/piui/scss/border.scss';

.pi-list {
}
</style>
