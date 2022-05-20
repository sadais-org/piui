<!--
 * @Author: zhangzhenfei
 * @Date: 2022-05-18 11:08:49
 * @LastEditTime: 2022-05-20 16:17:27
 * @LastEditors: zhangzhenfei
 * @Description: 日历输入
 * @FilePath: /hfmp-checkin-front/Users/feilin/workspace/piui/piui-awesome/src/piui/components/pi-date-picker-input/index.vue
-->

<template>
  <view class="pi-datePicker-input">
    <!-- 输入框 -->
    <view v-if="$slots.default || $slots.$default" class="pi-w-100P" @click="show = true">
      <slot />
    </view>
    <pi-input
      v-else
      type="text"
      :value="getInputValue"
      :custom-class="input.customClass"
      :custom-style="input.customStyle"
      :placeholder="input.placeholder"
      :placeholder-style="input.placeholderStyle"
      :placeholder-class="input.placeholderClass"
      :disabled="input.disabled"
      :border="input.border"
      :maxlength="input.maxlength"
      :password="input.password"
      :cursor-spacing="input.cursorSpacing"
      :focus="input.focus"
      :confirm-type="input.confirmType"
      :confirm-hold="input.confirmHold"
      :cursor="input.cursor"
      :selection-start="input.selectionStart"
      :selection-end="input.selectionEnd"
      :adjust-position="input.adjustPosition"
      :hold-keyboard="input.holdKeyboard"
      :auto-blur="input.autoBlur"
      :show-confirmbar="input.showConfirmbar"
      :auto-height="input.autoHeight"
      :fixed="input.fixed"
      :disable-default-padding="input.disableDefaultPadding"
      :clearable="input.clearable"
      :clear-icon="input.clearIcon"
      @click="show = true"
    />

    <!-- 日期弹出框 -->
    <pi-date-picker
      v-model="show"
      :default-value="val"
      :custom-class="getDatePicker.customClass"
      :custom-style="getDatePicker.customStyle"
      :start-year="getDatePicker.startYear"
      :end-year="getDatePicker.endYear"
      :field="getDatePicker.field"
      :date-type="getDatePicker.dateType"
      :format="dateFormat"
      :item-height="getDatePicker.itemHeight"
      :item-style="getDatePicker.itemStyle"
      :show-item-bottom-border="getDatePicker.showItemBottomBorder"
      :popup="getDatePicker.popup"
      :popup-select="getDatePicker.popupSelect"
      :confirm-btn="getDatePicker.confirmBtn"
      :cancel-btn="getDatePicker.cancelBtn"
      @confirm="handleDatePickerConfirm"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiDatePickerInput'
const { datePickerInput } = getConfig()

const PI_DEFAULT_FN_FLAG = 'PI_DEFAULT_FN_FLAG'

export default {
  name: 'PiDatePickerInput',
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
        return datePickerInput.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return datePickerInput.customClass
      }
    },
    // input输入设置
    input: {
      type: Object,
      default() {
        // 参照datePicker
        return datePickerInput.input
      }
    },
    // 日历弹窗参数设置
    datePicker: {
      type: Object,
      default() {
        // 参照datePicker
        return datePickerInput.datePicker
      }
    },
    // 已选择的时间格式化显示规则，默认（'YYYY-MM-DD'）
    dateFormat: {
      type: String,
      // 'YYYY-MM-DD'
      default: datePickerInput.dateFormat
    },
    // 范围选择时间分隔符，默认（'至'）
    rangeSplit: {
      type: String,
      // '至'
      default: datePickerInput.rangeSplit
    },
    // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
    parseValueFn: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: datePickerInput.parseValueFn
        }
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    getDatePicker() {
      return this.$pi.lang.mergeDeep(datePickerInput.datePicker, this.datePicker)
    },
    getInputValue() {
      const parseValueFn = this.parseValueFn[PI_DEFAULT_FN_FLAG]
        ? this.parseValueFn.fn
        : this.parseValueFn
      if (this.$pi.lang.isFunction(parseValueFn)) {
        const parseValue = parseValueFn(this.val)
        return parseValue
      }
      if (!this.dateFormat) {
        console.warn('使用pi-datePicker-input组件，请设置.dateFormat，否则无法正常显示')
      }
      if (this.$pi.lang.isEmpty(this.val)) return ''
      const date = this.$pi.date.parseDate(this.val)
      return date.format(this.dateFormat)
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleDatePickerConfirm(value) {
      this.val = value
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-datePicker-input {
  width: 100%;
}
</style>
