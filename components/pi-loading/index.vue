<template>
  <view
    v-if="show"
    class="pi-loading"
    :style="[customStyle, loadingStyle]"
    :class="[customClass, vertical ? 'vertical' : '']"
  >
    <view v-if="type === 'round'" class="loading-round" :style="[cricleStyle]" />
    <view v-if="type === 'spinner'" class="loading-spinner" :style="[cricleStyle]">
      <view v-for="line of 12" :key="line" />
    </view>
    <view
      v-if="$slots.default || $slots.$default"
      :style="[textStyle, loadingTextSize]"
      class="slot"
    >
      <slot />
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiLoading'
const { loading } = getConfig()

export default {
  name: 'PiLoading',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      // {}
      default() {
        return loading.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return loading.customClass
      }
    },
    // 是否显示loading
    show: {
      type: Boolean,
      // false
      default: false
    },
    // 颜色
    color: {
      type: String,
      // ''
      default: loading.color
    },
    // loading类型
    type: {
      // `'spinner'-菊花` `'round'-圆环`
      type: String,
      // `'spinner'`
      default: loading.type,
      validator: function(value) {
        return ['spinner', 'round'].includes(value)
      }
    },
    // 尺寸,默认单位rpx
    size: {
      type: [String, Number],
      // 32
      default: loading.size
    },
    // 是否垂直排列
    vertical: {
      type: Boolean,
      // false
      default: loading.vertical
    },
    // 文字尺寸,默认单位rpx
    textSize: {
      type: [String, Number],
      // '28'
      default: loading.textSize
    },
    // 文字样式
    textStyle: {
      type: Object,
      // {}
      default() {
        return loading.textStyle
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
    loadingStyle() {
      const style = {
        fontSize: this.getSize
      }
      if (this.color) style.color = this.color
      return style
    },
    // 加载中圆圈动画的样式
    cricleStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      return style
    },
    loadingTextSize() {
      const style = {
        fontSize: this.getTextSize
      }
      if (this.textStyle.fontSize) style.fontSize = this.textStyle.fontSize
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-loading {
  display: inline-block;
  overflow: hidden;
  line-height: 1;
  color: $pi-primary-color;
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
.loading-round {
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  background: 0 0;
  border: 2px solid;
  border-color: #e5e5e5 #e5e5e5 #e5e5e5 currentColor;
  border-radius: 50%;
  animation: round 1s linear infinite;
}

.loading-spinner {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  animation: round 1s steps(12) infinite;
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
      opacity: 1 - 0.0625 * ($i - 1);
      transform: rotate($i * 30deg);
    }
  }
}
</style>
