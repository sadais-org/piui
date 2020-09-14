<template>
  <view
    class="pi-grid-item"
    :style="[customStyle, itemStyle]"
    :class="[{ border: getBorder }, customClass]"
    :hover-class="hoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    @tap="handleItemClick"
  >
    <view class="grid-item-box" :class="[{ 'pi-square': getSquare }]">
      <view><slot /></view>
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiGridItem'
const { gridItem } = getConfig()

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return gridItem.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return gridItem.customClass
      }
    },
    // 宫格是否以正方形撑开
    square: {
      type: Boolean,
      default: gridItem.square
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: gridItem.border
    },
    // 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果
    hoverClass: {
      type: String,
      default() {
        return gridItem.hoverClass
      }
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      default() {
        return gridItem.hoverStartTime
      }
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      default() {
        return gridItem.hoverStayTime
      }
    }
  },
  computed: {
    getCol() {
      return this.piGrid && this.piGrid.col ? this.piGrid.col : 1
    },
    width() {
      return parseFloat(100 / this.getCol).toFixed(5) + '%'
    },
    getSquare() {
      return this.piGrid ? this.piGrid.square : this.square
    },
    getBorder() {
      return this.piGrid ? this.piGrid.border : this.border
    },
    itemStyle() {
      return { width: this.width }
    }
  },
  inject: {
    piGrid: { default: undefined }
  },
  methods: {
    handleItemClick(e) {
      this.$emit('tap', e)
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/piui/scss/border.scss';

.pi-grid-item {
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-grid-border-color;
      // 只生成右下边框
      border-right-width: $pi-grid-border-width;
      border-bottom-width: $pi-grid-border-width;
    }
  }
}
</style>
