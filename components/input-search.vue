<template>
  <view class="header-wrap pi-align-center pi-content">
    <view
      class="pi-flex-sub pi-align-center input-wrap pi-bg-light-gray pi-of-hidden "
      :style="inputStyle"
    >
      <view class="pi-icon-search" />
      <input
        v-model.trim="searchValue"
        type="text"
        class="pi-flex-sub pi-pd-left-16
      pi-bg-light-gray"
        confirm-type="search"
        :focus="autofocus"
        :placeholder="searchPlaceholder"
        @input="handleInput"
        @confirm="handleConfirm"
      />
    </view>
    <view
      v-if="searchValue"
      class="pi-primary pi-fz-32 pi-fw-500 pi-mg-left-32"
      @tap="handleClickRightButton"
    >
      {{ title }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'PiInputSearch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 初始值
    value: {
      required: false,
      type: String,
      default() {
        return ''
      }
    },
    // 选项列表
    searchPlaceholder: {
      required: false,
      type: String,
      default: '搜索'
    },
    // 自动拉起软键盘
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    },
    // 圆角
    inputStyle: {
      required: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: 'search', // search or cancel 当前处于搜索或者可取消状态
      searchValue: this.value,
      lastSearchValue: this.value
    }
  },
  computed: {
    title() {
      return this.status === 'search' ? '搜索' : '取消'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.searchValue = value
      }
    }
  },
  methods: {
    handleInput(e) {
      const value = e.detail.value
      this.status = value && value !== this.lastSearchValue ? 'search' : 'cancel'
      this.$emit('input', value)
      if (!value) {
        this.handleCancel()
      }
    },
    handleConfirm() {
      const searchValue = this.searchValue.trim()
      if (!searchValue) return // 如果搜索内容为空，中断
      this.status = 'cancel'
      this.lastSearchValue = searchValue
      uni.hideKeyboard()
      this.$emit('onSearch', searchValue)
    },
    handleCancel() {
      this.searchValue = ''
      this.status = 'search'
      this.lastSearchValue = ''
      uni.hideKeyboard()
      this.$emit('onSearch', this.searchValue)
    },
    handleClickRightButton() {
      if (this.status === 'search') {
        this.handleConfirm()
      } else {
        this.handleCancel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-wrap {
  font-size: $pi-font-size;
  font-weight: 400;
  color: #666666;
  text-align: left;
  transition: all 2s ease-in-out 0s;
  .input-wrap {
    padding: 10rpx 16rpx;
    input {
      overflow: hidden;
      font-size: 28rpx;
      color: #666666;
    }
  }
}
</style>
