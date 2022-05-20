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
const FIELDS = ['year', 'month', 'day', 'hour', 'minute', 'second']

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
    columns() {
      const monthDays = new Date(this.date.year, this.date.month, 0).getDate()
      let columns = [
        {
          field: 'year',
          unit: '年',
          key: 'year',
          setMethod: 'setYear',
          items: this.$pi.common.generateArray(this.startYear, this.endYear)
        },
        {
          field: 'month',
          unit: '月',
          key: 'month',
          setMethod: 'setMonth',
          items: this.$pi.common.generateArray(1, 12)
        },
        {
          field: 'day',
          unit: '日',
          key: 'date',
          setMethod: 'setDate',
          items: this.$pi.common.generateArray(1, monthDays)
        },
        {
          field: 'hour',
          unit: '时',
          key: 'hour',
          setMethod: 'setHours',
          type: 'time',
          items: this.$pi.common.generateArray(0, 23)
        },
        {
          field: 'minute',
          unit: '分',
          key: 'minute',
          setMethod: 'setMinutes',
          type: 'time',
          items: this.$pi.common.generateArray(0, 59)
        },
        {
          field: 'second',
          unit: '秒',
          key: 'second',
          setMethod: 'setSeconds',
          type: 'time',
          items: this.$pi.common.generateArray(0, 59)
        }
      ]

      columns = columns.filter((col, index) => {
        return FIELDS.slice(index).includes(this.field)
      })

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
          const intValue = parseInt(value, 10)
          const val = col.items.findIndex(m => m === intValue)
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
          const col = this.columns[index]
          let val = col.items[value] // 取出对应picker值
          if (col.field === 'month') val--
          time[col.setMethod](val) // 调用原生date方法赋值
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
