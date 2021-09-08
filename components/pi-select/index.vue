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
    :confirm-btn="getConfirmBtn"
    :cancel-btn="getCancelBtn"
    :popup="getPopup"
    @close="handlePopupClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <view class="pi-select pi-h-100P pi-flex-column" :style="[customStyle]" :class="[customClass]">
      <slot name="header" />
      <scroll-view scroll-y class="pi-scroll">
        <view
          v-for="item in getItems"
          :id="`id-${item[keyField]}`"
          :key="item[keyField]"
          :style="[itemStyle, getItemStyle]"
          :class="{
            'pi-solid-bottom-1': showItemBottomBorder,
            'disabled': item.disabled
          }"
          class="select-item pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
          @tap.stop="handleSelectItem(item)"
        >
          <!-- 自定义列表项 -->
          <slot name="item" :item="item" :selected="item.isSelected" class="pi-w-100P">
            <!-- item[displayField] -->
            {{ item[displayField] }}
          </slot>
          <!-- 如果配置了图片地址，使用图片 -->
          <pi-img
            v-if="getSelectedImg.src"
            :src="getSelectedImg.src"
            :mode="getSelectedImg.mode"
            :width="getSelectedImg.width"
            :height="getSelectedImg.height"
            :dot="getSelectedImg.dot"
            :dot-radius="getSelectedImg.dotRadius"
            :badge="getSelectedImg.badge"
            :shape="getSelectedImg.shape"
            :border-radius="getSelectedImg.borderRadius"
            :show-loading="getSelectedImg.showLoading"
            :loading-color="getSelectedImg.loadingColor"
            :loading-type="getSelectedImg.loadingType"
            :loading-size="getSelectedImg.loadingSize"
            :show-error="getSelectedImg.showError"
            :webp="getSelectedImg.webp"
          />
          <!-- 默认使用复选框 -->
          <pi-checkbox
            v-else
            readonly
            :value="item.isSelected"
            :name="getSelectedCheckbox.name"
            :shape="getSelectedCheckbox.shape"
            :border-radius="getSelectedCheckbox.borderRadius"
            :border="getSelectedCheckbox.border"
            :disabled="getSelectedCheckbox.disabled"
            :size="getSelectedCheckbox.size"
            :icon-size="getSelectedCheckbox.iconSize"
            :active-color="getSelectedCheckbox.activeColor"
            :active-mode="getSelectedCheckbox.activeMode"
          />
        </view>
      </scroll-view>
      <slot name="footer" />
    </view>
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiSelect'
const { select } = getConfig()

