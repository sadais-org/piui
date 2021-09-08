<template>
  <view class="pi-rate pi-align-center" @touchmove.stop.prevent="handleTouchMove">
    <view v-for="(item, index) in count" :key="index" class="rate-icon">
      <pi-icon
        :name="val > index ? selectedIcon : unselectedIcon"
        :color="val > index ? selectedColor : unselectedColor"
        :custom-style="{
          fontSize: size + 'rpx',
          padding: `0 ${gutter / 2 + 'rpx'}`
        }"
        :custom-class="selectedColor ? '' : 'pi-primary'"
        :custom-prefix="classPrefix"
        @click="handleClick(index + 1, $event)"
      />
    </view>
  </view>
</template>

<script>
/**
 * status-bar 状态栏
 * @description 移动端状态栏占位
 * @property {String} background 是否显示模态框 default: transparent
 * @example <status-bar />
 */
import ValueSync from '../../mixin/value-sync'

import { getConfig } from '../../config'
const { rate } = getConfig()

const TAG = 'PiRate'

export default {
  name: 'PiRate',
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
        return rate.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return rate.customClass
      }
    },
    // 评分总数
    count: {
      type: [String, Number],
      default() {
        // 5
        return rate.count
      }
    },
    // 图标的尺寸，单位rpx
    size: {
      type: [String, Number],
      default() {
        // 36
        return rate.size
      }
    },
    // 星星之间的间距，单位rpx
    gutter: {
      type: [String, Number],
      default() {
        // 12
        return rate.gutter
      }
    },
    // 未选中的颜色
    unselectedColor: {
      type: String,
      default() {
        // #b2b2b2
        return rate.unselectedColor
      }
    },
    // 选中的颜色，不设置默认为主题色
    selectedColor: {
      type: String,
      default() {
        // ''
        return rate.selectedColor
      }
    },
    // 未选中的图标名称
    unselectedIcon: {
      type: String,
      default() {
        // 'biaoxing'
        return rate.unselectedIcon
      }
    },
    // 选中的图标名称
    selectedIcon: {
      type: String,
      default() {
        // 'biaoxingfill'
        return rate.selectedIcon
      }
    },
    // 是否禁用评分
    disabled: {
      type: Boolean,
      default() {
        // false
        return rate.disabled
      }
    },
    // 禁用时的颜色
    disabledColor: {
      type: String,
      default() {
        // '#c8c9cc'
        return rate.disabledColor
      }
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default() {
        // false
        return rate.readonly
      }
    },
    // 类名前缀，用于使用自定义图标，默认为（pi-icon-）
    classPrefix: {
      type: String,
      default() {
        // 'pi-icon-'
        return rate.classPrefix
      }
    }
  },
  data() {
    return {
      containerLeft: 0, // 容器左边宽度
      iconWidth: 0 // 每个星星的宽度
    }
  },
  computed: {
    getSize() {
      return parseInt(this.size, 10)
    },
    getGutter() {
      return parseInt(this.gutter, 10)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const srollWrapRect = await this.$pi.common.queryRect(this, '.pi-rate', false)
      if (srollWrapRect) {
        this.containerLeft = srollWrapRect.left
      }
      const tabRects = await this.$pi.common.queryRect(this, '.rate-icon', true)
      if (tabRects && tabRects.length > 0) {
        this.iconWidth = tabRects[0].width
      }
    },
    handleTouchMove(e) {
      if (this.disabled) {
        return
      }
      if (!e.changedTouches[0]) {
        return
      }
      const movePageX = e.changedTouches[0].pageX
      // 滑动点相对于评分盒子左边的距离
      const distance = movePageX - this.containerLeft

      // 如果滑动到了评分盒子的左边界，就设置为0星
      if (distance <= 0) {
        this.val = 0
      }
      // 滑动的距离，相当于多少颗星星
      let index = Math.ceil(distance / this.iconWidth)
      this.val = index > this.count ? this.count : index

      this.handleEmitChange()
    },
    handleClick(index, e) {
      if (this.disabled) {
        return
      }
      // 对第一个星星特殊处理，只有一个的时候，点击可以取消，否则无法作0星评价
      if (index == 1) {
        if (this.val == 1) {
          this.val = 0
        } else {
          this.val = 1
        }
      } else {
        this.val = index
      }
      this.handleEmitChange()
    }
  }
}
</script>
