<template>
  <pi-popup
    ref="popup"
    :value="val"
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
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'" :safe-area="false">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button v-else width="100%" type="primary" @tap="handleConfirm">确定</pi-button>
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
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果
    borderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: picker.borderRadius
    },
    // 是否显示关闭图标
    showCloseIcon: {
      type: Boolean,
      // true
      default: picker.showCloseIcon
    },
    // 关闭图标的名称 自动拼接前缀pi-icon-
    closeIconName: {
      type: String,
      // 'close'
      default: picker.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      // '32rpx 32rpx'
      default: picker.closeIconPadding
    },
    // 关闭图标的颜色
    closeIconColor: {
      type: String,
      // '#666666'
      default: picker.closeIconColor
    },
    // 关闭图标的大小 单位默认rpx
    closeIconSize: {
      type: [String, Number],
      // 42
      default: picker.closeIconSize
    },
    // 关闭图标的font-weight
    closeIconWeight: {
      type: [String, Number],
      // 800
      default: picker.closeIconWeight
    },
    // 关闭图标位置
    closeIconPosition: {
      // tl-左上角，tr-右上角，bl-左下角，br-右下角，若不指定，则按照弹出位置自动显示在合适的位置
      type: String,
      // ''
      default: picker.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度）
    safeAreaInsetTop: {
      type: Boolean,
      // true
      default: picker.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离）
    safeAreaInsetBottom: {
      type: Boolean,
      // true
      default: picker.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，格式：500、'500ms'、'0.5s'
    duration: {
      type: [Number, String],
      // 300
      default: picker.duration
    },
    // 是否可以通过点击遮罩进行关闭
    maskClosable: {
      type: Boolean,
      // true
      default: picker.maskClosable
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      // false
      default: picker.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: picker.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 999
      default: picker.zIndex
    },
    // 背景颜色
    maskBackground: {
      type: String,
      // 'rgba(0, 0, 0, .5)'
      default: picker.maskBackground
    }
  },
  data() {
    return {
      pickerValue: [],
      scrolling: false // picker是否在滚动中，小程序在scrolling中点确定，选择的项目不正确
    }
  },
  computed: {
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
