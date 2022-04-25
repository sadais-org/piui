<template>
  <view
    :style="[customStyle]"
    class="marquee-container"
    :class="[customClass, isVertical ? 'vertical' : '']"
    @mouseenter="handlePause"
    @mouseleave="handleStart"
    @touchmove.stop.prevent="() => {}"
    @mousewheel.stop.prevent="() => {}"
  >
    <view class="inner-wrap" :class="direction" :style="[animate]">
      <view v-for="(marqueeItems, index) in getItems" :key="index" class="inner">
        <view
          v-for="(item, idx) in marqueeItems"
          :key="idx"
          class="marquee-item"
          :class="{ vertical: isVertical }"
          :style="[getItemStyle]"
        >
          <!-- item插槽 -->
          <slot name="item" :item="item">
            <view>{{ item }}</view>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiMarquee'
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
    },
    // 每个item是否占据整个宽度
    itemFullWidth: {
      type: Boolean,
      // false
      default: marquee.itemFullWidth
    },
    // 延迟多少毫秒后开始滚动
    runDelay: {
      type: [Number, String],
      // 500
      default: marquee.runDelay
    }
  },
  data() {
    return {
      animate: {},
      containerWidth: 'auto',
      cloneItems: false
    }
  },
  computed: {
    isVertical() {
      return ['tb', 'bt'].includes(this.direction)
    },
    getItemStyle() {
      const style = {}
      if (this.itemFullWidth && this.containerWidth !== 'auto') {
        style.width = `${this.containerWidth}px`
      }
      return style
    },
    getItems() {
      if (!this.cloneItems) return [this.items]
      return [this.items, this.items]
    }
  },
  watch: {
    customStyle() {
      this.init()
    },
    customClass() {
      this.init()
    },
    direction() {
      this.init()
    },
    speed: {
      immediate: true,
      handler() {
        this.handlePause()
        this.init()
        this.handleStart()
      }
    },
    items: {
      immediate: true,
      handler() {
        this.handlePause()
        this.init()
        this.handleStart()
      }
    }
  },
  mounted() {
    window && window.addEventListener('resize', this.init)
  },
  beforeDestroy() {
    window && window.removeEventListener('resize', this.init)
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
      setTimeout(() => {
        this.$set(this.animate, 'animationPlayState', 'running')
      }, parseInt(this.runDelay, 10))
    },
    init() {
      this.$nextTick(async () => {
        const rect = await this.$pi.common.queryRect(this, '.marquee-container', false)
        this.containerWidth = rect.width
        const containerHeight = rect.height
        const inner = await this.$pi.common.queryRect(this, '.inner', false)

        if (!inner) {
          // 没有marquee-item 则直接停止动画 隐藏拷贝
          this.handlePause()
          this.cloneItems = false
          return
        }
        if (!this.isVertical) {
          console.log(TAG, '横向滚动', inner.width, this.containerWidth)
          // 横向滚动
          if (!this.itemFullWidth && inner.width < this.containerWidth) {
            this.handlePause()
            this.cloneItems = false
          } else {
            const time = inner.width / this.speed
            this.$set(this.animate, 'animationDuration', `${time}s`)
            this.cloneItems = true
          }
        } else {
          // 纵向滚动
          if (inner.height < containerHeight) {
            this.$set(this.animate, 'animationPlayState', 'paused')
            this.cloneItems = false
          } else {
            const time = inner.height / this.speed
            this.$set(this.animate, 'animationDuration', `${time}s`)
            this.cloneItems = true
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
  overflow: hidden;
  font-size: 0;
  white-space: nowrap;
  background: #ffffff;
}

.marquee-container .inner {
  display: inline-block;
  height: 100%;
  white-space: nowrap;
}

.marquee-container.vertical {
  height: 100%;
  overflow: hidden auto;
  white-space: normal;
}

.marquee-container.vertical .inner {
  width: 100%;
  height: auto;
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
  width: 100%;
  white-space: normal;
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
