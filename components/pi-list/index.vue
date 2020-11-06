<template>
  <view class="pi-list" :style="[customStyle]" :class="[{ border: showBorder }, customClass]">
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
import { getConfig } from '../../config'

const TAG = 'PiList'
const { list } = getConfig()

export default {
  name: 'List',
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return list.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return list.customClass
      }
    },
    // 列表面板标题
    title: {
      type: String,
      default() {
        return list.title
      }
    },
    // 列表面板描述
    desc: {
      type: String,
      default() {
        return list.desc
      }
    },
    // 标题自定义样式，对象形式（默认值：{}）
    titleStyle: {
      type: Object,
      default() {
        return list.titleStyle
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default() {
        return list.border
      }
    },
    // 列按压时的样式类，"none"为无效果
    hoverClass: {
      type: String,
      default: list.hoverClass
    }
  },
  provide() {
    return {
      piList: this
    }
  },
  computed: {
    showBorder() {
      return this.border && !this.gap
    }
  }
}
</script>
