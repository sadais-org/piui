<template>
  <view
    class="pi-form-item pi-align-center"
    :style="[customStyle, itemStyle]"
    :class="[{ border: getBorder }, customClass]"
    @tap.stop="handleItemClick"
  >
    <!-- 左侧区域 -->
    <view class="form-label" :style="[getLabelStyle, labelStyle]">
      <slot name="label">
        {{ label }}
      </slot>
      <text v-if="getColon" class="pi-pd-left-8">:</text>
    </view>

    <!-- 中间区域 -->
    <view
      class="input-wrap pi-flex-sub pi-align-center"
      :style="[inputWrapStyle]"
      :class="[getInputAlign]"
    >
      <slot />
    </view>
    <!-- 右侧区域 -->
    <view v-if="$slots.right" class="pi-pd-left-24">
      <slot name="right" />
    </view>
  </view>
</template>

<script>
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiFormItem'
const { formItem } = getConfig()
const extendPiFrom = childInit('Form')

const alignFlexMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

export default {
  name: 'FormItem',
  mixins: [extendPiFrom], // 注入inheritProps
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return formItem.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return formItem.customClass
      }
    },
    // 高度
    height: {
      type: [String, Number],
      default() {
        return formItem.height
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      default() {
        return formItem.padding
      }
    },
    label: {
      type: String
    },
    // 表单项 label 宽度，默认单位为rpx
    labelWidth: {
      type: [String, Number],
      default() {
        return formItem.labelWidth
      }
    },
    // 表单项 label样式
    labelStyle: {
      type: Object,
      default() {
        return formItem.labelStyle
      }
    },
    // 表单label区域 label 对齐方式，可选值为 left center right
    labelAlign: {
      type: String,
      default() {
        return formItem.labelAlign
      },
      validator: function(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    // 表单输入区域 label 对齐方式，可选值为 left center right
    inputAlign: {
      type: String,
      default() {
        return formItem.inputAlign
      },
      validator: function(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    // 是否在 label 后面添加冒号
    colon: {
      type: Boolean,
      default: formItem.colon
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: formItem.disabled
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: formItem.border
    }
  },
  computed: {
    getBorder() {
      return this.inheritProps.border !== undefined ? this.inheritProps.border : this.border
    },
    getColon() {
      return this.inheritProps.colon !== undefined ? this.inheritProps.colon : this.colon
    },
    getLabelAlign() {
      return this.inheritProps.labelAlign !== undefined
        ? this.inheritProps.labelAlign
        : this.labelAlign
    },
    getInputAlign() {
      return this.inheritProps.inputAlign !== undefined
        ? this.inheritProps.inputAlign
        : this.inputAlign
    },
    itemStyle() {
      const style = {
        padding: this.padding
      }
      const height = this.height || this.inheritProps.height
      if (height) {
        style.height = this.$pi.common.addUnit(height)
      }
      return style
    },
    getLabelStyle() {
      const style = {}
      const labelWidth = this.labelWidth || this.inheritProps.labelWidth
      if (labelWidth) {
        style.minWidth = this.$pi.common.addUnit(labelWidth)
      }
      style.textAlign = this.getLabelAlign
      return style
    },
    inputWrapStyle() {
      const style = {}
      style.justifyContent = alignFlexMap[this.getInputAlign]
      return style
    }
  },
  inject: {
    piForm: { default: undefined }
  },
  created() {},
  methods: {
    handleItemClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/border.scss';

.pi-form-item {
  height: $pi-form-item-height;
  font-size: $pi-form-size;
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-form-border-color;
      border-bottom-width: $pi-form-border-width;
    }
  }
  .form-label {
    font-weight: $pi-form-label-weight;
    color: $pi-form-label-color;
    white-space: nowrap;
  }
  .input-wrap {
    padding-left: 24rpx;
    /deep/ .pi-input-wrap {
      width: 100%;
    }
    &.left {
      /deep/ .pi-input-wrap {
        text-align: left;
      }
    }
    &.center {
      /deep/ .pi-input-wrap {
        text-align: center;
      }
    }
    &.right {
      /deep/ .pi-input-wrap {
        text-align: right;
      }
    }
  }
}
</style>
