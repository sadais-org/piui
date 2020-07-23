<template>
  <pi-popup
    :value="val"
    :mask="popup.mask"
    :z-index="popup.zIndex"
    :border-radius="popup.borderRadius"
    :show-close-icon="popup.showCloseIcon"
    :close-icon-name="popup.closeIconName"
    :close-icon-padding="popup.closeIconPadding"
    :close-icon-color="popup.closeIconColor"
    :close-icon-size="popup.closeIconSize"
    :close-icon-position="popup.closeIconPosition"
    :safe-area-inset-bottom="popup.safeAreaInsetBottom"
    :mask-closable="popup.maskClosable"
    :hide-tab-bar="popup.hideTabBar"
    @close="handlePopupClose"
  >
    <view class="pi-calendar" :style="[customStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view class="pi-justify-center pi-fz-32 pi-fw-500" :style="[{ padding: getTitlePadding }]">
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
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
        <view v-if="showBackToday" class="back-today" @tap="handleBackToday">回到今日</view>
      </view>

      <!-- 星期 -->
      <view
        class="pi-align-center pi-pd-24"
        style="box-shadow: 0 15px 10px -15px rgba(125, 126, 128, 0.16);"
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
            <view v-for="emptyDay in firstDay" :key="emptyDay" class="date-item" />
            <!-- 天 -->
            <view
              v-for="day in days"
              :key="day.key"
              class="date-item"
              style="cursor: pointer;"
              :style="[day.nowStyle, day.activeStyle, day.disabledStyle]"
              @tap="handleSelectDate(day)"
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
              style="z-index: 1; font-size: 300rpx; pointer-events: none; opacity: 0.1;"
            >
              {{ month }}
            </view>
          </view>
          <!-- footer -->
          <view class="pi-abso-bl pi-w-100P pi-align-center pi-pd-24">
            <view class="pi-flex-sub pi-fz-30 pi-fw-500">{{ displayValue }}</view>
            <pi-button type="primary" size="medium" @tap="handleConfirm">确定</pi-button>
          </view>
        </view>
      </view>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import { createCustomPropsByConfig } from '../../mixin/component-custom'
const TAG = 'PiCalendar'
const { calendar } = getConfig()

export default {
  name: TAG,
  // 混入v-model
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync, createCustomPropsByConfig(calendar)],
  props: {
    // 弹窗的配置，默认选项请参照popup
    popup: {
      type: Object,
      default() {
        return calendar.popup
      }
    },
    title: {
      type: String,
      default: calendar.title
    },
    titlePadding: {
      type: [String, Number],
      default: calendar.titlePadding
    },
    // date 单个日期 || range [开始日期 结束日期]
    type: {
      type: String,
      default: calendar.type,
      validator: function(value) {
        return ['date', 'range'].includes(value)
      }
    },
    // 日期默认值，单选时候，传入Date(时间戳，时间字符串，Date类型)，日历范围，传入Date[]
    defaultValue: {
      type: [Number, String, Date, Array],
      default: calendar.defaultValue
    },
    // 可切换的最小年份
    minYear: {
      type: [Number, String],
      default: calendar.minYear
    },
    // 可切换的最大年份（默认当前年份）
    maxYear: {
      type: [Number, String],
      default: calendar.maxYear
    },
    // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    minDate: {
      type: [Number, String, Date],
      default: calendar.minDate
    },
    // 最大可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    maxDate: {
      type: [Number, String, Date],
      default: calendar.maxDate
    },
    // 是否显示回到今日，默认（true）
    showBackToday: {
      type: Boolean,
      default: calendar.showBackToday
    },
    // 今日日期激活边框颜色，默认（'#ff6a00'）
    todayActiveBorderColor: {
      type: String,
      default: calendar.todayActiveBorderColor
    },
    // 选中|起始结束日期字体颜色，默认（'#ffffff'）
    activeColor: {
      type: String,
      default: calendar.activeColor
    },
    // 选中|起始结束日期背景，默认（'#ff6a00'）
    activeBg: {
      type: String,
      default: calendar.activeBg
    },
    // 选中圆角效果（默认'0 0 0 0'）
    activeBorderRadius: {
      type: [String, Number],
      default: calendar.activeBorderRadius
    },
    // 范围内日期字体颜色默认（'#ff6a00'）
    rangeColor: {
      type: String,
      default: calendar.rangeColor
    },
    // 范围内日期背景色，默认（'rgba(254, 106, 0, 0.1)'）
    rangeBg: {
      type: String,
      default: calendar.rangeBg
    },
    // type=range时生效，起始日期自定义文案，默认（'开始'）
    startText: {
      type: String,
      default: calendar.startText
    },
    // type=range时生效，结束日期自定义文案，默认（'结束'）
    endText: {
      type: String,
      default: calendar.endText
    },
    // 已选择的时间格式化显示规则，默认（'yyyy-mm-dd'）
    dateFormat: {
      type: String,
      default: calendar.dateFormat
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
    // ! 使用计算属性依赖变化的特征，watch options
    // ! 因为使用对象，在H5端watch的时候，就算没有发生改变，也会触发，这里直接监听toString后的值
    options() {
      const watchs = ['defaultValue', 'type', 'minYear', 'maxYear', 'minDate', 'maxDate']
      const options = watchs
        .filter(d => this[d])
        .map(d => this[d].toString())
        .join('-')
      return options
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
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
            start && end && day.timestamp > start.timestamp && day.timestamp < end.timestamp
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
            border: '1px solid ' + this.todayActiveBorderColor,
            borderRadius: this.getActiveBorderRadius
          }
        }
        days.push(day)
      }
      return days
    },
    displayValue() {
      if (this.type === 'date') {
        return this.date.format(this.dateFormat)
      } else {
        let value = ''
        if (this.ranges[0]) {
          value += this.ranges[0].format(this.dateFormat)
        }
        if (this.ranges[1]) {
          value += ` 至 ${this.ranges[1].format(this.dateFormat)}`
        }
        return value
      }
    }
  },
  watch: {
    options(val) {
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
      this.$emit('close')
      this.handleEmitChange()
    },
    handleConfirm() {
      const value = this.type === 'date' ? this.date : this.ranges
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
