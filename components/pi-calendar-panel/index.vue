<template>
  <view class="pi-calendar-panel" :style="[customStyle]" :class="[customClass]">
    <!-- 操作栏 -->
    <view class="pi-align-center">
      <view class="pi-flex-sub pi-justify-center pi-align-center">
        <view class="pi-align-center">
          <view class="pi-icon-back pi-pd-14" @tap="handleChangeYear(-1)" />
          <view class="pi-pd-lr-8 pi-text-nowrap">{{ year }}年</view>
          <view class="pi-icon-right pi-pd-14" @tap="handleChangeYear(1)" />
        </view>
        <view class="pi-align-center">
          <view class="pi-icon-back pi-pd-14" @tap="handlePrevMonth()" />
          <view class="pi-pd-lr-8 pi-text-nowrap">{{ month }}月</view>
          <view class="pi-icon-right pi-pd-14" @tap="handleNextMonth()" />
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
        <swiper
          class="pi-w-100P pi-h-100P"
          :current="currentTabIndex"
          circular
          @change="handleTabChange"
        >
          <swiper-item v-for="tab in [1, 2, 3]" :key="tab">
            <calandar-days
              :calendar-value="calendarValue"
              :year="year"
              :month="getCalandarMonth(tab)"
              :type="type"
              :today-active-border-color="todayActiveBorderColor"
              :active-color="activeColor"
              :active-bg="activeBg"
              :active-border-radius="activeBorderRadius"
              :range-color="rangeColor"
              :range-bg="rangeBg"
              :start-text="startText"
              :end-text="endText"
              @change="handleChange"
            />
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import CalandarDays from './components/calendar-days'

const TAG = 'PiCalendarPanel'
const { calendarPanel } = getConfig()

export default {
  name: 'PiCalendarPanel',
  components: { CalandarDays },
  mixins: [ValueSync],
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
      validator: function(value) {
        return ['date', 'range'].includes(value)
      }
    },
    // 日期默认值，单选时候，传入Date(时间戳，时间字符串，Date类型)，日历范围，传入Date[]
    value: {
      type: [Number, String, Date, Array]
      // -
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
      calendarValue: '',
      currentTabIndex: 1 // 当前选中的tab索引
    }
  },
  computed: {
    getActiveBorderRadius() {
      return this.$pi.common.addUnit(this.activeBorderRadius)
    },
    weekDayZh() {
      return this.$pi.date.getWeekDayZh()
    },
    isMinYear() {
      return this.year === parseInt(this.minYear, 10)
    },
    isMaxYear() {
      return this.year === parseInt(this.maxYear, 10)
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    valid() {
      if (this.type === 'date') return true
      if (this.type === 'range' && this.$pi.lang.isArray(this.value) && this.value.length === 2)
        return true
      return false
    },
    init() {
      console.log(TAG, '组件初始化', this.value)
      if (!this.valid()) return
      let initValue = this.value
      const nowDate = this.$pi.date.parseDate(this.type === 'date' ? this.value : this.value[0])
      if (this.type === 'range') {
        const endDate = this.$pi.date.parseDate(this.value[1])
        if (this.year !== endDate.year && this.month !== endDate.month) {
          this.year = nowDate.year
          this.month = nowDate.month
        }
        initValue = [nowDate, endDate]
      } else {
        this.year = nowDate.year
        this.month = nowDate.month
        initValue = nowDate
      }
      this.value && this.handleChange(initValue)
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
    handleChangeMonth(change) {
      const month = this.month + change
      if (month > 12 && !this.isMaxYear) {
        // 下一年
        this.year = this.year + 1
        this.month = 1
      } else if (month < 1 && !this.isMinYear) {
        // 上一年
        this.year = this.year - 1
        this.month = 12
      } else {
        this.month = month
      }
    },
    handlePrevMonth() {
      if (this.currentTabIndex === 0) {
        this.currentTabIndex = 2
      } else {
        this.currentTabIndex--
      }
      this.handleChangeMonth(-1)
    },
    handleNextMonth() {
      if (this.currentTabIndex === 2) {
        this.currentTabIndex = 0
      } else {
        this.currentTabIndex++
      }
      this.handleChangeMonth(1)
    },
    handleChangeYear(change) {
      if (change > 0 && this.isMaxYear) return
      if (change < 0 && this.isMinYear) return
      this.year = this.year + change
    },
    handleBackToday() {
      this.year = this.now.year
      this.month = this.now.month
      if (this.type === 'date') {
        this.handleChange(this.now)
      }
    },
    handleChange(calendarValue) {
      this.calendarValue = calendarValue
      this.val =
        this.type === 'range'
          ? this.calendarValue.map(cv =>
              this.$pi.date.formatDate(new Date(cv.timestamp), this.dateFormat)
            )
          : this.$pi.date.formatDate(new Date(this.calendarValue.timestamp), this.dateFormat)
      this.handleEmitChange()
    },
    handleTabChange(e) {
      const { source, current } = e.detail
      if (source !== 'touch') return
      const isRightMove = [1, -2].includes(current - this.currentTabIndex)
      this.currentTabIndex = current
      this.handleChangeMonth(isRightMove ? 1 : -1)
    },
    getCalandarMonth(tab) {
      const changeMaps = [
        [0, -1, 1],
        [1, 0, 0],
        [-1, 0, 0]
      ]
      const change = changeMaps[tab - 1][this.currentTabIndex]
      return this.month + change
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-calendar-panel {
  width: 100%;
  .date-item {
    position: relative;
    z-index: 2;
    width: calc(100% / 7);
    margin-bottom: 12rpx;
    overflow: hidden;
  }
  .back-today {
    padding: 12rpx 24rpx;
    overflow: hidden;
    font-size: 20rpx;
    color: #ffffff;
    white-space: nowrap;
    background: $pi-primary-color;
    border-radius: 50rpx 0 0 50rpx;
  }
}
</style>
