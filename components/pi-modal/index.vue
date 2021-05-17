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
        v-if="$slots.footer || showCancelButton || showConfirmButton"
        class="modal-footer pi-align-center pi-justify-center pi-pd-24"
      >
        <!-- 按钮区域 -->
        <slot v-if="$slots.footer" name="footer" />
        <template v-else>
          <view v-if="showCancelButton" class="pi-button-wrap">
            <pi-button
              :color="cancelColor"
              :bg-color="cancelBgColor"
              custom-class="pi-w-100P"
              @click="handleCancel"
            >
              {{ cancelText }}
            </pi-button>
          </view>
          <view v-if="showConfirmButton" class="pi-button-wrap">
            <pi-button
              :type="confirmBgColor ? 'default' : 'primary'"
              :color="confirmColor"
              :bg-color="confirmBgColor"
              custom-class="pi-w-100P"
              @click="handleConfirm"
            >
              {{ confirmText }}
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
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      // true
      default: modal.showConfirmButton
    },
    // 确认文案
    confirmText: {
      type: String,
      // '确认'
      default: modal.confirmText
    },
    // 确认按钮文字颜色
    confirmColor: {
      type: String,
      // '#ffffff'
      default: modal.confirmColor
    },
    // 确认按钮背景色
    confirmBgColor: {
      type: String,
      // ''
      default: modal.confirmBgColor
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      // true
      default: modal.showCancelButton
    },
    // 取消文案
    cancelText: {
      type: String,
      // '取消'
      default: modal.cancelText
    },
    // 取消文字颜色
    cancelColor: {
      type: String,
      // '#666666'
      default: modal.cancelColor
    },
    // 取消按钮背景色
    cancelBgColor: {
      type: String,
      // ''
      default: modal.cancelBgColor
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
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
