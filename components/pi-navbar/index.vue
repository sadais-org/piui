<template>
  <view class="navbar-wrap" :style="[{ zIndex }, customStyle]" :class="[customClass]">
    <pi-status-bar v-if="fixed" :background="statusBarBackground" />
    <!-- 当导航栏为fixed时候，占位用 -->
    <view v-if="fixed && placeholder" :style="[{ height: height }]" />
    <view :class="{ 'navbar-fixed': fixed, 'pi-solid-bottom-1': borderBottom }">
      <!-- 内部状态栏占位用 -->
      <view v-if="fixed" class="pi-w-100P" :style="[{ height: statusBarHeight }]" />
      <!-- 真正渲染的navbar -->
      <view class="pi-rela pi-w-100P pi-align-center" :style="[{ background, height }]">
        <!-- 左侧 -->
        <view
          class="pi-align-center nav-icon"
          :class="[
            capsuleTheme,
            {
              'capsule pi-round': capsuleButton && !$slots.left && isShowBack && showHome
            }
          ]"
        >
          <slot v-if="$slots.left" name="left" />
          <template v-else>
            <view v-if="isShowBack" class="pi-align-center back-wrap" @tap="handleGoBack">
              <view
                :class="'pi-icon-' + backIconName"
                :style="[
                  { color: backIconColor, padding: backIconPadding, fontSize: backIconSize }
                ]"
              />
              <view v-if="backText" :style="[backTextStyle]">{{ backText }}</view>
            </view>
            <view v-if="showHome" class="pi-align-center home-wrap" @tap="handleGoHome">
              <view
                :class="'pi-icon-' + homeIconName"
                :style="[
                  { color: homeIconColor, padding: homeIconPadding, fontSize: homeIconSize }
                ]"
              />
            </view>
          </template>
        </view>
        <!-- 标题剩余空间 -->
        <view :style="[navTitleStyle]" class="pi-flex-sub ">
          <slot v-if="$slots.title" name="title" />
        </view>
        <!-- 贯穿标题 -->
        <view :style="[navTitleStyle]" class="through-space">
          <!-- slot default -->
          <slot v-if="$slots.default || $slots.$default" />
          <template v-else-if="title">{{ title }}</template>
        </view>
        <!-- 右侧 -->
        <view class="nav-icon"><slot name="right" /></view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 返回按钮内部已经做了处理，如果当前打开页面不属于二级页面，则不显示，需要显示左侧内容，请使用 slot left
 * slot left 和 backIcon homeIcon 冲突，两者只能取其一，默认以slot left为主
 * slot right
 * slot title 是除开icon的剩余空间
 * slot 整个标题栏的插槽
 */
import { systemInfo } from '../../tools/system'
import * as navi from '../../tools/navi'
import { getConfig } from '../../config'

const TAG = 'PiNavbar'
const { navbar } = getConfig()

export default {
  name: TAG,
  props: {
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return navbar.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return navbar.customClass
      }
    },
    // 标题（默认''）
    title: {
      type: String,
      default: navbar.title
    },
    // 标题样式（默认{ fontSize: '36rpx', fontWeight: 500, color: '#333333' }）
    titleStyle: {
      type: Object,
      default() {
        return navbar.titleStyle
      }
    },
    // 导航栏高度，（默认44px）
    height: {
      type: String,
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
    // 状态栏的背景色
    statusBarBackground: {
      type: String,
      default: navbar.statusBarBackground
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
      type: Boolean,
      default: navbar.showHome
    },
    // 在微信小程序中，当showBack和showHome同时显示的时候，以胶囊按钮样式显示
    capsuleButton: {
      required: false,
      type: Boolean,
      default: navbar.capsuleButton
    },
    // 胶囊按钮主题， light or dark
    capsuleTheme: {
      type: String,
      default: navbar.capsuleTheme,
      validator: function(value) {
        return ['light', 'dark'].includes(value)
      }
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
    // 返回的文字提示（默认''）
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
    // 自定义返回函数
    customBackFunc: {
      type: Function
    },
    // 主页icon的颜色（默认'#333333'）
    homeIconColor: {
      type: String,
      default: navbar.homeIconColor
    },
    // 主页icon的图标，默认（back）
    homeIconName: {
      type: String,
      default: navbar.homeIconName
    },
    // 主页icon图标的大小（默认'32rpx'）
    homeIconSize: {
      type: String,
      default: navbar.homeIconSize
    },
    // 主页icon图标的padding
    homeIconPadding: {
      type: String,
      default: navbar.homeIconPadding
    },
    // 主页路径，默认（‘’）
    homePage: {
      type: String,
      default: navbar.homePage
    },
    // 跳转主页方法，默认（‘switchTab’）navigateTo redirectTo switchTab reLaunch
    homePageMethod: {
      type: String,
      default: navbar.homePageMethod
    },
    // 自定义返回函数
    customHomeFunc: {
      type: Function
    },
    // 元素 z-index（默认999）
    zIndex: {
      type: [String, Number],
      default: navbar.zIndex
    }
  },
  data() {
    return {
      isShowBack: false
    }
  },
  computed: {
    // 状态栏高度
    statusBarHeight() {
      const statusBarHeight =
        systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0
      return `${statusBarHeight}px`
    },
    navTitleStyle() {
      return this.titleStyle
    }
  },
  created() {
    this.syncPageRoute()
  },
  methods: {
    syncPageRoute() {
      if (this.showBack === undefined) {
        /* eslint-disable */
      const pages = getCurrentPages()
      // 如果堆栈大于1表示打开了子页面，需要显示返回按钮
      this.isShowBack = pages.length > 1
      } else {
        this.isShowBack = this.showBack
      }
    },
    handleGoBack() {
      // 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
      if (this.customBackFunc && typeof this.customBackFunc === 'function') {
        this.customBackFunc()
      } else {
        uni.navigateBack()
      }
    },
    handleGoHome() {
      // 如果自定义了点击主页按钮的函数，则执行，否则执行返回逻辑
      if (this.customHomeFunc && typeof this.customHomeFunc === 'function') {
        this.customHomeFunc()
      } else if (this.homePage) {
        navi[this.homePageMethod](this.homePage)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-wrap {
  .navbar-fixed {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
  .nav-icon {
    position: relative;
    z-index: 1;

    // 小程序才开启胶囊效果

    /* #ifdef MP */
    &.capsule {
      position: relative;
      margin-left: 20rpx;
      border: 1px solid rgba(0, 0, 0, 0.1);
      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1px;
        height: 60%;
        content: '';
        transform: scaleX(0.5) translate(-50%, -50%);
      }
      &.dark {
        &::before {
          background: #999999;
        }

        background: rgba(0, 0, 0, 0.35);
      }
      &.light {
        &::before {
          background: #e5e5e5;
        }

        background: rgba(252, 252, 252, 0.3);
      }
    }

    /* #endif */
  }
  .through-space {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    transform: translateY(-50%);
  }
}
</style>
