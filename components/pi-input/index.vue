<template>
  <view class="pi-input-wrap" :style="[getInputWrapStyle]" :class="[{ disabled: getDisabled }]">
    <!-- 当disabled，增加一个abso的蒙层，为了触发click事件 -->
    <view
      v-if="getDisabled"
      class="pi-input-mask"
      :style="{ width: `calc(100% - ${closeIconWidth}px)` }"
      @tap="handleItemClick"
    />

    <textarea
      v-if="type === 'textarea'"
      class="pi-input-textarea"
      :style="[customStyle]"
      :class="[customClass]"
      :value="val"
      :password="password"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :maxlength="maxlength"
      :cursor-spacing="cursorSpacing"
      :focus="focus"
      :disabled="getDisabled"
      :confirm-hold="confirmHold"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :auto-blur="autoBlur"
      :show-confirm-bar="showConfirmbar"
      :auto-height="autoHeight"
      :disable-default-padding="disableDefaultPadding"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @keyboardheightchange="$emit('keyboardheightchange', $event)"
      @linechange="$emit('linechange', $event)"
      @tap="handleItemClick"
    />
    <input
      v-else
      class="pi-input"
      :style="[customStyle]"
      :class="[customClass]"
      :type="type == 'password' ? 'text' : type"
      :value="val"
      :password="password"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :maxlength="maxlength"
      :cursor-spacing="cursorSpacing"
      :focus="focus"
      :disabled="getDisabled"
      :confirm-hold="confirmHold"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :auto-blur="autoBlur"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @keyboardheightchange="$emit('keyboardheightchange', $event)"
      @tap="handleItemClick"
    />
    <!-- 清空icon -->
    <view class="pi-input-close-icon">
      <pi-icon
        v-if="showClearIcon"
        :custom-style="clearIcon.customStyle"
        :custom-class="`pi-pd-left-12 ${clearIcon.customClass}`"
        :name="clearIcon.name"
        :dot="clearIcon.dot"
        :dot-radius="clearIcon.dotRadius"
        :badge="clearIcon.badge"
        :color="clearIcon.color"
        :size="clearIcon.size"
        :class-prefix="clearIcon.classPrefix"
        @click="handleClearInput"
      />
    </view>
  </view>
</template>

<script>
/**
 *
 * @description 输入框
 */
import Emitter from '../../mixin/emitter'
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import { debounce } from '@sadais/piui-tool/tools/common'

const { input } = getConfig()

const TAG = 'PiInput'

