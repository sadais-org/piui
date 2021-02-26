<template>
  <view>
    <view class="pi-tabs" :style="[customStyle]" :class="[customClass]">
      <scroll-view class="pi-scroll" :scroll-left="scrollLeft" scroll-x scroll-with-animation>
        <view class="scroll-wrap" :style="[scrollWrapStyle]">
          <view
            v-for="(item, index) in items"
            :id="`tab-id-${item[keyField]}`"
            :key="item[keyField]"
            :style="[
              getItemStyle,
              itemStyle,
              activeIndex === index && activeTextColor ? { color: activeTextColor } : {},
              activeIndex === index && activeItemStyle ? activeItemStyle : {}
            ]"
            class="pi-tab pi-align-center"
            :class="[{ active: activeIndex === index }]"
            @tap.stop="handleSelectItem(item)"
          >
            <!-- slot slot-scoped只支持app,h5,微信小程序平台 -->
            <!-- <template slot="item" slot-scope="{ item }">{{ item.tag }}</template> -->
            <slot name="item" :item="item">
              {{ item[displayField] }}
            </slot>
          </view>
          <view
            class="slider-bar-guide"
            :style="[{ 'background-color': showSliderBarGuide ? '#e4e7ed' : 'unset' }]"
          >
            <view v-if="showSliderBar" class="slider-bar" :style="[getSliderBarStyle]" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiTabs'
const { tabs } = getConfig()

