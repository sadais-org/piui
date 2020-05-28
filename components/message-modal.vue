<template>
  <mask-content
    :is-show="isShow"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    @close="handleClose"
  >
    <view class="modal pi-content" :style="{ width: width }" @tap.stop>
      <view class="title">
        <text>{{ title }}</text>
        <view v-if="showCloseBtn" class="pi-icon-close close" @tap.stop="handleClose" />
      </view>
      <view v-if="content" class="content" :style="{ textIndent: contentIndent }">
        {{ content }}
      </view>
      <slot v-else>
        <!-- 当content传入的时候,以content为主,适合特殊样式 -->
      </slot>
      <view v-if="showBtns" class="btns">
        <button
          v-for="(btn, index) in btns"
          :key="index"
          :style="btn.style"
          :open-type="btn.openType"
          @tap="handleBtnClick(index)"
        >
          {{ btn.text }}
        </button>
      </view>
    </view>
  </mask-content>
</template>

<script>
import MaskContent from '@/src/PiUI-basic/components/mask-content.vue'

export default {
  components: {
    MaskContent
  },
  props: {
    // 是否显示
    isShow: {
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
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      default: false
    },
    // 是否显示关闭按钮
    showCloseBtn: {
      required: false,
      type: Boolean,
      default: true
    },
    // 是否显示dialog按钮
    showBtns: {
      required: false,
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default() {
        return '提示'
      }
    },
    content: {
      type: String
    },
    contentIndent: {
      type: String,
      default() {
        return '2em'
      }
    },
    btns: {
      type: Array,
      default() {
        return [
          {
            key: 'cancel',
            text: '取消',
            style: 'color: rgba(24, 144, 255, 1);'
          },
          {
            key: 'confirm',
            text: '确定',
            style:
              'color: #ffffff;background: linear-gradient(90deg, rgba(53, 195, 255, 1) 0%, rgba(24, 144, 255, 1) 100%);'
          }
        ]
      }
    },
    width: {
      type: [String, Number],
      default() {
        return '622rpx'
      }
    }
  },
  data() {
    return {}
  },
  computed: {},

  methods: {
    handleBtnClick(index) {
      const btn = this.btns[index]
      this.$emit('btnClick', btn)
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  max-height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  .title {
    position: relative;
    width: 100%;
    margin-bottom: 24rpx;
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
    .close {
      position: absolute;
      top: 50%;
      right: 0;
      font-size: 44rpx;
      font-weight: 500;
      color: #999999;
      transform: translateY(-50%);
    }
  }
  .content {
    min-height: 200rpx;
    padding: 20rpx 0;
    font-size: 32rpx;
    line-height: 1.5;
    color: #666666;
  }
  .btns {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 24rpx;
    button {
      flex: 1;
      height: 88rpx;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 88rpx;
      background: rgba(231, 242, 255, 1);
      border-radius: 8rpx;
    }
    button:not(:first-child) {
      margin-left: 24rpx;
      color: rgba(24, 144, 255, 1);
    }
    button:last-child {
      color: rgba(255, 255, 255, 1);
      background: linear-gradient(90deg, rgba(53, 195, 255, 1) 0%, rgba(24, 144, 255, 1) 100%);
    }
  }
}
</style>
