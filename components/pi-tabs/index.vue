<template>
  <view>
    <view class="pi-tabs" :style="[customStyle]" :class="[customClass]">
      <scroll-view class="pi-scroll" :scroll-left="scrollLeft" scroll-x scroll-with-animation>
        <view class="scroll-wrap" :style="[scrollWrapStyle]">
          <view
            v-for="(item, index) in items"
            :id="`id-${item[keyField]}`"
            :key="item[keyField]"
            :style="[
              getItemStyle,
              itemStyle,
              activeIndex === index && activeTextColor ? { color: activeTextColor } : {},
              activeIndex === index && activeItemStyle ? activeItemStyle : {}
            ]"
            class="pi-tab pi-align-center pi-fz-30"
            :class="[{ active: activeIndex === index }]"
            @tap="handleSelectItem(item)"
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
            <view :style="[getSliderBarStyle]" :class="{ 'slider-bar': showSliderBar }" />
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
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return tabs.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return tabs.customClass
      }
    },
    // 选项列表，默认（[]）
    items: {
      type: Array,
      default() {
        return tabs.items
      }
    },
    // 选项id字段，默认为id
    keyField: {
      type: String,
      default: tabs.keyField
    },
    // 选项显示字段，默认为text
    displayField: {
      type: String,
      default: tabs.displayField
    },
    // 选项两边的padding，单位rpx
    itemPadding: {
      type: [String, Number],
      default() {
        return tabs.itemPadding
      }
    },
    // 标签是否自动撑开
    stretch: {
      type: Boolean,
      default() {
        return tabs.stretch
      }
    },
    // 动画执行时间（毫秒）
    duration: {
      type: [String, Number],
      default() {
        return tabs.duration
      }
    },
    // 激活颜色（不设置，默认主题色）
    activeColor: {
      type: String,
      default() {
        return tabs.activeColor
      }
    },
    // 文字激活颜色（不设置，默认主题色）
    activeTextColor: {
      type: String,
      default() {
        return tabs.activeTextColor
      }
    },
    // 是否显示底部的滑块
    showSliderBar: {
      type: Boolean,
      default() {
        return tabs.showSliderBar
      }
    },
    // 是否显示底部滑块导轨
    showSliderBarGuide: {
      type: Boolean,
      default() {
        return tabs.showSliderBarGuide
      }
    },
    // 底部的滑块的宽度，单位rpx（如果不设置，默认按照当前item文字的宽度去适配）
    sliderBarWidth: {
      type: [String, Number],
      default() {
        return tabs.sliderBarWidth
      }
    },
    // 底部的滑块的高度，单位rpx
    sliderBarHeight: {
      type: [String, Number],
      default() {
        return tabs.sliderBarHeight
      }
    },
    // 底部的滑块的圆角，单位rpx
    sliderBarRadius: {
      type: [String, Number],
      default() {
        return tabs.sliderBarRadius
      }
    },
    // 导航栏的高度，单位rpx
    height: {
      type: [String, Number],
      default() {
        return tabs.height
      }
    },
    // 选项样式（默认：'{}'）
    itemStyle: {
      type: Object,
      default() {
        return tabs.itemStyle
      }
    },
    // 底部滑块样式（默认：'{}'）
    sliderBarStyle: {
      type: Object,
      default() {
        return tabs.sliderBarStyle
      }
    },
    // 激活选项样式（默认：'{}'）
    activeItemStyle: {
      type: Object,
      default() {
        return tabs.activeItemStyle
      }
    }
  },
  data() {
    return {
      tabsWidth: 0, // 组件区域宽度
      tabsLeft: 0, // 组件区域离屏幕左边的距离
      tabRects: [] // 标签节点信息
    }
  },
  computed: {
    activeIndex() {
      if (!this.val) return 0
      return this.items.findIndex(item => item[this.keyField] === this.val[this.keyField]) || 0
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
    scrollLeft() {
      if (!this.tabRects.length) return
      // 计算当前激活item移动到容器中心距离左边距离
      const activeIndex =
        this.activeIndex >= this.tabRects.length ? this.tabRects.length - 1 : this.activeIndex
      const activeRect = this.tabRects[activeIndex]
      const activeRectWidth = activeRect.width
      const activeRectLeft = activeRect.left
      const scrollLeft = activeRectLeft - this.tabsLeft - this.tabsWidth / 2 + activeRectWidth / 2
      return scrollLeft < 0 ? 0 : scrollLeft
    },
    getSliderBarStyle() {
      const style = {
        width: this.getSliderBarWidth,
        height: this.getSliderBarHeight,
        borderRadius: this.getSliderBarRadius,
        transitionDuration: `${this.duration / 1000}s`
      }
      if (!this.tabRects.length) return style
      const activeIndex =
        this.activeIndex >= this.tabRects.length ? this.tabRects.length - 1 : this.activeIndex
      const activeRect = this.tabRects[activeIndex]
      const activeRectWidth = activeRect.width
      const activeRectLeft = activeRect.left
      let sliderScrollLeft = activeRectLeft - this.tabsLeft
      if (style.width !== 'auto') {
        // 如果width设置了固定的宽度，将滑块移动到对应激活下的中心
        const sliderBarWidth = uni.upx2px(parseInt(this.sliderBarWidth))
        sliderScrollLeft = sliderScrollLeft + (activeRectWidth - sliderBarWidth) / 2
        style.transform = `translateX(${sliderScrollLeft}px)`
      }
      if (style.width === 'auto') {
        // 如果width设定了auto，根据当前激活项文字动态计算宽度
        const itemPadding = uni.upx2px(parseInt(this.itemPadding))
        style.width = `${activeRectWidth - itemPadding * 2}px`
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
        this.tabsLeft = srollWrapRect.left
      }
      this.tabRects = await this.$pi.common.queryRect(this, '.pi-tab', true)
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
  // 不显示滚动条
  ::v-deep ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
  }
  .scroll-wrap {
    position: relative;
    display: inline-block;
    white-space: nowrap;
    .pi-tab {
      display: inline-block;
      text-align: center;
      transition: all $pi-animation-duration $pi-animation-timing-function;
      &.active {
        color: $pi-primary-color;
      }
    }
    .slider-bar-guide {
      position: absolute;
      right: 0;
      bottom: 12rpx;
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
