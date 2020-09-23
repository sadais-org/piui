<template>
  <view
    class="pi-line-progress"
    :style="[progressStyle, customStyle]"
    :class="[customClass, { 'pi-round': round }]"
  >
    <view
      class="active-bar pi-align-center pi-justify-end"
      :class="[{ 'pi-round': round }, { striped: striped }, { active: 'stripedActive' }]"
      :style="[activeBarStyle]"
    >
      <slot v-if="$slots.default || $slots.$default" />
      <view v-else-if="showPercent" class="percent">
        {{ percent + '%' }}
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 线型进度条
 */
import { systemInfo } from '../../tools/system'

import { getConfig } from '../../config'
const { lineProgress } = getConfig()

const TAG = 'PiLineProgress'

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return lineProgress.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return lineProgress.customClass
      }
    },
    // 两端是否半圆（默认值：false）
    round: {
      required: false,
      type: Boolean,
      default: lineProgress.round
    },
    // 激活部分的颜色（不设置默认为主题色）
    activeColor: {
      required: false,
      type: String,
      default: lineProgress.activeColor
    },
    // 未激活底色
    inactiveColor: {
      required: false,
      type: String,
      default: lineProgress.inactiveColor
    },
    // 进度百分比，数值
    percent: {
      required: false,
      type: [String, Number],
      default: lineProgress.percent
    },
    // 是否在进度条内部显示百分比的值
    showPercent: {
      required: false,
      type: Boolean,
      default: lineProgress.showPercent
    },
    // 当showPercent为true，设定百分比的样式
    percentStyle: {
      type: Object,
      default() {
        return lineProgress.percentStyle
      }
    },
    // 进度条的高度，单位rpx
    height: {
      required: false,
      type: [String, Number],
      default: lineProgress.height
    },
    // 是否显示条纹
    striped: {
      required: false,
      type: Boolean,
      default: lineProgress.striped
    },
    // 条纹是否具有动态效果
    stripedActive: {
      required: false,
      type: Boolean,
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
        backgroundColor: this.inactiveColor
      }
      return style
    },
    activeBarStyle() {
      const style = {
        width: this.percent + '%'
      }
      if (this.activeColor) style.backgroundColor = this.activeColor
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-line-progress {
  .active-bar {
    background: $pi-primary-color;
    transition: all $pi-animation-duration ease-in-out;
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
      padding-right: 10rpx;
      font-size: 18rpx;
      line-height: 1;
      color: #ffffff;
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
