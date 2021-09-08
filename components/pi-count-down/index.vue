<template>
  <view class="pi-count-down" :style="[customStyle]" :class="[customClass]">
    <view
      v-for="time in getShowTimes"
      :key="time.key"
      class="countdown-item"
      :class="time.name"
      :style="[time.name === 'time' ? timeStyle : separatorStyle]"
    >
      {{ time.value }}
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { countDown } = getConfig()

const TAG = 'PiCountDown'

export default {
  name: 'PiCountDown',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值，接收一个时间戳
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return countDown.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      default() {
        // ''
        return countDown.customClass
      }
    },
    // 每一个项时间的自定义样式
    timeStyle: {
      type: Object,
      default() {
        // {}
        return countDown.timeStyle
      }
    },
    // 每一个项分隔符的自定义样式
    separatorStyle: {
      type: Object,
      default() {
        // {}
        return countDown.separatorStyle
      }
    },
    autoplay: {
      type: Boolean,
      default() {
        // true
        return countDown.autoplay
      }
    },
    // 分隔符，
    separator: {
      // `'colon'-英文冒号` `'zh'-中文`
      type: String,
      default() {
        // `'colon'`
        return countDown.separator
      },
      validator: function(value) {
        return ['colon', 'zh'].includes(value)
      }
    },
    // 是否显示天
    showDay: {
      type: Boolean,
      default() {
        // true
        return countDown.showDay
      }
    },
    // 是否显示小时
    showHour: {
      type: Boolean,
      default() {
        // true
        return countDown.showHour
      }
    },
    // 是否显示分钟
    showMinute: {
      type: Boolean,
      default() {
        // true
        return countDown.showMinute
      }
    },
    // 是否显示秒
    showSecond: {
      type: Boolean,
      default() {
        // true
        return countDown.showSecond
      }
    }
  },
  data() {
    return {
      timer: null // 定时器
    }
  },
  computed: {
    showTime() {
      return this.$pi.date.calcuLeftTime(this.val, this.showDay)
    },
    getShowTimes() {
      const times = []

      if (this.showDay) {
        const separator = this.separator === 'colon' ? ':' : '天'
        times.push({ key: 'day-value', name: 'time', value: this.showTime.day })
        times.push({
          key: 'day-separator',
          name: 'separator',
          value: separator
        })
      }
      if (this.showHour) {
        const separator = this.separator === 'colon' ? ':' : '时'
        times.push({
          key: 'hour-value',
          name: 'time',
          value: this.showTime.hour
        })
        times.push({
          key: 'hour-separator',
          name: 'separator',
          value: separator
        })
      }
      if (this.showMinute) {
        const separator = this.separator === 'colon' ? ':' : '分'
        times.push({
          key: 'minute-value',
          name: 'time',
          value: this.showTime.minute
        })
        times.push({
          key: 'minute-separator',
          name: 'separator',
          value: separator
        })
      }
      if (this.showSecond) {
        const separator = this.separator === 'colon' ? ':' : '秒'
        times.push({
          key: 'second-value',
          name: 'time',
          value: this.showTime.second
        })
        this.separator === 'zh' &&
          times.push({
            key: 'second-separator',
            name: 'separator',
            value: separator
          })
      }
      return times
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.autoplay && this.run()
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    run() {
      this.clearTimer()
      if (this.timestamp <= 0) return
      this.timer = setInterval(() => {
        this.val--
        this.handleEmitChange()
        if (this.val <= 0) {
          return this.stop()
        }
      }, 1000)
    },
    stop() {
      this.clearTimer()
      // 停止倒计时
      this.$emit('stop', {})
    },
    // 清除定时器
    clearTimer() {
      if (this.timer) {
        // 清除定时器
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-count-down {
  display: inline-block;
  .countdown-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2rpx;
    text-align: center;
    white-space: nowrap;
    border-radius: 6rpx;
    // 欺骗浏览器使用gpu渲染
    transform: translateZ(0);
    &.time {
      position: relative;
      min-width: 44rpx;
      min-height: 44rpx;
      font-size: 24rpx;
    }
    &.separator {
      margin: 0 4rpx;
    }
  }
}
</style>
