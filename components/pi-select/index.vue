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
    @closed="$emit('closed', $event)"
    @show="$emit('show', $event)"
    @showed="$emit('showed', $event)"
  >
    <view class="pi-select pi-h-100P pi-flex-column" :style="[customStyle]" :class="[customClass]">
      <slot name="header" />
      <view
        v-if="showSelectAll"
        class="select-item pi-align-center pi-justify-end pi-pd-lr-32"
        :style="[itemStyle, getItemStyle]"
        @tap.stop="handleSelectAll"
      >
        <view>全选</view>
        <view>
          <pi-checkbox
            :value="isSelectAll"
            readonly
            shape="round"
            custom-class="pi-mg-left-32"
            active-mode="fill-circle"
          />
        </view>
      </view>
      <scroll-view
        scroll-y
        class="pi-scroll"
        :scroll-into-view="getFirstSelectedId"
        scroll-with-animation
      >
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
            <view>
              <view class="select-item-title">{{ item[displayField] }}</view>
              <view v-if="item[descField]" class="pi-light-gray pi-fz-24 pi-mg-top-10 pi-lh-30">
                {{ item[descField] }}
              </view>
            </view>
          </slot>
          <!-- 如果配置了图片地址，使用图片 -->
          <pi-img
            v-if="getSelectedImg.src && item.isSelected"
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
            custom-class="pi-mg-left-32"
          />
          <!-- 默认使用复选框 -->
          <pi-checkbox
            v-if="!getSelectedImg.src"
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
            custom-class="pi-mg-left-32"
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
    // 描述显示字段，默认为desc
    descField: {
      type: String,
      // 'desc'
      default: select.descField
    },
    // 默认值，单选是传Number, String, Object，多选时传Array
    defaultValue: {
      type: [Number, String, Object, Array],
      // null
      default: select.defaultValue
    },
    // 是否只绑定keyField的默认值，默认false
    keyDefaultValue: {
      type: Boolean,
      default: select.keyDefaultValue
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      // false
      default: select.isMulti
    },
    // 是否显示全选（多选isMulti开启的情况下）
    showSelectAll: {
      type: Boolean,
      // false
      default: select.showSelectAll
    },
    // 单选模式下，是否可取消选中
    singleCancel: {
      type: Boolean,
      // true
      default: select.singleCancel
    },
    // 单选模式下，是否直接选中，不需要点击确认按钮
    singleConfirm: {
      type: Boolean,
      // false
      default: select.singleConfirm
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
      // 当前选中的值
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
      const popupSelect = this.$pi.lang.mergeDeep(select.popupSelect, this.popupSelect)
      if (!this.singleCancel && this.singleConfirm) {
        popupSelect.toolbarPosition = 'none'
      }
      return popupSelect
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
      return {
        height: this.$pi.common.addUnit(this.itemHeight)
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
    },
    getFirstSelectedId() {
      const firstSelected = this.selected[0] || this.selected
      const firstSelectedId = firstSelected[this.keyField]
      return firstSelectedId ? `id-${firstSelected[this.keyField]}` : ''
    },
    isSelectAll() {
      return this.getItems.every(item => item.isSelected)
    }
  },
  watch: {
    value(val) {
      val && this.init()
    }
  },
  methods: {
    valid() {
      if (!this.$pi.lang.isEmpty(this.defaultValue)) {
        if (this.isMulti && !this.$pi.lang.isArray(this.defaultValue)) {
          console.error(TAG, '多选模式下defaultValue必须为数组类型')
          return false
        }
        if (this.isMulti && this.$pi.lang.isArray(this.defaultValue)) {
          const isArrayObject = this.defaultValue.every(item => {
            return this.$pi.lang.isObject(item)
          })
          if (this.keyDefaultValue && isArrayObject) {
            console.error(TAG, 'keyDefaultValue模式下defaultValue不能为对象数组类型')
            return false
          }
          if (!this.keyDefaultValue && !isArrayObject) {
            console.error(TAG, '非keyDefaultValue模式下defaultValue必须为对象数组类型')
            return false
          }
        }
        if (!this.isMulti) {
          if (this.keyDefaultValue && this.$pi.lang.isObject(this.defaultValue)) {
            console.error(TAG, 'keyDefaultValue模式下defaultValue不能为对象类型')
            return false
          }
          if (
            !this.keyDefaultValue &&
            (!this.$pi.lang.isObject(this.defaultValue) || this.$pi.lang.isArray(this.defaultValue))
          ) {
            console.error(TAG, '非keyDefaultValue模式下defaultValue必须为对象类型')
            return false
          }
        }
      }
      return true
    },
    init() {
      if (!this.valid()) {
        return console.error(TAG, '默认值校验失败，跳过初始化')
      }
      console.log(TAG, '初始化')
      let selected = this.isMulti ? [] : {}
      if (!this.$pi.lang.isEmpty(this.defaultValue)) {
        // 如果有默认值，进行初始化
        if (!this.keyDefaultValue) {
          selected = this.$pi.lang.cloneDeep(this.defaultValue)
        } else {
          // 非对象类型构造成对象类型处理
          if (this.isMulti && this.$pi.lang.isArray(this.defaultValue)) {
            selected = this.defaultValue.map(item => ({
              [this.keyField]: item
            }))
          }
          if (!this.isMulti && !this.$pi.lang.isObject(this.defaultValue)) {
            selected = {
              [this.keyField]: this.defaultValue
            }
          }
        }
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
          if (this.singleConfirm) {
            setTimeout(() => {
              this.handleConfirm()
            }, 300)
          }
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
      this.getPopupSelect.onCancelClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm() {
      let selected = this.selected
      if (!this.$pi.lang.isEmpty(selected) && this.keyDefaultValue) {
        // 非对象类型返回值，返回值处理成非对象类型
        if (this.$pi.lang.isArray(selected)) {
          selected = selected.map(item => item[this.keyField])
        } else if (this.$pi.lang.isObject(selected)) {
          selected = selected[this.keyField]
        }
      }
      this.$emit('confirm', selected, this.selected)
      this.getPopupSelect.onConfirmClose && this.handlePopupClose()
    },
    handleSelectAll() {
      if (this.isMulti) {
        this.selected = this.isSelectAll ? [] : [...this.items]
      }
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
