<template>
  <view class="code-input-wrap" :style="[customStyle]" :class="[customClass]">
    <input
      class="code-input"
      type="number"
      :value="val"
      :focus="focus"
      :disabled="disabled"
      :maxlength="getLength"
      @focus="focus = true"
      @blur="focus = false"
      @input="handleInput"
    />
    <view class="labels pi-align-center" :class="[{ stretch }, getAlign]">
      <view
        v-for="(item, index) in getLength"
        :key="index"
        :style="[itemStyle, arrCode[index] ? fillStyle : {}]"
        class="label pi-flex-row-center"
        :class="{
          fill: currentIndex >= index,
          active: focus === true && index === currentIndex
        }"
        @tap="focus = true"
      >
        <!-- slot slot-scoped只支持app,h5,微信小程序平台 -->
        <!-- <template slot="item" slot-scope="{ item }">{{ item.tag }}</template> -->
        <slot
          name="item"
          :index="index"
          :item="arrCode[index]"
          :active="focus === true && index === currentIndex"
        >
          {{ arrCode[index] ? codeFormat || arrCode[index] || '' : '' }}
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'
const { codeInput } = getConfig()
const TAG = 'PiCodeInput'

const ALIGN_MAP = {
  left: 'pi-justify-start',
  right: 'pi-justify-end',
  center: 'pi-justify-center'
}

export default {
  name: 'PiCodeInput',
  mixins: [ValueSync],
  props: {
    // 初始值，接收一个长度为length的内容
    value: {
      type: [String, Number],
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return codeInput.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return codeInput.customClass
      }
    },
    // 每项验证码样式，对象形式
    itemStyle: {
      type: Object,
      // {}
      default() {
        return codeInput.customStyle
      }
    },
    // 已填项验证码样式，对象形式
    fillStyle: {
      type: Object,
      // {}
      default() {
        return codeInput.fillStyle
      }
    },
    // 长度
    length: {
      required: false,
      type: [String, Number],
      // 4
      default: codeInput.length
    },
    // 自动拉起键盘
    autoFocus: {
      required: false,
      type: Boolean,
      // false
      default: codeInput.autoFocus
    },
    // 自动拉起键盘延时
    autoFocusDelay: {
      required: false,
      type: [String, Number],
      // 350
      default: codeInput.autoFocusDelay
    },
    // 每项验证码是否均分宽度
    stretch: {
      type: Boolean,
      // false
      default() {
        return codeInput.stretch
      }
    },
    // 验证码对齐方向，可选值：left、center、right
    align: {
      type: String,
      // left
      default() {
        return codeInput.align
      },
      validator: function(value) {
        return ['right', 'left', 'center'].includes(value)
      }
    },
    // 验证码显示格式化
    codeFormat: {
      type: String,
      default() {
        return codeInput.codeFormat
      }
    }
  },
  data() {
    return {
      focus: false,
      disabled: false,
      data() {
        return {
          val: this.value
        }
      }
    }
  },
  computed: {
    getLength() {
      return parseInt(this.length, 10)
    },
    getAutoFocusDelay() {
      return parseInt(this.autoFocusDelay, 10)
    },
    arrCode: function() {
      return this.val ? this.val.toString().split('') : []
    },
    currentIndex: function() {
      return this.val ? this.val.toString().length - 1 : 0
    },
    getAlign() {
      return ALIGN_MAP[this.align]
    }
  },
  mounted() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.focus = true
      }, this.getAutoFocusDelay)
    }
  },
  methods: {
    handleInput(e) {
      const value = e.detail.value
      const val = value.replace(/[^\d]/g, '') // 限制非数字
      if (value.length <= this.getLength) {
        this.val = val
        this.handleEmitChange()
      }
      if (value.length === this.getLength) {
        /**
         * 当输入的数字位数与length属性相等时触发
         * @arg string 输入的数字
         */
        this.$emit('end', this.val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes flicker {
  100% {
    opacity: 0;
  }
}

.code-input-wrap {
  position: relative;
  width: 100%;
  .code-input {
    position: absolute;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -100%; /* 输入框光标起始点向左左移 */
    overflow: hidden;
    font-size: 35rpx;
    text-indent: -999em; /* 文本向左缩进 */
    border: none;
    outline: none;
    opacity: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .labels {
    -webkit-tap-highlight-color: transparent; // 解决ios点击灰色阴影的问题

    .label {
      position: relative;
      width: 84rpx;
      height: 84rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #666666;
      text-align: center;
      border: 4rpx solid #cccccc;
      border-radius: 8px;
      transition: all $pi-animation-duration $pi-animation-timing-function;
      &:not(:last-child) {
        margin-right: 24rpx;
      }
      &.fill {
        color: $pi-primary-color;
        border-color: $pi-primary-color;
      }
      &.active::after {
        position: absolute;
        top: 50%;
        left: 70%;
        width: 2rpx;
        height: 50%;
        // 伪类实现光标效果
        content: '';
        background: currentColor;
        transform: translate(-50%, -50%);
        animation: 1s flicker infinite;
      }
    }
    &.stretch {
      justify-content: space-around;
      margin-right: 0;
    }
  }
}
</style>