export default {
  name: 'Tabs',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return tabs.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // `''`
      default() {
        return tabs.customClass
      }
    },
    // 选项列表，默认
    items: {
      type: Array,
      // `[]`
      default() {
        return tabs.items
      }
    },
    // 选项id字段
    keyField: {
      type: String,
      // `id`
      default: tabs.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // `text`
      default: tabs.displayField
    },
    // 选项两边的padding，单位rpx
    itemPadding: {
      type: [String, Number],
      // `30`
      default() {
        return tabs.itemPadding
      }
    },
    // 标签是否自动撑开，可选值 `true`
    stretch: {
      type: Boolean,
      // `false`
      default() {
        return tabs.stretch
      }
    },
    // 动画执行时间（毫秒）
    duration: {
      type: [String, Number],
      // `300`
      default() {
        return tabs.duration
      }
    },
    // 激活颜色（不设置，默认主题色）
    activeColor: {
      type: String,
      // 默认主题色
      default() {
        return tabs.activeColor
      }
    },
    // 文字激活颜色（不设置，默认主题色）
    activeTextColor: {
      type: String,
      // 默认主题色
      default() {
        return tabs.activeTextColor
      }
    },
    // 是否显示底部的滑块，可选值 `false`
    showSliderBar: {
      type: Boolean,
      // `true`
      default() {
        return tabs.showSliderBar
      }
    },
    // 是否显示底部滑块导轨，可选值 `true`
    showSliderBarGuide: {
      type: Boolean,
      // `false`
      default() {
        return tabs.showSliderBarGuide
      }
    },
    // 底部的滑块的宽度，单位rpx（如果不设置，默认按照当前item文字的宽度去适配）
    sliderBarWidth: {
      type: [String, Number],
      // `''`
      default() {
        return tabs.sliderBarWidth
      }
    },
    // 底部的滑块的高度，单位rpx
    sliderBarHeight: {
      type: [String, Number],
      // `4`
      default() {
        return tabs.sliderBarHeight
      }
    },
    // 底部的滑块的圆角，单位rpx
    sliderBarRadius: {
      type: [String, Number],
      // `4`
      default() {
        return tabs.sliderBarRadius
      }
    },
    // 导航栏的高度，单位rpx
    height: {
      type: [String, Number],
      // `80`
      default() {
        return tabs.height
      }
    },
    // 选项样式
    itemStyle: {
      type: Object,
      // `{}`
      default() {
        return tabs.itemStyle
      }
    },
    // 底部滑块样式
    sliderBarStyle: {
      type: Object,
      // `{}`
      default() {
        return tabs.sliderBarStyle
      }
    },
    // 激活选项样式
    activeItemStyle: {
      type: Object,
      // `{}`
      default() {
        return tabs.activeItemStyle
      }
    }
  },
  data() {
    return {
      tabsWidth: 0, // 组件区域宽度
      tabRects: [] // 标签节点信息
    }
  },
  computed: {
    activeIndex() {
      if (!this.val) return 0
      const index = this.items.findIndex(item => item[this.keyField] === this.val[this.keyField])
      return index > 0 ? index : 0
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getSliderBarWidth() {
      const sliderBarWidth = this.$pi.common.addUnit(this.sliderBarWidth) || 'auto'
      return sliderBarWidth
    },
    getSliderBarHeight() {
      return this.$pi.common.addUnit(this.sliderBarHeight)
    },
    getSliderBarRadius() {
      return this.$pi.common.addUnit(this.sliderBarRadius)
    },
    getItemPadding() {
      return this.$pi.common.addUnit(this.itemPadding)
    },
    getItemStyle() {
      const style = {
        padding: `0 ${this.getItemPadding}`
      }
      style.height = this.getHeight
      style.lineHeight = this.getHeight
      if (this.stretch) style.flex = '1'
      return style
    },
    activeRect() {
      const rect = {
        left: 0,
        width: 0
      }
      if (!this.tabRects.length) return rect
      const activeIndex =
        this.activeIndex >= this.tabRects.length ? this.tabRects.length - 1 : this.activeIndex
      rect.left = this.tabRects.slice(0, activeIndex).reduce((previous, current) => {
        return previous + current.width
      }, 0)
      rect.width = this.tabRects[activeIndex].width
      return rect
    },
    scrollLeft() {
      // 计算当前激活item移动到容器中心距离左边距离
      const scrollLeft = this.activeRect.left - this.tabsWidth / 2 + this.activeRect.width / 2
      return scrollLeft < 0 ? 0 : scrollLeft
    },
    getSliderBarStyle() {
      const style = {
        width: this.getSliderBarWidth,
        height: this.getSliderBarHeight,
        borderRadius: this.getSliderBarRadius,
        transitionDuration: `${this.duration / 1000}s`
      }
      let sliderScrollLeft = this.activeRect.left
      if (style.width !== 'auto') {
        // 如果width设置了固定的宽度，将滑块移动到对应激活下的中心
        const sliderBarWidth = uni.upx2px(parseInt(this.sliderBarWidth))
        sliderScrollLeft = sliderScrollLeft + (this.activeRect.width - sliderBarWidth) / 2
        style.transform = `translateX(${sliderScrollLeft}px)`
      }
      if (style.width === 'auto') {
        // 如果width设定了auto，根据当前激活项文字动态计算宽度
        const itemPadding = uni.upx2px(parseInt(this.itemPadding))
        style.width = `${this.activeRect.width - itemPadding * 2}px`
        style.transform = `translateX(${sliderScrollLeft + itemPadding}px)`
      }
      if (this.activeColor) style.backgroundColor = this.activeColor
      return style
    },
    scrollWrapStyle() {
      const style = {}
      if (this.stretch) style.display = 'flex'
      return style
    }
  },
  watch: {
    items: {
      deep: true,
      immediate: false,
      handler(value) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const srollWrapRect = await this.$pi.common.queryRect(this, '.pi-tabs', false)
      if (srollWrapRect) {
        this.tabsWidth = srollWrapRect.width
      }
      this.tabRects = await this.$pi.common.queryRect(this, '.pi-tab', true)
      console.log(TAG, '计算.pi-tab布局', this.tabRects)
    },
    handleSelectItem(item) {
      this.val = item
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-tabs {
  .scroll-wrap {
    position: relative;
    display: inline-block;
    min-width: 100%;
    white-space: nowrap;
    .pi-tab {
      display: inline-block;
      font-size: 30rpx;
      text-align: center;
      transition: all $pi-animation-duration $pi-animation-timing-function;
      &.active {
        color: $pi-primary-color;
      }
    }
    .slider-bar-guide {
      position: absolute;
      right: 0;
      bottom: 6rpx;
      left: 0;
      width: 100%;
      height: 4rpx;
      .slider-bar {
        width: 80rpx;
        height: 100%;
        overflow: hidden;
        background-color: $pi-primary-color;
        transition-timing-function: $pi-animation-timing-function;
        transition-duration: $pi-animation-duration;
        transition-property: all;
      }
    }
  }
}
</style>
