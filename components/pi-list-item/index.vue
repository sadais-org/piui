<template>
  <view
    class="pi-list-item pi-align-center"
    :hover-class="hoverClass"
    :style="[customStyle, itemStyle]"
    :class="[{ border: getBorder }, customClass]"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    @tap="handleItemClick"
  >
    <!-- 左侧区域 -->
    <view v-if="$slots.left" class="pi-pd-right-24">
      <slot name="left" />
    </view>

    <!-- 标题和描述 -->
    <view v-if="title || desc">
      <view v-if="title" :style="[titleStyle]" class="list-item-title">{{ title }}</view>
      <view v-if="desc" :style="[descStyle]" class="list-item-desc">{{ desc }}</view>
    </view>
    <!-- 中间区域 -->
    <view class="pi-flex-sub"><slot /></view>
    <!-- 右侧区域 -->
    <view class="extra" :style="[extraStyle]">{{ extraText }}</view>
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
const { listItem } = getConfig()

export default {
  name: 'ListItem',
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return listItem.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return listItem.customClass
      }
    },
    // 列表高度
    height: {
      type: [String, Number],
      default() {
        return listItem.height
      }
    },
    // 标题
    title: {
      type: String,
      default() {
        return listItem.title
      }
    },
    // 标题自定义样式，对象形式（默认值：{}）
    titleStyle: {
      type: Object,
      default() {
        return listItem.titleStyle
      }
    },
    // 描述
    desc: {
      type: String,
      default() {
        return listItem.title
      }
    },
    // 描述自定义样式，对象形式（默认值：{}）
    descStyle: {
      type: Object,
      default() {
        return listItem.descStyle
      }
    },
    // 右侧文字
    extraText: {
      type: String,
      default() {
        return listItem.title
      }
    },
    // 右侧文字自定义样式，对象形式（默认值：{}）
    extraStyle: {
      type: Object,
      default() {
        return listItem.extraStyle
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default() {
        return listItem.disabled
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default() {
        return listItem.border
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      default() {
        return listItem.padding
      }
    },
    // 是否显示右边icon
    showRightIcon: {
      type: Boolean,
      default() {
        return listItem.showRightIcon
      }
    },
    // 右侧icon样式
    rightIcon: {
      type: Object,
      default() {
        return listItem.rightIcon
      }
    },
    // 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果
    hoverClass: {
      type: String,
      default() {
        return listItem.hoverClass
      }
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      default() {
        return listItem.hoverStartTime
      }
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      default() {
        return listItem.hoverStayTime
      }
    }
  },
  computed: {
    getBorder() {
      return this.piList ? this.piList.border : this.border
    },
    getHeight() {
      return this.$pi.common.addUnit(
        this.piList && this.piList.height ? this.piList.height : this.height
      )
    },
    itemStyle() {
      const style = {
        padding: this.padding,
        height: this.getHeight
      }
      return style
    }
  },
  inject: {
    piList: { default: undefined }
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

.pi-list-item {
  height: $pi-form-item-height;
  line-height: 1;
  .list-item-title {
    font-size: $pi-list-title-fontsize;
    color: $pi-list-title-color;
  }
  .list-item-desc {
    padding-top: 12rpx;
    font-size: $pi-list-desc-fontsize;
    color: $pi-list-desc-color;
  }
  .extra {
    font-size: $pi-list-extra-fontsize;
    color: $pi-list-extra-color;
  }
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-list-border-color;
      border-bottom-width: $pi-list-border-width;
    }
  }
}
</style>
