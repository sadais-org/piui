<template>
  <view class="navbar-wrap" :style="navbarStyle">
    <!-- 当导航栏为fixed时候，占位用 -->
    <view v-if="fixed && placeholder" :style="{ height: navbarWrapheight }" />
    <!-- 真正渲染的navbar -->
    <view
      class="navbar-inner pi-align-center "
      :class="{ 'navbar-fixed': fixed, 'pi-solid-bottom-1': borderBottom }"
      :style="navbarInnerStyle"
    >
      <view v-if="showBack" class="pi-abso-left-center pi-align-center" @tap="handleGoBack">
        <view
          :class="`pi-icon-${backIconName}`"
          :style="{ color: backIconColor, padding: backIconPadding, fontSize: backIconSize }"
        />
        <view v-if="backText" :style="backTextStyle">{{ backText }}</view>
      </view>
      <view :style="navTitleStyle" class=" pi-flex-sub pi-text-center">
        <block v-if="title">{{ title }}</block>
        <!-- slot default -->
        <slot v-else></slot>
      </view>
      <!-- slot right -->
      <view class="pi-abso-right-center"><slot name="right"></slot></view>
    </view>
  </view>
</template>

<script>
import { systemInfo } from '../../tools/system'
import { getConfig } from '../../config'
const { navbar } = getConfig()

export default {
  name: 'PiNavbar',
  props: {
    // 标题（默认''）
    title: {
      type: String,
      default: navbar.title
    },
    // 标题样式（默认{ fontSize: '32rpx', fontWeight: 500, color: '#333333' }）
    titleStyle: {
      type: Object,
      default() {
        return navbar.titleStyle
      }
    },
    // 导航栏高度，单位px，（默认44）
    height: {
      type: [String, Number],
      default: navbar.height
    },
    // 导航栏是否固定在顶部（默认true）
    fixed: {
      type: Boolean,
      default: navbar.fixed
    },
    // 固定在顶部时，是否在标签位置生成一个等高的占位元素（默认true）
    placeholder: {
      type: Boolean,
      default: navbar.placeholder
    },
    // 是否显示导航栏的下边框（默认true）
    borderBottom: {
      type: Boolean,
      default: navbar.borderBottom
    },
    // 背景颜色（默认'#000000'）
    background: {
      type: String,
      default: navbar.background
    },
    // 是否显示后退按钮（默认true）
    showBack: {
      required: false,
      type: Boolean,
      default: navbar.showBack
    },
    // 是否显示主页按钮（默认false）
    showHome: {
      required: false,
      type: [String, Boolean],
      default: navbar.showHome
    },
    // 返回箭头的颜色（默认'#333333'）
    backIconColor: {
      type: String,
      default: navbar.backIconColor
    },
    // 左边返回的图标，默认（back）
    backIconName: {
      type: String,
      default: navbar.backIconName
    },
    // 左边返回图标的大小（默认'32rpx'）
    backIconSize: {
      type: String,
      default: navbar.backIconSize
    },
    // 左边返回图标的padding（默认'24rpx 12rpx 24rpx 24rpx'）
    backIconPadding: {
      type: String,
      default: navbar.backIconPadding
    },
    // 返回的文字提示（默认'返回'）
    backText: {
      type: String,
      default: navbar.backText
    },
    // 返回的文字的 样式（默认{ color: '#333333' }）
    backTextStyle: {
      type: Object,
      default() {
        return navbar.backTextStyle
      }
    },
    // 元素 z-index（默认999）
    zIndex: {
      type: [String, Number],
      default: navbar.zIndex
    },
    // 自定义返回函数
    customBackFunc: {
      type: Function
    }
  },
  data() {
    return {}
  },
  computed: {
    // 导航包裹高度
    navbarWrapheight() {
      const statusBarHeight =
        systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0
      return `${this.height + statusBarHeight}px`
    },
    // 导航包裹盒子样式
    navbarStyle() {
      return {
        height: this.navbarWrapheight,
        background: this.background,
        zIndex: this.zIndex
      }
    },
    // 导航内部盒子样式
    navbarInnerStyle() {
      return {
        height: this.navbarWrapheight
      }
    },
    navTitleStyle() {
      return this.titleStyle
    }
  },
  methods: {
    handleGoBack() {
      // 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
      if (this.customBackFunc && typeof this.customBackFunc === 'function') {
        this.customBackFunc()
      } else {
        uni.navigateBack()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-wrap {
  .navbar-inner {
    position: relative;
    &.navbar-fixed {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
    }
  }
}
</style>
