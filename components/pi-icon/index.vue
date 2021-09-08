<template>
  <view class="icon-wrap" @tap="handleClick">
    <view :style="[iconStyle, customStyle]" :class="[iconClass, customClass]" />
    <view v-if="badge || dot" class="icon-badge" :class="{ dot }" :style="[badgeStyle]">
      {{ badge }}
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiIcon'
const { icon } = getConfig()

export default {
  name: 'PiIcon',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return icon.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return icon.customClass
      }
    },
    // 图标名称或图片链接
    name: {
      type: String,
      // ''
      default: icon.name
    },
    // 是否显示图标右上角小红点
    dot: {
      type: Boolean,
      // false
      default: icon.dot
    },
    // 小红点的半径
    dotRadius: {
      type: [String, Number],
      // 16rpx
      default: icon.dotRadius
    },
    // 图标右上角徽标的内容
    badge: {
      type: [String, Number],
      // ''
      default: icon.badge
    },
    // 图标颜色
    color: {
      type: String,
      // ''
      default: icon.color
    },
    // 图标字体大小，单位rpx
    size: {
      type: [String, Number],
      // ''
      default: icon.size
    },
    // 类名前缀，用于使用自定义图标
    classPrefix: {
      type: String,
      // 'pi-icon-'
      default: icon.classPrefix
    }
  },
  data() {
    return {
      // 初始化组件时，默认为加载中状态
      loading: true,
      // 图片是否加载错误，如果是，则显示错误占位图
      error: false
    }
  },
  computed: {
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    getDotRadius() {
      return this.$pi.common.addUnit(this.dotRadius)
    },
    iconStyle() {
      const style = {}
      this.color && (style.color = this.color)
      this.getSize && (style.fontSize = this.getSize)
      return style
    },
    badgeStyle() {
      const style = {}
      if (this.dot) {
        style.width = this.getDotRadius
        style.height = this.getDotRadius
      }
      return style
    },
    iconClass() {
      return this.classPrefix + this.name
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrap {
  position: relative;
  display: inline-flex;
  .icon-badge {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    min-width: 16px;
    padding: 0 3px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
    color: #ffffff;
    text-align: center;
    background-color: #ee0a24;
    border: 1px solid #ffffff;
    border-radius: 16px;
    transform: translate(50%, -50%);
    transform-origin: 100%;
    &.dot {
      min-width: 0;
      background-color: #ee0a24;
      border-radius: 100%;
    }
  }
}
</style>
