<template>
  <view
    class="pi-swiper-wrap"
    :style="[customStyle, { borderRadius: getBorderRadius }]"
    :class="[customClass]"
  >
    <swiper
      :current="val"
      :interval="interval"
      :circular="circular"
      :duration="getDuration.js"
      :autoplay="autoplay"
      :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
      :style="[swiperStyle]"
      @change="handleSwiperChange"
    >
      <swiper-item v-for="(img, index) in imgs" :key="index" class="swiper-item">
        <view
          class="swiper-image-wrap"
          :class="[val != index ? 'list-scale' : '']"
          :style="[
            {
              borderRadius: `${borderRadius}rpx`,
              transform: effect3d && val !== index ? 'scaleY(0.9)' : 'scaleY(1)',
              padding: effect3d && val !== index ? '0 20rpx' : 0
            }
          ]"
          @tap.stop="handleSwiperClick(index)"
        >
          <slot name="img" :index="index" :img="img" :value="val">
            <!-- 后备内容 -->
            <image
              class="swiper-image"
              :style="[imgStyle, { borderRadius: getBorderRadius }]"
              :src="imgField ? img[imgField] : img"
              :mode="imgMode"
            />
          </slot>
        </view>
      </swiper-item>
    </swiper>
    <view v-if="indicatorType !== 'none'" class="swiper-indicator" :style="[swiperIndicatorStyle]">
      <!-- 数字形式展示 -->
      <template v-if="indicatorType === 'number'">
        <view class="indicator-item number">{{ val + 1 }}/{{ imgs.length }}</view>
      </template>
      <!-- 点，矩形 -->
      <template v-else>
        <view
          v-for="(item, index) in imgs"
          :key="index"
          class="indicator-item"
          :class="[index === val ? 'active' : '', indicatorType]"
          :style="[
            index === val && indicatorActiveColor
              ? {
                  backgroundColor: indicatorActiveColor
                }
              : {}
          ]"
        />
      </template>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
import { parseDuration } from '@sadais/piui-tool/tools/common'
const { swiper } = getConfig()

const TAG = 'PiSwiper'

