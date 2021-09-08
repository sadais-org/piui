<template>
  <view class="pi-input-wrap">
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
      :disabled="disabled"
      :maxlength="maxlength"
      :cursor-spacing="cursorSpacing"
      :focus="focus"
      :confirmType="confirmType"
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
      @tap="handleItemClick"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @keyboardheightchange="handlekeyboardHeightChange"
      @linechange="$emit('linechange', $event)"
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
      :disabled="disabled"
      :maxlength="maxlength"
      :cursor-spacing="cursorSpacing"
      :focus="focus"
      :confirmType="confirmType"
      :confirm-hold="confirmHold"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :auto-blur="autoBlur"
      @tap="handleItemClick"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @confirm="handleConfirm"
      @keyboardheightchange="$emit('keyboardheightchange', $event)"
    />
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
    }
  },
  data() {
    return {
      focused: this.focus
    }
  },
  methods: {
    handleItemClick(e) {
      this.$emit('click', e)
    },
    handleInput: debounce(function(e) {
      let value = e.detail.value
      // 输入内容
      this.val = value
      this.handleEmitChange()
      this.dispatch('PiForm', 'form-change', value)
      this.dispatch('PiFormItem', 'form-change', value)
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
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm(e) {
      // 输入完成事件
      this.$emit('confirm', e.detail.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-input-wrap {
  width: 100%;
  .pi-input,
  .pi-input-textarea {
    width: 100%;
  }
}
</style>
