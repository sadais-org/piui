<template>
  <view class="navbar-wrap" :style="[{ zIndex }, customStyle]" :class="[customClass]">
    <!-- 当导航栏为fixed时候，占位用 -->
    <view
      v-if="fixed && placeholder"
      class="navbar-placeholder"
      :style="[{ height: `calc(${height} + ${statusBarHeight})` }]"
    />
    <view
      :class="{ 'navbar-fixed': fixed, 'pi-solid-bottom-1': borderBottom }"
      :style="[{ zIndex }]"
    >
      <!-- 内部状态栏占位用 -->
      <pi-status-bar v-if="placeholder" :background="statusBarBackground" />
      <!-- 真正渲染的navbar -->
      <view class="pi-navbar pi-rela pi-w-100P pi-align-center" :style="[{ background, height }]">
        <!-- 左侧 -->
        <view
          class="pi-align-center nav-icon"
          :class="[
            capsuleTheme,
            {
              'capsule pi-round': capsuleButton && isShowBack && showHome
            }
          ]"
        >
          <!-- 定制导航栏左侧内容 -->
          <slot name="left" />
          <view v-if="isShowBack" class="pi-align-center back-wrap" @tap.stop="handleGoBack">
            <view :class="'pi-icon-' + backIconName" :style="[backIconStyle]" />
            <view v-if="backText" :style="[backTextStyle]">{{ backText }}</view>
          </view>
          <view v-if="showHome" class="pi-align-center home-wrap" @tap.stop="handleGoHome">
            <view
              :class="'pi-icon-' + homeIconName"
              :style="[
                {
                  color: homeIconColor,
                  padding: homeIconPadding,
                  fontSize: homeIconSize
                }
              ]"
            />
          </view>
        </view>
        <!-- 标题剩余空间 -->
        <view :style="[navTitleStyle]" class="pi-flex-sub">
          <!-- 定制导航栏标题 -->
          <slot v-if="$slots.title" name="title" />
        </view>
        <!-- 贯穿标题 -->
        <view :style="[navTitleStyle, throughTitleStyle]" class="through-space">
          <!-- slot default -->
          <slot v-if="$slots.default || $slots.$default" />
          <template v-else-if="title">{{ title }}</template>
        </view>
        <!-- 右侧 -->
        <view v-if="$slots.right" class="nav-icon">
          <!-- 定制导航栏右侧区域 -->
          <slot name="right" />
        </view>
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
import { systemInfo } from '@sadais/piui-tool/tools/system'
import navi from '@sadais/piui-tool/tools/navi'
import { getConfig } from '../../config'

const TAG = 'PiNavbar'
const { navbar } = getConfig()