export default {
  name: 'PiInput',
  // 混入v-model
  mixins: [ValueSync, Emitter],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return input.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return input.customClass
      }
    },
    // 输入框类型
    type: {
      required: false,
      // `'textarea'` `'text'` `'number'` `'idcard'` `'digit'`
      type: String,
      // `'text'`
      default() {
        return input.type
      },
      validator: function(value) {
        return ['textarea', 'text', 'number', 'idcard', 'digit'].includes(value)
      }
    },
    // 是否是密码类型
    password: {
      type: Boolean,
      // false
      default: input.password
    },
    placeholder: {
      type: String,
      // ''
      default: input.placeholder
    },
    placeholderStyle: {
      type: String,
      // color: #c0c4cc; font-weight: 400;
      default: input.placeholderStyle
    },
    placeholderClass: {
      type: String,
      // input-placeholder
      default: input.placeholderClass
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      // false
      default: input.disabled
    },
    // 边框样式设置
    border: {
      type: [Boolean, String],
      // false
      default: input.border
    },
    // 最大输入长度，设置为 -1 的时候不限制最大长度
    maxlength: {
      type: [Number, String],
      // 140
      default: input.maxlength
    },
    // 指定光标与键盘的距离，单位 px
    cursorSpacing: {
      type: [Number, String],
      // 0
      default: input.cursorSpacing
    },
    // 是否自动获得焦点
    focus: {
      type: Boolean,
      // false
      default: input.focus
    },
    // 设置键盘右下角按钮的文字，仅在 type="text" 时生效。
    confirmType: {
      type: String,
      // 'done'
      default: input.confirmType
    },
    // 点击键盘右下角按钮时是否保持键盘不收起
    confirmHold: {
      type: Boolean,
      // false
      default: input.confirmHold
    },
    // 指定focus时的光标位置
    cursor: {
      type: [Object, Number],
      // null
      default: input.cursor
    },
    // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
    selectionStart: {
      type: [Number, String],
      // -1
      default: input.selectionStart
    },
    // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
    selectionEnd: {
      type: [Number, String],
      // -1
      default: input.selectionEnd
    },
    // 键盘弹起时，是否自动上推页面
    adjustPosition: {
      type: Boolean,
      // true
      default: input.adjustPosition
    },
    // focus时，点击页面的时候不收起键盘
    holdKeyboard: {
      type: Boolean,
      // false
      default: input.holdKeyboard
    },
    // 键盘收起时，是否自动失去焦点
    autoBlur: {
      type: Boolean,
      // true
      default: input.autoBlur
    },
    // 以下是textarea组件的属性
    // 是否显示键盘上方带有”完成“按钮那一栏
    showConfirmbar: {
      type: Boolean,
      // true
      default: input.showConfirmbar
    },
    // 是否自动增高
    autoHeight: {
      type: Boolean,
      // false
      default: input.autoHeight
    },
    // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true
    fixed: {
      type: Boolean,
      // false
      default: input.fixed
    },
    // 是否去掉 iOS 下的默认内边距
    disableDefaultPadding: {
      type: Boolean,
      // false
      default: input.disableDefaultPadding
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      // false
      default: input.clearable
    },
    // 清空图标设置
    clearIcon: {
      type: Object,
      default() {
        return input.clearIcon
      }
    }
  },
  data() {
    return {
      focused: this.focus,
      closeIconWidth: 0
    }
  },
  computed: {
    getDisabled() {
      const parentFormItem = this.$pi.parent(this, 'PiFormItem')
      const disabled = this.disabled || (parentFormItem && parentFormItem.getDisabled)
      return disabled
    },
    getInputWrapStyle() {
      const style = {}
      if (this.border) {
        style.padding = '8rpx 14rpx'
        style.borderRadius = '4rpx'
        if (this.$pi.lang.isString(this.border)) {
          style.border = this.border
        } else {
          style.border = '1px solid #d9d9d9'
        }
      }
      return style
    },
    showClearIcon() {
      return this.clearable && this.val
    }
  },
  watch: {
    showClearIcon() {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.closeIconWidth) {
        const closeIconRect = await this.$pi.common.queryRect(this, '.pi-input-close-icon', false)
        if (closeIconRect && closeIconRect.width) {
          this.closeIconWidth = closeIconRect.width
        }
        // console.log(TAG, '计算.pi-icon宽度', this.closeIconWidth)
      }
    },
    handleItemClick(e) {
      this.$emit('click', e)
    },
    handleInput: debounce(function(e) {
      let value = e.detail.value
      // 输入内容
      this.handleChange(value)
    }, 50),
    handleFocus() {
      this.focused = true
      // 获得焦点
      this.$emit('focus')
    },
    handleBlur(e) {
      setTimeout(() => {
        this.focused = false
      }, 100)
      // 失去焦点
      this.$emit('blur', e.detail.value)
      setTimeout(() => {
        this.dispatch('PiFormItem', 'form-blur', e.detail.value)
      }, 40)
    },
    handleClearInput() {
      this.handleChange('')
      this.$emit('clear')
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm(e) {
      // 输入完成事件
      this.$emit('confirm', e.detail.value)
    },
    handleChange(value) {
      this.val = value
      this.handleEmitChange()
      this.dispatch('PiForm', 'form-change', this.val)
      this.dispatch('PiFormItem', 'form-change', this.val)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-input-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  .pi-input,
  .pi-input-textarea {
    width: 100%;
  }

  .pi-input-mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: transparent;
    z-index: 101;
  }
}
</style>
