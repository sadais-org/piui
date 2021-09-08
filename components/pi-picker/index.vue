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
    <slot name="header" />
    <picker-view
      v-if="val"
      class="pi-text-center pi-h-100P"
      :style="[customStyle]"
      :class="[customClass]"
      :indicator-style="indicatorStyle"
      :value="pickerValue"
      @pickstart="handlePickstart"
      @pickend="handlePickend"
      @change="handlePickerChange"
    >
      <picker-view-column v-for="(column, index) in columns" :key="index">
        <view v-for="item in column" :key="item[keyField]" :style="indicatorStyle">
          {{ item[displayField] }}
        </view>
      </picker-view-column>
    </picker-view>
    <slot name="footer" />
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiPicker'
const { picker } = getConfig()

/**
 * 注意： default-value数组的长度，必须与列数相同，否则无效。
 * 单列模式 如设置default-value为[1]表示默认选中第2个(从0开始)，[5]表示选中第6个。
 * 多列模式 如设置default-value为[1, 3]表示第一列默认选中第2个，第二列默认选中第4个。
 */
export default {
  name: 'PiPicker',
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
        return picker.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return picker.customClass
      }
    },
    // 选项列表
    items: {
      type: Array,
      // []
      default() {
        return picker.items
      }
    },
    // 选项id字段
    keyField: {
      type: String,
      // 'id'
      default: picker.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // 'text'
      default: picker.displayField
    },
    // 自定义多列联动模式的children属性名
    childField: {
      type: String,
      // 'children'
      default: picker.childField
    },
    // 默认值，单选是传Object，多选时传Array
    defaultValue: {
      type: Array,
      // null
      default: picker.defaultValue
    },
    // 选择器类型
    type: {
      // 'single', 'multi', 'multi-auto'
      type: String,
      // 'single'
      default: picker.type,
      validator: function(value) {
        return ['single', 'multi', 'multi-auto'].includes(value)
      }
    },
    // 行高 单位默认rpx
    itemHeight: {
      type: [String, Number],
      // 110
      default: picker.itemHeight
    },
    // 是否显示item下边框
    showItemBottomBorder: {
      type: Boolean,
      // true
      default: picker.showItemBottomBorder
    },
    // 行样式
    itemStyle: {
      type: Object,
      // {}
      default() {
        return picker.itemStyle
      }
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popup
        return picker.popupSelect
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return picker.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return picker.cancelBtn
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return picker.popup
      }
    }
  },
  data() {
    return {
      pickerValue: [],
      scrolling: false // picker是否在滚动中，小程序在scrolling中点确定，选择的项目不正确
    }
  },
  computed: {
    getPopupSelect() {
      return this.$pi.lang.mergeDeep(picker.popupSelect, this.popupSelect)
    },
    getConfirmBtn() {
      const pickerConfirmBtn = this.$pi.lang.mergeDeep(
        picker.confirmBtn,
        this.popupSelect.confirmBtn
      )
      const mergeConfirmBtn = this.$pi.lang.mergeDeep(pickerConfirmBtn, this.confirmBtn)
      if (!mergeConfirmBtn.disabled) {
        mergeConfirmBtn.disabled = this.scrolling
      }
      return mergeConfirmBtn
    },
    getCancelBtn() {
      const pickerCancelBtn = this.$pi.lang.mergeDeep(picker.cancelBtn, this.popupSelect.cancelBtn)
      return this.$pi.lang.mergeDeep(pickerCancelBtn, this.cancelBtn)
    },
    getPopup() {
      const pickerPopup = this.$pi.lang.mergeDeep(picker.popup, this.popupSelect.popup)
      return this.$pi.lang.mergeDeep(pickerPopup, this.popup)
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
    },
    columns() {
      if (this.type === 'single') return [this.items]
      if (this.type === 'multi') return this.items
      if (this.type === 'multi-auto') {
        let columns = this.items
        return this.pickerValue.map((value, index) => {
          const returnValue = [...columns]
          const column = columns[value]
          if (column[this.childField] && column[this.childField].length) {
            columns = column[this.childField]
          }
          return returnValue
        })
      }

      return this.items
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        // 每次弹窗显示，进行数据初始化
        value && this.init()
      }
    }
  },
  methods: {
    init() {
      if (this.defaultValue) {
        this.pickerValue = this.defaultValue
      } else {
        if (this.type === 'single') this.pickerValue = [0]
        if (this.type === 'multi') return (this.pickerValue = [0, 0])
        if (this.type === 'multi-auto') {
          let count = 1
          let column = this.items
          // 只要有元素并且第一个元素有children属性，继续历遍
          while (column[0][this.childField]) {
            column = column[0] ? column[0][this.childField] : {}
            count++
          }
          this.pickerValue = new Array(count).fill(0)
        }
      }
    },
    handlePickstart() {
      this.scrolling = true
    },
    // 标识滑动结束
    handlePickend() {
      this.scrolling = false
    },
    handlePopupClose() {
      this.val = false
      // 弹窗关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handlePickerChange(e) {
      let pickerValue = e.detail.value

      if (this.type === 'multi-auto') {
        // 如果是多列联动，pickerValue的值需要重新生成
        // 第几列发生变化
        let columnIndex = this.pickerValue.findIndex((p, i) => pickerValue[i] !== p)
        pickerValue = pickerValue.slice(0, columnIndex + 1)
        let columnValue = pickerValue[columnIndex]
        let columns = this.columns[columnIndex]
        let column = columns[columnValue]
        while (column[this.childField]) {
          columns = column[this.childField]
          column = columns[0]
          columnIndex++
          pickerValue[columnIndex] = 0
        }
      }
      this.pickerValue = pickerValue
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
      if (this.scrolling) return
      this.$emit('confirm', this.pickerValue)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-picker {
  height: 50vh;
}
</style>
