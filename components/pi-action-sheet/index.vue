<template>
  <pi-popup-select
    :value="val"
    :custom-style="getPopupSelect.customStyle"
    :custom-class="getPopupSelect.customClass"
    :height="getPopupSelect.height"
    :show-title="getPopupSelect.showTitle"
    :title="getPopupSelect.title"
    :title-padding="getPopupSelect.titlePadding"
    :toolbar-position="getPopupSelect.toolbarPosition"
    :on-confirm-close="getPopupSelect.onConfirmClose"
    :on-cancel-close="getPopupSelect.onCancelClose"
    :confirm-btn="getPopupSelect.confirmBtn"
    :cancel-btn="getPopupSelect.cancelBtn"
    :popup="getPopup"
    @close="handlePopupClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <slot name="header" />
    <!-- 描述列 -->
    <view
      v-if="description"
      class="pi-solid-bottom-2 pi-align-center pi-pd-32 pi-light-gray"
      :style="[getItemAlignStyle]"
    >
      {{ description }}
    </view>
    <view
      v-for="item in items"
      :id="`id-${item[keyField]}`"
      :key="item[keyField]"
      :style="[itemStyle, getItemStyle, getItemAlignStyle, { color: item.color }]"
      :class="{
        'pi-solid-bottom-1': showItemBottomBorder,
        'pi-disabled': item.disabled
      }"
      class="pi-align-center pi-fz-30 pi-pd-lr-32"
      hover-class="pi-hover-class"
      @tap.stop="handleSelectItem(item)"
    >
      <!-- 自定义列表项 -->
      <slot name="item" :item="item" class="pi-w-100P">
        <template v-if="!item.loading">
          {{ item[displayField] }}
        </template>
        <pi-loading v-else show />
      </slot>
    </view>
    <!-- 取消action -->
    <template v-if="cancelText">
      <pi-gap height="20" />
      <view
        class="pi-align-center pi-fz-30 pi-pd-32 pi-light-gray"
        hover-class="pi-hover-class"
        :style="[getItemAlignStyle]"
        @tap="handleCancel"
      >
        {{ cancelText }}
      </view>
    </template>

    <slot name="footer" />
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiActionSheet'
const { actionSheet } = getConfig()

const alignFlexMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

export default {
  name: 'PiActionSheet',
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
        return actionSheet.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return actionSheet.customClass
      }
    },
    // 选项列表
    items: {
      type: Array,
      // []
      default() {
        return actionSheet.items
      }
    },
    // 选项id字段
    keyField: {
      type: String,
      // 'id'
      default: actionSheet.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // 'text'
      default: actionSheet.displayField
    },
    // 自定义多列联动模式的children属性名
    childField: {
      type: String,
      // 'children'
      default: actionSheet.childField
    },
    // 行高 单位默认rpx
    itemHeight: {
      type: [String, Number],
      // 110
      default: actionSheet.itemHeight
    },
    // 是否显示item下边框
    showItemBottomBorder: {
      type: Boolean,
      // true
      default: actionSheet.showItemBottomBorder
    },
    // 行样式
    itemStyle: {
      type: Object,
      // {}
      default() {
        return actionSheet.itemStyle
      }
    },
    itemAlign: {
      type: String,
      // 'center'
      default: actionSheet.itemAlign,
      validator: function(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popup
        return actionSheet.popupSelect
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return actionSheet.popup
      }
    },
    // 选项上方的描述信息，不填则不显示
    description: {
      type: String,
      // ''
      default: actionSheet.description
    },
    // 取消按钮文字，不填则不显示
    cancelText: {
      type: String,
      // ''
      default: actionSheet.cancelText
    }
  },
  data() {
    return {}
  },
  computed: {
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(actionSheet.popupSelect, this.popupSelect)
    },
    getPopup() {
      const actionSheetPopup = this.$pi.lang.mergeDeep(actionSheet.popup, this.popupSelect.popup)
      return this.$pi.lang.mergeDeep(actionSheetPopup, this.popup)
    },
    getItemAlignStyle() {
      return {
        justifyContent: alignFlexMap[this.itemAlign]
      }
    },
    getItemStyle() {
      const itemHeight = this.$pi.common.addUnit(this.itemHeight)
      return {
        height: itemHeight,
        lineHeight: itemHeight
      }
    },
    indicatorStyle() {
      const itemHeight = uni.upx2px(this.itemHeight)
      return `height: ${itemHeight}px;line-height: ${itemHeight}px;`
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 弹窗关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    /**
     * @vuese
     * 取消选择
     */
    handleCancel() {
      this.$emit('cancel')
      this.getPopupSelect.onConfirmClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleSelectItem(item) {
      if (item.disabled) return
      this.$emit('select', item)
      this.getPopupSelect.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-action-sheet {
}
</style>
