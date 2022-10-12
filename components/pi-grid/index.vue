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
  name: 'PiGrid',
  mixins: [parentInit(['border', 'col', 'gap', 'square', 'hoverClass'])],
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return grid.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return grid.customClass
      }
    },
    // 分成几列
    col: {
      type: [Number, String],
      // 5
      default: grid.col
    },
    // 宫格是否以正方形撑开
    square: {
      type: Boolean,
      // false
      default: grid.square
    },
    // 是否显示边框
    border: {
      type: Boolean,
      // true
      default: grid.border
    },
    // 宫格之间间隔
    gap: {
      type: [String, Number],
      // 0
      default: grid.gap
    },
    // 宫格按压时的样式类，"none"为无效果
    hoverClass: {
      type: String,
      // null
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
@import '../../scss/mixin.scss';

.pi-grid {
  width: 100%;
  &::before {
    display: inline-block;
    vertical-align: middle;
    content: '';
  }
  &.border {
    @include pi-border;
    &::before {
      border: 0 solid $pi-grid-border-color;
      border-top-width: $pi-grid-border-width;
      border-left-width: $pi-grid-border-width;
    }
  }
}
</style>
