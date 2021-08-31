<template>
  <view class="page-wrap" :class="customClass" :style="[customStyle, { textAlign }]">
    <view
      class="prev"
      :class="{ active: innerPage > 1 }"
      :style="{ marginRight: '8rpx' }"
      @click="handlePrev"
    >
      <slot name="prev">上一页</slot>
    </view>
    <view
      v-for="(i, idx) in pages"
      :key="idx"
      class="page-item"
      :class="[{ current: i === innerPage }, { background }]"
      @click="handleClickPage(i)"
    >
      {{ i }}
    </view>
    <view class="next" :class="{ active: innerPage < totalPage }" @click="handleNext">
      <slot name="next">下一页</slot>
    </view>
    <pi-picker
      v-model="pickerOpts.show"
      :items="pickerOpts.items"
      type="single"
      :default-value="[innerPage - 1]"
      @confirm="handleSelectPage"
    />
  </view>
</template>

<script>
import Config from '../../config/pagination'

export default {
  name: 'PiPagination',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return Config.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return Config.customClass
      }
    },
    // 总共多少条数据
    total: {
      type: Number,
      // `0`
      default: Config.total
    },
    // 只显示多少个页码
    limit: {
      type: Number,
      // `7`
      default: Config.limit
    },
    // 每页大小 用于计算共多少页
    pageSize: {
      type: Number,
      // `10`
      default: Config.pageSize
    },
    // 当前处于第几页 支持.sync
    page: {
      type: Number,
      // `0`
      default: Config.page
    },
    // 页码是否添加背景色
    background: {
      type: Boolean,
      default: Config.background
    },
    // 对齐方式
    textAlign: {
      type: String,
      default: Config.textAlign
    }
  },
  data() {
    return {
      innerPage: 1,
      pickerOpts: {
        show: false,
        items: []
      }
      // popupOpt: {
      //   showTitle: true,
      //   title: '请选择页码',
      //   borderRadius: '24rpx 24rpx 0 0',
      //   appendToBody: true
      // }
    }
  },
  computed: {
    pages() {
      const list = []
      let insertEllipsis = false
      if (this.innerPage === 1) {
        let right = this.innerPage + this.limit - 1
        if (right > this.totalPage) {
          right = this.totalPage
        } else if (right < this.totalPage - 1) {
          right -= 1
          insertEllipsis = true
        }
        for (let i = 1; i <= right; i++) {
          list.push(i)
        }
        if (insertEllipsis) {
          list.push('...')
        }
        if (right < this.totalPage) {
          list.push(this.totalPage)
        }
      } else if (this.innerPage === this.totalPage) {
        let left = this.innerPage - this.limit + 1
        if (left <= 0) {
          left = 1
        } else if (left > 2) {
          insertEllipsis = true
          left += 1
        }
        for (let i = left; i <= this.totalPage; i++) {
          list.push(i)
        }
        if (insertEllipsis) {
          list.splice(0, 0, '...')
        }
        if (left > 1) {
          list.splice(0, 0, 1)
        }
      } else {
        list.push(1)
        let middlePages = this.limit - 2
        if (middlePages < 0) {
          middlePages = 0
        }
        const half = parseInt(middlePages / 2, 10)
        let left = this.innerPage - half - 1
        if (left <= 1) {
          left = 2
        } else if (left > 2) {
          list.push('...')
        }
        for (let i = left; i <= this.innerPage; i++) {
          list.push(i)
        }

        let right = middlePages - this.innerPage + left - 1
        right += this.innerPage
        if (right >= this.totalPage) {
          right = this.totalPage - 1
        } else if (right < this.totalPage - 1) {
          insertEllipsis = true
        }
        for (let i = this.innerPage + 1; i <= right; i++) {
          list.push(i)
        }
        if (insertEllipsis) {
          list.push('...')
        }
        if (right < this.totalPage) {
          list.push(this.totalPage)
        }
      }

      return list
    },
    totalPage() {
      const ps = this.pageSize || 10
      const total = this.total || 0
      return total / ps + (total % ps !== 0 ? 1 : 0)
    }
  },
  watch: {
    page: {
      immediate: true,
      handler() {
        this.innerPage = this.page
      }
    },
    innerPage() {
      this.$emit('update:page', this.innerPage)
      // 当前页码发生改变
      // arg 最新的页码
      this.$emit('current-change', this.innerPage)
    }
  },
  methods: {
    handlePrev() {
      this.innerPage -= 1
      if (this.innerPage <= 0) {
        this.innerPage = 1
      }
    },
    handleNext() {
      this.innerPage += 1
      if (this.innerPage > this.totalPage) {
        this.innerPage = this.totalPage
      }
    },
    handleClickPage(page) {
      if (page !== '...') {
        this.innerPage = page
      } else {
        const tmps = []
        for (let i = 1; i <= this.totalPage; i++) {
          tmps.push({
            id: i,
            text: `${i}`
          })
        }
        this.pickerOpts.items = tmps
        this.pickerOpts.show = true
      }
    },
    handleSelectPage(values) {
      this.innerPage = values[0] + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  display: block;
  width: 100%;
  overflow: auto hidden;
  text-align: center;
  white-space: nowrap;

  .prev {
    display: inline-block;
    font-size: 24rpx;
    color: #979797;
    &.active {
      color: $pi-primary-color;
      cursor: pointer;
    }
  }

  .page-item {
    display: inline-block;
    margin-left: 24rpx;
    font-size: 24rpx;
    text-align: center;
    transition: all $pi-animation-duration $pi-animation-timing-function;

    &.background {
      min-width: 60rpx;
      padding: 8rpx;
      margin-left: 8rpx;
      font-size: 24rpx !important;
      color: #606266;
      background-color: #f4f4f5;
    }
    &.current {
      font-size: 32rpx;
      color: $pi-primary-color;
    }
    &.current.background {
      color: #ffffff;
      background-color: $pi-primary-color;
    }
  }

  .next {
    @extend .prev;

    margin-left: 16rpx;
  }
}
</style>
