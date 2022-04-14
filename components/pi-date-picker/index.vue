<template>
  <pi-popup-select
    :value="val"
    :custom-style="getPopupSelect.customStyle"
    :custom-class="getPopupSelect.customClass"
    :height="getPopupSelect.height"
    :show-title="getPopupSelect.showTitle"
    :title="getPopupSelect.title"
    :title-padding="getPopupSelect.titlePadding"
    :toolbar-position="getPopupSelect.toolbarPosition"
    :on-confirm-close="getPopupSelect.onConfirmClose"
    :on-cancel-close="getPopupSelect.onCancelClose"
    :confirm-btn="getConfirmBtn"
    :cancel-btn="getCancelBtn"
    :popup="getPopup"
    @close="handlePopupClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <slot name="header" />
    <picker-view
      v-if="val"
      class="pi-text-center pi-h-100P"
      :style="[customStyle]"
      :class="[customClass]"
      :indicator-style="indicatorStyle"
      :value="pickerValue"
      @pickstart="handlePickstart"
      @pickend="handlePickend"
      @change="handleDateChange"
    >
      <picker-view-column>
        <view v-for="(item, index) in years" :key="index" :style="indicatorStyle">
          {{ item }}年
        </view>
      </picker-view-column>
      <picker-view-column v-if="showMonth">
        <view v-for="(item, index) in months" :key="index" :style="indicatorStyle">
          {{ item + 1 }}月
        </view>
      </picker-view-column>
      <picker-view-column v-if="showDay">
        <view v-for="(item, index) in days" :key="index" :style="indicatorStyle">{{ item }}日</view>
      </picker-view-column>
      <picker-view-column v-if="showHour">
        <view v-for="(item, index) in hours" :key="index" :style="indicatorStyle">
          {{ item }}时
        </view>
      </picker-view-column>
      <picker-view-column v-if="showMinute">
        <view v-for="(item, index) in minutes" :key="index" :style="indicatorStyle">
          {{ item }}分
        </view>
      </picker-view-column>
      <picker-view-column v-if="showSecond">
        <view v-for="(item, index) in seconds" :key="index" :style="indicatorStyle">
          {{ item }}秒
        </view>
      </picker-view-column>
    </picker-view>
    <slot name="footer" />
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiDatePicker'
const { datePicker } = getConfig()
const FIELD_MAPS = [
  { field: 'year', getMethod: 'years', setMethod: 'setYear' },
  { field: 'month', getMethod: 'months', setMethod: 'setMonth' },
  { field: 'day', getMethod: 'days', setMethod: 'setDate' },
  { field: 'hour', getMethod: 'hours', setMethod: 'setHours' },
  { field: 'minute', getMethod: 'minutes', setMethod: 'setMinutes' },
  { field: 'second', getMethod: 'seconds', setMethod: 'setSeconds' }
]

