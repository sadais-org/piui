<template>
  <view class="pi-calendar-panel" :style="[customStyle]" :class="[customClass]">
    <!-- 操作栏 -->
    <view class="pi-align-center">
      <view class="pi-flex-sub pi-justify-center pi-align-center">
        <view class="pi-align-center">
          <view class="pi-icon-back pi-pd-24" @tap="handleChangeYear(-1)" />
          <view class="pi-pd-lr-8">{{ year }}年</view>
          <view class="pi-icon-right pi-pd-24" @tap="handleChangeYear(1)" />
        </view>
        <view class="pi-align-center">
          <view class="pi-icon-back pi-pd-24" @tap="handleChangeMonth(-1)" />
          <view class="pi-pd-lr-8">{{ month }}月</view>
          <view class="pi-icon-right pi-pd-24" @tap="handleChangeMonth(1)" />
        </view>
      </view>
      <view v-if="showBackToday" class="back-today" @tap="handleBackToday"
        >回到今日</view
      >
    </view>

    <!-- 星期 -->
    <view
      class="pi-align-center pi-pd-24"
      style="box-shadow: 0 15px 10px -15px rgba(125, 126, 128, 0.16)"
    >
      <view
        v-for="(week, index) in weekDayZh"
        :key="index"
        class="date-item pi-justify-center pi-fw-500"
      >
        {{ week }}
      </view>
    </view>
    <view class="pi-square">
      <!-- 固定日期面板正方形，避免高度变化造成界面抖动 -->
      <view class="pi-rela">
        <view class="pi-rela pi-align-center pi-flex-wrap pi-pd-24">
          <!-- 前置空项目 -->
          <view
            v-for="emptyDay in firstDay"
            :key="emptyDay"
            class="date-item"
          />
          <!-- 天 -->
          <view
            v-for="day in days"
            :key="day.key"
            class="date-item"
            style="cursor: pointer"
            :style="[day.nowStyle, day.activeStyle, day.disabledStyle]"
            @tap.stop="handleSelectDate(day)"
          >
            <view class="pi-square">
              <view class="pi-rela pi-flex-column-center">
                <text>{{ day.date }}</text>
                <text
                  v-if="day.tip"
                  class="pi-abso-bottom-center pi-text-nowrap pi-fz-20 pi-pd-bottom-6"
                >
                  {{ day.tip }}
                </text>
              </view>
            </view>
          </view>
          <!-- 日历背后蒙层 -->
          <view
            class="pi-abso-center pi-fw-500 pi-light-gray"
            style="
              z-index: 1;
              font-size: 300rpx;
              pointer-events: none;
              opacity: 0.1;
            "
          >
            {{ month }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiCalendarPanel'
const { calendarPanel } = getConfig()

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return calendarPanel.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return calendarPanel.customClass
      }
    },
    // 日历类型
    type: {
      // `'date'-单个日期`, `'range'-范围日期`
      type: String,
      // 'date'
      default: calendarPanel.type,
      validator: function (value) {
        return ['date', 'range'].includes(value)
      }
    },
    // 日期默认值，单选时候，传入Date(时间戳，时间字符串，Date类型)，日历范围，传入Date[]
    defaultValue: {
      type: [Number, String, Date, Array],
      // -
      default: calendarPanel.defaultValue
    },
    // 可切换的最小年份
    minYear: {
      type: [Number, String],
      // 当前年份 - 80
      default: calendarPanel.minYear
    },
    // 可切换的最大年份（默认当前年份）
    maxYear: {
      type: [Number, String],
      // 当前年份 + 30
      default: calendarPanel.maxYear
    },
    // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    minDate: {
      type: [Number, String, Date],
      // ''
      default: calendarPanel.minDate
    },
    // 最大可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    maxDate: {
      type: [Number, String, Date],
      // ''
      default: calendarPanel.maxDate
    },
    // 是否显示回到今日
    showBackToday: {
      type: Boolean,
      // true
      default: calendarPanel.showBackToday
    },
    // 今日日期激活边框颜色
    todayActiveBorderColor: {
      type: String,
      // '#ff6a00'
      default: calendarPanel.todayActiveBorderColor
    },
    // 选中|起始结束日期字体颜色
    activeColor: {
      type: String,
      // '#ffffff'
      default: calendarPanel.activeColor
    },
    // 选中|起始结束日期背景，默认
    activeBg: {
      type: String,
      // '#ff6a00'
      default: calendarPanel.activeBg
    },
    // 选中圆角效果
    activeBorderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: calendarPanel.activeBorderRadius
    },
    // 范围内日期字体颜色默认
    rangeColor: {
      type: String,
      // '#ff6a00'
      default: calendarPanel.rangeColor
    },
    // 范围内日期背景色
    rangeBg: {
      type: String,
      // 'rgba(254, 106, 0, 0.1)'
      default: calendarPanel.rangeBg
    },
    // type=range时生效，起始日期自定义文案
    startText: {
      type: String,
      // '开始'
      default: calendarPanel.startText
    },
    // type=range时生效，结束日期自定义文案
    endText: {
      type: String,
      // '结束'
      default: calendarPanel.endText
    },
    // 已选择的时间格式化显示规则
    dateFormat: {
      type: String,
      // 'YYYY-MM-DD'
      default: calendarPanel.dateFormat
    }
  },
  data() {
    const now = this.$pi.date.parseDate()
    return {
      now: now, // 当前时间
      year: '', // 年份
      month: '', // 月份
      date: now, // type 为 date 当前选中日期
      ranges: [] // type 为 range 的开始和结束日期
    }
  },
  computed: {
    getActiveBorderRadius() {
      return this.$pi.common.addUnit(this.activeBorderRadius)
    },
    weekDayZh() {
      return this.$pi.date.getWeekDayZh()
    },
    // 第一天
    firstDay() {
      return new Date(`${this.year}/${this.month}/01 00:00:00`).getDay()
    },
    getMinDate() {
      return this.minDate ? this.$pi.date.parseDate(this.minDate) : ''
    },
    getMaxDate() {
      return this.minDate ? this.$pi.date.parseDate(this.maxDate) : ''
    },
    // 总天数
    days() {
      const days = []
      const monthDays = new Date(this.year, this.month, 0).getDate()
      for (let i = 1; i <= monthDays; i++) {
        const day = {
          key: 'pi-calander-day-item-' + i,
          index: i,
          ...this.$pi.date.parseDate(`${this.year}/${this.month}/${i}`)
        }
        const isDisabled = this.isDisabled(day)
        // 禁用
        if (isDisabled) {
          day.disabledStyle = {
            opacity: '0.3',
            cursor: 'not-allowed'
          }
        }
        // 单选选中样式
        if (this.type === 'date' && this.isSameDay(this.date, day)) {
          const activeStyle = {
            color: this.activeColor,
            borderRadius: this.getActiveBorderRadius
          }
          if (this.activeBg) activeStyle.background = this.activeBg
          day.activeStyle = activeStyle
        }
        // 范围选中样式
        if (this.type === 'range') {
          const start = this.ranges[0]
          const end = this.ranges[1]
          const isBegin = this.isSameDay(start, day)
          const isEnd = this.isSameDay(end, day)
          const inRange =
            start &&
            end &&
            day.timestamp > start.timestamp &&
            day.timestamp < end.timestamp
          const activeStyle = {}
          // 处理两端
          if (isBegin || isEnd) {
            activeStyle.color = this.activeColor
            activeStyle.borderRadius = isBegin
              ? `${this.getActiveBorderRadius} 0 0 ${this.getActiveBorderRadius}`
              : `0 ${this.getActiveBorderRadius} ${this.getActiveBorderRadius} 0`
            if (this.activeBg) activeStyle.background = this.activeBg
          }
          // 处理中间范围的样式
          if (inRange) {
            activeStyle.color = this.rangeColor
            activeStyle.background = this.rangeBg
          }
          day.activeStyle = activeStyle
          // type 为 range 开始和结束的提示
          if (isBegin) day.tip = this.startText
          if (isEnd) day.tip = this.endText
        }
        // 当天样式
        if (this.showBackToday && this.isSameDay(this.now, day)) {
          day.nowStyle = {
            color: this.todayActiveBorderColor,
            border: '1px solid ' + this.todayActiveBorderColor,
            borderRadius: this.getActiveBorderRadius
          }
        }
        days.push(day)
      }
      return days
    }
  },
  watch: {
    value(val) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    valid() {
      if (this.type === 'date') return true
      if (
        this.type === 'range' &&
        this.$pi.lang.isArray(this.defaultValue) &&
        this.defaultValue.length === 2
      )
        return true
      console.error(TAG, 'defaultValue 参数不合法，请检查')
      return false
    },
    init() {
      console.log(TAG, '组件初始化')
      if (!this.valid()) return
      const nowDate = this.$pi.date.parseDate(
        this.type === 'date' ? this.defaultValue : this.defaultValue[0]
      )
      this.year = nowDate.year
      this.month = nowDate.month
      this.date = nowDate
      if (this.type === 'range') {
        this.ranges = [nowDate, this.$pi.date.parseDate(this.defaultValue[1])]
      }
    },
    isSameDay(day1, day2) {
      return (
        day1 &&
        day2 &&
        day1.year === day2.year &&
        day1.month === day2.month &&
        day1.date === day2.date
      )
    },
    isDisabled(day) {
      const isDisabled =
        (this.getMinDate && day.timestamp < this.getMinDate.timestamp) ||
        (this.getMaxDate && day.timestamp > this.getMaxDate.timestamp)
      return isDisabled
    },
    handleSelectDate(date) {
      const isDisabled = this.isDisabled(date)
      if (isDisabled) return
      if (this.type === 'date') {
        // 单选方式
        this.date = date
        return
      }
      // 处理范围选择方式
      if (this.ranges.length === 2) {
        // 如果选了两项，则重新开始选择范围
        this.ranges = [date]
      } else {
        // 如果第二项选择的和第一项一样，不做处理
        const isSameDay = this.isSameDay(this.ranges[0], date)
        if (isSameDay) return
        // 和第一项判断一下大小，小的放前面
        if (date.timestamp > this.ranges[0].timestamp) {
          this.ranges = [this.ranges[0], date]
        } else {
          this.ranges = [date, this.ranges[0]]
        }
      }
    },
    handleChangeMonth(change) {
      const month = this.month + change
      if (month > 12) {
        // 下一年
        this.year = this.year + 1
        this.month = 1
      } else if (month < 1) {
        // 上一年
        this.year = this.year - 1
        this.month = 12
      } else {
        this.month = month
      }
    },
    handleChangeYear(change) {
      if (change > 0 && this.year === parseInt(this.maxYear, 10)) return
      if (change < 0 && this.year === parseInt(this.minYear, 10)) return
      this.year = this.year + change
    },
    handleBackToday() {
      this.year = this.now.year
      this.month = this.now.month
      this.date = this.now
    },
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleConfirm() {
      const value = this.type === 'date' ? this.date : this.ranges
      // 确认
      this.$emit('confirm', value)
      this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.date-item {
  position: relative;
  z-index: 2;
  width: calc(100% / 7);
  overflow: hidden;
}
.back-today {
  padding: 12rpx 24rpx;
  overflow: hidden;
  font-size: 20rpx;
  color: #ffffff;
  background: $pi-primary-color;
  border-radius: 50rpx 0 0 50rpx;
}
</style>
