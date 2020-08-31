<template>
  <pi-popup
    ref="popup"
    :value="val"
    position="center"
    :border-radius="borderRadius"
    :show-close-icon="showTitle && showCloseIcon"
    :close-icon-name="closeIconName"
    :close-icon-padding="closeIconPadding"
    :close-icon-color="closeIconColor"
    :close-icon-size="closeIconSize"
    :close-icon-position="closeIconPosition"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :duration="duration"
    :mask-closable="maskClosable"
    :hide-tab-bar="hideTabBar"
    :append-to-body="appendToBody"
    :z-index="zIndex"
    :mask-background="maskBackground"
    @close="handlePopupClose"
  >
    <view class="pi-modal" :style="[customStyle, modalStyle]" :class="[customClass]">
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
      </view>
      <!-- 内容区域 -->
      <view class="pi-flex-column-center pi-pd-24" :style="[contentStyle]">
        <slot v-if="$slots.default || $slots.$default" />
        <view v-else>{{ content }}</view>
      </view>

      <!-- 按钮区域 -->
      <view class="modal-footer pi-align-center pi-justify-center pi-pd-24">
        <slot v-if="$slots.footer" name="footer" />
        <template v-else>
          <pi-button
            v-if="showCancelButton"
            :color="cancelColor"
            :bg-color="cancelBgColor"
            class="pi-button"
            @tap="handleCancel"
          >
            {{ cancelText }}
          </pi-button>
          <pi-button
            v-if="showConfirmButton"
            :type="confirmBgColor ? 'default' : 'primary'"
            :color="confirmColor"
            :bg-color="confirmBgColor"
            class="pi-button"
            @tap="handleConfirm"
          >
            {{ confirmText }}
          </pi-button>
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

export default {
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return modal.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return modal.customClass
      }
    },
    // 是否点击确认的时候关闭弹窗（默认：'true'）
    onConfirmClose: {
      type: Boolean,
      default: modal.onConfirmClose
    },
    // 是否显示title（默认：true）
    showTitle: {
      type: Boolean,
      default: modal.showTitle
    },
    // 标题（默认：日期选择）
    title: {
      type: String,
      default: modal.title
    },
    // 标题 padding（默认：24rpx）
    titlePadding: {
      type: [String, Number],
      default: modal.titlePadding
    },
    // 弹窗宽度，可以是数值(rpx)，百分比，auto等
    width: {
      type: [Number, String],
      default: modal.width
    },
    // 弹窗内容
    content: {
      type: String,
      default: modal.content
    },
    // 内容的样式
    contentStyle: {
      type: Object,
      default() {
        return modal.contentStyle
      }
    },
    // 是否显示确认按钮
    showConfirmButton: {
      type: Boolean,
      default: modal.showConfirmButton
    },
    // 确认文案
    confirmText: {
      type: String,
      default: modal.confirmText
    },
    // 确认按钮颜色
    confirmColor: {
      type: String,
      default: modal.confirmColor
    },
    // 确认按钮颜色
    confirmBgColor: {
      type: String,
      default: modal.confirmBgColor
    },
    // 是否显示取消按钮
    showCancelButton: {
      type: Boolean,
      default: modal.showCancelButton
    },
    // 取消文案
    cancelText: {
      type: String,
      default: modal.cancelText
    },
    // 取消文字颜色
    cancelColor: {
      type: String,
      default: modal.cancelColor
    },
    cancelBgColor: {
      type: String,
      default: modal.cancelBgColor
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: modal.borderRadius
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: modal.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: modal.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: modal.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#c9c9c9'）
    closeIconColor: {
      type: String,
      default: modal.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: modal.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: modal.closeIconWeight
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: modal.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeAreaInsetTop: {
      type: Boolean,
      default: modal.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: modal.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: modal.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: modal.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: modal.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: modal.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: modal.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: modal.maskBackground
    }
  },
  data() {
    return {
      selected: {}
    }
  },
  computed: {
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
      this.$emit('close')
      this.handleEmitChange()
    },
    handleCancel() {
      this.$emit('cancel')
      this.handlePopupClose()
    },
    handleConfirm() {
      this.$emit('confirm')
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-footer {
  .pi-button {
    flex: 1;
    &:nth-child(2) {
      margin-left: 24rpx;
    }
  }
}
</style>
