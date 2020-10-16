<template>
  <view class="pi-grid" :style="[customStyle]" :class="[{ border: showBorder }, customClass]">
    <slot />
  </view>
</template>

<script>
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiGrid'
const { grid } = getConfig()

export default {
  name: TAG,
  mixins: [parentInit(['border', 'col', 'gap', 'square', 'hoverClass'])],
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return grid.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return grid.customClass
      }
    },
    // 分成几列
    col: {
      type: [Number, String],
      default: grid.col
    },
    // 宫格是否以正方形撑开
    square: {
      type: Boolean,
      default: grid.square
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: grid.border
    },
    // 宫格之间间隔，（默认：0）
    gap: {
      type: [String, Number],
      default: grid.gap
    },
    // 宫格按压时的样式类，"none"为无效果
    hoverClass: {
      type: String,
      default: grid.hoverClass
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

.pi-grid {
  width: 100%;
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-grid-border-color;
      border-top-width: $pi-grid-border-width;
      border-left-width: $pi-grid-border-width;
    }
  }
}
</style>
