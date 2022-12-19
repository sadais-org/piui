<template>
  <view class="pi-align-center pi-w-100P" :style="[customStyle]" :class="[customClass]">
    <view v-if="searchLabel" class="pi-pd-right-18" :style="[searchLabelStyle]">
      {{ searchLabel }}
    </view>
    <!-- 中间灰色包裹块 -->
    <view
      class="pi-search-wrap pi-flex-sub pi-align-center pi-of-hidden"
      :class="[customClass]"
      :style="[
        customStyle,
        {
          background: background,
          borderRadius: shape == 'round' ? '2000px' : '8rpx',
          flexDirection: searchIconPosition === 'right' ? 'row-reverse' : 'row'
        }
      ]"
    >
      <!-- 搜索图标 -->
      <view
        v-if="showSearchIcon"
        :class="[
          {
            'pi-pd-left-18 pi-pd-right-18': searchIconPosition === 'left',
            'pi-pd-right-18': searchIconPosition === 'right'
          }
        ]"
      >
        <view :class="'pi-fz-32 pi-icon-' + searchIcon" :style="[IconStyle]" />
      </view>
      <!-- 输入框包裹 -->
      <view
        class="pi-align-center pi-flex-sub"
        :class="[{ 'pi-pd-left-18': searchIconPosition === 'right' }]"
      >
        <input
          v-if="isControlFocus"
          class="pi-flex-sub pi-fz-28"
          confirm-type="search"
          :value="val"
          :disabled="disabled"
          :maxlength="parseInt(maxlength, 10)"
          :focus="focused"
          :placeholder="placeholder"
          :placeholder-style="placeholderStyle"
          type="text"
          :style="[mergeInputStyle]"
          @blur="handleInputBlur"
          @confirm="handleInputSearch"
          @input="handleInputChange"
          @focus="handleInputFocus"
        />
        <input
          v-else
          class="pi-flex-sub pi-fz-28"
          confirm-type="search"
          :value="val"
          :disabled="disabled"
          :maxlength="parseInt(maxlength, 10)"
          :placeholder="placeholder"
          :placeholder-style="placeholderStyle"
          type="text"
          :style="[mergeInputStyle]"
          @blur="handleInputBlur"
          @confirm="handleInputSearch"
          @input="handleInputChange"
          @focus="handleInputFocus"
        />
        <!-- clear action -->
        <view v-if="clearable && val" class="pi-pd-lr-18" @tap="handleClearInput">
          <view class="pi-icon-roundclosefill" :style="[clearIconStyle]" />
        </view>
      </view>
    </view>
    <!-- right action -->
    <view
      v-if="showAction"
      class="pi-pd-left-18 pi-primary pi-fz-28"
      :style="[actionStyle]"
      @tap.stop="handleActionClick"
    >
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
  name: 'PiSearch',
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync], // 注入value与val，进行双向绑定
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return search.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // `''`
      default() {
        return search.customClass
      }
    },
    // 搜索框形状,可选值为 `'square'` `'round'`
    shape: {
      type: String,
      // `'round'`
      default: search.shape,
      validator: function (value) {
        return ['square', 'round'].includes(value)
      }
    },
    // 背景颜色
    background: {
      type: String,
      // `'#f5f5f5'`
      default: search.background
    },
    // 是否启用清除控件
    clearable: {
      type: Boolean,
      // `true`
      default: search.clearable
    },
    // 清除图标自定义样式
    clearIconStyle: {
      type: Object,
      // `{}`
      default() {
        return search.searchIconStyle
      }
    },
    // 是否自动获得焦点
    focus: {
      type: Boolean,
      // `false`
      default: search.focus
    },
    // 占位提示文字
    placeholder: {
      type: String,
      // `'请输入搜索关键词'`
      default: search.placeholder
    },
    // 指定 placeholder 的样式
    placeholderStyle: {
      type: String,
      // `'color: #cccccc;'`
      default() {
        return search.placeholderStyle
      }
    },
    // 输入框最大能输入的长度，-1为不限制长度
    maxlength: {
      type: [Number, String],
      // `-1`
      default: search.maxlength
    },
    // 是否在搜索框右侧显示文字
    showAction: {
      type: Boolean,
      // `false`
      default: search.showAction
    },
    // 右侧显示文字
    actionText: {
      type: String,
      // `'取消'`
      default: search.actionText
    },
    // 指定右侧显示文字样式
    actionStyle: {
      type: Object,
      // `{}`
      default() {
        return search.actionStyle
      }
    },
    // 输入框内容对齐方式，可选值 `'left'` `'center'` `'right'`
    inputAlign: {
      type: String,
      // `'left'`
      default: search.inputAlign
    },
    // 搜索框左侧文本
    searchLabel: {
      type: String,
      // `''`
      default: search.searchLabel
    },
    // 搜索框左侧文本样式
    searchLabelStyle: {
      type: Object,
      // `{}`
      default() {
        return search.searchLabelStyle
      }
    },
    // 是否显示搜索icon
    showSearchIcon: {
      type: Boolean,
      // `true`
      default: search.showSearchIcon
    },
    // 输入框的图标，可以为icon名称或图片路径
    searchIcon: {
      type: String,
      // `'search'`
      default: search.searchIcon
    },
    // 输入框左边的图标颜色(当传入searchIcon为name的时候)
    searchIconColor: {
      type: String,
      // `'#333333'`
      default: search.searchIconColor
    },
    // 输入框左侧的图标自定义样式
    searchIconStyle: {
      type: Object,
      // `{}`
      default() {
        return search.searchIconStyle
      }
    },
    // 搜索icon的位置, 可选值为`'left'` `'right'`
    searchIconPosition: {
      type: String,
      // `'left'`
      default: search.searchIconPosition,
      validator: function (value) {
        return ['left', 'right'].includes(value)
      }
    },
    // 是否禁用输入框
    disabled: {
      type: Boolean,
      // `false`
      default: search.disabled
    },
    // 指定input样式
    inputStyle: {
      type: Object,
      // `{}`
      default() {
        return search.inputStyle
      }
    },
    // 导航栏高度，单位px
    height: {
      type: [String, Number],
      // `58`
      default: search.height
    },
    // 输入文本颜色
    color: {
      type: String,
      // `'#333333'`
      default: search.color
    }
  },
  data() {
    return {
      focused: this.focus // input 是否已获取焦点
    }
  },
  computed: {
    isControlFocus() {
      //  #ifdef APP-PLUS
      const info = uni.getSystemInfoSync()
      return info.platform !== 'android'
      //  #endif

      //  #ifndef APP-PLUS
      return true
      // #endif
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
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
    IconStyle() {
      return {
        color: this.searchIconColor,
        ...this.searchIconStyle
      }
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
      // 输入框内容变化时触发
      this.val = value
      this.handleEmitChange()
    },
    handleInputBlur() {
      this.focused = false
      // 输入框失去焦点时触发
      // @arg `event: Event`
      this.$emit('blur', this.val)
      uni.hideKeyboard() // 收起键盘
    },
    handleInputSearch(e) {
      // 确定搜索时触发
      // @arg `value: string` (当前输入的值)
      this.$emit('search', e.detail.value)
      uni.hideKeyboard() // 收起键盘
    },
    handleInputFocus() {
      this.focused = true
      // 输入框获得焦点时触发
      // @arg `event: Event`
      this.$emit('focus', this.val)
    },
    handleClearInput() {
      this.val = ''
      this.handleEmitChange()
      uni.hideKeyboard() // 收起键盘
      this.$nextTick(() => {
        // 延后发出事件，避免在父组件监听clear事件时，value为更新前的值(不为空)
        // @arg `event: Event`
        this.$emit('clear', this.val)
      })
    },
    handleActionClick() {
      // 点击按钮时触发
      this.$emit('action', this.val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-search-wrap {
  font-weight: initial;
  color: #cccccc;
}
</style>
