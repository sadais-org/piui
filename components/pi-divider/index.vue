<template>
  <view class="pi-rela pi-w-100P pi-align-center" :style="[customStyle]" :class="[customClass]">
    <view
      v-if="['center', 'right'].includes(contentPosition)"
      class="pi-divider"
      :style="[dividerStyle]"
    />
    <!-- $slots.$default 是为了支持支付宝小程序 -->
    <view
      v-if="$slots.default || $slots.$default"
      :style="[{ padding: contentPadding }, contentStyle]"
    >
      <slot />
    </view>
    <view
      v-if="['center', 'left'].includes(contentPosition)"
      class="pi-divider"
      :style="[dividerStyle]"
    />
  </view>
</template>

<script>
import { getConfig } from '../../config'

const TAG = 'PiDivider'
const { divider } = getConfig()

export default {
  name: 'PiDivider',
  props: {
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return divider.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      default() {
        // ''
        return divider.customClass
      }
    },
    // 是否使用0.5px线
    halfline: {
      type: Boolean,
      // true
      default: divider.halfline
    },
    // 线条颜色
    borderColor: {
      type: String,
      // #d6e4ef
      default: divider.borderColor
    },
    // 分割线样式：dashed dotted double等，和style提供的borderStyle一致
    borderStyle: {
      type: String,
      // 'solid'
      default: divider.borderStyle
    },
    // 内容位置
    contentPosition: {
      // `'center'` `'left'` `'right'`
      type: String,
      // 'center'
      default: divider.contentPosition,
      validator: function(value) {
        return ['center', 'left', 'right'].includes(value)
      }
    },
    // 内容padding
    contentPadding: {
      type: String,
      // '0 24rpx'
      default: divider.contentPadding
    },
    // 内容自定义样式
    contentStyle: {
      type: Object,
      default() {
        // {}
        return divider.customStyle
      }
    }
  },
  computed: {
    dividerStyle() {
      const style = {
        borderStyle: this.borderStyle,
        borderColor: this.borderColor
      }
      if (this.halfline) {
        style.transform = 'scaleY(0.5)'
      }
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-divider {
  flex: 1;
  border-width: 0;
  border-top-width: 1px;
}
</style>
