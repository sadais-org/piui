<template>
  <view
    :style="[customStyle]"
    class="pi-marquee-pure-css"
    :class="[customClass, directionClass]"
  >
    <view
      class="marquee-content"
      :class="animationClass"
      :style="animationStyle"
    >
      <!-- 第一组内容 -->
      <view class="marquee-group">
        <view
          v-for="(item, index) in items"
          :key="`first-${index}`"
          class="marquee-item"
        >
          <slot name="item" :item="item" :index="index">
            <text>{{ item }}</text>
          </slot>
        </view>
      </view>

      <!-- 第二组内容（用于无缝循环） -->
      <view class="marquee-group">
        <view
          v-for="(item, index) in items"
          :key="`second-${index}`"
          class="marquee-item"
        >
          <slot name="item" :item="item" :index="index">
            <text>{{ item }}</text>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiMarqueePureCss'
const { marqueePureCss } = getConfig()

export default {
  name: 'PiMarqueePureCss',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        return marqueePureCss.customStyle || {}
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        return marqueePureCss.customClass || ''
      }
    },
    // 滚动方向: 'left', 'right', 'up', 'down'
    direction: {
      type: String,
      default: marqueePureCss.direction,
      validator: value => ['left', 'right', 'up', 'down'].includes(value)
    },
    // 动画持续时间（秒）
    duration: {
      type: [Number, String],
      default: marqueePureCss.duration
    },
    // 动画速度曲线
    timingFunction: {
      type: String,
      default: marqueePureCss.timingFunction
    },
    // 是否暂停动画
    paused: {
      type: Boolean,
      default: marqueePureCss.paused
    },
    // 轮播数据
    items: {
      type: Array,
      default: () => marqueePureCss.items
    },
    // 每个item之间的间距（单位：rpx）
    itemGap: {
      type: [Number, String],
      default: marqueePureCss.itemGap
    }
  },
  computed: {
    directionClass() {
      return `direction-${this.direction}`
    },
    animationClass() {
      return `marquee-${this.direction}`
    },
    animationStyle() {
      const style = {
        animationDuration: `${this.duration}s`,
        animationTimingFunction: this.timingFunction,
        animationPlayState: this.paused ? 'paused' : 'running'
      }

      // 如果有间距，添加gap样式
      if (this.itemGap && this.itemGap > 0) {
        if (['left', 'right'].includes(this.direction)) {
          style.gap = `${this.itemGap}rpx`
        } else {
          style.rowGap = `${this.itemGap}rpx`
        }
      }

      return style
    }
  },
  methods: {
    /**
     * 暂停动画
     */
    pause() {
      this.$emit('update:paused', true)
    },

    /**
     * 恢复动画
     */
    resume() {
      this.$emit('update:paused', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-marquee-pure-css {
  overflow: hidden;
  position: relative;

  &.direction-left,
  &.direction-right {
    width: 100%;
    white-space: nowrap;
  }

  &.direction-up,
  &.direction-down {
    height: 100%;
  }
}

.marquee-content {
  display: flex;

  .direction-left &,
  .direction-right & {
    flex-direction: row;
    width: fit-content;
  }

  .direction-up &,
  .direction-down & {
    flex-direction: column;
    height: fit-content;
  }
}

.marquee-group {
  display: flex;
  flex-shrink: 0;

  .direction-left &,
  .direction-right & {
    flex-direction: row;
  }

  .direction-up &,
  .direction-down & {
    flex-direction: column;
  }
}

.marquee-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;

  .direction-left &,
  .direction-right & {
    display: inline-flex;
    white-space: nowrap;
  }

  .direction-up &,
  .direction-down & {
    width: 100%;
  }
}

/* 左滚动动画 */
.marquee-left {
  animation: marquee-scroll-left infinite;
}

@keyframes marquee-scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 右滚动动画 */
.marquee-right {
  animation: marquee-scroll-right infinite;
}

@keyframes marquee-scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

/* 上滚动动画 */
.marquee-up {
  animation: marquee-scroll-up infinite;
}

@keyframes marquee-scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

/* 下滚动动画 */
.marquee-down {
  animation: marquee-scroll-down infinite;
}

@keyframes marquee-scroll-down {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}

/* 响应式处理 */
@media screen and (max-width: 750px) {
  .marquee-item {
    font-size: 28rpx;
  }
}
</style>
