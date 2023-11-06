<template>
  <view class="badge-wrap" :style="[customStyle]" :class="[customClass]" @tap="handleClick">
    <view
      class="badge"
      :class="[
        {
          dot,
          'abso': $slots.default || $slots.$default,
          'hide-border': !dot && !getContent && !($slots.content || $slots.$content)
        }
      ]"
      :style="[badgeStyle]"
    >
      <slot name="content">
        {{ getContent }}
      </slot>
    </view>
    <slot />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiBadge'
const { badge } = getConfig()

export default {
  name: 'PiBadge',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return badge.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return badge.customClass
      }
    },
    // 是否显示图标右上角小红点
    dot: {
      type: Boolean,
      // false
      default: badge.dot
    },
    // 小红点的半径
    dotRadius: {
      type: [String, Number],
      // 16rpx
      default: badge.dotRadius
    },
    // 图标右上角徽标的内容
    content: {
      type: [String, Number],
      // ''
      default: badge.content
    },
    // 徽标背景颜色
    color: {
      type: String,
      // ''
      default: badge.color
    },
    // 最大值，超过最大值会显示 {max}+，仅当 content 为数字时有效
    max: {
      type: [String, Number],
      // ''
      default: badge.max
    }
  },
  data() {
    return {}
  },
  computed: {
    getDotRadius() {
      return this.$pi.common.addUnit(this.dotRadius)
    },
    badgeStyle() {
      const style = {
        backgroundColor: this.color
      }
      if (this.dot) {
        style.width = this.getDotRadius
        style.height = this.getDotRadius
      }
      return style
    },
    getContent() {
      const max = parseInt(this.max, 10)
      const content = parseInt(this.content, 10)
      if (this.$pi.lang.isNumber(content) && max < content) return `${max}+`
      return this.content
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
.badge-wrap {
  position: relative;
  display: inline-block;

  .badge {
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

    &.hide-border {
      border: none;
    }

    &.dot {
      min-width: 0;
      background-color: #ee0a24;
      border-radius: 100%;
    }
    &.abso {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      transform-origin: 100%;
    }
  }
}
</style>
