<template>
  <view
    :class="[customClass, 'pi-img-cropper']"
    :style="[customStyle]"
    @touchstart.stop.prevent="handleStart"
    @touchmove.stop.prevent="handleMove"
    @touchcancel.stop.prevent="handleEnd"
    @touchend.stop.prevent="handleEnd"
  >
    <image class="img" mode="aspectFit" :style="[imgStyle]" :src="src" />
    <view class="crop" :style="[cropStyle]">
      <view class="corner lt" @touchstart="setCutMode('lt')" />
      <view class="corner rt" @touchstart="setCutMode('rt')" />
      <view class="corner rb" @touchstart="setCutMode('rb')" />
      <view class="corner lb" @touchstart="setCutMode('lb')" />
    </view>
    <canvas
      v-if="canvasId"
      :id="canvasId"
      :canvas-id="canvasId"
      style="position: absolute; left: -500000px; top: -500000px"
      :style="canvasStyle"
    />
  </view>
</template>
<script>
import Touch from "./touch";
import Vector from "./vector";
import Canvas from "./canvas";
import { getConfig } from "../../config";

const { imgCropper } = getConfig();
export default {
  name: "PiImgCropper",
  mixins: [Touch, Vector, Canvas],
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return imgCropper.customStyle;
      },
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return imgCropper.customClass;
      },
    },
    // 图片src
    src: {
      type: String,
      // `''`
      default: imgCropper.src,
    },
    // 图片格式
    fileType: {
      type: String,
      // `png`
      deault: imgCropper.fileType,
    },
    // 图片质量(0,1]
    quality: {
      type: Number,
      // `1`
      default: imgCropper.quality,
    },
    // 裁剪窗口大小
    cropSize: {
      // {`width`: `百分比 相对于容器宽度` or `px` or `rpx`, `height`: `百分比` or `px` or `rpx` }
      type: Object,
      // { width: `'50%'`, height: `'50%'`}
      default: () => imgCropper.cropSize,
    },
    // 最小的裁剪窗口
    minCropSize: {
      // {`width`: `百分比 相对于容器宽度` or `px` or `rpx`, `height`: `百分比` or `px` or `rpx` }
      type: Object,
      // { width: `'50px'`, height: `'50px'`}
      default: () => imgCropper.minCropSize,
    },
    // true: 开启图片边界检测 保证移动图片过程,当图片的边与裁剪框的边重叠时 就无法继续移动
    boundaryDetect: {
      type: Boolean,
      // `true`
      default: imgCropper.boundaryDetect,
    },
    // 是否保持裁剪框的高宽比不变
    keepCropRatio: {
      type: Boolean,
      // `false`
      default: imgCropper.keepCropRatio,
    },
    // 是否禁止旋转
    disableRotate: {
      type: Boolean,
      // `false`
      default: imgCropper.disableRotate,
    },
    // 放大裁剪窗口的倍数
    canvasZoom: {
      type: Number,
      // `1`
      default: imgCropper.canvasZoom,
    },
    // 遮罩层背景颜色
    maskBackground: {
      type: String,
      // 'rgba(0, 0, 0, .5)'
      default: imgCropper.maskBackground,
    },
  },
  data() {
    return {
      ratio: 1,
      root: {
        width: 0,
        height: 0,
      },
      img: {
        path: "",
        transform: {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
        },
        width: 0,
        height: 0,
      },
      crop: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ratio: 0,
        width: 0,
        height: 0,
      },
      focus: true,
    };
  },
  computed: {
    imgStyle() {
      const {
        width,
        height,
        transform: { x, y, rotate, scale },
      } = this.img;
      // 指定图片的大小、位置、旋转角度、缩放系数
      const style = {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
      };
      return style;
    },
    cropStyle() {
      const { top: t, right: r, bottom: b, left: l } = this.crop;
      // 指定裁剪窗口的位置、大小、周边的遮罩层效果
      return {
        top: `${t}px`,
        right: `${r}px`,
        bottom: `${b}px`,
        left: `${l}px`,
        outline: `50000px solid ${this.maskBackground}`,
      };
    },
  },
  watch: {
    src() {
      this.initImage();
    },
  },
  mounted() {
    uni.getSystemInfo({
      success: (result) => {
        this.ratio = result.windowWidth / 750;
        this.$nextTick(() => {
          this.initUI();
        });
      },
    });
  },
  methods: {
    async initUI() {
      const { width, height } = await this.getContainerSize();
      this.root = {
        width,
        height,
      };
      this.initImage();
      this.initCropWindow();
    },
    getContainerSize() {
      return new Promise((resolve) => {
        let query = uni.createSelectorQuery();
        // #ifndef MP-ALIPAY
        query = query.in(this);
        // #endif
        const node = query.select(".pi-img-cropper");
        node
          .boundingClientRect((result) => {
            resolve(result);
          })
          .exec();
      });
    },
    async initImage() {
      if (!this.src) {
        return;
      }
      const img = await this.loadImageInfo(this.src);
      let w = 0,
        h = 0;
      const root = this.root;
      if (img.height > img.width) {
        // 竖向图片：高度铺满屏幕高度、宽度等比计算
        h = root.height;
        w = (h / img.height) * img.width;
        if (w > root.width) {
          // 若计算后的宽度超出屏幕宽度 则等比缩小
          w = root.width;
          h = (w / img.width) * img.height;
        }
      } else {
        // 横向图片
        w = root.width;
        h = (w / img.width) * img.height;
        if (h > root.height) {
          h = root.height;
          w = (h / img.height) * img.width;
        }
      }
      const x = (root.width - img.width) / 2;
      const y = (root.height - img.height) / 2;
      const scale = w / img.width;
      this.img = {
        path: img.path,
        width: img.width,
        height: img.height,
        transform: {
          x,
          y,
          rotate: 0,
          scale,
        },
      };
    },
    async loadImageInfo(src) {
      return new Promise((resolve) => {
        uni.getImageInfo({
          src: this.src,
          success: (result) => {
            resolve(result);
          },
          fail: (error) => {
            resolve(null);
          },
        });
      });
    },
    initCropWindow() {
      // 初始化裁剪窗口
      const root = this.root;
      let w = this.toPx(this.cropSize.width);
      let h = this.toPx(this.cropSize.height);
      const minW = this.toPx(this.minCropSize.width);
      const minH = this.toPx(this.minCropSize.height);
      w = w < minW ? minW : w > root.width ? root.width : w;
      h = h < minH ? minH : h > root.height ? root.height : h;
      const ratio = h / w;
      const left = (root.width - w) / 2;
      const top = (root.height - h) / 2;
      this.crop = {
        top,
        left,
        right: left,
        bottom: top,
        width: w,
        height: h,
        ratio,
      };
    },
    toPx(unit) {
      let value = 0;
      if (unit) {
        if (/%$/.test(unit)) {
          value = Number(unit.replace(/%$/, ""));
          value = !value ? 0 : value;
          value = value * 0.01 * this.root.width;
        } else if (/rpx$/i.test(unit)) {
          value = Number(unit.replace(/rpx$/i, ""));
          value = !value ? 0 : value;
          value = value * this.ratio;
        } else {
          value = Number(unit.replace(/px$/i, ""));
        }
      }
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.pi-img-cropper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.img {
  position: absolute;
  transform-origin: 50% 50%;
}

.crop {
  position: absolute;
  background: transparent;
}

.corner {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border: 8rpx solid #ffffff;
  &.lt {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  &.rt {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }
  &.rb {
    right: 0;
    bottom: 0;
    border-top: none;
    border-left: none;
  }
  &.lb {
    left: 0;
    bottom: 0;
    border-top: none;
    border-right: none;
  }
}
</style>
