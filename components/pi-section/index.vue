<template>
  <view
    class="section pi-align-center"
    :style="[itemStyle, customStyle]"
    :class="[{ border }, customClass]"
  >
    <view v-if="line" class="line" />
    <!-- 左侧区域 -->
    <view v-if="$slots.left" class="pi-pd-right-24">
      <slot name="left" />
    </view>
    <!-- 中间区域 -->
    <view class="pi-flex-sub pi-align-baseline">
      <!-- 标题和描述 -->
      <view
        v-if="$slots.default || $slots.$default || title"
        :style="[titleStyle]"
        class="list-item-title"
      >
        <slot>{{ title }}</slot>
      </view>
      <view v-if="$slots.desc || desc" :style="[descStyle]" class="list-item-desc">
        <slot name="desc">{{ desc }}</slot>
      </view>
    </view>
    <!-- 右侧区域 -->
    <view class="extra">{{ extraText }}</view>
    <view v-if="$slots.right" class="pi-pd-left-24">
      <slot name="right" />
    </view>
    <pi-icon
      v-else-if="showRightIcon"
      :name="rightIcon.name"
      :dot="rightIcon.dot"
      :badge="rightIcon.badge"
      :color="rightIcon.color"
      :size="rightIcon.size"
      :class-prefix="rightIcon.classPrefix"
      custom-class="pi-pd-left-4"
    />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiListItem'
const { section } = getConfig()

export default {
  name: 'Section',
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return section.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return section.customClass
      }
    },
    // 标题
    title: {
      type: String,
      default() {
        return section.title
      }
    },
    // 标题自定义样式，对象形式（默认值：{}）
    titleStyle: {
      type: Object,
      default() {
        return section.titleStyle
      }
    },
    // 描述
    desc: {
      type: String,
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
      default() {
        return section.title
      }
    },
    // 右侧文字自定义样式，对象形式（默认值：{}）
    extraStyle: {
      type: Object,
      default() {
        return section.extraStyle
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default() {
        return section.border
      }
    },
    // 是否显示左侧竖线
    line: {
      type: Boolean,
      default() {
        return section.line
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      default() {
        return section.padding
      }
    },
    // 是否显示右边icon
    showRightIcon: {
      type: Boolean,
      default() {
        return section.showRightIcon
      }
    },
    // 右侧icon样式
    rightIcon: {
      type: Object,
      default() {
        return section.rightIcon
      }
    }
  },
  computed: {
    itemStyle() {
      const style = {
        padding: this.padding
      }
      return style
    }
  },
  inject: {
    piList: { default: undefined }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
@import '../../scss/border.scss';
.section {
  position: relative;
  line-height: 1;
  .list-item-title {
    margin-right: 12rpx;
    font-size: $pi-section-title-fontsize;
    color: $pi-section-title-color;
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
    &::after {
      border: 0 solid $pi-section-border-color;
      border-bottom-width: $pi-section-border-width;
    }
  }
}
</style>
