<template>
  <view class="textarea-text-wrap">
    <!--  #ifndef MP-WEIXIN -->
    <textarea
      :focus="piFocus"
      :value="value"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :disabled="disabled"
      :maxlength="maxlength"
      :auto-height="autoHeight"
      :fixed="fixed"
      :cursor="cursor"
      :show-confirm-bar="showConfirmBar"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      @focus="handleFocus"
      @blur="handleBlur"
      @linechange="handleLineChange"
      @input="handleInput"
      @confirm="handleConfirm"
    ></textarea>
    <!--  #endif -->

    <!-- 只处理微信端textarea z-index 问题，如果页面没有遮罩层或者不需要兼容微信小程序，则不需要处理 -->

    <!-- #ifdef MP-WEIXIN -->
    <textarea
      v-if="show"
      auto-focus
      :style="{ height: autoHeight ? '' : '300rpx' }"
      :focus="piFocus"
      :value="value"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :disabled="disabled"
      :maxlength="maxlength"
      :auto-height="autoHeight"
      :fixed="fixed"
      :cursor="cursor"
      :show-confirm-bar="showConfirmBar"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      @focus="handleFocus"
      @blur="handleBlur"
      @linechange="handleLineChange"
      @input="handleInput"
      @confirm="handleConfirm"
    ></textarea>
    <view
      v-else
      :style="{ 'height': autoHeight ? '' : '300rpx', 'margin-bottom': autoHeight ? '1px' : '' }"
      @tap="handleFocusTextarea"
    >
      <view v-if="!value" class="rich-text placeholder" :style="placeholderStyle">
        {{ placeholder }}
      </view>
      <rich-text v-else class="rich-text" :nodes="value | brFilter" />
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'PiTextarea',
  filters: {
    brFilter: function(value) {
      return value.replace(/\n/g, '<br/>')
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    maxlength: {
      type: [Number, String],
      default: 140
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: [Boolean, String],
      default: false
    },
    focus: {
      type: [Boolean, String],
      default: false
    },
    autoFocus: {
      type: [Boolean, String],
      default: false
    },
    placeholderClass: {
      type: String,
      default: ''
    },
    placeholderStyle: {
      type: String,
      default: ''
    },
    fixed: {
      type: [Boolean, String],
      default: false
    },
    autoHeight: {
      type: [Boolean, String],
      default: false
    },
    cursor: {
      type: [Number, String],
      default: -1
    },
    showConfirmBar: {
      type: [Boolean, String],
      default: true
    },
    selectionStart: {
      type: [Number, String],
      default: -1
    },
    selectionEnd: {
      type: [Number, String],
      default: -1
    },
    adjustPosition: {
      type: [Boolean, String],
      default: true
    }
  },
  data() {
    return {
      show: false,
      piFocus: this.focus
    }
  },
  watch: {
    focus: {
      deep: true,
      immediate: true,
      handler(focus) {
        this.piFocus = focus
      }
    }
  },
  methods: {
    handleBlur(e) {
      this.show = false
      this.piFocus = false
      this.$emit('blur', e)
    },
    handleFocus(e) {
      this.$emit('focus', e)
    },
    handleLineChange(e) {
      this.$emit('linechange', e)
    },
    handleConfirm(e) {
      this.$emit('confirm', e)
    },
    handleFocusTextarea() {
      this.show = true
      setTimeout(() => {
        this.piFocus = true
      }, 100)
    },
    handleInput(e) {
      const value = e.detail.value
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea-text-wrap {
  position: relative;
  width: 100%;
  font-size: inherit;
  transition: all 0.6s ease-in-out;
  textarea {
    width: 100%;
    font-size: inherit;
    line-height: 1.2em;
  }
  .rich-text {
    width: 100%;
    line-height: 1.2em;
    word-break: break-all;
  }
  .placeholder {
    color: $pi-placeholder-color;
  }
}
</style>
