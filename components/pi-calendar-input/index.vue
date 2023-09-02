<!--
 * @Author: zhangzhenfei
 * @Date: 2022-05-18 11:08:49
 * @LastEditTime: 2023-09-02 11:40:12
 * @LastEditors: zhangzhenfei
 * @Description: 日历输入
 * @FilePath: \piui-awesome\src\piui\components\pi-calendar-input\index.vue
-->

<template>
  <view class="pi-calendar-input">
    <!-- 输入框 -->
    <view v-if="$slots.default || $slots.$default" class="pi-w-100P" @click="show = true">
      <slot />
    </view>
    <pi-input
      v-else
      type="text"
      :value="getInputValue"
      :custom-class="getInput.customClass"
      :custom-style="getInput.customStyle"
      :placeholder="getInput.placeholder"
      :placeholder-style="getInput.placeholderStyle"
      :placeholder-class="getInput.placeholderClass"
      :disabled="getInput.disabled"
      :border="getInput.border"
      :maxlength="getInput.maxlength"
      :password="getInput.password"
      :cursor-spacing="getInput.cursorSpacing"
      :focus="getInput.focus"
      :confirm-type="getInput.confirmType"
      :confirm-hold="getInput.confirmHold"
      :cursor="getInput.cursor"
      :selection-start="getInput.selectionStart"
      :selection-end="getInput.selectionEnd"
      :adjust-position="getInput.adjustPosition"
      :hold-keyboard="getInput.holdKeyboard"
      :auto-blur="getInput.autoBlur"
      :show-confirmbar="getInput.showConfirmbar"
      :auto-height="getInput.autoHeight"
      :fixed="getInput.fixed"
      :disable-default-padding="getInput.disableDefaultPadding"
      :clearable="getInput.clearable"
      :clear-icon="getInput.clearIcon"
      @click="show = true"
      @clear="handleClearValue"
    />

    <!-- 日历弹出框 -->
    <pi-calendar
      v-model="show"
      :custom-class="getCalendar.customClass"
      :custom-style="getCalendar.customStyle"
      :show-title="getCalendar.showTitle"
      :title="getCalendar.title"
      :title-padding="getCalendar.titlePadding"
      :type="getCalendar.type"
      :calendar-panel="{
        ...getCalendar.calendarPanel,
        dateFormat: getCalendar.dateFormat,
        value: val
      }"
      :popup="getCalendar.popup"
      @confirm="handleCalendarConfirm"
      @close="$emit('close', $event)"
      @closed="$emit('closed', $event)"
      @show="$emit('show', $event)"
      @showed="$emit('showed', $event)"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiCalendarInput'
const { calendarInput } = getConfig()

const PI_DEFAULT_FN_FLAG = 'PI_DEFAULT_FN_FLAG'

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
        return calendarInput.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return calendarInput.customClass
      }
    },
    // input输入设置
    input: {
      type: Object,
      default() {
        // 参照calendar
        return calendarInput.input
      }
    },
    // 日历弹窗参数设置
    calendar: {
      type: Object,
      default() {
        // 参照calendar
        return calendarInput.calendar
      }
    },
    // 已选择的时间格式化显示规则，默认（'YYYY-MM-DD'）
    dateFormat: {
      type: String,
      // 'YYYY-MM-DD'
      default: calendarInput.dateFormat
    },
    // 范围选择时间分隔符，默认（'至'）
    rangeSplit: {
      type: String,
      // '至'
      default: calendarInput.rangeSplit
    },
    // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
    parseValueFn: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: calendarInput.parseValueFn
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
    getInput() {
      return this.$pi.lang.mergeDeep(calendarInput.input, this.input)
    },
    getCalendar() {
      return this.$pi.lang.mergeDeep(calendarInput.calendar, this.calendar)
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
        console.warn('使用pi-calendar-input组件，请设置.dateFormat，否则无法正常显示')
      }
      if (this.$pi.lang.isEmpty(this.val)) return ''
      // 常规字段正常返回
      if (this.$pi.lang.isString(this.val) || this.$pi.lang.isNumber(this.val)) {
        return this.val
      }
      // 如果是日期对象，返回格式化后的日期
      if (this.calendar.calendarPanel.type === 'date') {
        return this.$pi.date.formatDate(new Date(this.val), this.dateFormat)
      }
      if (this.calendar.calendarPanel.type === 'range') {
        return this.val
          .map(date => {
            return this.$pi.date.formatDate(new Date(date), this.dateFormat)
          })
          .join(this.rangeSplit)
      }
      return ''
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleCalendarConfirm(value) {
      this.val = value
      this.handleEmitChange()
    },
    handleClearValue() {
      if (this.calendar.calendarPanel.type === 'date') {
        this.handleCalendarConfirm('')
      }
      if (this.calendar.calendarPanel.type === 'range') {
        this.handleCalendarConfirm([])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-calendar-input {
  width: 100%;
}
</style>
