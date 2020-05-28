<template>
  <view class="uni-calendar" @touchmove.stop.prevent="clean">
    <view class="uni-calendar__content">
      <view class="uni-calendar__header pi-solid-bottom-1">
        <view class="pi-flex-sub pi-justify-center">
          <view class="pi-align-center">
            <!-- 上一年 -->
            <view class="pi-icon-before pi-primary pi-pd-8 " @tap="yearChange(-1)" />
            <!-- 上一个月 -->
            <view class="pi-icon-back pi-primary pi-pd-8" @tap="pre" />
            <!-- 当前年月 -->
            <text class="uni-calendar__header-text">
              {{ (nowDate.year || '') + '年' + (nowDate.month || '') + '月' }}
            </text>
            <!-- 下一个月 -->
            <view class="pi-icon-right pi-primary pi-pd-8" @tap="next" />
            <!-- 下一年 -->
            <view class="pi-mg-left-32 pi-icon-next pi-primary pi-pd-8" @tap="yearChange(1)" />
          </view>
        </view>
        <text class="uni-calendar__backtoday" @tap="backtoday">回到今天</text>
      </view>
      <view class="uni-calendar__box">
        <view v-if="showMonth" class="uni-calendar__box-bg">
          <text class="uni-calendar__box-bg-text">{{ nowDate.month }}</text>
        </view>
        <view class="uni-calendar__weeks">
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">日</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">一</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">二</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">三</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">四</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">五</text>
          </view>
          <view class="uni-calendar__weeks-day">
            <text class="uni-calendar__weeks-day-text">六</text>
          </view>
        </view>
        <view v-for="(item, weekIndex) in weeks" :key="weekIndex" class="uni-calendar__weeks">
          <view v-for="(weeks, weeksIndex) in item" :key="weeksIndex" class="uni-calendar__weeks-item">
            <uni-calendar-item
              :weeks="weeks"
              :calendar="calendar"
              :selected="selected"
              :lunar="lunar"
              @change="choiceDate"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Calendar from './lib/calendar'
import uniCalendarItem from './lib/calendar-item'
import dayjs from 'dayjs'

export default {
  components: {
    uniCalendarItem
  },
  props: {
    /**
     * 当前日期
     */
    date: {
      type: String,
      default: ''
    },
    /**
     * 打点日期
     */
    selected: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 是否开启阴历日期
     */
    lunar: {
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
    /**
     * 是否显示月份背景
     */
    showMonth: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      weeks: [],
      calendar: {},
      nowDate: '',
      aniMaskShow: false
    }
  },
  watch: {
    selected(newVal) {
      this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
      this.weeks = this.cale.weeks
    }
  },
  created() {
    // 获取日历方法实例
    this.cale = new Calendar({
      date: this.date,
      selected: this.selected,
      startDate: dayjs(this.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.endDate).format('YYYY-MM-DD'),
      range: this.range
    })
    this.init(this.cale.date.fullDate)
  },
  methods: {
    // 取消穿透
    clean() {},
    init(date) {
      this.weeks = this.cale.weeks
      this.nowDate = this.calendar = this.cale.getInfo(date)
    },
    open() {
      this.show = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.aniMaskShow = true
        }, 50)
      })
    },
    close() {
      this.aniMaskShow = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.show = false
        }, 300)
      })
    },
    confirm() {
      this.setEmit('confirm')
      this.close()
    },
    change() {
      this.setEmit('change')
    },
    monthSwitch() {
      const { year, month } = this.nowDate
      this.$emit('monthSwitch', {
        year,
        month: Number(month)
      })
    },
    setEmit(name) {
      const { year, month, date, fullDate, lunar, extraInfo } = this.calendar
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        fulldate: fullDate,
        lunar,
        extraInfo: extraInfo || {}
      })
    },
    choiceDate(weeks) {
      if (weeks.disable) return
      this.calendar = weeks
      // 设置多选
      this.cale.setMultiple(this.calendar.fullDate)
      this.weeks = this.cale.weeks
      this.change()
    },
    backtoday() {
      console.log('日历组件：用户点击回到今天')
      this.cale.setDate()
      this.weeks = this.cale.weeks
      this.nowDate = this.calendar = this.cale.getInfo()
      this.change()
    },
    pre() {
      const preDate = this.cale.getDate(this.nowDate.fullDate, -1, 'month').fullDate
      this.setDate(preDate)
      this.monthSwitch()
    },
    next() {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, +1, 'month').fullDate
      this.setDate(nextDate)
      this.monthSwitch()
    },
    yearChange(range) {
      const nextDate = this.cale.getDate(this.nowDate.fullDate, range, 'year').fullDate
      this.setDate(nextDate)
      this.monthSwitch()
    },
    setDate(date) {
      this.cale.setDate(date)
      this.weeks = this.cale.weeks
      this.nowDate = this.cale.getInfo(date)
    }
  }
}
</script>

<style lang="scss" scoped>
.uni-calendar {
  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: column;
}

.uni-calendar__mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  /* #ifndef APP-NVUE */
  z-index: 99;
  background-color: $uni-bg-color-mask;
  opacity: 0;
  transition-duration: 0.3s;
  transition-property: opacity;

  /* #endif */
}

.uni-calendar--mask-show {
  opacity: 1;
}

.uni-calendar--fixed {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;

  /* #ifndef APP-NVUE */
  z-index: 99;
  transition-duration: 0.3s;
  transition-property: transform;
  transform: translateY(460px);

  /* #endif */
}

.uni-calendar--ani-show {
  transform: translateY(0);
}

.uni-calendar__content {
  background-color: #ffffff;
}

.uni-calendar__header {
  position: relative;

  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.uni-calendar--fixed-top {
  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: row;
  justify-content: space-between;
  border-top-color: $uni-border-color;
  border-top-style: solid;
  border-top-width: 1px;
}

.uni-calendar--fixed-width {
  width: 50px;
  // padding: 0 15px;
}

.uni-calendar__backtoday {
  padding-left: 24rpx;
  font-size: 12px;
  line-height: 25px;
  color: $pi-primary-color;
  background-color: #f4f4f4;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  opacity: 0.7;
}

.uni-calendar__header-text {
  width: 100px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  text-align: center;
}

.uni-calendar__header-btn {
  width: 10px;
  height: 10px;
  border-top-color: $uni-color-subtitle;
  border-top-style: solid;
  border-top-width: 2px;
  border-left-color: $uni-text-color-placeholder;
  border-left-style: solid;
  border-left-width: 2px;
}

.uni-calendar--left {
  transform: rotate(-45deg);
}

.uni-calendar--right {
  transform: rotate(135deg);
}

.uni-calendar__weeks {
  position: relative;

  /* #ifndef APP-NVUE */
  display: flex;

  /* #endif */
  flex-direction: row;
}

.uni-calendar__weeks-item {
  flex: 1;
}

.uni-calendar__weeks-day {
  /* #ifndef APP-NVUE */
  display: flex;
  flex: 1;

  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 45px;
}
.uni-calendar__weeks-day-text {
  font-size: 14px;
  font-weight: 500;
  color: #999999;
}

.uni-calendar__box {
  position: relative;
}

.uni-calendar__box-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  /* #ifndef APP-NVUE */
  display: flex;
  align-items: center;

  /* #endif */
  justify-content: center;
}

.uni-calendar__box-bg-text {
  font-size: 200px;
  font-weight: bold;

  /* #ifndef APP-NVUE */
  line-height: 1;
  color: $uni-text-color-grey;
  text-align: center;
  opacity: 0.1;

  /* #endif */
}
</style>
