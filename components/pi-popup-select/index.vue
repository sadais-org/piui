<template>
  <pi-popup
    ref="popup"
    :value="val"
    :custom-class="getPopup.customClass"
    :custom-style="getPopupCustomStyle"
    :position="getPopup.position"
    :border-radius="getPopup.borderRadius"
    :show-close-icon="showTitle && getPopup.showCloseIcon"
    :close-icon="getPopup.closeIcon"
    :safe-area-inset-bottom="getPopup.safeAreaInsetBottom"
    :mask="getPopup.mask"
    :hide-tab-bar="getPopup.hideTabBar"
    :append-to-body="getPopup.appendToBody"
    :z-index="getPopup.zIndex"
    :background="getPopup.background"
    @show="$emit('show')"
    @close="handlePopupClose"
  >
    <view class="pi-popup-select pi-flex-column" :style="[customStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <!-- 顶部操作条 -->
      <view
        v-if="toolbarPosition === 'top'"
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500 pi-pd-32"
      >
        <slot v-if="$slots.toolbar" name="toolbar" />
        <template v-else>
          <view class="item-btn" @tap.stop="handlePopupClose">取消</view>
          <view class="item-btn pi-primary" @tap.stop="handleConfirm">
            确定
          </view>
        </template>
      </view>
      <!-- 选择区域 -->
      <view class="pi-flex-sub pi-of-hidden">
        <slot />
      </view>
      <!-- 顶部操作条, 底部安全区域由popup控制 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'" :safe-area="false">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <view v-else class="pi-align-center">
          <view v-if="getCancelBtn.show" class="pi-button-wrap">
            <pi-button
              :custom-class="getCancelBtn.customClass"
              :custom-style="getCancelBtn.customStyle"
              :width="getCancelBtn.width"
              :size="getCancelBtn.size"
              :type="getCancelBtn.type"
              :plain="getCancelBtn.plain"
              :disabled="getCancelBtn.disabled"
              :loading="getCancelBtn.loading"
              :form-type="getCancelBtn.formType"
              :open-type="getCancelBtn.openType"
              :hover-class="getCancelBtn.hoverClass"
              :hover-start-time="getCancelBtn.hoverStartTime"
              :hover-stay-time="getCancelBtn.hoverStayTime"
              :app-parameter="getCancelBtn.appParameter"
              :hover-stop-propagation="getCancelBtn.hoverStopPropagation"
              :lang="getCancelBtn.lang"
              :session-from="getCancelBtn.sessionFrom"
              :send-message-title="getCancelBtn.sendMessageTitle"
              :send-message-path="getCancelBtn.sendMessagePath"
              :send-message-img="getCancelBtn.sendMessageImg"
              :show-message-card="getCancelBtn.showMessageCard"
              :color="getCancelBtn.color"
              :bg-color="getCancelBtn.bgColor"
              :round="getCancelBtn.round"
              :ripple="getCancelBtn.ripple"
              :ripple-bg-color="getCancelBtn.rippleBgColor"
              :debounce-timeout="getCancelBtn.debounceTimeout"
              @click="handleCancel"
            >
              {{ getCancelBtn.text }}
            </pi-button>
          </view>
          <view v-if="getConfirmBtn.show" class="pi-button-wrap">
            <pi-button
              :custom-class="getConfirmBtn.customClass"
              :custom-style="getConfirmBtn.customStyle"
              :width="getConfirmBtn.width"
              :size="getConfirmBtn.size"
              :type="getConfirmBtn.type"
              :plain="getConfirmBtn.plain"
              :disabled="getConfirmBtn.disabled"
              :loading="getConfirmBtn.loading"
              :form-type="getConfirmBtn.formType"
              :open-type="getConfirmBtn.openType"
              :hover-class="getConfirmBtn.hoverClass"
              :hover-start-time="getConfirmBtn.hoverStartTime"
              :hover-stay-time="getConfirmBtn.hoverStayTime"
              :app-parameter="getConfirmBtn.appParameter"
              :hover-stop-propagation="getConfirmBtn.hoverStopPropagation"
              :lang="getConfirmBtn.lang"
              :session-from="getConfirmBtn.sessionFrom"
              :send-message-title="getConfirmBtn.sendMessageTitle"
              :send-message-path="getConfirmBtn.sendMessagePath"
              :send-message-img="getConfirmBtn.sendMessageImg"
              :show-message-card="getConfirmBtn.showMessageCard"
              :color="getConfirmBtn.color"
              :bg-color="getConfirmBtn.bgColor"
              :round="getConfirmBtn.round"
              :ripple="getConfirmBtn.ripple"
              :ripple-bg-color="getConfirmBtn.rippleBgColor"
              :debounce-timeout="getConfirmBtn.debounceTimeout"
              @click="handleConfirm"
            >
              {{ getConfirmBtn.text }}
            </pi-button>
          </view>
        </view>
      </pi-bottom-bar>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiPopupSelect'
const { popupSelect } = getConfig()

export default {
  name: 'PiPopupSelect',
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
        return popupSelect.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return popupSelect.customClass
      }
    },
    // 工具条位置
    toolbarPosition: {
      // 'bottom', 'top', 'none'
      type: String,
      // 'bottom'
      default: popupSelect.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom', 'none'].includes(value)
      }
    },
    // 是否显示title
    showTitle: {
      type: Boolean,
      // false
      default: popupSelect.showTitle
    },
    // 标题
    title: {
      type: String,
      // '弹出选择'
      default: popupSelect.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // '32rpx'
      default: popupSelect.titlePadding
    },
    // 弹出选择层的宽度，默认100%
    width: {
      type: String,
      // '100%'
      default: popupSelect.width
    },
    // 弹出选择层的高度
    height: {
      type: String,
      // '60%'
      default: popupSelect.height
    },
    // 是否点击取消的时候关闭弹窗
    onCancelClose: {
      type: Boolean,
      // true
      default: popupSelect.onCancelClose
    },
    // 是否点击确认的时候关闭弹窗
    onConfirmClose: {
      type: Boolean,
      // true
      default: popupSelect.onConfirmClose
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return popupSelect.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return popupSelect.cancelBtn
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return popupSelect.popup
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    getConfirmBtn() {
      return this.$pi.lang.mergeDeep(popupSelect.confirmBtn, this.confirmBtn)
    },
    getCancelBtn() {
      return this.$pi.lang.mergeDeep(popupSelect.cancelBtn, this.cancelBtn)
    },
    getPopup() {
      return this.$pi.lang.mergeDeep(popupSelect.popup, this.popup)
    },
    getPopupCustomStyle() {
      return {
        width: this.$pi.common.addUnit(this.width),
        height: this.$pi.common.addUnit(this.height)
      }
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 关闭弹窗
      this.$emit('close')
      this.handleEmitChange()
    },
    /**
     * @vuese
     * 取消选择
     */
    handleCancel() {
      this.$emit('cancel')
      this.onCancelClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm() {
      this.$emit('confirm', this.popupSelected)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-popup-select {
  height: 100%;
  max-width: 960rpx;
  margin: 0 auto;
  .pi-button-wrap {
    flex: 1;
    &:nth-child(2) {
      margin-left: 24rpx;
    }
  }
}
</style>
