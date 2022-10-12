<template>
  <view
    class="pi-list-item pi-align-center"
    :hover-class="disabled ? '' : getHoverClass"
    :style="[
      customStyle,
      itemStyle,
      {
        backgroundColor: disabled ? '#e5e5e5' : 'none',
        opacity: disabled ? 0.5 : 1
      }
    ]"
    :class="[{ border: getBorder }, customClass]"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    @tap="handleItemClick"
  >
    <!-- 左侧区域 -->
    <view v-if="$slots.left" class="pi-pd-right-24">
      <!-- 左侧区域插槽 -->
      <slot name="left" />
    </view>

    <!-- 标题和描述 -->
    <view v-if="title || desc" class="title-wrap">
      <view v-if="title" :style="[titleStyle]" class="list-item-title">{{ title }}</view>
      <view v-if="desc" :style="[descStyle]" class="list-item-desc">{{ desc }}</view>
    </view>
    <!-- 中间区域 -->
    <view class="pi-flex-sub pi-w-100P pi-of-hidden">
      <!-- 中间区域插槽 -->
      <slot />
    </view>
    <!-- 右侧区域 -->
    <view class="extra" :style="[extraStyle]">{{ extraText }}</view>
    <view v-if="$slots.right" class="pi-pd-left-24">
      <!-- 右侧区域插槽 -->
      <slot name="right" />
    </view>
    <!-- 右侧箭头 -->
    <pi-icon
      v-else-if="getShowRightIcon"
      :custom-style="getRightIcon.customStyle"
      :custom-class="`pi-pd-left-4 ${getRightIcon.customClass}`"
      :name="getRightIcon.name"
      :dot="getRightIcon.dot"
      :dot-radius="getRightIcon.dotRadius"
      :badge="getRightIcon.badge"
      :color="getRightIcon.color"
      :size="getRightIcon.size"
      :class-prefix="getRightIcon.classPrefix"
    />
  </view>
</template>

<script>
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiListItem'
const { listItem } = getConfig()
const extendPiList = childInit('PiList')

export default {
  name: 'PiListItem',
  mixins: [extendPiList], // 注入value与val，进行双向绑定
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      // {}
      default() {
        // {}
        return listItem.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        // ''
        return listItem.customClass
      }
    },
    // 列表高度
    height: {
      type: [String, Number],
      // 110
      default() {
        // 110
        return listItem.height
      }
    },
    // 标题
    title: {
      type: String,
      // ''
      default() {
        // ''
        return listItem.title
      }
    },
    // 标题自定义样式
    titleStyle: {
      type: Object,
      // {}
      default() {
        // {}
        return listItem.titleStyle
      }
    },
    // 描述
    desc: {
      type: String,
      // ''
      default() {
        // ''
        return listItem.title
      }
    },
    // 描述自定义样式
    descStyle: {
      type: Object,
      // {}
      default() {
        // {}
        return listItem.descStyle
      }
    },
    // 右侧文字
    extraText: {
      type: String,
      // ''
      default() {
        // ''
        return listItem.title
      }
    },
    // 右侧文字自定义样式
    extraStyle: {
      type: Object,
      // {}
      default() {
        // {}
        return listItem.extraStyle
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      // false
      default() {
        // false
        return listItem.disabled
      }
    },
    // 是否显示边框
    border: {
      type: Boolean,
      // true
      default() {
        // rue
        return listItem.border
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      // '24rpx 32rpx'
      default() {
        // '24rpx 32rpx'
        return listItem.padding
      }
    },
    // 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果
    hoverClass: {
      type: String,
      // 'pi-hover-class'
      default() {
        // 'pi-hover-class'
        return listItem.hoverClass
      }
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: [String, Number],
      // 10
      default() {
        // 10
        return listItem.hoverStartTime
      }
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: [String, Number],
      // 100
      default() {
        // 100
        return listItem.hoverStayTime
      }
    },
    // 是否显示右边icon
    showRightIcon: {
      type: Boolean,
      // true
      default() {
        // true
        return listItem.showRightIcon
      }
    },
    // 右侧icon配置
    rightIcon: {
      type: Object,
      default() {
        return listItem.rightIcon
      }
    }
  },
  computed: {
    getRightIcon() {
      return this.$pi.lang.mergeDeep(listItem.rightIcon, this.rightIcon)
    },
    getBorder() {
      return !this.isEmptyInheritProps && this.inheritProps.border !== null
        ? this.inheritProps.border
        : this.border
    },
    getHeight() {
      const height =
        !this.isEmptyInheritProps && this.inheritProps.height !== null
          ? this.inheritProps.height
          : this.height
      return this.$pi.common.addUnit(height)
    },
    getShowRightIcon() {
      return !this.isEmptyInheritProps && this.inheritProps.showRightIcon !== null
        ? this.inheritProps.showRightIcon
        : this.showRightIcon
    },
    getHoverClass() {
      return !this.isEmptyInheritProps && this.inheritProps.hoverClass !== null
        ? this.inheritProps.hoverClass
        : this.hoverClass
    },
    itemStyle() {
      const style = {
        padding: this.padding,
        height: this.getHeight
      }
      return style
    }
  },
  created() {},
  methods: {
    handleItemClick(e) {
      if (this.disabled) {
        return
      }
      // 点击列表项时触发
      this.$emit('click', e)
    },
    handleItemMouseenter(e) {
      // 鼠标进入列表项时触发
      this.$emit('mouseenter', e)
    },
    handleItemMouseleave(e) {
      // 鼠标离开列表项时触发
      this.$emit('mouseleave', e)
    },
    handleItemClickRight(e) {
      if (this.disabled) {
        return
      }
      // 点击右侧列表项时触发
      this.$emit('click-right', e)
    },
    handleItemClickLeft(e) {
      if (this.disabled) {
        return
      }
      // 点击左侧列表项时触发
      this.$emit('click-left', e)
    },
    handleItemMouseDown(e) {
      // 鼠标按下列表项时触发
      this.$emit('mousedown', e)
    },
    handleItemMouseUp(e) {
      // 鼠标松开列表项时触发
      this.$emit('mouseup', e)
    },
    handleItemMouseMove(e) {
      // 鼠标移动列表项时触发
      this.$emit('mousemove', e)
    },
    handleItemMouseOver(e) {
      // 鼠标进
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/mixin.scss';

.pi-list-item {
  height: $pi-form-item-height;
  line-height: 1;
  .title-wrap {
    max-width: 100%;
    overflow: hidden;
  }
  .list-item-title {
    font-size: $pi-list-title-fontsize;
    color: $pi-list-title-color;
  }
  .list-item-desc {
    padding-top: 24rpx;
    font-size: $pi-list-desc-fontsize;
    color: $pi-list-desc-color;
  }
  .extra {
    font-size: $pi-list-extra-fontsize;
    color: $pi-list-extra-color;
  }
  &.border {
    @include pi-border;
    &::before {
      border: 0 solid $pi-list-border-color;
      border-bottom-width: $pi-list-border-width;
    }
  }
}
</style>
