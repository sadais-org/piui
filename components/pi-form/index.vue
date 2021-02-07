<template>
  <view class="pi-form" :style="[customStyle]" :class="[{ border }, customClass]">
    <pi-section
      v-if="title"
      :title="title"
      :desc="desc"
      :custom-style="titleStyle"
      padding="24rpx 32rpx"
    />
    <slot />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiForm'
const { form } = getConfig()

// 仅仅作为一个容器，批量设置form-item的属性
export default {
  name: 'Form',
  mixins: [
    ValueSync, // 混入v-model
    parentInit([
      'height',
      'border',
      'labelWidth',
      'labelAlign',
      'labelStyle',
      'inputAlign',
      'wrap',
      'labelWrapBorder',
      'colon',
      'disabled',
      'border'
    ])
  ],
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return form.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return form.customClass
      }
    },
    // 列表面板标题
    title: {
      type: String,
      default() {
        return form.title
      }
    },
    // 列表面板描述
    desc: {
      type: String,
      default() {
        return form.desc
      }
    },
    // 标题自定义样式，对象形式（默认值：{}）
    titleStyle: {
      type: Object,
      default() {
        return form.titleStyle
      }
    },
    // 高度
    height: {
      type: [String, Number],
      default() {
        return form.height
      }
    },
    // 表单项 label 宽度，默认单位为rpx
    labelWidth: {
      type: [String, Number],
      default() {
        return form.labelWidth
      }
    },
    // 表单label区域 label 对齐方式，可选值为 left center right
    labelAlign: {
      type: [Object, String],
      default() {
        return form.labelAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 表单项 label样式
    labelStyle: {
      type: Object,
      default() {
        return form.labelStyle
      }
    },
    // 表单输入区域 label 对齐方式，可选值为 left center right
    inputAlign: {
      type: [Object, String],
      default() {
        return form.inputAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 是否以换行样式显示表单
    wrap: {
      type: Boolean,
      default: form.wrap
    },
    // wrap样式label是否显示边框
    labelWrapBorder: {
      type: Boolean,
      default: form.labelWrapBorder
    },
    // 是否在 label 后面添加冒号
    colon: {
      type: Boolean,
      default: form.colon
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: form.disabled
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: form.border
    }
  }
}
</script>
