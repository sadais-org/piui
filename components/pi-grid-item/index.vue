<template>
  <view
    class="pi-grid-item"
    :style="[customStyle, itemStyle]"
    :class="[itemClass, customClass]"
    :hover-class="getHoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    @tap.stop="handleItemClick"
  >
    <view class="grid-item-box" :class="[itemBoxClass]">
      <view><slot /></view>
    </view>
  </view>
</template>

<script>
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiGridItem'
const { gridItem } = getConfig()
const extendPiGrid = childInit('Grid')

export default {
  name: 'GridItem',
  // 混入自定义样式customStyle和customClass
  mixins: [extendPiGrid], // 注入value与val，进行双向绑定
  props: {
    // 当前宫格索引
    index: {
      type: [Number, String],
      required: true
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return gridItem.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return gridItem.customClass
      }
    },
    // 分成几列
    col: {
      type: [Number, String],
      // 5
      default: gridItem.col
    },
    // 宫格是否以正方形撑开
    square: {
      type: Boolean,
      // false
      default: gridItem.square
    },
    // 是否显示边框
    border: {
      type: Boolean,
      // true
      default: gridItem.border
    },
    // 宫格之间间隔
    gap: {
      type: [String, Number],
      // 0
      default: gridItem.gap
    },
    // 自定义背景色按钮
    bgColor: {
      type: String,
      // ''
      default: gridItem.bgColor
    },
    // 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果
    hoverClass: {
      type: String,
      default() {
        // 'pi-hover-class'
        return gridItem.hoverClass
      }
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      default() {
        // 10
        return gridItem.hoverStartTime
      }
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      default() {
        // 100
        return gridItem.hoverStayTime
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    getGap() {
      return this.inheritProps.gap || this.gap
    },
    getCol() {
      const col = this.inheritProps.col ? this.inheritProps.col : this.col
      return parseInt(col, 10)
    },
    getRowGapWidth() {
      return this.$pi.common.addUnit(this.getGap * (this.getCol - 1))
    },
    width() {
      return `calc((100% - ${this.getRowGapWidth}) / ${this.getCol})`
    },
    getSquare() {
      return this.inheritProps.square !== null ? this.inheritProps.square : this.square
    },
    getBorder() {
      return this.inheritProps.border !== null ? this.inheritProps.border : this.border
    },
    getHoverClass() {
      return this.inheritProps.hoverClass !== null ? this.inheritProps.hoverClass : this.hoverClass
    },
    itemStyle() {
      const gap = this.$pi.common.addUnit(this.getGap)
      const style = {
        width: this.width,
        marginRight: gap,
        marginBottom: gap
      }
      // 如果设置了index，并且是列数的最后一行，则不设置marginRight
      if (this.index && (this.index + 1) % this.getCol === 0) {
        style.marginRight = 0
      }
      if (this.bgColor) style.backgroundColor = this.bgColor
      return style
    },
    itemClass() {
      const clazz = []
      this.getBorder && clazz.push('border')
      this.getGap && clazz.push('gap')
      return clazz.join(' ')
    },
    itemBoxClass() {
      const clazz = []
      this.getSquare && clazz.push('pi-square')
      return clazz.join(' ')
    }
  },
  created() {
    this.valid()
  },
  methods: {
    valid() {
      if (this.getGap && this.index === null) {
        console.warn(TAG, '当设置gap的时候，请把当前迭代器的索引传递到index属性，否则宽度计算有误')
      }
    },
    handleItemClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/border.scss';

.pi-grid-item {
  display: inline-block;
  vertical-align: middle;
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-grid-border-color;
      // 只生成右下边框
      border-right-width: $pi-grid-border-width;
      border-bottom-width: $pi-grid-border-width;
    }
    &.gap::after {
      // 如果有间隔的情况下（边框全部生成）
      border-width: $pi-grid-border-width;
    }
  }
  .grid-item-box {
    display: inline-block;
    width: 100%;
  }
}
</style>
