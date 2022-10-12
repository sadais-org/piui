<template>
  <view
    class="section pi-align-center"
    :style="[itemStyle, customStyle]"
    :class="[{ border }, customClass]"
    @tap="handleSectionClick"
  >
    <view v-if="line" class="line" :style="[lineStyle]" />
    <!-- 左侧区域 -->
    <view v-if="$slots.left" class="pi-pd-right-24">
      <slot name="left" />
    </view>
    <!-- 中间区域 -->
    <view class="pi-flex-sub pi-align-baseline">
      <!-- 标题和描述 -->
      <view :style="[titleStyle]" class="list-item-title">
        <slot v-if="$slots && ($slots.default || $slots.$default)" />
        <template v-else-if="title">{{ title }}</template>
      </view>
      <view v-if="($slots && $slots.desc) || desc" :style="[descStyle]" class="list-item-desc">
        <slot name="desc">{{ desc }}</slot>
      </view>
    </view>
    <!-- 右侧区域 -->
    <view class="extra" :style="[extraStyle]">{{ extraText }}</view>
    <view v-if="$slots.right" class="pi-pd-left-24">
      <slot name="right" />
    </view>
    <pi-icon
      v-else-if="showRightIcon"
      :name="getRightIcon.name"
      :dot="getRightIcon.dot"
      :badge="getRightIcon.badge"
      :color="getRightIcon.color"
      :size="getRightIcon.size"
      :class-prefix="getRightIcon.classPrefix"
      custom-class="pi-pd-left-4"
    />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiSection'
const { section } = getConfig()

export default {
  name: 'PiSection',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return section.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // `''`
      default() {
        return section.customClass
      }
    },
    // 自定义竖线样式，对象形式
    lineStyle: {
      type: Object,
      // `{}`
      default() {
        return section.lineStyle
      }
    },
    // 标题
    title: {
      type: String,
      // `''`
      default() {
        return section.title
      }
    },
    // 标题自定义样式，对象形式
    titleStyle: {
      type: Object,
      // `{}`
      default() {
        return section.titleStyle
      }
    },
    // 描述
    desc: {
      type: String,
      // `''`
      default() {
        return section.title
      }
    },
    // 描述自定义样式，对象形式（默认值：{}）
    descStyle: {
      type: Object,
      default() {
        return section.descStyle
      }
    },
    // 右侧文字
    extraText: {
      type: String,
      // `''`
      default() {
        return section.title
      }
    },
    // 右侧文字自定义样式，对象形式
    extraStyle: {
      type: Object,
      // `{}`
      default() {
        return section.extraStyle
      }
    },
    // 是否显示边框，可用值 `true`
    border: {
      type: Boolean,
      // `false`
      default() {
        return section.border
      }
    },
    // 是否显示左侧竖线，可用值 `false`
    line: {
      type: Boolean,
      // `true`
      default() {
        return section.line
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      // `24rpx 0`
      default() {
        return section.padding
      }
    },
    // 是否显示右边icon。默认是箭头（可以自定义设置成其他图标），可用值 `true`
    showRightIcon: {
      type: Boolean,
      // `false`
      default() {
        return section.showRightIcon
      }
    },
    // 右侧icon样式
    rightIcon: {
      type: Object,
      // `name` `dot` `badge` `color` `size` `classPrefix`
      default() {
        return section.rightIcon
      }
    }
  },
  computed: {
    getRightIcon() {
      return this.$pi.lang.mergeDeep(section.rightIcon, this.rightIcon)
    },
    itemStyle() {
      const style = {
        padding: this.$pi.common.addUnit(this.padding)
      }
      return style
    }
  },
  methods: {
    handleSectionClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/mixin.scss';
.section {
  position: relative;
  width: 100%;
  line-height: 1;
  .list-item-title {
    margin-right: 12rpx;
    font-size: $pi-section-title-fontsize;
    color: $pi-section-title-color;
    white-space: nowrap;
  }
  .list-item-desc {
    font-size: $pi-section-desc-fontsize;
    color: $pi-section-desc-color;
  }
  .line {
    width: 6rpx;
    height: 32rpx;
    margin-right: 12rpx;
    overflow: hidden;
    background-color: $pi-primary-color;
    border-radius: 4rpx;
  }
  .extra {
    font-size: $pi-section-extra-fontsize;
    color: $pi-section-extra-color;
  }
  &.border {
    @include pi-border;
    &::before {
      border: 0 solid $pi-section-border-color;
      border-bottom-width: $pi-section-border-width;
    }
  }
}
</style>
