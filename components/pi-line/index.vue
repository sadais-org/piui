<template>
  <view class="pi-line" :style="[lineStyle]" />
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const TAG = 'PiLine'
const { line } = getConfig()
export default {
  name: 'PiLine',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    color: {
      type: String,
      default: line.color
    },
    // 长度，竖向时为高度，横向时为长度，可以为百分比，带rpx单位的值等
    length: {
      type: String,
      default: line.length
    },
    // 排列方向，row|column
    direction: {
      type: String,
      default: line.direction
    },
    // 是否显示细边框
    hairLine: {
      type: Boolean,
      default: line.hairLine
    },
    // 边距
    margin: {
      type: String,
      default: line.margin
    },
    // 线条的类型，solid-实线，dashed-方形虚线，dotted-圆点虚线
    borderStyle: {
      type: String,
      default: line.borderStyle
    }
  },
  data() {
    return {}
  },
  computed: {
    lineStyle() {
      let style = {}
      style.margin = this.margin
      if (this.direction == 'row') {
        style.borderBottomWidth = '1px'
        style.borderBottomStyle = this.borderStyle
        style.width = this.length
        // 边框高度缩小一半
        if (this.hairLine) style.transform = 'scaleY(0.5)'
      } else {
        style.borderLeftWidth = '1px'
        style.borderLeftStyle = this.borderStyle
        style.height = this.length
        // 边框宽度缩小一半
        if (this.hairLine) style.transform = 'scaleX(0.5)'
      }
      style.borderColor = this.color
      return style
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.pi-line {
  vertical-align: middle;
}
</style>