export default {
  name: 'PiSelect',
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
        return select.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return select.customClass
      }
    },
    // 选项列表
    items: {
      type: Array,
      // []
      default() {
        return select.items
      }
    },
    // 列表选项的唯一标识
    keyField: {
      type: String,
      // 'id'
      default: select.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // 'text'
      default: select.displayField
    },
    // 默认值，单选是传Object，多选时传Array
    defaultValue: {
      type: [Object, Array],
      // null
      default: select.defaultValue
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      // false
      default: select.isMulti
    },
    // 单选模式下，是否可取消选中
    singleCancel: {
      type: Boolean,
      // true
      default: select.singleCancel
    },
    // 行高 值为数字，则单位默认rpx
    itemHeight: {
      type: [String, Number],
      // 110
      default: select.itemHeight
    },
    // 是否显示item下边框
    showItemBottomBorder: {
      type: Boolean,
      // true
      default: select.showItemBottomBorder
    },
    // 行样式
    itemStyle: {
      type: Object,
      // {}
      default() {
        return select.itemStyle
      }
    },
    // 选中图标的配置
    selectedImg: {
      type: Object,
      default() {
        // 参照img
        return select.selectedImg
      }
    },
    // 选中checkbox配置
    selectedCheckbox: {
      type: Object,
      default() {
        // 参照checkbox
        return select.selectedCheckbox
      }
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popupSelect
        return select.popupSelect
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return select.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return select.cancelBtn
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return select.popup
      }
    }
  },
  data() {
    return {
      selected: {}
    }
  },
  computed: {
    getSelectedImg() {
      return this.$pi.lang.mergeDeep(select.selectedImg, this.selectedImg)
    },
    getSelectedCheckbox() {
      return this.$pi.lang.mergeDeep(select.selectedCheckbox, this.selectedCheckbox)
    },
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(select.popupSelect, this.popupSelect)
    },
    getConfirmBtn() {
      const selectConfirmBtn = this.$pi.lang.mergeDeep(
        select.confirmBtn,
        this.popupSelect.confirmBtn
      )
      return this.$pi.lang.mergeDeep(selectConfirmBtn, this.confirmBtn)
    },
    getCancelBtn() {
      const selectCancelBtn = this.$pi.lang.mergeDeep(select.cancelBtn, this.popupSelect.cancelBtn)
      return this.$pi.lang.mergeDeep(selectCancelBtn, this.cancelBtn)
    },
    getPopup() {
      const selectPopup = this.$pi.lang.mergeDeep(select.popup, this.popupSelect.popup)
      return this.$pi.lang.mergeDeep(selectPopup, this.popup)
    },
    getItemStyle() {
      const itemHeight = this.$pi.common.addUnit(this.itemHeight)
      return {
        height: itemHeight,
        lineHeight: itemHeight
      }
    },
    getItems() {
      return this.items.map(item => {
        let isSelected = false
        if (this.isMulti) {
          isSelected =
            this.$pi.lang.isArray(this.selected) &&
            this.selected.findIndex(s => s[this.keyField] === item[this.keyField]) !== -1
        } else {
          isSelected = this.selected[this.keyField] === item[this.keyField]
        }
        item.isSelected = isSelected
        return item
      })
    }
  },
  watch: {
    value(val) {
      val && this.init()
    }
  },
  methods: {
    init() {
      console.log(TAG, '初始化')
      let selected = this.$pi.lang.cloneDeep(this.defaultValue)
      if (!selected) {
        selected = this.isMulti ? [] : {}
      }
      this.selected = selected
    },
    handlePopupClose() {
      this.val = false
      // 关闭弹窗
      this.$emit('close')
      this.handleEmitChange()
    },
    handleSelectItem(item) {
      if (item.disabled) return
      if (!this.isMulti) {
        // 单选
        if (!this.singleCancel) {
          this.selected = item
          return
        }
        // 如果单选允许取消，需要判断是否点击了同一个选项
        const isSame =
          !this.$pi.lang.isEmpty(this.selected) &&
          this.selected[this.keyField] === item[this.keyField]
        // 如果当前已勾选，比较是否同一个，如果同一个就取消勾选
        this.selected = isSame ? {} : item
        return
      }
      // 多选
      const hasSelected =
        this.selected.findIndex(s => s[this.keyField] === item[this.keyField]) !== -1
      if (hasSelected) {
        this.selected = this.selected.filter(s => s[this.keyField] !== item[this.keyField])
      } else {
        this.selected.push(item)
      }
    },
    /**
     * @vuese
     * 全选或全清选择值
     * @arg selected=true 是否勾选
     * @arg nodes=[] 需要改变的节点，不填默认全部
     */
    toggleSelect(selected = true, nodes = []) {
      if (!this.isMulti) return
      if (!selected) {
        // 全清
        this.selected = []
        return
      }
      const toggleSelect = this.items.filter(item => {
        let toggleNode = true
        if (nodes.length) {
          toggleNode = nodes.findIndex(node => node[this.keyField] === item[this.keyField]) !== -1
        }
        return toggleNode && !item.disabled
      })
      if (!toggleSelect.length) return
      this.selected = toggleSelect
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
      this.$emit('confirm', this.selected)
      this.getPopupSelect.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-select {
  .select-item.disabled {
    opacity: $pi-disabled-opacity;
  }
  .pi-button-wrap {
    flex: 1;
    &:nth-child(2) {
      margin-left: 24rpx;
    }
  }
}
</style>