export default {
  name: 'PiNavbar',
  props: {
    // 自定义样式 添加到组件的根节点上
    customStyle: {
      type: Object,
      // {}
      default() {
        return navbar.customStyle
      }
    },
    // 自定义样式类 添加到组件的根节点上
    customClass: {
      type: String,
      // ''
      default() {
        return navbar.customClass
      }
    },
    // 标题
    title: {
      type: String,
      // ''
      default: navbar.title
    },
    // 标题样式
    titleStyle: {
      type: Object,
      // { fontSize: '36rpx', fontWeight: 500, color: '#333333' }
      default() {
        return navbar.titleStyle
      }
    },
    // 导航栏高度
    height: {
      type: String,
      // '44px'
      default: navbar.height
    },
    // 贯穿布局title宽度，auto：自动撑开
    throughTitleWidth: {
      type: String,
      // 'auto'
      default: navbar.throughTitleWidth
    },
    // 导航栏是否固定在顶部
    fixed: {
      type: Boolean,
      // true
      default: navbar.fixed
    },
    // 固定在顶部时，是否生成一个与导航栏高度登高的占位容器
    placeholder: {
      type: Boolean,
      // true
      default: navbar.placeholder
    },
    // 是否显示导航栏的下边框
    borderBottom: {
      type: Boolean,
      // true
      default: navbar.borderBottom
    },
    // 状态栏的背景色
    statusBarBackground: {
      type: String,
      // 'transparent'
      default: navbar.statusBarBackground
    },
    // 背景颜色
    background: {
      type: String,
      // '#ffffff'
      default: navbar.background
    },
    // 是否显示后退按钮，默认不设置，根据当前页面堆栈自动判断
    showBack: {
      required: false,
      type: [String, Boolean],
      // ''
      default: navbar.showBack
    },
    // 是否显示主页按钮
    showHome: {
      required: false,
      type: Boolean,
      // false
      default: navbar.showHome
    },
    // 在微信小程序中，当showBack和showHome同时显示的时候，以胶囊按钮样式显示
    capsuleButton: {
      required: false,
      type: Boolean,
      // true
      default: navbar.capsuleButton
    },
    // 胶囊按钮主题
    capsuleTheme: {
      // `'light'` `'dark'`
      type: String,
      // `'light'`
      default: navbar.capsuleTheme,
      validator: function(value) {
        return ['light', 'dark'].includes(value)
      }
    },
    // 返回箭头的颜色
    backIconColor: {
      type: String,
      // '#333333'
      default: navbar.backIconColor
    },
    // 左边返回的图标，自动拼接前缀pi-icon-
    backIconName: {
      type: String,
      // 'back'
      default: navbar.backIconName
    },
    // 左边返回图标的大小
    backIconSize: {
      type: String,
      // '36rpx'
      default: navbar.backIconSize
    },
    // 左边返回图标的padding
    backIconPadding: {
      type: String,
      // '10rpx 24rpx'
      default: navbar.backIconPadding
    },
    // 返回的文字提示
    backText: {
      type: String,
      // ''
      default: navbar.backText
    },
    // 返回的文字的样式
    backTextStyle: {
      type: Object,
      // { color: '#333333' }
      default() {
        return navbar.backTextStyle
      }
    },
    // 是否自定义返回函数
    customBackFunc: {
      type: Boolean,
      default: navbar.customBackFunc
    },
    // 主页icon的颜色
    homeIconColor: {
      type: String,
      // '#333333'
      default: navbar.homeIconColor
    },
    // 主页icon的图标 自动拼接前缀pi-icon-
    homeIconName: {
      type: String,
      // 'homefill'
      default: navbar.homeIconName
    },
    // 主页icon图标的大小
    homeIconSize: {
      type: String,
      // '36rpx'
      default: navbar.homeIconSize
    },
    // 主页icon图标的padding
    homeIconPadding: {
      type: String,
      // '10rpx 24rpx'
      default: navbar.homeIconPadding
    },
    // 主页路径
    homePage: {
      type: String,
      // ''
      default: navbar.homePage
    },
    // 跳转主页方法
    homePageMethod: {
      // 'navigateTo'、'redirectTo'、'switchTab'、'reLaunch'
      type: String,
      // 'switchTab'
      default: navbar.homePageMethod
    },
    // 是否自定义返回函数
    customHomeFunc: {
      type: Boolean,
      default: navbar.customHomeFunc
    },
    // 元素 z-index
    zIndex: {
      type: [String, Number],
      // 99
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
      return this.$pi.lang.mergeDeep(navbar.titleStyle, this.titleStyle)
    },
    getThroughTitleWidth() {
      return this.$pi.common.addUnit(this.throughTitleWidth)
    },
    throughTitleStyle() {
      const style = {}
      if (this.getThroughTitleWidth !== 'auto') {
        style.width = this.getThroughTitleWidth
      }
      return style
    },
    backIconStyle() {
      const style = {
        color: this.backIconColor,
        padding: this.backIconPadding,
        fontSize: this.backIconSize
      }
      if (this.backText) {
        style.paddingRight = '10rpx'
      }
      return style
    }
  },
  created() {
    this.syncPageRoute()
  },
  methods: {
    syncPageRoute() {
      if (this.showBack === null) {
        /* eslint-disable */
        const pages = getCurrentPages()
        // 如果堆栈大于1表示打开了子页面，需要显示返回按钮
        this.isShowBack = pages.length > 1
        // #ifdef H5
        if(!this.isShowBack) {
          // H5端，如果isShowBack为false，继续尝试获取父节点的属性判断是否子页面
          const page = this.$pi.parent(this, 'Page')
          if(!page) return
          this.isShowBack = !page.isQuit && !page.$route.meta.isQuit
        }
        // #endif
      } else {
        this.isShowBack = this.showBack
      }
    },
    handleGoBack(){
      if(!this.customBackFunc) {
        if (getCurrentPages().length === 1) {
          uni.reLaunch({
            url: '/'
          })
        } else {
          uni.navigateBack({
            from: 'backbutton'
          })
        }
      }
      this.$emit('navigateToBack')
    },
    handleGoHome() {
      !this.customHomeFunc && navi[this.homePageMethod](this.homePage)
      this.$emit('navigateToHome')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-wrap {
  position: relative;
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
    left: 50%;
    z-index: 0;
    overflow: hidden;
    line-height: initial;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: translate(-50%, -50%);
  }
}
</style>
