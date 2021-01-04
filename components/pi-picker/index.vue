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
        <slot name="title">{{ title }}</slot>
      </view>
      <!-- 顶部操作条 -->
      <view
        v-if="toolbarPosition === 'top'"
        class="pi-justify-between pi-align-center pi-solid-bottom-1 pi-fz-32 pi-fw-500 pi-pd-32"
      >
        <slot v-if="$slots.toolbar" name="toolbar" />
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
      <!-- 顶部操作条 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <pi-button v-else width="100%" type="primary" @tap="handleConfirm">
          确定
        </pi-button>
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
  name: 'Picker',
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
        return picker.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return picker.customClass
      }
    },
    // 操作栏（确定/取消）位置
    toolbarPosition: {
      type: String,
      default: picker.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
      }
    },
    // 选项列表，默认（[]）
    items: {
      type: Array,
      default() {
        return picker.items
      }
    },
    // 选项id字段，默认为id
    keyField: {
      type: String,
      default: picker.keyField
    },
    // 选项显示字段，默认为text
    displayField: {
      type: String,
      default: picker.displayField
    },
    // 自定义多列联动模式的children属性名
    childField: {
      type: String,
      default: picker.childField
    },
    // 默认值，单选是传Object，多选时传Array，默认null
    defaultValue: {
      type: Array,
      default: picker.defaultValue
    },
    // 选择器类型：single：单列，mutil 多列，mutil-auto 多列联动
    type: {
      type: String,
      default: picker.type,
      validator: function(value) {
        return ['single', 'multi', 'multi-auto'].includes(value)
      }
    },
    // 是否显示title（默认：true）
    showTitle: {
      type: Boolean,
      default: picker.showTitle
    },
    // 标题（默认：日期选择）
    title: {
      type: String,
      default: picker.title
    },
    // 标题 padding（默认：24rpx）
    titlePadding: {
      type: [String, Number],
      default: picker.titlePadding
    },
    // 弹出选择层的高度，不可填百分比（默认：'50vh'）
    height: {
      type: String,
      default: picker.height
    },
    // 行高（默认：'110rpx'）
    itemHeight: {
      type: [String, Number],
      default: picker.itemHeight
    },
    // 是否显示item下边框（默认：'true'）
    showItemBottomBorder: {
      type: Boolean,
      default: picker.showItemBottomBorder
    },
    // 行样式（默认：'{}'）
    itemStyle: {
      type: Object,
      default() {
        return picker.itemStyle
      }
    },
    // 是否点击确认的时候关闭弹窗（默认：'true'）
    onConfirmClose: {
      type: Boolean,
      default: picker.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: picker.borderRadius
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: picker.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: picker.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: picker.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#666666'）
    closeIconColor: {
      type: String,
      default: picker.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: picker.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: picker.closeIconWeight
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: picker.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeAreaInsetTop: {
      type: Boolean,
      default: picker.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: picker.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: picker.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: picker.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: picker.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: picker.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: picker.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
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
