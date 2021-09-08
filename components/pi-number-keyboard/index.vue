<template>
  <pi-popup-select
    :value="show"
    :custom-style="getPopupSelect.customStyle"
    :custom-class="getPopupSelect.customClass"
    :height="getPopupSelect.height"
    :show-title="getPopupSelect.showTitle"
    :title="getPopupSelect.title"
    :title-padding="getPopupSelect.titlePadding"
    :toolbar-position="getPopupSelect.toolbarPosition"
    :popup="getPopup"
    @close="handlePopupClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <slot name="header" />
    <view
      class="pi-pd-bottom-32"
      :style="[{ backgroundColor: backgroundColor }, customStyle]"
      :class="[getPopupSelect.showTitle ? 'pi-pd-top-12' : 'pi-pd-top-60', customClass]"
    >
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
              :ripple="false"
              hover-class="pi-hover-class"
              width="100%"
              :bg-color="index < 11 ? keyBackgroundColor : 'transparent'"
              :custom-style="keyboardKeyStyle"
              @click="handleKeyClick(keys[index])"
            >
              <template v-if="index < 11">{{ keys[index] }}</template>
              <pi-icon v-else name="backspace" size="64" />
            </pi-button>
          </view>
        </pi-grid-item>
      </pi-grid>
      <slot name="footer" />
    </view>
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiNumberKeyboard'
const { numberKeyboard } = getConfig()

export default {
  name: 'PiNumberKeyboard',
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
      default: numberKeyboard.keyBackgroundColor
    },
    // 按键自定义样式，对象形式（默认值：{}）
    keyStyle: {
      type: Object,
      default() {
        return numberKeyboard.keyStyle
      }
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popup
        return numberKeyboard.popupSelect
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return numberKeyboard.popup
      }
    }
  },
  computed: {
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(numberKeyboard.popupSelect, this.popupSelect)
    },
    getPopup() {
      const numberKeyboardPopup = this.$pi.lang.mergeDeep(
        numberKeyboard.popup,
        this.popupSelect.popup
      )
      return this.$pi.lang.mergeDeep(numberKeyboardPopup, this.popup)
    },
    keys() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, this.extraKey, 0, 'backspace']
    },
    keyboardKeyStyle() {
      const styles = {
        fontSize: '44rpx',
        height: '100rpx',
        lineHeight: '100rpx',
        ...this.keyStyle
      }
      return styles
    }
  },
  methods: {
    handlePopupClose() {
      this.$emit('close')
    },
    handleKeyClick(key) {
      if (key === 'backspace') {
        this.val = this.val.slice(0, this.val.length - 1)
      } else {
        this.val = this.val.toString() + key
      }
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