export default {
  name: 'PiDatePicker',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 是否显示弹窗
    value: {
      required: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return datePicker.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return datePicker.customClass
      }
    },
    // 开始年份
    startYear: {
      type: [String, Number],
      default() {
        // 当前年份 - 30
        return datePicker.startYear
      }
    },
    // 结束年份
    endYear: {
      type: [String, Number],
      default() {
        // 当前年份
        return datePicker.endYear
      }
    },
    // 选择器的粒度
    field: {
      // `'year'` `'month'` `'day'` `'hour'` `'minute'` `'second'`
      type: String,
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['year', 'month', 'day', 'hour', 'minute', 'second'].includes(value)
      },
      // 'day'
      default() {
        return datePicker.field
      }
    },
    // 日期默认值
    defaultValue: {
      type: [Number, String, Date],
      // ''
      default: datePicker.defaultValue
    },
    // 返回的日期格式
    format: {
      type: String,
      // 'YYYY-MM-DD'
      default: datePicker.format
    },
    // 行高
    itemHeight: {
      type: [String, Number],
      // 110
      default: datePicker.itemHeight
    },
    // 行样式
    itemStyle: {
      type: Object,
      default() {
        // {}
        return datePicker.itemStyle
      }
    },
    // 是否显示item下边框
    showItemBottomBorder: {
      type: Boolean,
      // true
      default: datePicker.showItemBottomBorder
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popup
        return datePicker.popupSelect
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return datePicker.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return datePicker.cancelBtn
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return datePicker.popup
      }
    }
  },
  data() {
    const date = this.$pi.date.parseDate(this.defaultValue)
    return {
      date,
      scrolling: false // picker是否在滚动中，小程序在scrolling中点确定，选择的项目不正确
    }
  },
  computed: {
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(datePicker.popupSelect, this.popupSelect)
    },
    getConfirmBtn() {
      const datePickerConfirmBtn = this.$pi.lang.mergeDeep(
        datePicker.confirmBtn,
        this.popupSelect.confirmBtn
      )
      const mergeConfirmBtn = this.$pi.lang.mergeDeep(datePickerConfirmBtn, this.confirmBtn)
      if (!mergeConfirmBtn.disabled) {
        mergeConfirmBtn.disabled = this.scrolling
      }
      return mergeConfirmBtn
    },
    getCancelBtn() {
      const datePickerCancelBtn = this.$pi.lang.mergeDeep(
        datePicker.cancelBtn,
        this.popupSelect.cancelBtn
      )
      return this.$pi.lang.mergeDeep(datePickerCancelBtn, this.cancelBtn)
    },
    getPopup() {
      const datePickerPopup = this.$pi.lang.mergeDeep(datePicker.popup, this.popupSelect.popup)
      return this.$pi.lang.mergeDeep(datePickerPopup, this.popup)
    },
    options() {
      const watchs = ['startYear', 'endYear', 'field', 'defaultValue']
      const options = watchs
        .filter(d => this[d])
        .map(d => this[d].toString())
        .join('-')
      return options
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
    indicatorStyle() {
      const itemHeight = uni.upx2px(this.itemHeight)
      return `height: ${itemHeight}px;line-height: ${itemHeight}px;`
    },
    showYear() {
      return ['year', 'month', 'day', 'hour', 'minute', 'second'].includes(this.field)
    },
    showMonth() {
      return ['month', 'day', 'hour', 'minute', 'second'].includes(this.field)
    },
    showDay() {
      return ['day', 'hour', 'minute', 'second'].includes(this.field)
    },
    showHour() {
      return ['hour', 'minute', 'second'].includes(this.field)
    },
    showMinute() {
      return ['minute', 'second'].includes(this.field)
    },
    showSecond() {
      return ['second'].includes(this.field)
    },
    years() {
      return this.$pi.common.generateArray(this.startYear, this.endYear)
    },
    months() {
      return this.$pi.common.generateArray(0, 11)
    },
    days() {
      const monthDays = new Date(this.date.year, this.date.month, 0).getDate()
      return this.$pi.common.generateArray(1, monthDays)
    },
    hours() {
      return this.$pi.common.generateArray(0, 23)
    },
    minutes() {
      return this.$pi.common.generateArray(0, 59)
    },
    seconds() {
      return this.$pi.common.generateArray(0, 59)
    },
    pickerValue() {
      const dateFieldMaps = [
        { key: 'year', dataKey: 'years', showKey: 'showYear' },
        { key: 'month', dataKey: 'months', showKey: 'showMonth' },
        { key: 'date', dataKey: 'days', showKey: 'showDay' },
        { key: 'hour', dataKey: 'hours', showKey: 'showHour' },
        { key: 'minute', dataKey: 'minutes', showKey: 'showMinute' },
        { key: 'second', dataKey: 'seconds', showKey: 'showSecond' }
      ]
      const pickerValue = []
      dateFieldMaps.forEach(map => {
        // 当前日期字段
        let value = this.date[map.key]
        if (this[map.showKey] && value) {
          if (map.key === 'month') value--
          // 查找当前picker中索引对应的真实值
          const intValue = parseInt(value, 10)
          const val = this[map.dataKey].findIndex(m => m === intValue)
          pickerValue.push(val)
        }
      })
      return pickerValue
    }
  },
  watch: {
    // ! 因为使用对象，在H5端watch的时候，就算没有发生改变，也会触发，这里直接监听toString后的值
    options(val) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.date = this.$pi.date.parseDate(this.defaultValue)
    },
    handlePickstart() {
      this.scrolling = true
    },
    // 标识滑动结束
    handlePickend() {
      this.scrolling = false
    },
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleDateChange(e) {
      const values = e.detail.value // values 返回的数组固定是picker的数量，只返回有变化的索引值
      const time = this.date.time // 取出当前date的实际时间
      values.forEach((value, index) => {
        if (value !== null) {
          // value为picker列的索引值
          const field = FIELD_MAPS[index] // day
          const val = this[field.getMethod][value] // days[index] 取出对应picker值
          time[field.setMethod](val) // 调用原生date方法赋值
        }
      })
      // 重新解析
      this.date = this.$pi.date.parseDate(time)
    },
    /**
     * @vuese
     * 取消选择
     */
    handleCancel() {
      /**
       * @vuese
       * 点击取消按钮时触发
       * @arg 当前选中的值 单选为对象，多选模式为数组
       */
      this.$emit('cancel')
      this.onCancelClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm() {
      // 提交
      const value = this.format ? this.date.format(this.format) : this.date
      this.$emit('confirm', value)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-date-picker {
  height: 50vh;
}
</style>
