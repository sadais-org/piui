<template>
  <view
    v-show="show"
    class="pi-tag-wrapper pi-rela pi-inline-block"
    :class="[tagWrapperClass]"
    :style="[tagWrapperStyle]"
  >
    <view
      class="pi-tag pi-align-center pi-justify-center"
      :class="[customClass, tagClass]"
      :style="[customStyle, tagStyle]"
      @tap="handleClickTag"
    >
      <slot name="icon">
        <view v-if="icon" class="pi-tag__icon pi-align-center">
          <image v-if="isImg(icon)" :src="icon" :style="[imgStyle]" />
          <pi-icon v-else :custom-class="piIconClass" :name="icon" :size="iconSize" />
        </view>
      </slot>
      <text class="pi-tag__text" :style="[textColor]" :class="[textClass]">
        {{ text }}
      </text>
    </view>
    <view
      v-if="closable"
      class="pi-tag__close"
      :class="[`pi-tag__close--${size}`]"
      :style="{ backgroundColor: closeColor }"
      @tap="handleCloseTag"
    >
      <pi-icon name="close" :size="closeSize" color="#ffffff" />
    </view>
  </view>
</template>

<script>
import { getConfig } from '../../config'
const { tag } = getConfig()
/**
 * Tag 标签
 * @description tag组件一般用于标记和选择，我们提供了更加丰富的表现形式，能够较全面的涵盖您的使用场景
 * @tutorial http://piui.sadais.com/docs/components/tag.html
 * @event {Function(index)} click 点击标签时触发 index: 传递的index参数值
 * @event {Function(index)} close closable为true时，点击标签关闭按钮触发 index: 传递的index参数值
 * @example <pi-tag text="标签" type="error" plain plainFill />
 */
export default {
  name: 'PiTag',
  props: {
    // 自定义样式，对象形式
    tagWrapperStyle: {
      type: Object,
      // `{}`
      default() {
        return tag.tagWrapperStyle
      }
    },
    // 自定义样式类，字符串形式
    tagWrapperClass: {
      type: String,
      // ''
      default() {
        return tag.tagWrapperClass
      }
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // `{}`
      default() {
        return tag.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return tag.customClass
      }
    },
    // 标签尺寸
    size: {
      // `'large'` `'medium'` `'mini'`
      type: String,
      // 'medium'
      default: tag.size,
      validator: function (value) {
        return ['large', 'medium', 'mini'].includes(value)
      }
    },
    // 标签的预置样式
    type: {
      // `'primary'` `'success'` `'info'` `'warning'` `'error'`
      type: String,
      // 'default'
      default: tag.type,
      validator: function (value) {
        return ['primary', 'success', 'info', 'warning', 'error'].includes(value)
      }
    },
    // 是否禁用
    disabled: {
      type: [Boolean, String],
      // false
      default() {
        return tag.disabled
      }
    },
    // tag的形状
    shape: {
      type: String,
      // 'square'
      default() {
        return tag.shape
      }
    },
    // 标签的文字内容
    text: {
      type: [String, Number],
      // ''
      default() {
        return tag.text
      }
    },
    // 背景颜色
    bgColor: {
      type: String,
      // ''
      default() {
        return tag.bgColor
      }
    },
    // 标签字体颜色
    color: {
      type: String,
      // ''
      default() {
        return tag.color
      }
    },
    // 镂空形式标签的边框颜色
    borderColor: {
      type: String,
      // ''
      default() {
        return tag.borderColor
      }
    },
    // 关闭按钮图标的颜色
    closeColor: {
      type: String,
      // '#C6C7CB'
      default() {
        return tag.closeColor
      }
    },
    // 点击时返回的索引值
    name: {
      type: [String, Number],
      // ''
      default() {
        return tag.name
      }
    },
    // 镂空时是否填充背景色
    plainFill: {
      type: Boolean,
      // false
      default() {
        return tag.plainFill
      }
    },
    //  是否镂空
    plain: {
      type: Boolean,
      // false
      default() {
        return tag.plain
      }
    },
    // 是否可关闭
    closable: {
      type: Boolean,
      // false
      default() {
        return tag.closable
      }
    },
    // 是否显示 默认true
    show: {
      type: Boolean,
      // true
      default() {
        return tag.show
      }
    },
    // 内置图标
    icon: {
      type: String,
      // ''
      default() {
        return tag.icon
      }
    }
  },
  computed: {
    // 标签动态class
    tagClass() {
      let className = `pi-tag--${this.shape}`
      if (this.plain) {
        className += ` pi-tag--${this.type}--plain`
      } else {
        className += ` pi-tag--${this.type}`
      }
      className += ` pi-tag--${this.size}`
      if (this.plain && this.plainFill) {
        className += ` pi-tag--${this.type}--plain--fill`
      }
      return className
    },
    // 标签动态style
    tagStyle() {
      const style = {}
      if (this.bgColor) {
        style.backgroundColor = this.bgColor
      }
      if (this.color) {
        style.color = this.color
      }
      if (this.borderColor) {
        style.borderColor = this.borderColor
      }
      return style
    },
    // 标签文本样式
    textClass() {
      let className = `pi-tag__text--${this.type}`
      if (this.plain) {
        className += ` pi-tag__text--${this.type}--plain`
      }
      className += ` pi-tag__text--${this.size}`
      return className
    },
    // nvue下，文本颜色无法继承父元素
    textColor() {
      const style = {}
      if (this.color) {
        style.color = this.color
      }
      return style
    },
    // 标签图标style
    imgStyle() {
      const width = this.size === 'large' ? '34rpx' : this.size === 'medium' ? '30rpx' : '26rpx'
      return {
        width,
        height: width
      }
    },
    // 关闭图标的样式 单位rpx
    closeSize() {
      const size = this.size === 'large' ? 30 : this.size === 'medium' ? 26 : 24
      return size
    },
    // 图标大小 单位rpx
    iconSize() {
      const size = this.size === 'large' ? 42 : this.size === 'medium' ? 38 : 32
      return size
    },
    // 图标类名
    piIconClass() {
      return this.plain ? `pi-${this.type}` : 'pi-white'
    },
    // 判断是否是图片
    isImg() {
      return value => {
        const newValue = value.split('?')[0]
        const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i
        return IMAGE_REGEXP.test(newValue)
      }
    }
  },
  methods: {
    // 关闭标签
    handleCloseTag() {
      this.$emit('close', this.name, this.text)
    },
    // 点击标签
    handleClickTag() {
      this.$emit('click', this.name, this.text)
    }
  }
}
</script>

