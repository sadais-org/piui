<template>
  <mask-content
    :is-show="isShow"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    @close="handleClose"
  >
    <view class="pi-scroll-container" @tap.stop="">
      <view class="pi-navi-item pi-justify-between pi-align-center pi-fz-32 pi-pd-32">
        <view>{{ displayDate }}</view>
        <view class="pi-primary pi-fw-500 confirm" @tap="handleConfirm">确定</view>
      </view>
      <calendar
        :date="date"
        :start-date="startDate"
        :end-date="endDate"
        :range="range"
        @change="handleDateChange"
      />
    </view>
  </mask-content>
</template>

<script>
import MaskContent from '@/src/PiUI-basic/components/mask-content.vue'
import Calendar from './calendar'

export default {
  components: {
    MaskContent,
    Calendar
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值
    value: {
      required: false,
      type: String
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
    /**
     * 开始时间
     */
    startDate: {
      type: String,
      default: ''
    },
    /**
     * 结束时间
     */
    endDate: {
      type: String,
      default: ''
    },
    /**
     * 范围
     */
    range: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let defaultDate = this.$dayjs().format('YYYY-MM-DD')
    if (this.value) {
      // 如果有初始值，按照初始值初始化
      const dayjsValue = this.$dayjs(this.value)
      defaultDate = dayjsValue.format('YYYY-MM-DD')
    }
    return {
      date: defaultDate
    }
  },
  computed: {
    displayDate() {
      return this.$dayjs(this.date).format('YYYY年MM月DD日')
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      const value = this.$dayjs(this.date).format('YYYY-MM-DD')
      this.$emit('change', value)
      this.handleClose()
    },
    handleDateChange(e) {
      this.date = e.fulldate
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
  height: 808rpx;
  background-color: #ffffff;
  .confirm {
    z-index: 11;
  }
}
</style>
