<template>
  <view class="pi-img" :style="[rectStyle]">
    <view
      class="pi-align-center"
      :style="[rectStyle, imageStyle, customStyle]"
      :class="[customClass]"
      @tap="handleButtonTap"
    >
      <image
        :src="src"
        :mode="mode"
        :lazy-load="lazyLoad"
        :style="[rectStyle, imageStyle]"
        :show-menu-by-longpress="showMenuByLongpress"
        @error="handleError"
        @load="handleLoad"
      />
      <view class="pi-abso-center">
        <!-- 加载中 -->
        <template v-if="src && loading">
          <!-- 加载中样式 -->
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
        <template v-if="src && error">
          <!-- 加载失败样式 -->
          <slot v-if="$slots.error" name="error" />
          <view class="pi-icon-pic" />
        </template>
      </view>
    </view>
    <view v-if="badge || dot" class="img-badge" :class="{ dot }" :style="[badgeStyle]">
      {{ badge }}
    </view>
    <view v-if="dot" />
  </view>
</template>

<script>
/**
 * 注意，必须指定宽度和高度，否则没办法显示低图和加载错误占位图
 * 如果要自定义loading底图和请求失败图，请使用slot对本组件进行二次封装
 */
import { getConfig } from '../../config'
import { debounce } from '@sadais/piui-tool/tools/common'

const TAG = 'PiImg'
const { img } = getConfig()

export default {
  name: 'PiImg',
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return img.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return img.customClass
      }
    },
    // 图片地址
    src: {
      type: String,
      // ''
      default: img.src
    },
    // 裁剪模式
    mode: {
      type: String,
      // 'widthFix'
      default: img.mode
    },
    // 宽度
    width: {
      type: [String, Number],
      // '100%'
      default: img.width
    },
    // 高度
    height: {
      type: [String, Number],
      // 'auto'
      default: img.height
    },
    // 是否显示图标右上角小红点
    dot: {
      type: Boolean,
      // false
      default: img.dot
    },
    // 小红点的半径
    dotRadius: {
      type: [String, Number],
      // 16
      default: img.dotRadius
    },
    // 图标右上角徽标的内容
    badge: {
      type: [String, Number],
      // ''
      default: img.badge
    },
    // 图片形状
    shape: {
      // `'round'-圆形` `'square'-方形`
      type: String,
      // 'square'
      default: img.shape,
      validator: function(value) {
        return ['square', 'round'].includes(value)
      }
    },
    // shape为square的时候设置
    borderRadius: {
      type: [String, Number],
      // 0
      default: img.borderRadius
    },
    // 是否懒加载
    lazyLoad: {
      type: Boolean,
      // true
      default: img.lazyLoad
    },
    // 开启长按图片显示识别微信小程序码菜单
    showMenuByLongpress: {
      type: Boolean,
      // true
      default: img.showMenuByLongpress
    },
    // 是否显示加载中的图标或者自定义的slot
    showLoading: {
      type: Boolean,
      // true
      default: img.showLoading
    },
    // 加载中颜色
    loadingColor: {
      type: String,
      // '#c1c1c1'
      default: img.loadingColor
    },
    // loading类型
    loadingType: {
      // `'spinner'-菊花` `'round'-圆环`
      type: String,
      // 'spinner'
      default: img.loadingType,
      validator: function(value) {
        return ['spinner', 'round'].includes(value)
      }
    },
    // 尺寸
    loadingSize: {
      type: [String, Number],
      // 32
      default: img.loadingSize
    },
    // 是否显示加载中的图标或者自定义的slot
    showError: {
      type: Boolean,
      // true
      default: img.showError
    },
    // 默认不解析 webP 格式，只支持网络资源
    webp: {
      type: Boolean,
      // false
      default: img.webp
    }
  },
  data() {
    return {
      loading: this.showLoading,
      // 图片是否加载错误，如果是，则显示错误占位图
      error: false
    }
  },
  computed: {
    getDotRadius() {
      return this.$pi.common.addUnit(this.dotRadius)
    },
    rectStyle() {
      return {
        width: this.$pi.common.addUnit(this.width),
        height: this.$pi.common.addUnit(this.height)
      }
    },
    badgeStyle() {
      const style = {}
      if (this.dot) {
        style.width = this.getDotRadius
        style.height = this.getDotRadius
      }
      return style
    },
    imageStyle() {
      return {
        overflow: 'hidden',
        borderRadius: this.shape === 'round' ? '50%' : this.$pi.common.addUnit(this.borderRadius)
      }
    }
  },
  methods: {
    handleButtonTap: debounce(function(e) {
      this.$emit('click', e)
    }, 200),
    handleError() {
      console.log(TAG, '图片加载失败')
      this.error = true
      this.loading = false
      // 图片加载完成
      this.$emit('load')
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
  .img-badge {
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
