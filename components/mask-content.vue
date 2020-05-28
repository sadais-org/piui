<template>
  <view v-if="show" class="pi-mask-5" @touchmove.stop>
    <view
      class="content-wrap"
      :class="aniShow ? animation.show : animation.hide"
      @tap="handleClose"
    >
      <slot />
    </view>
  </view>
</template>

<script>
let timer // 延时器

export default {
  name: 'PiMaskContent',
  props: {
    // 是否显示
    isShow: {
      required: true,
      type: Boolean,
      default: false
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      default: false
    },
    // 点击蒙层是否允许关闭
    maskClosable: {
      required: false,
      type: Boolean,
      default: true
    },
    animation: {
      required: false,
      type: Object,
      default() {
        return {
          show: 'ani-slide-bottom-show', // 显示的时候执行的动画
          hide: 'ani-slide-bottom-hide', // 隐藏的时候执行的动画
          duration: 300 // 动画持续时间
        }
      }
    }
  },
  data() {
    return {
      show: this.isShow,
      aniShow: this.isShow
    }
  },
  watch: {
    isShow(value) {
      setTimeout(() => {
        if (value) {
          this.show = true
          this.aniShow = true
          uni.hideKeyboard()
          console.log('蒙层显示，触发mask-show事件，是否隐藏tabbar：', this.hideTabBar)
          uni.$emit('mask-show')
          this.hideTabBar && uni.hideTabBar()
        } else {
          this.aniShow = false
          this.closeMask()
        }
      }, 100)
    }
  },
  created() {
    console.log('mask-content初始化,蒙层显示状态为:', this.isShow)
    if (this.isShow) {
      uni.hideKeyboard()
      console.log('蒙层显示,触发mask-show事件')
      uni.$emit('mask-show')
      this.hideTabBar && uni.hideTabBar()
    }
  },
  beforeDestroy() {
    if (timer) clearTimeout(timer)
    uni.$emit('mask-hide')
  },
  methods: {
    closeMask() {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.show = false
        console.log('蒙层关闭,触发mask-hide事件')
        uni.$emit('mask-hide')
        uni.showTabBar()
      }, this.animation.duration)
    },
    handleClose() {
      if (!this.maskClosable) return
      this.aniShow = false
      this.$emit('close')
      this.closeMask()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-mask-5 {
  z-index: 12;
  .content-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 12;
    width: 100%;
    background-color: transparent;
  }
}
</style>
