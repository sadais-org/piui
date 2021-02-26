<template>
  <pi-popup
    ref="popup"
    :value="show"
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
    <view
      class="pi-numberKeyboard pi-flex-column"
      :style="[customStyle, { height: getHeight }]"
      :class="[customClass]"
    >
      <!-- 顶部操作条 -->
      <view
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <slot v-if="$slots.toolbar" name="toolbar" />
        <template v-else>
          <view class="item-btn" @tap.stop="handlePopupClose">取消</view>
          <slot name="title">
            {{ title }}
          </slot>
          <view class="item-btn pi-primary" @tap.stop="handleConfirm">确定</view>
        </template>
      </view>
      <!-- 选择区域 -->
      <pi-grid col="3" gap="24" :border="false" hover-class="none" custom-class="pi-pd-lr-24">
        <!-- 固定生成12个坑位 -->
        <pi-grid-item
          v-for="(key, index) in $pi.common.generateArray(0, 11)"
          :key="key"
          :index="index"
        >
          <view v-if="keys[index] !== ''" class="keyboard-key">
            <pi-button
              width="100%"
              :bg-color="index < 11 ? keyBackgroundColor : 'transparent'"
              :custom-style="{ fontSize: '44rpx', height: '100rpx', lineHeight: '100rpx' }"
              @click="handleKeyClick"
            >
              <template v-if="index < 11">{{ keys[index] }}</template>
              <pi-icon v-else name="backspace" size="64" />
            </pi-button>
          </view>
        </pi-grid-item>
      </pi-grid>
    </view>
  </pi-popup>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiNumberKeyboard'
const { numberKeyboard } = getConfig()

export default {
  name: 'NumberKeyboard',
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
        return numberKeyboard.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return numberKeyboard.customClass
      }
    },
    // 是否显示键盘
    show: {
      type: Boolean,
      default() {
        return numberKeyboard.show
      }
    },
    // 是否点击确认的时候关闭弹窗（默认：'true'）
    onConfirmClose: {
      type: Boolean,
      default: numberKeyboard.onConfirmClose
    },
    // 是否显示title（默认：true）
    showTitle: {
      type: Boolean,
      default: numberKeyboard.showTitle
    },
    // 标题（默认：日期选择）
    title: {
      type: String,
      default: numberKeyboard.title
    },
    // 标题 padding（默认：24rpx）
    titlePadding: {
      type: [String, Number],
      default: numberKeyboard.titlePadding
    },
    // 左下角额外的键
    extraKey: {
      type: String,
      // ''
      default: numberKeyboard.extraKey
    },
    // 键盘背景颜色
    backgroundColor: {
      type: String,
      // ''
      default: numberKeyboard.backgroundColor
    },
    // 按键背景颜色
    keyBackgroundColor: {
      type: String,
      // ''
      default: numberKeyboard.backgroundColor
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: numberKeyboard.borderRadius
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: numberKeyboard.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: numberKeyboard.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: numberKeyboard.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#666666'）
    closeIconColor: {
      type: String,
      default: numberKeyboard.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: numberKeyboard.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: numberKeyboard.closeIconWeight
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: numberKeyboard.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeAreaInsetTop: {
      type: Boolean,
      default: numberKeyboard.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: numberKeyboard.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: numberKeyboard.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: numberKeyboard.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: numberKeyboard.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: numberKeyboard.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: numberKeyboard.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: numberKeyboard.maskBackground
    }
  },
  computed: {
    keys() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, this.extraKey, 0]
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
    },
    keyboardKeyStyle() {
      const styles = {}
      styles.backgroundColor = this.keyBackgroundColor
      return styles
    }
  },
  methods: {
    handlePopupClose() {
      this.$emit('close')
    },
    handleKeyClick() {},
    handleConfirm() {
      this.$emit('confirm', this.numberKeyboarded)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-numberKeyboard {
  height: 50vh;
}
</style>
