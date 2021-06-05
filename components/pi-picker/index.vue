<template>
  <pi-popup
    ref="popup"
    :value="val"
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
    @close="handlePopupClose"
  >
    <view
      class="pi-picker pi-flex-column"
      :style="[customStyle, { height: getHeight }]"
      :class="[customClass]"
    >
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <!-- 标题 -->
        <slot name="title">
          <!-- 默认：prop tite -->
          {{ title }}
        </slot>
      </view>
      <!-- 顶部操作条 -->
      <view
        v-if="toolbarPosition === 'top'"
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500 pi-pd-32"
      >
        <!-- 工具条 -->
        <slot v-if="$slots.toolbar" name="toolbar">
          <!-- 当toolbarPositon == 'top ' 默认：左边取消按钮 右边确定按钮; 否则默认: 一个宽度100%的确定按钮 -->
        </slot>
        <template v-else>
          <view class="item-btn" @tap.stop="handlePopupClose">取消</view>
          <view class="item-btn pi-primary" @tap.stop="handleConfirm">确定</view>
        </template>
      </view>
      <!-- 选择区域 -->
      <view class="pi-w-100P pi-scroll">
        <!-- uniapp 底层bug picker-view 如果不加v-if会导致小程序和app端初始化不正常 -->
        <picker-view
          v-if="val"
          class="pi-text-center pi-h-100P"
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
      </view>
      <!-- 顶部操作条, 底部安全区域由popup控制 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'" :safe-area="safeAreaInsetBottom">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button v-else width="100%" type="primary" @click="handleConfirm">确定</pi-button>
      </pi-bottom-bar>
    </view>
  </pi-popup>
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
    // 操作栏（确定/取消）位置
    toolbarPosition: {
      // 'top', 'bottom'
      type: String,
      // 'bottom'
      default: picker.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
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
    // 是否显示title
    showTitle: {
      type: Boolean,
      // false
      default: picker.showTitle
    },
    // 标题
    title: {
      type: String,
      // '弹出选择'
      default: picker.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // '32rpx'
      default: picker.titlePadding
    },
    // 弹出选择层的高度，不可填百分比
    height: {
      type: String,
      // '50vh'
      default: picker.height
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
    // 是否点击确认的时候关闭弹窗
    onConfirmClose: {
      type: Boolean,
      // true
      default: picker.onConfirmClose
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
    getPopup() {
      return this.$pi.lang.mergeDeep(picker.popup, this.popup)
    },
    getHeight() {
      return this.$pi.common.addUnit(this.height)
    },
    getTitlePadding() {
      return this.$pi.common.addUnit(this.titlePadding)
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
    handleConfirm() {
      if (this.scrolling) return
      /**
       * 点击确定按钮时触发
       * @arg this.pickerValue
       */
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
