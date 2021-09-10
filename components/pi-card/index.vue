<template>
  <view
    class="card"
    :style="[{ margin: getMargin }, customStyle]"
    :class="[customClass]"
    @tap.stop="handleCardClick"
  >
    <!-- title -->
    <view
      v-if="($slots && $slots.title) || title"
      class="card-title pi-align-center pi-solid-bottom-1"
      :style="[{ padding: getPadding }, titleStyle]"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </view>
    <!-- default -->
    <view
      v-if="$slots.default || $slots.$default"
      class="pi-pd-tb-24"
      :style="[{ padding: getPadding }]"
    >
      <slot />
    </view>
    <!-- body -->
    <view v-if="$slots.body" class="pi-pd-tb-24" :style="[{ padding: getPadding }]">
      <slot name="body" />
    </view>
    <!-- footer -->
    <view
      v-if="$slots.footer"
      class="pi-pd-tb-24 pi-solid-top-1"
      :style="[{ padding: getPadding }]"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'
const { card } = getConfig()

export default {
  name: 'PiCard',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return card.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // `''`
      default() {
        return card.customClass
      }
    },
    // 标题
    title: {
      type: String,
      // `''`
      default() {
        return card.title
      }
    },
    // 标题自定义样式，对象形式
    titleStyle: {
      type: Object,
      // `{}`
      default() {
        return card.titleStyle
      }
    },
    // 卡片外边距
    margin: {
      type: String,
      // `24rpx 0`
      default() {
        return card.margin
      }
    },
    // 卡片内边距
    padding: {
      type: String,
      // `24rpx 0`
      default() {
        return card.padding
      }
    }
  },
  computed: {
    getPadding() {
      return this.$pi.common.addUnit(this.padding)
    },
    getMargin() {
      return this.$pi.common.addUnit(this.margin)
    }
  },
  methods: {
    handleCardClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/mixin.scss';
.card {
  position: relative;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 16rpx 0 #edeef1;
  .card-title {
    font-size: $pi-card-title-fontsize;
    color: $pi-card-title-color;
    white-space: nowrap;
  }
}
</style>
