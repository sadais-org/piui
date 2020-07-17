<template>
  <view class="pi-rela pi-w-100P pi-align-center" :style="[customStyle]">
    <view class="pi-divider" :style="[dividerStyle]" />
    <view v-if="$slots.default" :style="{ padding: contentPadding }"><slot /></view>
    <view class="pi-divider" :style="[dividerStyle]" />
  </view>
</template>

<script>
import { getConfig } from '../../config'
const TAG = 'PiDivider'
const { divider } = getConfig()

export default {
  name: TAG,
  props: {
    // 是否使用0.5px线
    halfline: {
      type: Boolean,
      default: divider.halfline
    },
    // 线条颜色
    borderColor: {
      type: String,
      default: divider.borderColor
    },
    // 分割线样式：dashed dotted double等，和style提供的borderStyle一致
    borderStyle: {
      type: String,
      default: divider.borderStyle
    },
    // 整个divider自定义样式
    customStyle: {
      type: Object,
      default() {
        return divider.customStyle
      }
    },
    // 内容位置：center left right
    contentPosition: {
      type: String,
      default: divider.contentPosition,
      validator: function(value) {
        return ['center', 'left', 'right'].includes(value)
      }
    },
    // 内容padding，默认（'0 24rpx'）
    contentPadding: {
      type: String,
      default: divider.contentPadding
    },
    // 内容自定义样式
    contentStyle: {
      type: Object,
      default() {
        return divider.customStyle
      }
    }
  },
  computed: {
    dividerStyle() {
      const style = {
        borderStyle: this.borderStyle,
        borderColor: this.borderColor
      }
      if (this.halfline) {
        style.transform = 'scaleY(0.5)'
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-divider {
  flex: 1;
  border-width: 0;
  border-top-width: 1px;
}
</style>
