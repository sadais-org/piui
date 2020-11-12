<template>
  <view class="pi-form" :style="[customStyle]" :class="[{ border: showBorder }, customClass]">
    <view v-if="title" class="form-title" :style="[titleStyle]">{{ title }}</view>
    <slot />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiForm'
const { form } = getConfig()

export default {
  name: 'Form',
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
    // 标题自定义样式，对象形式（默认值：{}）
    titleStyle: {
      type: Object,
      default() {
        return form.titleStyle
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default() {
        return form.border
      }
    },
    // 列按压时的样式类，"none"为无效果
    hoverClass: {
      type: String,
      default: form.hoverClass
    }
  },
  provide() {
    return {
      piForm: this
    }
  },
  computed: {
    showBorder() {
      return this.border && !this.gap
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/border.scss';

.pi-form {
  .form-title {
    position: relative;
    padding-left: 48rpx;
    margin: 24rpx 0;
    font-size: 32rpx;
    font-weight: 500;
    color: #6a6a77;

    &::before {
      position: absolute;
      top: 50%;
      left: 24rpx;
      display: inline-block;
      width: 6rpx;
      height: 60%;
      overflow: hidden;
      content: '';
      background-color: #6190e8;
      border-radius: 2rpx;
      transform: translateY(-50%);
    }
  }
}
</style>
