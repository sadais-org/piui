<template>
  <view class="code-wrap">
    <input
      class="code"
      type="number"
      :value="val"
      :focus="focus"
      :disabled="disabled"
      :maxlength="length"
      @focus="focus = true"
      @blur="focus = false"
      @input="handleInput"
    />
    <view
      class="labels pi-grid pi-col-space-16"
      :class="{
        'pi-col-2': length === 2,
        'pi-col-3': length === 3,
        'pi-col-4': length === 4,
        'pi-col-5': length === 5,
        'pi-col-6': length === 6
      }"
    >
      <view
        v-for="(item, index) in length"
        :key="index"
        class="label"
        :class="{ active: focus === true && index === currentIndex }"
        @tap="focus = true"
      >
        <view>{{ arrCode[index] || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import ValueMixin from '../mixin/value-mixin.js'

export default {
  name: 'DigitalInput',
  mixins: [ValueMixin],
  props: {
    // 长度
    length: {
      required: false,
      type: Number,
      default: 4
    },
    autoFocus: {
      required: false,
      type: Boolean,
      default: false
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
    arrCode: function() {
      return this.val.split('')
    },
    currentIndex: function() {
      return this.val.length
    }
  },
  mounted() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.focus = true
      }, 200)
    }
  },
  methods: {
    handleInput(e) {
      const value = e.detail.value
      const val = value.replace(/[^\d]/g, '') // 限制非数字
      this.$emit('change', this.val)
      if (value.length <= this.length) {
        this.val = val
      }
      if (value.length === this.length) {
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

.code-wrap {
  position: relative;
  width: 100%;
  .code {
    position: absolute;
    right: 0;
    left: 0;
    width: 100%;
    height: 98rpx;
    overflow: hidden;
    font-size: 35rpx;
    border: none;
    outline: none;
    opacity: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .labels {
    -webkit-tap-highlight-color: transparent; // 解决ios点击灰色阴影的问题
  }
  .label {
    position: relative;
    height: 98rpx;
    font-size: 48rpx;
    font-weight: 500;
    line-height: 98rpx;
    color: #313131;
    text-align: center;
    border-bottom: 2rpx solid #eeeeee;
    &.active::after {
      position: absolute;
      top: 50%;
      width: 4rpx;
      height: 50%;
      // 伪类实现光标效果
      content: ' ';
      background: #666666;
      transform: translateY(-50%);
      animation: 1s flicker infinite;
    }
  }
}
</style>
