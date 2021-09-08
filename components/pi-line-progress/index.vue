<template>
  <view
    class="pi-line-progress"
    :style="[progressStyle, customStyle]"
    :class="[customClass, { round: round }]"
  >
    <view
      class="active-bar"
      :class="[{ round: round }, { striped: striped }, { active: stripedActive }]"
      :style="[activeBarStyle]"
    >
      <view class="percent" :style="[{ height: getHeight, lineHeight: getHeight }, percentStyle]">
        <slot v-if="$slots.default || $slots.$default" />
        <template v-else-if="showPercent">
          {{ percent + '%' }}
        </template>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 线型进度条
 */
import { getConfig } from '../../config'
const { lineProgress } = getConfig()

const TAG = 'PiLineProgress'

export default {
  name: 'PiLineProgress',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return lineProgress.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return lineProgress.customClass
      }
    },
    // 两端是否半圆
    round: {
      type: Boolean,
      // true
      default: lineProgress.round
    },
    // 激活部分的颜色（不设置默认为主题色）
    activeColor: {
      type: String,
      // ''
      default: lineProgress.activeColor
    },
    // 未激活底色
    inactiveColor: {
      type: String,
      // '#ebeef5'
      default: lineProgress.inactiveColor
    },
    // 进度百分比，数值
    percent: {
      type: [String, Number],
      // 0
      default: lineProgress.percent
    },
    // 是否在进度条内部显示百分比的值
    showPercent: {
      type: Boolean,
      // true
      default: lineProgress.showPercent
    },
    // 当showPercent为true，设定百分比的样式
    percentStyle: {
      type: Object,
      default() {
        // {}
        return lineProgress.percentStyle
      }
    },
    // 进度条的宽度，单位rpx
    width: {
      type: [String, Number],
      // 0
      default: lineProgress.width
    },
    // 进度条的高度，单位rpx
    height: {
      type: [String, Number],
      // 20
      default: lineProgress.height
    },
    // 是否显示条纹
    striped: {
      type: Boolean,
      // false
      default: lineProgress.striped
    },
    // 条纹是否具有动态效果
    stripedActive: {
      type: Boolean,
      // false
      default: lineProgress.stripedActive
    }
  },
  computed: {
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    progressStyle() {
      const style = {
        height: this.getHeight,
        background: this.inactiveColor
      }
      if (this.width) style.width = this.$pi.common.addUnit(this.width)
      return style
    },
    activeBarStyle() {
      const style = {
        height: this.getHeight,
        lineHeight: this.getHeight,
        width: this.percent + '%'
      }
      if (this.activeColor) style.background = this.activeColor
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.round {
  border-radius: 200px;
}
.pi-line-progress {
  overflow: hidden;

  .active-bar {
    position: relative;
    font-size: 0;
    text-align: right;
    white-space: nowrap;
    vertical-align: middle;
    background: $pi-primary-color;
    transition: all $pi-animation-duration $pi-animation-timing-function;
    &::after {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      content: '';
    }
    &.striped {
      &.active {
        animation: progress-stripes 2s linear infinite;
      }
      /* stylelint-disable */
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 39px 39px;
    }

    .percent {
      display: inline-block;
      padding: 0 12rpx;
      font-size: 18rpx;
      color: #ffffff;
      text-align: right;
      white-space: nowrap;
      vertical-align: middle;
    }
  }
}

@keyframes progress-stripes {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 39px 0;
  }
}
</style>
