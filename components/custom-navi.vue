<template>
  <view class="navi-wrap" :style="{ height: naviWrapheight }">
    <view
      class="navi-placeholder"
      :style="{
        'height': naviWrapheight,
        'background': placeholderBackground || background,
        'box-shadow': boxShadow
      }"
    />
    <view
      class="navi"
      :class="{ light: theme === 'light', dark: theme === 'dark' }"
      :style="{ 'height': naviWrapheight, 'background': background, 'box-shadow': boxShadow }"
    >
      <status-bar :background="background" />
      <view class="navi-row" :style="{ height: `${DEFAULT_NAVI_HEIGHT}px` }">
        <view class="navi-icons" :class="{ 'pi-solid-1': showBorder && hasMultiIcons }">
          <view v-if="showBack && isShowNaviBack" class="navi-icon navi-back" @tap="naviBackHandle">
            <view class="pi-icon-back" />
          </view>
          <view v-if="showHome && isShowNaviHome" class="navi-icon navi-home" @tap="naviHomeHandle">
            <view class="pi-icon-home" />
          </view>
        </view>
        <view class="slot-left">
          <slot name="left"></slot>
        </view>
        <view class="slot">
          <slot></slot>
        </view>
        <view class="slot-right">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getSystemInfo } from '../utils/system.js'
import StatusBar from './status-bar'
import { DEFAULT_NAVI_HEIGHT } from '../config'
const TIMEOUT = 20

/* 自定义导航栏涉及到系统的渲染方式，这里使用px比较合适 */
export default {
  name: 'PiCustomNavi',
  components: { StatusBar },
  props: {
    // 是否显示后退按钮
    showBack: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否显示主页按钮
    showHome: {
      required: false,
      type: [String, Boolean],
      default: true
    },
    showBorder: {
      required: false,
      type: Boolean,
      default: false
    },
    // 背景颜色
    background: {
      required: false,
      type: String
    },
    placeholderBackground: {
      required: false,
      type: String
    },
    // 导航阴影
    boxShadow: {
      required: false,
      type: String,
      default: 'none'
    },
    // 主题，light or dark
    theme: {
      required: false,
      type: String,
      default: 'light'
    },
    // 回退页数,默认为1
    backDelta: {
      required: false,
      type: Number,
      default: 1
    }
  },
  data() {
    const systemInfo = getSystemInfo()
    return {
      DEFAULT_NAVI_HEIGHT,
      statusBarHeight: systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0,
      isShowNaviBack: false,
      isShowNaviHome: false
    }
  },
  computed: {
    hasMultiIcons() {
      return this.showBack && this.isShowNaviBack && this.showHome && this.isShowNaviHome
    },
    naviWrapheight() {
      return `${this.DEFAULT_NAVI_HEIGHT + this.statusBarHeight}px`
    }
  },
  onReady() {
    this.syncPageRoute()
  },
  mounted() {
    this.syncPageRoute()
  },
  methods: {
    syncPageRoute() {
      /* eslint-disable */
      const pages = getCurrentPages()
      // console.log('当前打开页面堆栈为：', pages)
      // 如果堆栈大于1表示打开了子页面，需要显示返回按钮
      this.isShowNaviBack = pages.length > 1
      // 如果当前不是主页那么显示主页按钮
      this.isShowNaviHome = pages[pages.length - 1].route !== this.$consts.INDEX_PATH
    },
    naviBackHandle() {
      setTimeout(() => {
        uni.navigateBack({ delta: this.backDelta })
      }, TIMEOUT)
    },
    naviHomeHandle() {
      setTimeout(() => {
        if (this.$consts && this.$consts.INDEX_PATH) {
          const indexPath = this.$consts.INDEX_PATH.startsWith('/')
            ? this.$consts.INDEX_PATH
            : `/${this.$consts.INDEX_PATH}`
          uni.switchTab({
            url: indexPath
          })
        } else {
          this.$emit('home')
        }
      }, TIMEOUT)
    },
    naviDebuggerHandle() {
      this.showNaviDebugger = true
    },
    closeDebuggerHandle() {
      this.showNaviDebugger = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navi-wrap {
  .navi-placeholder {
    background: $pi-navi-background;
  }
  .navi {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $pi-navi-z-index;
    width: 100%;
    background: $pi-navi-background;
    .status-bar {
      color: #000000;
    }
    .navi-row {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 0 $pi-navi-padding-lr;
      text-align: center;
      .navi-icons {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: $pi-navi-icon-border-height;
        line-height: $pi-navi-icon-border-height;
        text-align: center;
        border-radius: 5000000px;
        &::after {
          border-color: #ececec;
        }
        .navi-icon {
          position: relative;
          z-index: $pi-navi-z-index;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding-right: 24rpx;
          color: $pi-navi-icon-color;
          /* stylelint-disable */
          & > view {
            font-size: $pi-navi-icon-size;
            font-weight: $pi-navi-icon-weight;
            color: $pi-navi-icon-color;
            &::before {
              color: $pi-navi-icon-color;
            }
          }

          /*  #ifdef MP-WEIXIN  */
          & > view {
            font-size: $pi-navi-icon-size-MP-WEIXIN;
            font-weight: $pi-navi-icon-weight-MP-WEIXIN;
            color: $pi-navi-icon-color-MP-WEIXIN;
            &::before {
              color: $pi-navi-icon-color-MP-WEIXIN;
            }
          }

          /*  #endif  */
        }
        &.pi-solid-1 {
          margin-right: 24rpx;
          .navi-icon {
            padding-left: 24rpx;
            &:not(:last-child) {
              @include pi-border;
              &::after {
                top: 50%;
                height: 120%;
                border-right: 1px solid #ececec;
                transform: scale(0.5) translateY(-50%);
              }
            }
          }
        }
      }
      .slot {
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        width: 100%;
        font-size: $pi-navi-title-size;
        font-weight: 500;
        color: $pi-navi-icon-color;
        transform: translateY(-50%);
      }
      .slot-left {
        z-index: $pi-navi-z-index;
        font-size: $pi-navi-title-size;
        font-weight: 500;
      }
      .slot-right {
        position: absolute;
        top: 50%;
        right: 24rpx;
        z-index: $pi-navi-z-index;
        font-size: $pi-navi-title-size;
        font-weight: 500;
        transform: translateY(-50%);
      }
    }
    // 如果是暗色主题，那么把文字和图标颜色设置成白色
    &.dark {
      .slot,
      .navi-icons .navi-icon > view {
        color: #ffffff;
        &::before {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
