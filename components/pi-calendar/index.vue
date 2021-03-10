<template>
  <pi-popup
    :value="val"
    :border-radius="borderRadius"
    :show-close-icon="showCloseIcon"
    :close-icon-name="closeIconName"
    :close-icon-padding="closeIconPadding"
    :close-icon-color="closeIconColor"
    :close-icon-size="closeIconSize"
    :close-icon-position="closeIconPosition"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :duration="duration"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    :append-to-body="appendToBody"
    :z-index="zIndex"
    :mask-background="maskBackground"
    @close="handlePopupClose"
  >
    <view class="pi-calendar" :style="[customStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view class="pi-justify-center pi-fz-32 pi-fw-500" :style="[{ padding: getTitlePadding }]">
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <pi-calendar-panel
        ref="calendarPanel"
        :type="type"
        :default-value="defaultValue"
        :min-year="minYear"
        :max-year="maxYear"
        :min-date="minDate"
        :max-date="maxDate"
        :show-back-today="showBackToday"
        :today-active-border-color="todayActiveBorderColor"
        :active-color="activeColor"
        :active-bg="activeBg"
        :active-border-radius="activeBorderRadius"
        :range-color="rangeColor"
        :range-bg="rangeBg"
        :start-text="startText"
        :end-text="endText"
        :date-format="dateFormat"
      />
      <!-- footer -->
      <view class="pi-abso-bl pi-w-100P pi-align-center pi-pd-24">
        <view class="pi-flex-sub pi-fz-30 pi-fw-500">{{ displayValue }}</view>
        <pi-button type="primary" size="medium" @tap="handleConfirm">确定</pi-button>
      </view>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiCalendar'
const { calendar } = getConfig()

export default {
  name: 'Calendar',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return calendar.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return calendar.customClass
      }
    },
    // 是否显示title
    showTitle: {
      type: Boolean,
      // true
      default: calendar.showTitle
    },
    // 标题
    title: {
      type: String,
      // '日期选择'
      default: calendar.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // 24
      default: calendar.titlePadding
    },
    // 日历类型
    type: {
      // 'date：单个日期', 'range：范围日期'
      type: String,
      // 'date'
      default: calendar.type,
      validator: function(value) {
        return ['date', 'range'].includes(value)
      }
    },
    // 日期默认值，单选时候，传入Date(时间戳，时间字符串，Date类型)，日历范围，传入Date[]
    defaultValue: {
      type: [Number, String, Date, Array],
      // -
      default: calendar.defaultValue
    },
    // 可切换的最小年份
    minYear: {
      type: [Number, String],
      // 当前年份 - 80
      default: calendar.minYear
    },
    // 可切换的最大年份（默认当前年份）
    maxYear: {
      type: [Number, String],
      // 当前年份 + 30
      default: calendar.maxYear
    },
    // 最小可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    minDate: {
      type: [Number, String, Date],
      // ''
      default: calendar.minDate
    },
    // 最大可选日期(不在范围内日期禁用不可选，默认''，不作限制)
    maxDate: {
      type: [Number, String, Date],
      // ''
      default: calendar.maxDate
    },
    // 是否显示回到今日
    showBackToday: {
      type: Boolean,
      // true
      default: calendar.showBackToday
    },
    // 今日日期激活边框颜色
    todayActiveBorderColor: {
      type: String,
      // '#ff6a00'
      default: calendar.todayActiveBorderColor
    },
    // 选中|起始结束日期字体颜色
    activeColor: {
      type: String,
      // '#ffffff'
      default: calendar.activeColor
    },
    // 选中|起始结束日期背景，默认
    activeBg: {
      type: String,
      // '#ff6a00'
      default: calendar.activeBg
    },
    // 选中圆角效果
    activeBorderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: calendar.activeBorderRadius
    },
    // 范围内日期字体颜色默认
    rangeColor: {
      type: String,
      // '#ff6a00'
      default: calendar.rangeColor
    },
    // 范围内日期背景色
    rangeBg: {
      type: String,
      // 'rgba(254, 106, 0, 0.1)'
      default: calendar.rangeBg
    },
    // type=range时生效，起始日期自定义文案
    startText: {
      type: String,
      // '开始'
      default: calendar.startText
    },
    // type=range时生效，结束日期自定义文案
    endText: {
      type: String,
      // '结束'
      default: calendar.endText
    },
    // 已选择的时间格式化显示规则
    dateFormat: {
      type: String,
      // 'YYYY-MM-DD'
      default: calendar.dateFormat
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * -------------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果
    borderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: calendar.borderRadius
    },
    // 是否显示关闭图标
    showCloseIcon: {
      type: Boolean,
      // true
      default: calendar.showCloseIcon
    },
    // 关闭图标的名称
    closeIconName: {
      type: String,
      // 'close'
      default: calendar.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      // '32rpx 32rpx'
      default: calendar.closeIconPadding
    },
    // 关闭图标的颜色
    closeIconColor: {
      type: String,
      // '#666666'
      default: calendar.closeIconColor
    },
    // 关闭图标的大小
    closeIconSize: {
      type: [String, Number],
      // 42
      default: calendar.closeIconSize
    },
    // 关闭图标font-weight
    closeIconWeight: {
      type: [String, Number],
      // 800
      default: calendar.closeIconWeight
    },
    // 关闭图标位置，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      // tl为左上角，tr为右上角，bl为左下角，br为右下角
      type: String,
      // -
      default: calendar.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度）
    safeAreaInsetTop: {
      type: Boolean,
      // true
      default: calendar.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离）
    safeAreaInsetBottom: {
      type: Boolean,
      // true
      default: calendar.safeAreaInsetBottom
    },
    /**
     * mask props
     * -------------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，格式：500、'500ms'、'0.5s'
    duration: {
      type: [Number, String],
      // 500
      default: calendar.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认
    maskClosable: {
      type: Boolean,
      // true
      default: calendar.maskClosable
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      // false
      default: calendar.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: calendar.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 100
      default: calendar.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      // 'rgba(0, 0, 0, .5)'
      default: calendar.maskBackground
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
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
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

  methods: {
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
