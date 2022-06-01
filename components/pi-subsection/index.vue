<template>
  <view
    ref="pi-subsection"
    class="pi-subsection"
    :class="[`pi-subsection--${mode}`, { round: round }, customClass]"
    :style="[customStyle, wrapperStyle]"
  >
    <view
      ref="pi-subsection__bar"
      class="pi-subsection__bar"
      :style="[barStyle]"
      :class="[barClass]"
    />
    <view
      v-for="(item, index) in items"
      :ref="`pi-subsection__item--${index}`"
      :key="index"
      class="pi-subsection__item"
      :class="[itemClass(index)]"
      :style="[itemStyle(index)]"
      @tap="handleSelectItem(index)"
    >
      <text class="pi-subsection__item__text" :style="[textStyle(index)]">{{ getText(item) }}</text>
    </view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom')
const animation = uni.requireNativePlugin('animation')
// #endif
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { subsection } = getConfig()
/**
 * Subsection 分段器
 * @description 该分段器一般用于用户从几个选项中选择某一个的场景
 * @tutorial http://piui.sadais.com/docs/components/Subsection.html
 * @event {Function} change		分段器选项发生改变时触发  回调 index：选项的index索引值，从0开始
 * @example <pi-subsection v-model="current" :items="items" @change="sectionChange" />
 */
