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
    @closed="$emit('closed', $event)"
    @show="$emit('show', $event)"
    @showed="$emit('showed', $event)"
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
      <picker-view-column v-for="col in columns" :key="col.field">
        <view v-for="item in col.items" :key="item" :style="indicatorStyle">
          {{ item }}{{ col.unit }}
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
const FIELDS = ['year', 'month', 'day', 'halfday', 'hour', 'minute', 'second']

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
        return FIELDS.includes(value)
      },
      // 'day'
      default() {
        return datePicker.field
      }
    },
    // 日期类型，date、datetime、time
    dateType: {
      // `'date'` `'datetime'` `'time'`
      type: String,
      validator: function(value) {
        return ['date', 'datetime', 'time'].includes(value)
      },
      // 'datetime'
      default() {
        return datePicker.dateType
      }
    },
    // 年份选项
    yearOptions: {
      type: Array,
      default() {
        // []
        return datePicker.yearOptions
      }
    },
    // 月份选项
    monthOptions: {
      type: Array,
      default() {
        // []
        return datePicker.monthOptions
      }
    },
    // 日期选项
    dayOptions: {
      type: Array,
      default() {
        // []
        return datePicker.dayOptions
      }
    },
    // 小时选项
    hourOptions: {
      type: Array,
      default() {
        // []
        return datePicker.hourOptions
      }
    },
    // 分钟选项
    minuteOptions: {
      type: Array,
      default() {
        // []
        return datePicker.minuteOptions
      }
    },
    // 日期默认值
    defaultValue: {
      type: [Number, String, Date],
      // ''
      default: datePicker.defaultValue
    },
    // 单位数组，默认值：['年', '月', '日', '时', '分', '秒']
    units: {
      type: Array,
      default() {
        return datePicker.units
      }
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
    },
    // 最小可选日期
    minDate: {
      type: [Date, Number, String],
      default: datePicker.minDate
    },
    // 最大可选日期
    maxDate: {
      type: [Date, Number, String],
      default: datePicker.maxDate
    }
  },
  data() {
    let date = this.$pi.date.parseDate(this.defaultValue)
    if (this.field === 'halfday') {
      const time = date.time
      if (date.hour < 12) {
        time.setHours(0)
      } else {
        time.setHours(12)
      }
      date = this.$pi.date.parseDate(time)
    }
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
      const mergeConfirmBtn = this.$pi.lang.mergeDeep(
        datePickerConfirmBtn,
        this.confirmBtn
      )
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
      const datePickerPopup = this.$pi.lang.mergeDeep(
        datePicker.popup,
        this.popupSelect.popup
      )
      return this.$pi.lang.mergeDeep(datePickerPopup, this.popup)
    },
    // 解析后的最小日期
    parsedMinDate() {
      if (!this.minDate) return null
      return this.$pi.date.parseDate(this.minDate)
    },
    // 解析后的最大日期
    parsedMaxDate() {
      if (!this.maxDate) return null
      return this.$pi.date.parseDate(this.maxDate)
    },
    options() {
      const watchs = [
        'val',
        'startYear',
        'endYear',
        'field',
        'defaultValue',
        'minDate',
        'maxDate'
      ]
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
    getUnits() {
      return this.$pi.mergeDeep(datePicker.units, this.units, {
        arrayMerge: (target, source, options) => {
          return target.map((t, index) => source[index] || t)
        }
      })
    },
    getYearOptions() {
      if (this.yearOptions && this.yearOptions.length > 0) {
        return this.yearOptions
      }
      let start = parseInt(this.startYear, 10)
      let end = parseInt(this.endYear, 10)
      // 根据 minDate/maxDate 限制年份范围
      if (this.parsedMinDate) {
        start = Math.max(start, this.parsedMinDate.year)
      }
      if (this.parsedMaxDate) {
        end = Math.min(end, this.parsedMaxDate.year)
      }
      return this.$pi.common.generateArray(start, end)
    },
    getMonthOptions() {
      if (this.monthOptions && this.monthOptions.length > 0) {
        return this.monthOptions
      }
      let start = 1
      let end = 12
      const currentYear = this.date.year
      // 当前年份等于最小年份时，限制起始月份
      if (this.parsedMinDate && currentYear === this.parsedMinDate.year) {
        start = this.parsedMinDate.month
      }
      // 当前年份等于最大年份时，限制结束月份
      if (this.parsedMaxDate && currentYear === this.parsedMaxDate.year) {
        end = this.parsedMaxDate.month
      }
      return this.$pi.common.generateArray(start, end)
    },
    getDayOptions() {
      if (this.dayOptions && this.dayOptions.length > 0) {
        return this.dayOptions
      }
      const currentYear = this.date.year
      const currentMonth = this.date.month
      let start = 1
      let end = new Date(currentYear, currentMonth, 0).getDate()
      // 当前年月等于最小年月时，限制起始日期
      if (
        this.parsedMinDate &&
        currentYear === this.parsedMinDate.year &&
        currentMonth === this.parsedMinDate.month
      ) {
        start = this.parsedMinDate.date
      }
      // 当前年月等于最大年月时，限制结束日期
      if (
        this.parsedMaxDate &&
        currentYear === this.parsedMaxDate.year &&
        currentMonth === this.parsedMaxDate.month
      ) {
        end = this.parsedMaxDate.date
      }
      return this.$pi.common.generateArray(start, end)
    },
    getHourOptions() {
      if (this.hourOptions && this.hourOptions.length > 0) {
        return this.hourOptions
      }
      let start = 0
      let end = 23
      const { year, month, date } = this.date
      // 当前年月日等于最小年月日时，限制起始小时
      if (
        this.parsedMinDate &&
        year === this.parsedMinDate.year &&
        month === this.parsedMinDate.month &&
        date === this.parsedMinDate.date
      ) {
        start = this.parsedMinDate.hour
      }
      // 当前年月日等于最大年月日时，限制结束小时
      if (
        this.parsedMaxDate &&
        year === this.parsedMaxDate.year &&
        month === this.parsedMaxDate.month &&
        date === this.parsedMaxDate.date
      ) {
        end = this.parsedMaxDate.hour
      }
      return this.$pi.common.generateArray(start, end)
    },
    getMinuteOptions() {
      if (this.minuteOptions && this.minuteOptions.length > 0) {
        return this.minuteOptions
      }
      let start = 0
      let end = 59
      const { year, month, date, hour } = this.date
      // 当前年月日时等于最小年月日时时，限制起始分钟
      if (
        this.parsedMinDate &&
        year === this.parsedMinDate.year &&
        month === this.parsedMinDate.month &&
        date === this.parsedMinDate.date &&
        hour === this.parsedMinDate.hour
      ) {
        start = this.parsedMinDate.minute
      }
      // 当前年月日时等于最大年月日时时，限制结束分钟
      if (
        this.parsedMaxDate &&
        year === this.parsedMaxDate.year &&
        month === this.parsedMaxDate.month &&
        date === this.parsedMaxDate.date &&
        hour === this.parsedMaxDate.hour
      ) {
        end = this.parsedMaxDate.minute
      }
      return this.$pi.common.generateArray(start, end)
    },
    columns() {
      let columns = [
        {
          field: 'year',
          unit: this.getUnits[0],
          key: 'year',
          setMethod: 'setYear',
          items: this.getYearOptions
        },
        {
          field: 'month',
          unit: this.getUnits[1],
          key: 'month',
          setMethod: 'setMonth',
          items: this.getMonthOptions
        },
        {
          field: 'day',
          unit: this.getUnits[2],
          key: 'date',
          setMethod: 'setDate',
          items: this.getDayOptions
        },
        {
          field: 'halfday',
          unit: '',
          key: 'hour',
          setMethod: 'setHours',
          items: ['上午', '下午']
        },
        {
          field: 'hour',
          unit: this.getUnits[3],
          key: 'hour',
          setMethod: 'setHours',
          type: 'time',
          items: this.getHourOptions
        },
        {
          field: 'minute',
          unit: this.getUnits[4],
          key: 'minute',
          setMethod: 'setMinutes',
          type: 'time',
          items: this.getMinuteOptions
        },
        {
          field: 'second',
          unit: this.getUnits[5],
          key: 'second',
          setMethod: 'setSeconds',
          type: 'time',
          items: this.$pi.common.generateArray(0, 59)
        }
      ]

      columns = columns.filter((col, index) => {
        return FIELDS.slice(index).includes(this.field)
      })
      if (this.field !== 'halfday') {
        columns = columns.filter(col => col.field !== 'halfday')
      }
      if (this.dateType === 'time') {
        columns = columns.filter(col => col.type === 'time')
      }

      return columns
    },
    pickerValue() {
      const pickerValue = []
      this.columns.forEach(col => {
        // 当前日期字段
        const value = this.date[col.key]
        if (value !== null) {
          // 查找当前picker中索引对应的真实值
          if (col.field === 'halfday') {
            const val = value < 12 ? 0 : 1
            pickerValue.push(val)
          } else {
            const intValue = parseInt(value, 10)
            const val = col.items.findIndex(m => m === intValue)
            pickerValue.push(val)
          }
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
      if (this.field === 'halfday') {
        const time = this.date.time
        if (this.date.hour < 12) {
          time.setHours(0)
        } else {
          time.setHours(12)
        }
        this.date = this.$pi.date.parseDate(time)
      }
      // 校正初始日期边界
      this.$nextTick(() => {
        this.correctDateBoundary()
      })
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
        if (value !== null && value !== -1) {
          // value为picker列的索引值
          const col = this.columns[index]
          let val = col.items[value] // 取出对应picker值
          if (col.field === 'month') val--
          if (col.field === 'halfday') val = value === 0 ? 0 : 12
          time[col.setMethod](val) // 调用原生date方法赋值
        }
      })
      // 重新解析
      this.date = this.$pi.date.parseDate(time)
      // 校正日期边界
      this.correctDateBoundary()

      this.$emit('scrollend', this.date)
    },
    /**
     * 校正日期边界，确保选中的日期在 minDate 和 maxDate 范围内
     */
    correctDateBoundary() {
      const time = this.date.time
      let needUpdate = false
      // 校正最小日期
      if (this.parsedMinDate && time < this.parsedMinDate.time) {
        this.date = this.$pi.date.parseDate(this.parsedMinDate.time)
        needUpdate = true
      }
      // 校正最大日期
      if (this.parsedMaxDate && time > this.parsedMaxDate.time) {
        this.date = this.$pi.date.parseDate(this.parsedMaxDate.time)
        needUpdate = true
      }
      return needUpdate
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
      if (this.field === 'halfday') {
        const time = this.date.time
        time.setMinutes(0)
        time.setSeconds(0)
        time.setMilliseconds(0)
        this.date = this.$pi.date.parseDate(time)
      }
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
