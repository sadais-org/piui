<template>
  <pi-popup
    ref="popup"
    :value="val"
    position="center"
    :border-radius="getPopup.borderRadius"
    :show-close-icon="showTitle && getPopup.showCloseIcon"
    :close-icon="getPopup.closeIcon"
    :safe-area-inset-bottom="getPopup.safeAreaInsetBottom"
    :mask="getPopup.mask"
    :hide-tab-bar="getPopup.hideTabBar"
    :append-to-body="getPopup.appendToBody"
    :z-index="getPopup.zIndex"
    :background="getPopup.background"
    @close="handlePopupClose"
  >
    <view class="pi-modal" :style="[customStyle, modalStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <!-- title -->
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <!-- 内容区域 -->
      <view class="pi-flex-column-center pi-pd-24 modal-content">
        <!-- 内容插槽 -->
        <slot v-if="$slots.default || $slots.$default" />
        <view v-else :style="[contentStyle]">{{ content }}</view>
      </view>

      <!-- 按钮区域 -->
      <view
        v-if="$slots.footer || getCancelBtn.show || getConfirmBtn.show"
        class="modal-footer pi-align-center pi-justify-center pi-pd-24"
      >
        <!-- 按钮区域 -->
        <slot v-if="$slots.footer" name="footer" />
        <template v-else>
          <view v-if="getCancelBtn.show" class="pi-button-wrap">
            <pi-button
              :color="getCancelBtn.color"
              :bg-color="getCancelBtn.bgColor"
              custom-class="pi-w-100P"
              @click="handleCancel"
            >
              {{ getCancelBtn.text }}
            </pi-button>
          </view>
          <view v-if="getConfirmBtn.show" class="pi-button-wrap">
            <pi-button
              :type="getConfirmBtn.bgColor ? 'default' : 'primary'"
              :color="getConfirmBtn.color"
              :bg-color="getConfirmBtn.bgColor"
              custom-class="pi-w-100P"
              @click="handleConfirm"
            >
              {{ getConfirmBtn.text }}
            </pi-button>
          </view>
        </template>
      </view>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiModal'
const { modal } = getConfig()

// 模态弹窗
export default {
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      // {}
      default() {
        return modal.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return modal.customClass
      }
    },
    // 是否点击确认的时候关闭弹窗
    onConfirmClose: {
      type: Boolean,
      // true
      default: modal.onConfirmClose
    },
    // 是否显示title
    showTitle: {
      type: Boolean,
      // true
      default: modal.showTitle
    },
    // 标题
    title: {
      type: String,
      // '弹出选择'
      default: modal.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // '32rpx'
      default: modal.titlePadding
    },
    // 弹窗宽度 不带单位 则默认rpx
    width: {
      type: [Number, String],
      // 600
      default: modal.width
    },
    // 弹窗内容
    content: {
      type: String,
      // '内容'
      default: modal.content
    },
    // 内容的样式
    contentStyle: {
      type: Object,
      // {}
      default() {
        return modal.contentStyle
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Boolean,
      default: modal.confirmBtn
    },
    // 取消按钮配置
    cancelBtn: {
      type: Boolean,
      default: modal.cancelBtn
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return modal.popup
      }
    }
  },
  data() {
    return {
      selected: {}
    }
  },
  computed: {
    getPopup() {
      return this.$pi.lang.mergeDeep(modal.popup, this.popup)
    },
    getConfirmBtn() {
      return this.$pi.lang.mergeDeep(modal.confirmBtn, this.confirmBtn)
    },
    getCancelBtn() {
      return this.$pi.lang.mergeDeep(modal.cancelBtn, this.cancelBtn)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
    modalStyle() {
      return {
        width: this.$pi.common.addUnit(this.width)
      }
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 点击关闭按钮时触发
      this.$emit('close')
      this.handleEmitChange()
    },
    handleCancel() {
      // 点击取消按钮时触发
      this.$emit('cancel')
      this.handlePopupClose()
    },
    handleConfirm() {
      // 点击确定按钮时触发
      this.$emit('confirm')
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-footer {
  .modal-content {
    line-height: 1.5;
  }
  .pi-button-wrap {
    flex: 1;
    &:nth-child(2) {
      margin-left: 24rpx;
    }
  }
}
</style>
