<template>
  <view class="pi-align-center">
    <view class="pi-pd-right-18" :style="searchLabelStyle">{{ searchLabel }}</view>
    <!-- 中间灰色包裹块 -->
    <view
      class="pi-flex-sub pi-align-center pi-of-hidden"
      :style="{
        background: background,
        borderRadius: shape == 'round' ? '2000px' : '8rpx'
      }"
    >
      <!-- 搜索图标 -->
      <view class="pi-pd-lr-18">
        <view :class="'pi-icon-' + searchIcon" />
      </view>
      <!-- 输入框包裹 -->
      <view class="pi-align-center pi-flex-sub">
        <input
          class="pi-flex-sub pi-fz-28"
          confirm-type="search"
          :value="val"
          :disabled="disabled"
          :maxlength="parseInt(maxlength, 10)"
          :focus="focused"
          :placeholder="placeholder"
          :placeholder-style="placeholderStyle"
          type="text"
          :style="mergeInputStyle"
          @blur="handleInputBlur"
          @confirm="handleInputSearch"
          @input="handleInputChange"
          @focus="handleInputFocus"
        />
        <!-- clear action -->
        <view v-if="showClear" class="pi-pd-right-18" @tap="handleClearInput">
          <view class=" pi-icon-close" />
        </view>
      </view>
    </view>
    <!-- right action -->
    <view v-if="showAction" class=" pi-pd-left-18" :style="[actionStyle]" @tap="handleActionClick">
      {{ actionText }}
    </view>
  </view>
</template>

<script>
/**
 *
 * search	确定搜索时触发	value: string (当前输入的值)
 * input	输入框内容变化时触发	value: string (当前输入的值)
 * focus	输入框获得焦点时触发	event: Event
 * blur	输入框失去焦点时触发	event: Event
 * clear	点击清除按钮后触发	event: Event
 * action	点击右侧action触发
 */
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const TAG = 'PiSearch'
const { search } = getConfig()

export default {
  name: TAG,
  mixins: [ValueSync], // 注入value与val，进行双向绑定
  props: {
    // 搜索框形状 round || square（默认'round'）
    shape: {
      type: String,
      default: search.shape
    },
    // 背景颜色（默认'#f2f2f2'）
    background: {
      type: String,
      default: search.background
    },
    // 是否启用清除控件（默认true）
    clearable: {
      type: Boolean,
      default: search.clearable
    },
    // 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示，（默认'always'）
    clearTrigger: {
      type: String,
      default: search.clearTrigger
    },
    // 是否自动获得焦点（默认false）
    focus: {
      type: Boolean,
      default: search.focus
    },
    // 占位提示文字（默认''）
    placeholder: {
      type: String,
      default: search.placeholder
    },
    // 指定 placeholder 的样式（默认'请输入搜索关键词'）
    placeholderStyle: {
      type: String,
      default() {
        return search.placeholderStyle
      }
    },
    // 输入框最大能输入的长度，-1为不限制长度（默认-1）
    maxlength: {
      type: [Number, String],
      default: search.maxlength
    },
    // 是否在搜索框右侧显示文字（默认false）
    showAction: {
      type: Boolean,
      default: search.showAction
    },
    // 右侧显示文字（默认'取消'）
    actionText: {
      type: String,
      default: search.actionText
    },
    // 指定右侧显示文字样式（默认{}）
    actionStyle: {
      type: Object,
      default() {
        return search.actionStyle
      }
    },
    // 输入框内容对齐方式，可选值为 left|center|right（默认为'left'）
    inputAlign: {
      type: String,
      default: search.inputAlign
    },
    // 搜索框左侧文本（默认''）
    searchLabel: {
      type: String,
      default: search.searchLabel
    },
    // 搜索框左侧文本样式（默认{}）
    searchLabelStyle: {
      type: Object,
      default() {
        return search.searchLabelStyle
      }
    },
    // 输入框左边的图标，可以为icon名称或图片路径（默认为'search'）
    searchIcon: {
      type: String,
      default: search.searchIcon
    },
    // 输入框左边的图标颜色(当传入searchIcon为name的时候)，（默认为'#333333'）
    searchIconColor: {
      type: String,
      default: search.searchIconColor
    },
    // 是否禁用输入框
    disabled: {
      type: Boolean,
      default: search.disabled
    },
    // 指定input样式（默认{}）
    inputStyle: {
      type: Object,
      default() {
        return search.inputStyle
      }
    },
    // 导航栏高度，单位px，（默认58）
    height: {
      type: [String, Number],
      default: search.height
    },
    // 输入框颜色，（默认为'#333333'）
    color: {
      type: String,
      default: search.color
    }
  },
  data() {
    return {
      focused: this.focus // input 是否已获取焦点
    }
  },
  computed: {
    getHeight() {
      return this.$piTools.common.addUnit(this.height)
    },
    mergeInputStyle() {
      return {
        textAlign: this.inputAlign,
        color: this.color,
        background: this.background,
        height: this.getHeight,
        ...this.inputStyle
      }
    },
    showClear() {
      return this.clearTrigger === 'always' ? this.val : this.focused && this.val
    }
  },
  watch: {
    focus: {
      deep: true,
      immediate: true,
      handler(value) {
        this.focused = value
      }
    }
  },
  methods: {
    handleInputChange(e) {
      const value = e.detail.value
      this.$emit('input', value)
      this.val = value
    },
    handleInputBlur() {
      this.focused = false
      this.$emit('blur', this.val)
      uni.hideKeyboard() // 收起键盘
    },
    handleInputSearch(e) {
      this.$emit('search', e.detail.value)
      uni.hideKeyboard() // 收起键盘
    },
    handleInputFocus() {
      this.focused = true
      this.$emit('focus', this.val)
    },
    handleClearInput() {
      this.val = ''
      uni.hideKeyboard() // 收起键盘
      this.$nextTick(() => {
        // 延后发出事件，避免在父组件监听clear事件时，value为更新前的值(不为空)
        this.$emit('clear', this.val)
      })
    },
    handleActionClick() {
      this.$emit('action')
    }
  }
}
</script>
