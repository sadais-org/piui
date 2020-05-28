<template>
  <mask-content
    :is-show="isShow"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    @close="handleClose"
  >
    <view class="pi-scroll-container" @tap.stop>
      <scroll-view
        scroll-x
        class="pi-navi pi-bg-white"
        scroll-with-animation
        :scroll-left="scrollLeft"
      >
        <view
          class="pi-navi-item"
          :class="{ active: currentTabId === 'date' }"
          @tap="handleTabSelect('date')"
        >
          {{ displayDate }}
        </view>
        <view
          class="pi-navi-item"
          :class="{ active: currentTabId === 'time' }"
          @tap="handleTabSelect('time')"
        >
          {{ displayTime }}
        </view>
      </scroll-view>
      <view class="pi-scroll">
        <view v-show="currentTabId === 'date'" class="pi-width-100P pi-height-100P">
          <calendar
            :date="date"
            :insert="true"
            :start-date="startDate"
            :end-date="endDate"
            :range="range"
            @change="handleDateChange"
          />
        </view>
        <view v-show="currentTabId === 'time'" class="pi-width-100P pi-height-100P">
          <picker-view
            v-if="isShow && currentTabId === 'time'"
            :value="time"
            :indicator-style="indicatorStyle"
            class="pi-text-center pi-height-100P"
            @change="handleTimeChange"
          >
            <picker-view-column>
              <view v-for="item in hours" :key="item" class="time-item">{{ item }}</view>
            </picker-view-column>
            <picker-view-column>
              <view v-for="item in minutes" :key="item" class="time-item">{{ item }}</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
      <view class="pi-absolute-rt pi-primary pi-fz-32 pi-fw-500 confirm" @tap="handleConfirm">
        确定
      </view>
    </view>
  </mask-content>
</template>

<script>
import MaskContent from '@/src/PiUI-basic/components/mask-content.vue'
import Calendar from './calendar'

export default {
  components: {
    MaskContent,
    Calendar
  },
  props: {
    // 初始值
    value: {
      required: false,
      type: String
    },
    // 是否显示
    isShow: {
      required: false,
      type: Boolean,
      default: false
    },
    // 点击蒙层是否允许关闭
    maskClosable: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      default: false
    },
    /**
     * 开始时间
     */
    startDate: {
      type: String,
      default: ''
    },
    /**
     * 结束时间
     */
    endDate: {
      type: String,
      default: ''
    },
    /**
     * 范围
     */
    range: {
      type: Boolean,
      default: false
    },
    // 分钟步进（假如设定为1，那么就是显示60分钟供选择，假如设定为2，那么就是显示0,2,4,6供选择）
    minuteStep: {
      required: false,
      type: Number,
      default: 30
    }
  },
  data() {
    const hours = []
    const minutes = []
    for (let i = 0; i < 24; i++) {
      hours.push(i)
    }
    for (let i = 0; i <= 59 / this.minuteStep; i++) {
      minutes.push(i * this.minuteStep)
    }

    const defaultDate = this.$dayjs().format('YYYY-MM-DD')
    const defaultTime = [9, 0]

    return {
      currentTabId: 'date',
      scrollLeft: 0,
      date: defaultDate,
      time: defaultTime,
      hours,
      minutes,
      indicatorStyle: `height: ${uni.upx2px(100)}px;line-height: ${uni.upx2px(100)}px;`
    }
  },
  computed: {
    displayDate() {
      return this.$dayjs(this.date).format('YYYY年MM月DD日')
    },
    displayTime() {
      return `${this.padStart(this.time[0])}:${this.padStart(this.time[1] * this.minuteStep)}`
    }
  },
  watch: {
    value() {
      if (this.value) {
        // 如果有初始值，按照初始值初始化
        const dayjsValue = this.$dayjs(this.value)
        this.date = dayjsValue.format('YYYY-MM-DD')
        this.time = [dayjsValue.hour(), dayjsValue.minute() / this.minuteStep]
      }
    }
  },
  methods: {
    padStart(num) {
      if (num < 10) {
        return '0' + num
      }
      return '' + num
    },
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      const value = this.$dayjs(this.date + ' ' + this.displayTime).format('YYYY-MM-DD HH:mm')
      this.$emit('change', value)
      this.handleClose()
    },
    handleTabSelect(id) {
      this.currentTabId = id
    },
    handleDateChange(e) {
      this.date = e.fulldate
    },
    handleTimeChange(e) {
      this.time = e.detail.value
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-scroll-container {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 768rpx;
  background-color: #ffffff;
  .pi-navi-item {
    display: inline-block;
  }
  .time-item {
    height: 100rpx;
    line-height: 100rpx;
  }
  .confirm {
    z-index: 11;
    height: $pi-navi-height;
    padding-right: 32rpx;
    line-height: $pi-navi-height;
  }
}
</style>
