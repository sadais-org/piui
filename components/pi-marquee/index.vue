<template>
  <view
    :style="[customStyle]"
    class="marquee-container"
    :class="[customClass, isVertical ? 'vertical' : '']"
    @mouseenter="handlePause"
    @mouseleave="handleStart"
    @touchmove.stop.prevent
    @mousewheel.stop.prevent
  >
    <view class="inner-wrap" :class="direction" :style="[animate]">
      <view id="firstInner" class="inner">
        <view
          v-for="(item, idx) in items"
          :key="idx"
          class="marquee-item"
          :style="[itemStyle]"
          :class="{ vertical: isVertical }"
        >
          <slot name="item" :item="item" />
        </view>
      </view>
      <view v-if="showCopy" class="inner">
        <view
          v-for="(item, idx) in items"
          :key="idx"
          class="marquee-item"
          :style="[itemStyle]"
          :class="{ vertical: isVertical }"
        >
          <slot name="item" :item="item" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'
// const TAG = 'PiMarquee'
const { marquee } = getConfig()
export default {
  name: 'PiMarquee',
  props: {
    customStyle: {
      type: Object,
      // {}
      default() {
        return marquee.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return marquee.customClass
      }
    },
    // 控制滚动方向方向
    direction: {
      // `'lr'`、`'rl'`、`'tb'`、`'bt'`
      type: String,
      // `'rl'`
      default: marquee.direction
    },
    // 动画移动速度:每秒移动多少像素
    speed: {
      type: Number,
      // 100
      default: marquee.speed
    },
    // 是否支持鼠标移上去暂停滚动
    hoverPause: {
      type: Boolean,
      // true
      default: marquee.hoverPause
    },
    // 轮播数据
    items: {
      type: Array,
      // `[]`
      default: () => marquee.items
    }
  },
  data() {
    return {
      animate: {},
      showCopy: false
    }
  },
  computed: {
    isVertical() {
      return ['tb', 'bt'].includes(this.direction)
    }
  },
  watch: {
    customStyle() {
      this.updateTime()
    },
    customClass() {
      this.updateTime()
    },
    direction() {
      this.updateTime()
    },
    speed: {
      immediate: true,
      handler() {
        this.handlePause()
        this.updateTime()
        this.handleStart()
      }
    }
  },
  mounted() {
    window && window.addEventListener('resize', this.updateTime)
  },
  beforeDestroy() {
    window && window.removeEventListener('resize', this.updateTime)
  },
  methods: {
    /**
     * @vuese
     * 暂停动画
     * @arg 无
     */
    handlePause() {
      if (!this.hoverPause) {
        return
      }
      this.$set(this.animate, 'animationPlayState', 'paused')
    },
    /**
     * @vuese
     * 开始动画 重新计算动画时间
     * @arg 无
     */
    handleStart() {
      if (!this.hoverPause) {
        return
      }
      this.$set(this.animate, 'animationPlayState', 'running')
    },
    updateTime() {
      this.$nextTick(async () => {
        const rect = await this.$pi.common.queryRect(this, '.marquee-container', false)
        const containerWidth = rect.width
        const containerHeight = rect.height
        const inner = await this.$pi.common.queryRect(this, '#firstInner', false)

        if (!inner) {
          // 没有marquee-item 则直接停止动画 隐藏拷贝
          this.handlePause()
          this.showCopy = false
          return
        }
        if (!this.isVertical) {
          if (inner.width <= containerWidth) {
            this.handlePause()
            this.showCopy = false
          } else {
            const time = inner.width / this.speed
            this.$set(this.animate, 'animationDuration', `${time}s`)
            this.showCopy = true
          }
        } else {
          if (inner.height <= containerHeight) {
            this.$set(this.animate, 'animationPlayState', 'paused')
            this.showCopy = false
          } else {
            const time = inner.height / this.speed
            this.$set(this.animate, 'animationDuration', `${time}s`)
            this.showCopy = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.marquee-container {
  width: 100%;
  white-space: nowrap;
  overflow: auto hidden;
  background: #ffffff;
  font-size: 0px;
}

.marquee-container .inner {
  display: inline-block;
  height: 100%;
  white-space: nowrap;
}

.marquee-container.vertical {
  height: 100%;
  white-space: normal;
  overflow: hidden auto;
}

.marquee-container.vertical .inner {
  height: auto;
  width: 100%;
  white-space: normal;
}

.inner-wrap {
  display: inline-block;
  white-space: nowrap;
  &.lr {
    animation: roll-lr 0s linear infinite;
  }
  &.rl {
    animation: roll-rl 0s linear infinite;
  }
  &.tb {
    animation: roll-tb 0s linear infinite;
  }
  &.bt {
    animation: roll-bt 0s linear infinite;
  }
}

.marquee-container.vertical > .inner-wrap {
  white-space: normal;
  width: 100%;
}

@keyframes roll-lr {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes roll-rl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes roll-bt {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes roll-tb {
  0% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0%);
  }
}

.marquee-item {
  position: relative;
  display: inline-block;
  font-size: 28rpx;
}

.marquee-item.vertical {
  width: 100%;
  height: auto;
}
</style>
