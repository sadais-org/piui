<template>
  <pi-popup
    ref="popup"
    :value="val"
    :border-radius="borderRadius"
    :show-close-icon="showTitle && showCloseIcon"
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
    <view
      class="pi-datePicker pi-flex-column"
      :style="[customStyle, { height: getHeight }]"
      :class="[customClass]"
    >
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        style="z-index: 1"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <!-- 标题 -->
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <!-- 顶部操作条 -->
      <view
        v-if="toolbarPosition === 'top'"
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500 pi-pd-32"
      >
        <!-- 操作条 -->
        <slot v-if="$slots.toolbar" name="toolbar" />
        <template v-else>
          <view class="item-btn" @tap="handlePopupClose">取消</view>
          <view class="item-btn pi-primary" @tap="handleConfirm">确定</view>
        </template>
      </view>
      <!-- 选择区域 -->
      <view class="pi-w-100P pi-scroll">
        <!-- uniapp 底层bug picker-view 如果不加v-if会导致小程序和app端初始化不正常 -->
        <picker-view
          v-if="val"
          class="pi-text-center pi-h-100P"
          :indicator-style="indicatorStyle"
          :value="pickerValue"
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
            <view v-for="(item, index) in days" :key="index" :style="indicatorStyle">
              {{ item }}日
            </view>
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
      </view>
      <!-- 顶部操作条 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button v-else width="100%" type="primary" @tap="handleConfirm">
          确定
        </pi-button>
      </pi-bottom-bar>
    </view>
  </pi-popup>
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
  name: TAG,
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
    toolbarPosition: {
      // `'top'` `'bottom'`
      type: String,
      // 'bottom'
      default: datePicker.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
      }
    },
    // 是否显示title
    showTitle: {
      type: Boolean,
      // false
      default: datePicker.showTitle
    },
    // 标题
    title: {
      type: String,
      // 日期选择
      default: datePicker.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // '32rpx'
      default: datePicker.titlePadding
    },
    // 弹出选择层的高度，不可填百分比
    height: {
      type: String,
      // '50vh'
      default: datePicker.height
    },
    // 行高
    itemHeight: {
      type: [String, Number],
      // 110
      default: datePicker.itemHeight
    },
    // 是否显示item下边框
    showItemBottomBorder: {
      type: Boolean,
      // true
      default: datePicker.showItemBottomBorder
    },
    // 行样式
    itemStyle: {
      type: Object,
      default() {
        // {}
        return datePicker.itemStyle
      }
    },
    // 是否点击确认的时候关闭弹窗
    onConfirmClose: {
      type: Boolean,
      // true
      default: datePicker.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果
    borderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: datePicker.borderRadius
    },
    // 是否显示关闭图标
    showCloseIcon: {
      type: Boolean,
      // true
      default: datePicker.showCloseIcon
    },
    // 关闭图标的名称
    closeIconName: {
      type: String,
      // 'close'
      default: datePicker.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      // '32rpx 32rpx'
      default: datePicker.closeIconPadding
    },
    // 关闭图标的颜色
    closeIconColor: {
      type: String,
      // #666666
      default: datePicker.closeIconColor
    },
    // 关闭图标的大小
    closeIconSize: {
      type: [String, Number],
      // 42
      default: datePicker.closeIconSize
    },
    // 关闭图标的font-weight
    closeIconWeight: {
      type: [String, Number],
      // 800
      default: datePicker.closeIconWeight
    },
    // 关闭图标位置
    closeIconPosition: {
      // `''-自适应` `'tl'-左上角` `'bl'-左下角` `'br'-右下角` `'tr'-右上角`
      type: String,
      // ''
      default: datePicker.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度）
    safeAreaInsetTop: {
      type: Boolean,
      // true
      default: datePicker.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离）
    safeAreaInsetBottom: {
      type: Boolean,
      // true
      default: datePicker.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，格式：500、'500ms'、'0.5s'
    duration: {
      type: [Number, String],
      // 300
      default: datePicker.duration
    },
    // 是否可以通过点击遮罩进行关闭
    maskClosable: {
      type: Boolean,
      // true
      default: datePicker.maskClosable
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      // false
      default: datePicker.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: datePicker.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 999
      default: datePicker.zIndex
    },
    // 背景颜色
    maskBackground: {
      type: String,
      // rgba(0,0,0,.5)
      default: datePicker.maskBackground
    }
  },
  data() {
    const date = this.$pi.date.parseDate(this.defaultValue)
    return {
      date
    }
  },
  computed: {
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
    handleConfirm() {
      // 提交
      this.$emit('confirm', this.date)
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
