<!--
 * @Author: zhangzhenfei
 * @Date: 2022-06-28 16:53:54
 * @LastEditTime: 2023-05-12 16:02:29
 * @LastEditors: zhangzhenfei
 * @Description: 日历日期数据
 * @FilePath: /piui-awesome/src/piui/components/pi-calendar-panel/components/calendar-days/index.vue
-->

<template>
  <view class="pi-rela pi-align-center pi-flex-wrap pi-pd-24">
    <view
      v-for="day in days"
      :key="day.key"
      class="date-item"
      style="cursor: pointer;"
      :class="[
        { 'pi-disabled': day.disabled || day.type === 'disabled' },
        { range: day.range },
        { marked: day.marked }
      ]"
      @tap.stop="handleSelectDate(day)"
    >
      <view class="pi-square">
        <view class="pi-rela date-item-inner">
          <view
            class="pi-w-100P pi-h-100P pi-flex-column-center pi-lh-28"
            :style="[day.nowStyle, day.activeStyle, day.rangeStyle]"
          >
            <text>{{ day.date }}</text>
            <text v-if="day.tip" class=" pi-text-nowrap pi-fz-18 pi-mg-top-6">
              {{ day.tip }}
            </text>
          </view>
        </view>
      </view>
    </view>
    <!-- 日历蒙层 -->
    <view
      class="pi-abso-center pi-fw-500 pi-light-gray pi-text-nowrap"
      style="
              z-index: -1;
              pointer-events: none;
              opacity: 0.15;"
      :style="[
        { fontSize: weekView ? '32rpx' : '300rpx' },
        { marginTop: weekView ? '30rpx' : '0' }
      ]"
    >
      {{ getBgTip }}
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../../../config'
const { calendarPanel } = getConfig()

