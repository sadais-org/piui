<!--
 * @Author: zhangzhenfei
 * @Date: 2022-06-28 16:53:54
 * @LastEditTime: 2022-06-29 09:33:59
 * @LastEditors: zhangzhenfei
 * @Description: 日历日期数据
 * @FilePath: /hfmp-checkin-front/Users/feilin/workspace/piui/piui-awesome/src/piui/components/pi-calendar-panel/components/calendar-days/index.vue
-->

<template>
  <view class="pi-rela pi-align-center pi-flex-wrap pi-pd-24">
    <view
      v-for="day in days"
      :key="day.key"
      class="date-item"
      style="cursor: pointer;"
      :style="[day.nowStyle, day.activeStyle]"
      :class="{ 'pi-disabled': day.disabled }"
      @tap.stop="handleSelectDate(day)"
    >
      <view class="pi-square">
        <view class="pi-rela pi-flex-column-center pi-lh-28">
          <text>{{ day.date }}</text>
          <text v-if="day.tip" class=" pi-text-nowrap pi-fz-18 pi-mg-top-6">
            {{ day.tip }}
          </text>
        </view>
      </view>
    </view>
    <!-- 日历蒙层 -->
    <view
      class="pi-abso-center pi-fw-500 pi-light-gray"
      style="
              z-index: 1;
              font-size: 300rpx;
              pointer-events: none;
              opacity: 0.1;"
    >
      {{ month }}
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
    }
  },
  computed: {
    getActiveBorderRadius() {
      return this.$pi.common.addUnit(this.activeBorderRadius)
    },
    // 第一天
    firstDay() {
      const preMonthLastDay = this.getPreMonthLastDay()
      const firstDay = new Date(`${this.year}/${this.month}/01 00:00:00`).getDay()
      return this.$pi.common.generateArray(preMonthLastDay - firstDay + 1, preMonthLastDay)
    },
    getMinDate() {
      return this.minDate ? this.$pi.date.parseDate(this.minDate) : ''
    },
    getMaxDate() {
      return this.maxDate ? this.$pi.date.parseDate(this.maxDate) : ''
    },
    // 总天数
    days() {
      const days = []
      const dayCount = 7 * 6 // 固定显示6周
      const monthDays = new Date(this.year, this.month, 0).getDate()
      for (let i = 1; i <= dayCount; i++) {
        let day = {
          key: 'pi-calander-day-item-' + i,
          index: i
        }
        const firstDayCount = this.firstDay.length
        // 上月数据
        if (i <= firstDayCount) {
          day.date = this.firstDay[i - 1]
          day.type = 'pre'
          day.disabled = true
        } else if (i > monthDays + firstDayCount) {
          // 下月数据
          day.date = i - monthDays - firstDayCount
          day.type = 'next'
          day.disabled = true
        } else {
          // 当月数据
          day = {
            ...day,
            ...this.$pi.date.parseDate(`${this.year}/${this.month}/${i - firstDayCount}`)
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
            const activeStyle = {}
            // 处理中间范围的样式
            if (inRange) {
              activeStyle.color = this.rangeColor
              activeStyle.background = this.rangeBg
            }
            // 处理两端
            if (isBegin || isEnd) {
              activeStyle.color = this.activeColor
              activeStyle.borderRadius = isBegin
                ? `${this.getActiveBorderRadius} 0 0 ${this.getActiveBorderRadius}`
                : `0 ${this.getActiveBorderRadius} ${this.getActiveBorderRadius} 0`
              if (this.activeBg) activeStyle.background = this.activeBg
            }
            day.activeStyle = activeStyle
            // type 为 range 开始和结束的提示
            if (isBegin) day.tip = this.startText
            if (isEnd) day.tip = this.endText
            if (isBegin && isEnd) {
              day.tip = this.startText + '-' + this.endText
            }
          }
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
    // 获取上个月最后一天
    getPreMonthLastDay() {
      let year = this.year
      let month = this.month
      if (month === 1) {
        year = year - 1
        month = 12
      }
      return new Date(year, month - 1, '0').getDate()
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
      if (this.calendarValue.length === 2) {
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
  margin-bottom: 12rpx;
  overflow: hidden;
}
</style>
