<template>
  <view
    class="pi-img pi-w-100P pi-align-center"
    :style="[imageStyle, customStyle]"
    :class="[customClass]"
  >
    <image
      :src="src"
      :mode="mode"
      :lazy-load="lazyLoad"
      :style="[imageStyle]"
      @error="handleError"
      @load="handleLoad"
    />
    <view class="pi-abso-center">
      <!-- 加载中 -->
      <template v-if="loading">
        <slot v-if="$slots.loading" name="loading" />
        <pi-loading
          v-else
          :show="loading"
          :type="loadingType"
          :color="loadingColor"
          :size="loadingSize"
        />
      </template>
      <!-- 加载失败 -->
      <template v-if="error">
        <slot v-if="$slots.error" name="error" />
        <view class="pi-icon-pic" />
      </template>
    </view>
  </view>
</template>

<script>
/**
 * 注意，必须指定宽度和高度，否则没办法显示低图和加载错误占位图
 * 如果要自定义loading底图和请求失败图，请使用slot对本组件进行二次封装
 */
import { getConfig } from '../../config'
import { createCustomPropsByConfig } from '../../mixin/component-custom'
const TAG = 'PiImg'
const { img } = getConfig()

export default {
  name: TAG,
  // 混入自定义样式customStyle和customClass
  mixins: [createCustomPropsByConfig(img)],
  props: {
    // 图片地址（默认值：''）
    src: {
      type: String,
      default: img.src
    },
    // 裁剪模式（默认值：'aspectFill'）
    mode: {
      type: String,
      default: img.mode
    },
    // 宽度（默认值：'100%'）
    width: {
      type: [String, Number],
      default: img.width
    },
    // 高度（默认值：'auto'）
    height: {
      type: [String, Number],
      default: img.height
    },
    // 图片形状，circle-圆形，square-方形（默认值：'square'）
    shape: {
      type: String,
      default: img.shape,
      validator: function(value) {
        return ['square', 'circle'].includes(value)
      }
    },
    // shape为square的时候设置（默认值：'0'）
    borderRadius: {
      type: [String, Number],
      default: img.borderRadius
    },
    // 是否懒加载（默认值：'true'）
    lazyLoad: {
      type: Boolean,
      default: img.lazyLoad
    },
    // 开启长按图片显示识别微信小程序码菜单（默认值：'true'）
    showMenuByLongpress: {
      type: Boolean,
      default: img.showMenuByLongpress
    },
    // 是否显示加载中的图标或者自定义的slot（默认值：'true'）
    showLoading: {
      type: Boolean,
      default: img.showLoading
    },
    // 加载中颜色（默认值：'#c1c1c1'）
    loadingColor: {
      type: String,
      default: img.loadingColor
    },
    // 类型： spinner 菊花 circle 圆环（默认值：'spinner'）
    loadingType: {
      type: String,
      default: img.loadingType,
      validator: function(value) {
        return ['spinner', 'circle'].includes(value)
      }
    },
    // 尺寸，默认38rpx
    loadingSize: {
      type: [String, Number],
      default: img.loadingSize
    },
    // 是否显示加载中的图标或者自定义的slot（默认值：true）
    showError: {
      type: Boolean,
      default: img.showError
    },
    // 默认不解析 webP 格式，只支持网络资源（默认值：false）
    webp: {
      type: Boolean,
      default: img.webp
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
    imageStyle() {
      return {
        overflow: 'hidden',
        width: this.$pi.common.addUnit(this.width),
        height: this.$pi.common.addUnit(this.height),
        borderRadius: this.shape === 'circle' ? '50%' : this.$pi.common.addUnit(this.borderRadius)
      }
    }
  },
  methods: {
    handleError() {
      this.error = true
      this.loading = false
    },
    handleLoad() {
      this.error = false
      this.loading = false
      this.$emit('load')
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-img {
  position: relative;
  min-height: 50%;
}
</style>