export default {
  name: 'PiCalendarDays',
  props: {
    calendarValue: {
      type: [String, Object, Array],
      default: ''
    },
    year: {
      type: [String, Number],
      default: ''
    },
    month: {
      type: [String, Number],
      default: ''
    },
    // 当前展示周
    week: {
      type: Number,
      default: 0
    },
    // 日历类型
    type: {
      // `'date'-单个日期`, `'range'-范围日期`
      type: String,
      // 'date'
      default: calendarPanel.type,
      validator: function(value) {
        return ['date', 'range'].includes(value)
      }
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
    weekView: {
      type: Boolean,
      // '是否显示周视图'
      default: calendarPanel.defalutWeekView
    },
    // 日期标记，数组形式，默认（[]）
    marks: {
      type: Array,
      // []
      default: () => calendarPanel.marks
    }
  },
  data() {
    const now = this.$pi.date.parseDate()
    return {
      now: now // 当前时间
    }
  },
  computed: {
    getActiveBorderRadius() {
      return this.$pi.common.addUnit(this.activeBorderRadius)
    },
    // 获取上个月最后一天
    getPreMonthLastDay() {
      let year = this.year
      let month = this.month - 1
      if (month === 0) {
        year = year - 1
        month = 12
      }
      return new Date(year, month, '0')
    },
    getNextMonthFirstDay() {
      let year = this.year
      let month = this.month + 1
      if (month === 13) {
        year = year + 1
        month = 1
      }
      return new Date(year, month - 1, '1')
    },
    // 第一天
    firstDay() {
      const firstDays = []
      const preMonthLastDay = this.getPreMonthLastDay
      const lastDay = preMonthLastDay.getDate()
      const firstDay = new Date(this.year, this.month - 1, '1').getDay()
      for (let i = 0; i < firstDay; i++) {
        const day = preMonthLastDay.setDate(lastDay - firstDay + i + 1)
        firstDays.push(new Date(day))
      }
      return firstDays
    },
    getMinDate() {
      return this.minDate ? this.$pi.date.parseDate(this.minDate) : ''
    },
    getMaxDate() {
      return this.maxDate ? this.$pi.date.parseDate(this.maxDate) : ''
    },
    getMarks() {
      return this.marks.map(item => {
        return this.$pi.date.parseDate(item)
      })
    },
    // 总天数
    days() {
      const days = []
      const dayCount = 7 * 6 // 固定显示6周
      const monthDays = new Date(this.year, this.month, 0).getDate()
      const firstDayCount = this.firstDay.length
      const nextMonthFirstDay = this.getNextMonthFirstDay
      for (let i = 1; i <= dayCount; i++) {
        let day = {
          key: this.$pi.guid(),
          index: i
        }

        // 上月数据
        if (i <= firstDayCount) {
          day = {
            ...day,
            ...this.$pi.date.parseDate(this.firstDay[i - 1]),
            type: this.weekView ? '' : 'disabled'
          }
        } else if (i > monthDays + firstDayCount) {
          // 下月数据
          day = {
            ...day,
            ...this.$pi.date.parseDate(
              new Date(nextMonthFirstDay.setDate(i - monthDays - firstDayCount))
            ),
            type: this.weekView ? '' : 'disabled'
          }
        } else {
          // 当月数据
          day = {
            ...day,
            ...this.$pi.date.parseDate(new Date(this.year, this.month - 1, i - firstDayCount))
          }
        }

        const isDisabled = this.isDisabled(day)
        // 禁用
        if (isDisabled) {
          day.disabled = true
        }
        // 单选选中样式
        if (this.type === 'date' && this.isSameDay(this.calendarValue, day)) {
          const activeStyle = {
            color: this.activeColor,
            borderRadius: this.getActiveBorderRadius
          }
          if (this.activeBg) activeStyle.background = this.activeBg
          day.activeStyle = activeStyle
        }
        // 范围选中样式
        if (this.type === 'range') {
          const start = this.calendarValue[0]
          const end = this.calendarValue[1]
          const isBegin = this.isSameDay(start, day)
          const isEnd = this.isSameDay(end, day)
          const inRange =
            start && end && day.timestamp > start.timestamp && day.timestamp < end.timestamp
          const rangeStyle = {}
          // 处理中间范围的样式
          if (inRange) {
            rangeStyle.color = this.rangeColor
            rangeStyle.background = this.rangeBg
          }
          // 处理两端
          if (isBegin || isEnd) {
            rangeStyle.color = this.activeColor
            rangeStyle.borderRadius = isBegin
              ? `${this.getActiveBorderRadius} 0 0 0`
              : `0 0 ${this.getActiveBorderRadius} 0`
            if (this.activeBg) rangeStyle.background = this.activeBg
          }
          day.range = true
          day.rangeStyle = rangeStyle
          // type 为 range 开始和结束的提示
          if (isBegin) day.tip = this.startText
          if (isEnd) day.tip = this.endText
          if (isBegin && isEnd) {
            day.tip = this.startText + '-' + this.endText
          }
        }
        // 是否打点
        if (this.getMarks.length) {
          const mark = this.getMarks.find(item => {
            return this.isSameDay(item, day)
          })
          if (mark) {
            day.marked = mark
          }
        }
        // 当天样式
        if (this.isSameDay(this.now, day)) {
          day.today = true
          if (this.showBackToday) {
            day.nowStyle = {
              color: this.todayActiveBorderColor,
              border: '1px solid ' + this.todayActiveBorderColor,
              borderRadius: this.getActiveBorderRadius
            }
          }
        }
        days.push(day)
      }
      if (this.weekView) {
        days.splice(0, (this.week - 1) * 7)
        days.splice(7, days.length - 7)
      }
      return days
    },
    getBgTip() {
      if (!this.days.length) return ''
      const startDay = this.days[0]
      const endDay = this.days[this.days.length - 1]
      return this.weekView
        ? `${startDay.month}月 ${startDay.date}日 - ${endDay.month}月 ${endDay.date}日`
        : this.month
    }
  },
  methods: {
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
    handleChange(value) {
      this.$emit('change', value)
    },
    handleSelectDate(date) {
      if (date.disabled) return
      if (this.type === 'date') {
        // 单选方式
        this.handleChange(date)
        return
      }
      // 处理范围选择方式
      if (this.calendarValue.length === 0 || this.calendarValue.length === 2) {
        // 如果选了两项，则重新开始选择范围
        this.handleChange([date])
      } else {
        // 和第一项判断大小，小的放前面
        if (date.timestamp > this.calendarValue[0].timestamp) {
          this.handleChange([this.calendarValue[0], date])
        } else {
          this.handleChange([date, this.calendarValue[0]])
        }
      }
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
  &.marked {
    &::after {
      content: '';
      position: absolute;
      bottom: 18rpx;
      left: 50%;
      width: 8rpx;
      height: 8rpx;
      background: #ff0027;
      border-radius: 50%;
      transform: translateX(-50%);
      overflow: hidden;
    }
  }
  .date-item-inner {
    padding: 8rpx;
  }
  &.range {
    .date-item-inner {
      padding: 6rpx 0rpx;
    }
  }
}
</style>
