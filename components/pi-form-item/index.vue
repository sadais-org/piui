<template>
  <view
    class="pi-form-item"
    :style="[customStyle, itemStyle]"
    :class="[{ border: getBorder }, { 'pi-align-center': !getWrap }, customClass]"
    @tap.stop="handleItemClick"
  >
    <!-- 表单标题 -->
    <view
      class="form-label pi-align-center pi-flex-nowrap"
      :style="[getLabelStyle, labelStyle]"
      :class="[{ border: getWrap && getLabelWrapBorder }]"
    >
      <view v-if="required" style="color: red;" class="pi-mg-right-12" :style="[requiredStyle]">
        *
      </view>
      <slot name="label">
        {{ label }}
      </slot>
      <view v-if="getColon" class="pi-pd-left-8">:</view>
    </view>

    <!-- 内容区域 -->
    <view
      class="content-wrap pi-align-center"
      :class="[{ 'pi-flex-sub': !getWrap }, getInputAlign]"
      :style="[contentWrapStyle]"
    >
      <view class="input-wrap " :class="[{ wrap: getWrap, nowrap: !getWrap }]">
        <slot />
      </view>
      <!-- 右侧区域 -->
      <view v-if="$slots && $slots.right" class="pi-pd-left-24">
        <slot name="right" />
      </view>
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
  options: {
    styleIsolation: 'shared'
  },
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
    // 是否必填
    required: {
      type: Boolean,
      default() {
        return formItem.required
      }
    },
    // 必填标志自定义样式，对象形式（默认值：{}）
    requiredStyle: {
      type: Object,
      default() {
        return formItem.requiredStyle
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
    // 是否以换行样式显示表单
    wrap: {
      type: Boolean,
      default: formItem.wrap
    },
    // wrap样式label是否显示边框
    labelWrapBorder: {
      type: Boolean,
      default: formItem.labelWrapBorder
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
      return this.inheritProps.border !== null ? this.inheritProps.border : this.border
    },
    getWrap() {
      return this.inheritProps.wrap !== null ? this.inheritProps.wrap : this.wrap
    },
    getLabelWrapBorder() {
      return this.inheritProps.labelWrapBorder !== null
        ? this.inheritProps.labelWrapBorder
        : this.labelWrapBorder
    },
    getColon() {
      return this.inheritProps.colon !== null ? this.inheritProps.colon : this.colon
    },
    getLabelAlign() {
      return this.inheritProps.labelAlign !== null ? this.inheritProps.labelAlign : this.labelAlign
    },
    getInputAlign() {
      return this.inheritProps.inputAlign !== null ? this.inheritProps.inputAlign : this.inputAlign
    },
    itemStyle() {
      const style = {}
      if (!this.getWrap) {
        style.padding = this.padding
      }
      const height = this.height || this.inheritProps.height
      if (!this.getWrap && height) {
        style.height = this.$pi.common.addUnit(height)
      }
      return style
    },
    getLabelStyle() {
      const style = {}
      if (this.getWrap) {
        style.padding = this.padding
      }
      const labelWidth = this.labelWidth || this.inheritProps.labelWidth
      if (labelWidth) {
        style.minWidth = this.$pi.common.addUnit(labelWidth)
      }
      const height = this.height || this.inheritProps.height
      if (this.getWrap && height) {
        style.height = this.$pi.common.addUnit(height)
      }
      style.textAlign = this.getLabelAlign
      return style
    },
    contentWrapStyle() {
      const style = {}
      if (this.getWrap) {
        style.padding = this.padding
      }
      style.justifyContent = alignFlexMap[this.getInputAlign]
      return style
    }
  },
  inject: {
    piForm: { default: null }
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
    &.border {
      @include pi-border;
      &::after {
        border: 0 solid $pi-form-border-color;
        border-bottom-width: $pi-form-border-width;
      }
    }
  }
  .input-wrap {
    width: 100%;
    &.nowrap {
      margin-left: 24rpx;
    }
    &.wrap {
      margin-top: 24rpx;
      margin-bottom: 24rpx;
    }
  }
  // 解决slot宽度没有占满100%的问题
  /deep/ .content-wrap {
    & > pi-input {
      width: 100%;
    }
    .pi-input-wrap {
      width: 100%;
    }
    &.left {
      .pi-input-wrap,
      pi-input {
        text-align: left;
      }
      .pi-checkbox-group.horizontal {
        justify-content: flex-start;
      }
    }
    &.center {
      .pi-input-wrap,
      pi-input {
        text-align: center;
      }
      .pi-checkbox-group.horizontal {
        justify-content: center;
      }
    }
    &.right {
      .pi-input-wrap,
      pi-input {
        text-align: right;
      }
      .pi-checkbox-group.horizontal {
        justify-content: flex-end;
      }
    }
  }
}
</style>
