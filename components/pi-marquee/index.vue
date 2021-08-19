<template>
  <div
    class="marquee-container"
    :class="{ vertical: direction === 'vertical' }"
    @mouseenter="handlePause"
    @mouseleave="handleStart"
  >
    <div class="inner" :style="animateTime">
      <!-- 默认插槽：放置pi-marquee-item -->
      <slot />
    </div>
    <div v-if="showCopy" class="inner" :style="animateTime">
      <slot />
    </div>
  </div>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiMarquee'
const { marquee } = getConfig()
export default {
  name: TAG,
  props: {
    // 控制方向
    direction: {
      // `'vertical'` or `'horizontal'`
      type: String,
      // `'horizontal'`
      default: marquee.direction
    },
    // 动画移动速度:每毫秒移动多少像素
    speed: {
      type: Number,
      // 0.2s
      default: marquee.speed
    },
    // 是否支持鼠标移上去暂停滚动
    hoverPause: {
      type: Boolean,
      // true
      default: marquee.hoverPause
    }
  },
  data() {
    return {
      children: [],
      animateTime: '',
      showCopy: false
    }
  },
  watch: {
    direction() {
      this.children.forEach(i => (i.direction = this.direction))
      this.updateTime()
    },
    duration: {
      immediate: true,
      handler() {
        this.handlePause()
        this.updateTime()
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateTime)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateTime)
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
      this.animateTime = 'animation: none'
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
      this.updateTime()
    },
    updateTime() {
      this.$nextTick(() => {
        const containerWidth = this.$el.clientWidth
        const containerHeight = this.$el.clientHeight
        const inner = this.$el.children[0]
        if (!inner) {
          // 没有marquee-item 则直接停止动画 隐藏拷贝
          this.handlePause()
          this.showCopy = false
          return
        }
        if (this.direction !== 'vertical') {
          if (inner.offsetWidth <= containerWidth) {
            this.handlePause()
            this.showCopy = false
          } else {
            const time = inner.offsetWidth / this.speed / 1000
            this.animateTime = `animation-duration: ${time}s`
            this.showCopy = true
          }
        } else {
          if (inner.offsetHeight <= containerHeight) {
            this.animateTime = 'animation: none'
            this.showCopy = false
          } else {
            const time = inner.offsetHeight / this.speed / 1000
            this.animateTime = `animation-duration: ${time}s`
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
}

.marquee-container > .inner {
  display: inline-block;
  height: 100%;
  white-space: nowrap;
  animation: roll 0s linear infinite;
}

.marquee-container.vertical {
  height: 100%;
  white-space: normal;
  overflow: hidden auto;
}

.marquee-container.vertical > .inner {
  height: auto;
  width: 100%;
  white-space: normal;
  animation: roll-vertical 0s linear infinite;
}

@keyframes roll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes roll-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>