<style lang="scss" scoped>
$pi-error-color: #fa3534;
$pi-warning-color: #ff9900;
$pi-info-color: #909399;

.pi-tag {
  border-style: solid;
  &--circle {
    border-radius: 200rpx;
  }

  &--square {
    border-radius: 6rpx;
  }

  &__icon {
    margin-right: 8rpx;
  }

  &__text {
    &--mini {
      font-size: 24rpx;
      line-height: 24rpx;
    }

    &--medium {
      font-size: 26rpx;
      line-height: 26rpx;
    }

    &--large {
      font-size: 30rpx;
      line-height: 30rpx;
    }
  }

  &--mini {
    height: 44rpx;
    line-height: 44rpx;
    padding: 0 10rpx;
  }

  &--medium {
    height: 52rpx;
    line-height: 44rpx;
    padding: 0 20rpx;
  }

  &--large {
    height: 64rpx;
    line-height: 64rpx;
    padding: 0 30rpx;
  }
  &__text--primary,
  &__text--error,
  &__text--warning,
  &__text--success,
  &__text--info {
    color: #ffffff;
  }
  &--primary,
  &--error,
  &--warning,
  &--success,
  &--info,
  &--primary--plain,
  &--error--plain,
  &--warning--plain,
  &--success--plain,
  &--info--plain {
    border-width: 2rpx;
  }

  &--primary {
    background-color: $pi-primary-color;
    border-color: $pi-primary-color;
  }

  &--primary--plain {
    border-color: $pi-primary-color;
  }

  &--primary--plain--fill {
    background-color: #ecf5ff;
  }

  &__text--primary--plain {
    color: $pi-primary-color;
  }

  &--error {
    background-color: $pi-error-color;
    border-color: $pi-error-color;
  }

  &--error--plain {
    border-color: $pi-error-color;
  }

  &--error--plain--fill {
    background-color: #fef0f0;
  }

  &__text--error--plain {
    color: $pi-error-color;
  }

  &--warning {
    background-color: $pi-warning-color;
    border-color: $pi-warning-color;
  }

  &--warning--plain {
    border-color: $pi-warning-color;
  }

  &--warning--plain--fill {
    background-color: #fdf6ec;
  }

  &__text--warning--plain {
    color: $pi-warning-color;
  }

  &--success {
    background-color: $pi-fourth-color;
    border-color: $pi-fourth-color;
  }

  &--success--plain {
    border-color: $pi-fourth-color;
  }

  &--success--plain--fill {
    background-color: #f5fff0;
  }

  &__text--success--plain {
    color: $pi-fourth-color;
  }

  &--info {
    background-color: $pi-info-color;
    border-color: $pi-info-color;
  }

  &--info--plain {
    border-color: $pi-info-color;
  }

  &--info--plain--fill {
    background-color: #f4f4f5;
  }

  &__text--info--plain {
    color: $pi-info-color;
  }

  &__close {
    position: absolute;
    z-index: 999;
    top: 0;
    right: 0;
    border-radius: 200rpx;
    background-color: #c6c7cb;
    display: flex;
    align-items: center;
    justify-content: center;
    /* #ifndef APP-NVUE */
    transform: scale(0.6) translate(80%, -80%);
    /* #endif */
    /* #ifdef APP-NVUE */
    transform: scale(0.6) translate(50%, -50%);
    /* #endif */

    &--mini {
      width: 36rpx;
      height: 36rpx;
    }

    &--medium {
      width: 44rpx;
      height: 44rpx;
    }

    &--large {
      width: 50rpx;
      height: 50rpx;
    }
  }
}
</style>
