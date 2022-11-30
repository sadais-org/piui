<template>
  <view>
    <view
      class="pi-bottom-bar"
      :style="[{ borderTop: borderTop, background: background }]"
      :class="[{ fixed: fixed }]"
    >
      <!-- 默认插槽 -->
      <view
        class="pi-w-100P"
        :style="[{ padding: getPadding }, customStyle]"
        :class="[customClass]"
      >
        <slot />
      </view>
      <view v-if="safeArea" class="pi-safearea" :style="[{ backgroundColor: safeAreaBgColor }]" />
    </view>
    <!-- fixed时候的占位空间 -->
    <template v-if="fixed">
      <view class="pi-bottom-bar-placeholder" :style="[{ height: barHeight }]" />
      <!-- <view v-if="safeArea" class="pi-safearea" /> -->
    </template>
  </view>
</template>

<script>
/**
 * bottom-bar 底部栏
 */
import { getConfig } from '../../config'
const TAG = 'PiBottomBar'
const { bottomBar } = getConfig()

// 底部栏
export default {
  name: 'PiBottomBar',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return bottomBar.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      // ''
      default() {
        return bottomBar.customClass
      }
    },
    // 顶部边框样式，如需去掉，设置'none'
    borderTop: {
      type: String,
      // '1px solid #e6e6e6'
      default() {
        return bottomBar.borderTop
      }
    },
    // 是否开启安全区域
    safeArea: {
      type: Boolean,
      // false
      default() {
        return bottomBar.safeArea
      }
    },
    // 背景
    background: {
      type: String,
      // '#ffffff'
      default: bottomBar.background
    },
    // 安全区域背景颜色
    safeAreaBgColor: {
      type: String,
      // '#ffffff'
      default: bottomBar.safeAreaBgColor
    },
    // 建议传值，不传的时候，自动根据内容撑开
    height: {
      type: [String, Number],
      // ''
      default: bottomBar.height
    },
    // 是否fixed定位
    fixed: {
      type: Boolean,
      // false
      default: bottomBar.fixed
    },
    // 内边距
    padding: {
      type: [String, Number],
      // '17rpx 32rpx'
      default: bottomBar.padding
    }
  },
  data() {
    return {
      barHeight: this.$pi.common.addUnit(this.height)
    }
  },
  computed: {
    getPadding() {
      return this.$pi.common.addUnit(this.padding)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.fixed || this.height) return // fixed并且未设定height，才需要计算高度
      const barRect = await this.$pi.common.queryRect(this, '.pi-bottom-bar', false)
      this.barHeight = `${barRect.height}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-bottom-bar {
  width: 100%;
  &.fixed {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
  }
  ::v-deep .pi-button[size] {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
