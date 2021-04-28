<template>
  <view
    class="card"
    :style="[{ margin: getMargin }, customStyle]"
    :class="[customClass]"
    @tap.stop="handleCardClick"
  >
    <!-- title -->
    <view class="card-title pi-align-center" :style="[{ padding: getPadding }, titleStyle]">
      <slot v-if="$slots && $slots.title" name="title" />
      <template v-else-if="title">{{ title }}</template>
    </view>
    <!-- body -->
    <view v-if="$slots.body" class="pi-pd-tb-24 pi-solid-top-1" :style="[{ padding: getPadding }]">
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
    // 自定义竖线样式，对象形式
    lineStyle: {
      type: Object,
      // `{}`
      default() {
        return card.lineStyle
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
    // 描述
    desc: {
      type: String,
      // `''`
      default() {
        return card.title
      }
    },
    // 描述自定义样式，对象形式（默认值：{}）
    descStyle: {
      type: Object,
      default() {
        return card.descStyle
      }
    },
    // 右侧文字
    extraText: {
      type: String,
      // `''`
      default() {
        return card.title
      }
    },
    // 右侧文字自定义样式，对象形式
    extraStyle: {
      type: Object,
      // `{}`
      default() {
        return card.extraStyle
      }
    },
    // 是否显示左侧竖线，可用值 `false`
    line: {
      type: Boolean,
      // `true`
      default() {
        return card.line
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
    },
    // 是否显示右边icon。默认是箭头（可以自定义设置成其他图标），可用值 `true`
    showRightIcon: {
      type: Boolean,
      // `false`
      default() {
        return card.showRightIcon
      }
    },
    // 右侧icon样式
    rightIcon: {
      type: Object,
      // `name` `dot` `badge` `color` `size` `classPrefix`
      default() {
        return card.rightIcon
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
  .line {
    width: 6rpx;
    height: 32rpx;
    margin-right: 12rpx;
    overflow: hidden;
    background-color: $pi-primary-color;
    border-radius: 4rpx;
  }
}
</style>
