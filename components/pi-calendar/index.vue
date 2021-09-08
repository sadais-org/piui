<template>
  <pi-popup
    ref="popup"
    :value="val"
    :position="getPopup.position"
    :border-radius="getPopup.borderRadius"
    :show-close-icon="showTitle && getPopup.showCloseIcon"
    :close-icon="getPopup.closeIcon"
    :safe-area-inset-bottom="getPopup.safeAreaInsetBottom"
    :mask="getPopup.mask"
    :hide-tab-bar="getPopup.hideTabBar"
    :append-to-body="getPopup.appendToBody"
    :z-index="getPopup.zIndex"
    :background="getPopup.background"
    @close="handlePopupClose"
  >
    <view class="pi-calendar" :style="[customStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view class="pi-justify-center pi-fz-32 pi-fw-500" :style="[{ padding: getTitlePadding }]">
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <pi-calendar-panel
        v-model="calendarValue"
        :type="getCalendarPanel.type"
        :min-year="getCalendarPanel.minYear"
        :max-year="getCalendarPanel.maxYear"
        :min-date="getCalendarPanel.minDate"
        :max-date="getCalendarPanel.maxDate"
        :show-back-today="getCalendarPanel.showBackToday"
        :today-active-border-color="getCalendarPanel.todayActiveBorderColor"
        :active-color="getCalendarPanel.activeColor"
        :active-bg="getCalendarPanel.activeBg"
        :active-border-radius="getCalendarPanel.activeBorderRadius"
        :range-color="getCalendarPanel.rangeColor"
        :range-bg="getCalendarPanel.rangeBg"
        :start-text="getCalendarPanel.startText"
        :end-text="getCalendarPanel.endText"
        :date-format="getCalendarPanel.dateFormat"
      />
      <!-- footer -->
      <view class="pi-w-100P pi-align-center pi-pd-24 pi-solid-top-1">
        <view class="pi-flex-sub pi-fz-30 pi-fw-500">{{ getDisplayValue }}</view>
        <pi-button type="primary" size="medium" @click="handleConfirm">确定</pi-button>
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
  name: 'PiCalendar',
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
    // 日历面板参数设置
    calendarPanel: {
      type: Object,
      default() {
        // 参照calendarPanel
        return calendar.calendarPanel
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return calendar.popup
      }
    }
  },
  data() {
    const mergeCalendarPanel = this.$pi.lang.mergeDeep(calendar.calendarPanel, this.calendarPanel)
    return {
      calendarValue: mergeCalendarPanel.value
    }
  },
  computed: {
    getCalendarPanel() {
      return this.$pi.lang.mergeDeep(calendar.calendarPanel, this.calendarPanel)
    },
    getPopup() {
      return this.$pi.lang.mergeDeep(calendar.popup, this.popup)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
    getDisplayValue() {
      return [].concat(this.calendarValue).join(' - ')
    }
  },
  watch: {
    'getCalendarPanel.value'(val) {
      this.calendarValue = val
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
      this.$emit('confirm', this.calendarValue)
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
