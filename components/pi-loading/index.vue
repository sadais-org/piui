<template>
  <view v-if="show" class="pi-loading" :class="{ vertical: vertical }" :style="{ color: color }">
    <view v-if="type === 'circle'" class="loading-circle" :style="[cricleStyle]" />
    <view v-if="type === 'spinner'" class="loading-spinner" :style="[cricleStyle]">
      <view v-for="line of 12" :key="line" />
    </view>
    <view v-if="$slots.default" class="slot"><slot /></view>
  </view>
</template>

<script>
import { getConfig } from '../../config'
const TAG = 'PiLoading'
const { loading } = getConfig()

export default {
  name: TAG,
  props: {
    // 是否显示loading
    show: {
      type: Boolean,
      default: false
    },
    // 颜色
    color: {
      type: String,
      default: loading.color
    },
    // 类型： spinner 菊花 circular 圆环
    type: {
      type: String,
      default: loading.type,
      validator: function(value) {
        return ['spinner', 'circular'].includes(value)
      }
    },
    // 尺寸，默认38rpx
    size: {
      type: [String, Number],
      default: loading.size
    },
    // 是否垂直排列
    vertical: {
      type: Boolean,
      default: loading.vertical
    },
    // 尺寸，默认38rpx
    textSize: {
      type: [String, Number],
      default: loading.textSize
    },
    // 文字样式
    textStyle: {
      type: Object,
      default() {
        return loading.textStyle
      }
    },
    // 整个loading自定义样式
    customStyle: {
      type: Object,
      default() {
        return loading.customStyle
      }
    }
  },
  computed: {
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    getTextSize() {
      return this.$pi.common.addUnit(this.textSize)
    },
    // 加载中圆圈动画的样式
    cricleStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      if (this.type == 'circle')
        style.borderColor = `#e4e4e4 #e4e4e4 #e4e4e4 ${this.color ? this.color : '#c7c7c7'}`
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-loading {
  display: inline-block;
  .slot {
    display: inline-block;
    margin-left: 12rpx;
  }
  &.vertical {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    .slot {
      margin-top: 12rpx;
    }
  }
}
.loading-circle {
  display: inline-block;
  width: 28rpx;
  height: 28rpx;
  vertical-align: middle;
  background: 0 0;
  border: 2px solid;
  border-color: #e5e5e5 #e5e5e5 #e5e5e5 #8f8d8e;
  border-radius: 50%;
  animation: circle 1s linear infinite;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  animation: circle 1s steps(12) infinite;
  view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    &::before {
      display: block;
      width: 2px;
      height: 25%;
      margin: 0 auto;
      content: ' ';
      background-color: currentColor;
    }
  }

  @for $i from 1 through 12 {
    view:nth-of-type(#{$i}) {
      opacity: 1 - (0.75 / 12) * ($i - 1);
      transform: rotate($i * 30deg);
    }
  }
}
</style>
