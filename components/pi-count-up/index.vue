<template>
  <view
    class="pi-count-up-wrapper"
    :style="{
      fontSize: fontSize + 'rpx',
      color: fontColor
    }"
  >
    <slot :val="showingVal">{{ showingVal }}</slot>
  </view>
</template>

<script>
import { getConfig } from '../../config'
const { countUp } = getConfig()

export default {
  name: 'PiCountUp',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return countUp.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      default() {
        // ''
        return countUp.customClass
      }
    },
    // 开始的数值，默认从0增长到某一个数
    startNum: {
      type: [Number, String],
      default: countUp.startNum
    },
    // 要滚动的目标数值，必须
    endNum: {
      type: [Number, String],
      default: 0,
      required: countUp.endNum
    },
    // 滚动到目标数值的动画持续时间，单位为毫秒（ms）
    duration: {
      type: [Number, String],
      default: countUp.duration
    },
    // 设置数值后是否自动开始滚动
    autoplay: {
      type: Boolean,
      default: countUp.autoplay
    },
    // 要显示的小数位数
    decimals: {
      type: [Number, String],
      default: countUp.decimals
    },
    // 千位符分隔符，默认为空
    thousands: {
      type: [String],
      default: countUp.thousands
    },
    // 是否在即将到达目标数值的时候，使用缓慢滚动的效果
    isEase: {
      type: Boolean,
      default: countUp.isEase
    },
    // 字体颜色
    fontColor: {
      type: String,
      default: countUp.fontColor
    },
    // 字体大小
    fontSize: {
      type: [Number, String],
      default: countUp.fontSize
    }
  },
  data() {
    return {
      localStartNum: this.startNum,
      showingVal: this.formatNumber(this.startNum),
      printVal: null,
      paused: false, // 是否暂停
      localDuration: Number(this.duration),
      startTime: null, // 开始的时间
      timestamp: null, // 时间戳
      remaining: null, // 停留的时间
      animationInstance: null,
      lastTime: 0 // 上一次的时间
    }
  },
  computed: {
    countDown() {
      return this.startNum > this.endNum
    }
  },
  watch: {
    startNum() {
      this.autoplay && this.start()
    },
    endNum() {
      this.autoplay && this.start()
    }
  },
  mounted() {
    this.autoplay && this.start()
  },
  methods: {
    easingFn(t, b, c, d) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
    },
    requestAnimationFrame(callback) {
      const currTime = new Date().getTime()
      // 为了使setTimteout的尽可能的接近每秒60帧的效果
      const timeToCall = Math.max(0, 16 - (currTime - this.lastTime)) // 计算当前一帧内还剩多少时间
      const id = setTimeout(() => {
        callback(currTime + timeToCall)
      }, timeToCall)
      this.lastTime = currTime + timeToCall
      return id
    },

    cancelAnimationFrame(id) {
      clearTimeout(id)
    },
    // 开始滚动数字
    start() {
      this.localStartNum = this.startNum
      this.startTime = null
      this.localDuration = this.duration
      this.paused = false
      this.animationInstance = this.requestAnimationFrame(this.count)
    },
    // 暂定状态，重新再开始滚动；或者滚动状态下，暂停
    reStart() {
      if (this.paused) {
        this.resume()
        this.paused = false
      } else {
        this.stop()
        this.paused = true
      }
    },
    // 暂停
    stop() {
      this.cancelAnimationFrame(this.animationInstance)
    },
    // 重新开始(暂停的情况下)
    resume() {
      this.startTime = null
      this.localDuration = this.remaining
      this.localStartNum = this.printVal
      this.requestAnimationFrame(this.count)
    },
    // 重置
    reset() {
      this.startTime = null
      this.cancelAnimationFrame(this.animationInstance)
      this.showingVal = this.formatNumber(this.startNum)
    },
    count(timestamp) {
      if (!this.startTime) this.startTime = timestamp
      this.timestamp = timestamp
      const progress = timestamp - this.startTime
      this.remaining = this.localDuration - progress
      if (this.isEase) {
        if (this.countDown) {
          this.printVal =
            this.localStartNum -
            this.easingFn(progress, 0, this.localStartNum - this.endNum, this.localDuration)
        } else {
          this.printVal = this.easingFn(
            progress,
            this.localStartNum,
            this.endNum - this.localStartNum,
            this.localDuration
          )
        }
      } else {
        if (this.countDown) {
          this.printVal =
            this.localStartNum -
            (this.localStartNum - this.endNum) * (progress / this.localDuration)
        } else {
          this.printVal =
            this.localStartNum +
            (this.endNum - this.localStartNum) * (progress / this.localDuration)
        }
      }
      this.printVal = this.countDown
        ? Math.max(this.printVal, this.endNum)
        : Math.min(this.printVal, this.endNum)
      this.showingVal = this.formatNumber(this.printVal)
      if (progress < this.localDuration) {
        this.animationInstance = this.requestAnimationFrame(this.count)
      } else {
        this.$emit('end')
      }
    },
    // 判断是否数字
    isNumber(val) {
      return !isNaN(parseFloat(val))
    },
    formatNumber(num) {
      num = Number(num)
      num = num.toFixed(Number(this.decimals))
      num += ''
      return this.$pi.format.numFormat(num, this.decimals, this.thousands)
    },
    destroyed() {
      this.cancelAnimationFrame(this.animationInstance)
    }
  }
}
</script>

<style lang="scss" scoped></style>
