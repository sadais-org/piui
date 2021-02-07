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
      :placeholderStyle="placeholderStyle"
      :disabled="disabled || type === 'select'"
      :maxlength="maxlength"
      :focus="focus"
      :confirmType="confirmType"
      :cursor-spacing="cursorSpacing"
      :selection-end="selectionEnd"
      :selection-start="selectionStart"
      :show-confirm-bar="showConfirmbar"
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
      :placeholderStyle="placeholderStyle"
      :disabled="disabled || type === 'select'"
      :maxlength="maxlength"
      :focus="focus"
      :confirmType="confirmType"
      :cursor-spacing="cursorSpacing"
      :selection-end="selectionEnd"
      :selection-start="selectionStart"
      :show-confirm-bar="showConfirmbar"
    />
  </view>
</template>

<script>
/**
 *
 * @description 输入框
 */
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { input } = getConfig()

const TAG = 'PiInput'

export default {
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return input.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return input.customClass
      }
    },
    // 输入框类型 'textarea', 'text', 'number', 'idcard', 'digit'
    type: {
      required: false,
      type: String,
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
      default: input.password
    },
    placeholder: {
      type: String,
      default: input.placeholder
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: -1
    },
    placeholderStyle: {
      type: String,
      default: 'color: #c0c4cc; font-weight: 400;'
    },
    confirmType: {
      type: String,
      default: 'done'
    },
    // 是否自动获得焦点
    focus: {
      type: Boolean,
      default: false
    },
    // 指定光标与键盘的距离，单位 px
    cursorSpacing: {
      type: [Number, String],
      default: 0
    },
    // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
    selectionStart: {
      type: [Number, String],
      default: -1
    },
    // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
    selectionEnd: {
      type: [Number, String],
      default: -1
    },
    // 是否显示键盘上方带有”完成“按钮那一栏
    showConfirmbar: {
      type: Boolean,
      default: true
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.pi-input-wrap {
  .pi-input-textarea {
    width: 100%;
  }
}
</style>