export default {
  name: 'PiSwiper',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 显示第几项
    value: {
      required: false,
      type: [String, Number],
      // `0`
      default() {
        return swiper.value
      }
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return swiper.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // `''`
      default() {
        return swiper.customClass
      }
    },
    // 选项列表
    imgs: {
      type: Array,
      // `[]`
      default() {
        return swiper.imgs
      }
    },
    // 如果`imgs`传的是字符串数组，`imgField`传空，如果`imgs`传的是对象数组，`imgField`传对象中`img`字段
    imgField: {
      type: String,
      // `''` 或 `img`
      default() {
        return swiper.imgField
      }
    },
    // 轮播图的高度
    height: {
      type: [String, Number],
      // `auto`
      default: swiper.height
    },
    // 图片的裁剪模式，详见image组件裁剪模式，可选值`widthFix` `heightFix` `aspectFill` `aspectFit` `scaleToFill`
    imgMode: {
      type: String,
      // `widthFix`
      default: swiper.imgMode
    },
    // 背景颜色
    bgColor: {
      type: String,
      // `transparent`
      default: swiper.bgColor
    },
    // 指示器模式 rect / dot / number / none
    indicatorType: {
      type: String,
      // `number`
      default: swiper.indicatorType,
      validator: function(value) {
        return ['rect', 'dot', 'number', 'none'].includes(value)
      }
    },
    // 指示器的位置,可用值 `tl 左上角` `tc 上中` `tr 右上角` `bl 左下角` ` bc 下种` `br 右下角`
    indicatorPosition: {
      type: String,
      // `br`
      default: swiper.indicatorPosition,
      validator: function(value) {
        return ['tl', 'tc', 'tr', 'bl', 'bc', 'br'].includes(value)
      }
    },
    // 指示器激活颜色，不设置默认为主题色
    indicatorActiveColor: {
      type: String,
      // `''`
      default: swiper.indicatorActiveColor
    },
    // 是否开启3d效果，可选值 `true`
    effect3d: {
      type: Boolean,
      // `false`
      default: swiper.effect3d
    },
    // effect3d = true的情况下，激活项与前后项之间的距离，单位rpx
    effect3dPreviousMargin: {
      type: [String, Number],
      // `50`
      default: swiper.effect3dPreviousMargin
    },
    // 是否自动播放, 可选值 `false`
    autoplay: {
      type: Boolean,
      // true
      default: swiper.autoplay
    },
    // 自动轮播时间间隔，单位ms
    interval: {
      type: [String, Number],
      // `3000`
      default: swiper.interval
    },
    // 是否循环播放，可选值`false`
    circular: {
      type: Boolean,
      // `true`
      default: swiper.circular
    },
    // 切换一张轮播图所需的时间 格式：500、'500ms', '0.5s'
    duration: {
      type: [String, Number],
      // `500`
      default: swiper.duration
    },
    // 轮播图圆角值，单位rpx
    borderRadius: {
      type: [String, Number],
      // `8`
      default: swiper.borderRadius
    },
    // 图片自定义样式，对象形式
    imgStyle: {
      type: Object,
      // `{}`
      default() {
        return swiper.imgStyle
      }
    },
    // 标题自定义样式，对象形式
    titleStyle: {
      type: Object,
      // `{}`
      default() {
        return swiper.titleStyle
      }
    }
  },
  computed: {
    getDuration() {
      return parseDuration(this.duration, swiper.duration)
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getBorderRadius() {
      return this.$pi.common.addUnit(this.borderRadius)
    },
    swiperStyle() {
      const style = {
        backgroundColor: this.bgColor,
        borderRadius: this.getBorderRadius
      }
      if (this.getHeight !== 'auto') {
        style.height = this.getHeight
      }
      return style
    },
    swiperIndicatorStyle() {
      const style = {
        top: this.indicatorPosition.includes('t') ? '24rpx' : 'unset',
        bottom: this.indicatorPosition.includes('b') ? '24rpx' : 'unset',
        justifyContent: this.indicatorPosition.includes('c')
          ? 'center'
          : this.indicatorPosition.includes('l')
          ? 'flex-start'
          : 'flex-end',
        padding: `0 ${this.effect3d ? '74rpx' : '24rpx'}`
      }
      return style
    }
  },
  methods: {
    handleSwiperChange(e) {
      const current = e.detail.current
      this.val = current
      this.handleEmitChange()
    },
    handleSwiperClick(index) {
      // 点击时触发 |	index, 当前页的索引
      this.$emit('click', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-swiper-wrap {
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  .swiper-item {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .swiper-image-wrap {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
      overflow: hidden;
      transition: all $pi-animation-duration $pi-animation-timing-function;
      &.list-scale {
        transform-origin: center center;
      }
      .swiper-image {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;

        /* #ifdef H5 */
        pointer-events: none;
        will-change: transform;

        /* #endif */
      }
    }
  }

  .swiper-indicator {
    position: absolute;
    z-index: 1;
    display: flex;
    width: 100%;
    padding: 0 24rpx;
    .indicator-item {
      transition: all $pi-animation-duration $pi-animation-timing-function;
      &.dot {
        width: 14rpx;
        height: 14rpx;
        margin: 0 6rpx;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 20rpx;
        &.active {
          width: 30rpx;
        }
      }
      &.rect {
        width: 26rpx;
        height: 8rpx;
        margin: 0 6rpx;
        background-color: rgba(0, 0, 0, 0.3);
      }
      &.number {
        padding: 6rpx 16rpx;
        font-size: 26rpx;
        line-height: 1;
        color: rgba(255, 255, 255, 0.8);
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50000rpx;
      }
      &.active {
        background-color: $pi-primary-color;
      }
    }
  }
}
</style>
