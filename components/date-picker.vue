<template>
  <mask-content
    :is-show="isShow"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    @close="handleClose"
  >
    <view class="pi-scroll-container" @tap.stop>
      <view
        class="pi-justify-between pi-align-center pi-content pi-solid-bottom-1 pi-fz-32 pi-fw-500"
      >
        <view @tap="handleClose">取消</view>
        <view class="pi-primary" @tap="handleConfirm">确定</view>
      </view>
      <view class="pi-width-100P pi-scroll">
        <!-- uniapp 底层bug picker-view 如果不加v-if会导致小程序和app端初始化不正常 -->
        <picker-view
          v-if="isShow"
          class="pi-text-center pi-height-100P"
          :indicator-style="indicatorStyle"
          :value="pickerValue"
          @change="handleChange"
        >
          <picker-view-column>
            <view v-for="(item, index) in years" :key="index" class="item">{{ item }}年</view>
          </picker-view-column>
          <picker-view-column v-if="showMonth">
            <view v-for="(item, index) in months" :key="index" class="item">{{ item }}月</view>
          </picker-view-column>
          <picker-view-column v-if="showDay">
            <view v-for="(item, index) in days" :key="index" class="item">{{ item }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </mask-content>
</template>

<script>
import MaskContent from './mask-content.vue'
import debounce from 'lodash/debounce'

/**
 * 获取指定年月的天数
 */
function getDaysOfYearAndMonth(year, month) {
  const date = new Date(year, month, 0)
  const days = date.getDate()
  return days
}

/**
 *  根据传入的日期生成日期数组
 */
function generateDates(start, end) {
  const dates = []
  for (let i = start; i <= end; i++) {
    dates.push(i)
  }
  return dates
}

const date = new Date()
export default {
  name: 'DatePicker',
  components: {
    MaskContent
  },
  props: {
    value: {
      required: false,
      type: Array,
      default() {
        return []
      }
    },
    // 是否显示
    isShow: {
      required: false,
      type: Boolean,
      default: false
    },
    // 点击蒙层是否允许关闭
    maskClosable: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      default: false
    },
    startYear: {
      required: false,
      type: Number,
      default: 1990
    },
    endYear: {
      required: false,
      type: Number,
      default: date.getFullYear()
    },
    fields: {
      // fields	String	day	有效值 year,month,day，表示选择器的粒度
      required: false,
      type: String,
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['year', 'month', 'day'].indexOf(value) !== -1
      },
      default() {
        return 'day'
      }
    }
  },
  data() {
    const years = generateDates(this.startYear, this.endYear)
    const months = generateDates(1, 12)

    const month = date.getMonth() + 1
    const day = date.getDate()

    const defaultYear = parseInt((this.value && this.value[0]) || this.endYear, 10)
    const defaultMonth = parseInt((this.value && this.value[1]) || month, 10)
    const defaultDay = parseInt((this.value && this.value[2]) || day, 10)

    const maxDays = getDaysOfYearAndMonth(defaultYear, defaultMonth)
    const days = generateDates(1, maxDays)

    return {
      years,
      months,
      days,
      year: defaultYear,
      defaultYear,
      month: defaultMonth,
      defaultMonth,
      day: defaultDay,
      defaultDay,
      indicatorStyle: `height: ${uni.upx2px(100)}px;line-height: ${uni.upx2px(100)}px;`
    }
  },
  computed: {
    showMonth() {
      return ['month', 'day'].includes(this.fields)
    },
    showDay() {
      return ['day'].includes(this.fields)
    },
    pickerValue() {
      const pickerValue = [this.years.findIndex(y => y === parseInt(this.year, 10))]
      if (this.showMonth && this.month) {
        pickerValue.push(this.months.findIndex(m => m === parseInt(this.month, 10)))
      }
      if (this.showDay && this.day) {
        pickerValue.push(this.days.findIndex(m => m === parseInt(this.day, 10)))
      }
      return pickerValue
    }
  },
  methods: {
    handleChange: debounce(function(e) {
      const val = e.detail.value
      console.log('组件[month-picker]触发change事件,val为', e, val)
      this.year = this.years[val[0]]
      this.month = this.months[val[1]]
      const maxDays = getDaysOfYearAndMonth(this.year, this.month)
      if (maxDays === this.days.length) {
        this.day = this.days[val[2]]
      } else {
        // 当前月份和选择项不一致,需要同步
        this.days = generateDates(1, maxDays)
        this.day = this.days[val[2]]
      }
    }, 500),
    handleClose() {
      this.$emit('close')
      // 关闭后还原初始值
      this.year = this.defaultYear
      this.month = this.defaultMonth
      this.day = this.defaultDay
    },
    handleConfirm() {
      this.$emit('change', [this.year, this.month, this.day])
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-scroll-container {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 661rpx;
  background-color: #ffffff;
  .item {
    height: 100rpx;
    line-height: 100rpx;
  }
}
</style>