export default {
  name: 'PiSubsection',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 当前活动的tab的index
    value: {
      type: Number,
      // 0
      default() {
        return subsection.value
      }
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return subsection.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return subsection.customClass
      }
    },
    // tab的数据
    items: {
      type: Array,
      // []
      default() {
        return subsection.items
      }
    },
    // 激活时的颜色
    activeColor: {
      type: String,
      // #5a7dff
      default() {
        return subsection.activeColor
      }
    },
    // 未激活时的颜色
    inactiveColor: {
      type: String,
      // #303133
      default() {
        return subsection.inactiveColor
      }
    },
    // 模式选择，mode=button为按钮形式，mode=subsection时为分段模式
    mode: {
      type: String,
      // button
      default() {
        return subsection.mode
      }
    },
    // 圆角模式
    round: {
      type: Boolean,
      // false
      default() {
        return subsection.round
      }
    },
    // 字体大小，单位px
    fontSize: {
      type: [String, Number],
      // 24rpx
      default() {
        return subsection.fontSize
      }
    },
    // 激活选项的字体是否加粗
    bold: {
      type: Boolean,
      // true
      default() {
        return subsection.bold
      }
    },
    // 组件背景颜色，mode为button时有效
    bgColor: {
      type: String,
      // #eeeeef
      default() {
        return subsection.bgColor
      }
    },
    // 从`items`元素对象中读取的键名
    keyField: {
      type: String,
      // name
      default() {
        return subsection.keyField
      }
    }
  },
  data() {
    return {
      // 组件尺寸
      itemRect: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    // 滑块指定class
    barClass() {
      // 默认按钮模式
      let className = 'pi-subsection--button__bar'
      // 分段器模式
      if (this.mode === 'subsection') {
        if (this.val === 0) {
          className = 'pi-subsection__bar--first'
        } else if (this.val > 0 && this.val < this.items.length - 1) {
          className = 'pi-subsection__bar--center'
        } else if (this.val === this.items.length - 1) {
          className = 'pi-subsection__bar--last'
        }
      }
      return className
    },
    wrapperStyle() {
      const style = {}
      // button模式时，设置背景色
      if (this.mode === 'button') {
        style.background = this.bgColor
      }
      return style
    },
    // 滑块的样式
    barStyle() {
      const style = {}
      style.width = `${this.itemRect.width}px`
      style.height = `${this.itemRect.height}px`
      // 通过translateX移动滑块，其移动的距离为索引*item的宽度
      // #ifndef APP-NVUE
      style.transform = `translateX(${this.val * this.itemRect.width}px)`
      // #endif
      if (this.mode === 'subsection') {
        // 在subsection模式下，需要动态设置滑块的圆角，因为移动滑块使用的是translateX，无法通过父元素设置overflow: hidden隐藏滑块的直角
        style.background = this.activeColor
      }
      // 按钮圆角模式 按钮模式生效
      if (this.round && this.mode === 'button') {
        style.borderRadius = `${this.itemRect.height}px`
      }
      return style
    },
    // 分段器item的样式
    itemStyle(index) {
      return index => {
        const style = {}
        if (this.mode === 'subsection') {
          // 设置border的样式
          style.borderColor = this.activeColor
          style.borderWidth = '2rpx'
          style.borderStyle = 'solid'
          if (this.round) {
            if (index === 0) {
              style.borderTopLeftRadius = `${this.itemRect.height}px`
              style.borderBottomLeftRadius = `${this.itemRect.height}px`
            } else if (index === this.items.length - 1) {
              // 最后一个
              style.borderTopRightRadius = `${this.itemRect.height}px`
              style.borderBottomRightRadius = `${this.itemRect.height}px`
            }
          }
        }
        return style
      }
    },
    // 分段器item的class
    itemClass(index) {
      return index => {
        let className = `pi-subsection__item--${index}`
        if (index < this.items.length - 1) {
          className += ' pi-subsection__item--no-border-right'
        } else if (index === 0) {
          className += ' pi-subsection__item--first'
        } else if (index === this.items.length - 1) {
          className += ' pi-subsection__item--last'
        }
        return className
      }
    },
    // 分段器文字颜色
    textStyle(index) {
      return index => {
        const style = {}
        style.fontWeight = this.bold && this.val === index ? 'bold' : 'normal'
        style.fontSize = this.$pi.common.addUnit(this.fontSize)
        // subsection模式下，激活时默认为白色的文字
        if (this.mode === 'subsection') {
          style.color = this.val === index ? '#fff' : this.inactiveColor
        } else {
          // button模式下，激活时文字颜色默认为activeColor
          style.color = this.val === index ? this.activeColor : this.inactiveColor
        }
        return style
      }
    }
  },
  watch: {
    items(newValue, oldValue) {
      this.init()
    },
    current: {
      immediate: true,
      handler(n) {
        // #ifdef APP-NVUE
        // 在安卓nvue上，如果通过translateX进行位移，到最后一个时，会导致右侧无法绘制圆角
        // 故用animation模块进行位移
        const ref = this.$refs?.['pi-subsection__bar']?.ref
        // 不存在ref的时候(理解为第一次初始化时，需要渲染dom，进行一定延时再获取ref)，这里的100ms是经过测试得出的结果(某些安卓需要延时久一点)，勿随意修改
        this.sleep(ref ? 0 : 100).then(() => {
          animation.transition(this.$refs['pi-subsection__bar'].ref, {
            styles: {
              transform: `translateX(${n * this.itemRect.width}px)`,
              transformOrigin: 'center center'
            },
            duration: 300
          })
        })
        // #endif
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.sleep().then(() => this.getRect())
    },
    // 判断展示文本
    getText(item) {
      return typeof item === 'object' ? item[this.keyField] : item
    },
    // 获取组件的尺寸
    getRect() {
      // #ifndef APP-NVUE
      this.$pi.common.queryRect(this, '.pi-subsection__item--0', false).then(size => {
        this.itemRect = size
      })
      // #endif
      // #ifdef APP-NVUE
      const ref = this.$refs['pi-subsection__item--0'][0]
      ref &&
        dom.getComponentRect(ref, res => {
          this.itemRect = res.size
        })
      // #endif
    },
    /**
     * @description 进行延时，以达到可以简写代码的目的
     * @param {number} value 堵塞时间 单位ms 毫秒
     * @returns {Promise} 返回promise
     */
    sleep(value = 30) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, value)
      })
    },

    handleSelectItem(index) {
      this.val = index
      this.handleEmitChange()
    }
  }
}
</script>
<style lang="scss" scoped>
.pi-subsection {
  display: flex;
  position: relative;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  width: 100%;
  box-sizing: border-box;
  /* #endif */
  &.round {
    border-radius: 60rpx;
  }
  &--button {
    height: 64rpx;
    background-color: rgb(238, 238, 239);
    padding: 6rpx;
    border-radius: 6rpx;
    align-items: stretch;
    &__bar {
      background-color: #ffffff;
      border-radius: 6rpx;
    }
  }
  &--subsection {
    height: 60rpx;
  }
  &__bar {
    position: absolute;
    /* #ifndef APP-NVUE */
    transition-property: transform, color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    /* #endif */
    &--first {
      border-top-left-radius: 6rpx;
      border-bottom-left-radius: 6rpx;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    &--center {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    &--last {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-top-right-radius: 6rpx;
      border-bottom-right-radius: 6rpx;
    }
  }
  &__item {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    // vue环境下，需要设置相对定位，因为滑块为绝对定位，item需要在滑块的上面
    position: relative;
    &--no-border-right {
      border-right-width: 0 !important;
    }
    &--first {
      border-top-left-radius: 6rpx;
      border-bottom-left-radius: 6rpx;
    }
    &--last {
      border-top-right-radius: 6rpx;
      border-bottom-right-radius: 6rpx;
    }
    &__text {
      font-size: 24rpx;
      line-height: 24rpx;
      display: flex;
      align-items: center;
      transition-property: color;
      transition-duration: 0.3s;
    }
  }
}
</style>
