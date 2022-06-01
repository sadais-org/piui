<template>
  <view
    class="pi-bubble pi-rela pi-flex pi-align-center pi-justify-center"
    :style="[customStyle]"
    :class="customClass"
    @longpress.stop="handleLongpress"
  >
    <slot />
    <view v-show="showBubble" class="pi-bubble-wrapper" :class="[bubbleClass]">
      <view
        ref="bubble"
        class="pi-bubble-content pi-abso pi-bg-white pi-radius-4 pi-pd-20"
        :style="[bubbleStyle]"
      >
        <slot name="bubble" />
        <view class="pi-bubble-angle pi-abso" />
      </view>
    </view>
    <pi-mask v-model="showMaks" background="transparent" @close="showBubble = false" />
  </view>
</template>

<script>
/**
 * bubble 气泡弹窗
 */
import { getConfig } from '../../config'
const TAG = 'PiBubble'
const { bubble } = getConfig()

// 底部栏
export default {
  name: 'PiBubble',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return bubble.customStyle
      }
    },
    customClass: {
      type: String,
      // ''
      default() {
        return bubble.customClass
      }
    },
    position: {
      type: String,
      default() {
        return bubble.position
      }
    },
    zIndex: {
      type: Number,
      default() {
        return bubble.zIndex
      }
    }
  },
  data() {
    return {
      showBubble: false,
      showMaks: false,
      bubleWidth: 0,
      sysInfo: {},
      bublePosition: {
        top: 0,
        left: 0
      }
    }
  },
  computed: {
    rpxRatio() {
      return 750 / this.screenWidth
    },
    screenWidth() {
      return this.sysInfo.screenWidth
    },
    bubblePosition() {
      return this.position === 'bottom' ? 'top' : 'bottom'
    },
    bubbleStyle() {
      return {
        zIndex: this.zIndex,
        ...this.bublePosition
      }
    },
    bubbleClass() {
      return this.position === 'top' ? 'isTop' : ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.sysInfo = uni.getSystemInfoSync()
    },
    async handleLongpress(e) {
      await this.calcBubblePosition()
      this.showBubble = true
      this.showMaks = true
    },
    getBubbleWidth() {
      return new Promise(reslove => {
        this.$set(this, 'bublePosition', { top: '-9999vh', left: 0 })
        this.showBubble = true
        setTimeout(() => {
          reslove(this.$refs.bubble ? this.$refs.bubble.$el.getBoundingClientRect().width : 0)
          this.showBubble = false
        }, 500)
      })
    },
    async calcBubblePosition() {
      let bublePosition = this.$el.getBoundingClientRect()
      this.bubleWidth = await this.getBubbleWidth()
      const lengthGap = (this.bubleWidth - bublePosition.width) / 2
      const compRight = this.screenWidth - bublePosition.x - bublePosition.width
      const posRes = {}
      if (lengthGap <= 0 || (lengthGap < bublePosition.x && lengthGap < compRight)) {
        posRes.left = -Math.abs(lengthGap) + 'px'
      } else {
        posRes.right = 4 - Math.min(bublePosition.x, compRight) + 'px'
      }
      posRes[this.bubblePosition] = 'calc(100% + 18rpx)'
      this.$set(this, 'bublePosition', posRes)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-bubble {
  width: fit-content;
  height: fit-content;
  .pi-bubble-wrapper {
    filter: drop-shadow(0 0 2rpx #000);
    z-index: 9999;
    position: absolute;
    width: 100%;
    height: 0;
    top: 100%;
    &.isTop {
      top: 0;
      .pi-bubble-content {
        .pi-bubble-angle {
          top: initial;
          bottom: -10rpx;
        }
      }
    }
    .pi-bubble-content {
      max-width: 98vw;
      line-height: 30rpx;
      color: #fff;
      z-index: 9999;
      background-color: #000;
      .pi-bubble-angle {
        top: -10rpx;
        left: 50%;
        z-index: 9999;
        width: 0rpx;
        height: 0rpx;
        border: 12rpx solid #000;
        transform: translateX(-50%) rotate(45deg);
        transform-origin: center;
      }
    }
  }
}
</style>
