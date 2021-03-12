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
      class="pi-select pi-flex-column"
      :style="[customStyle, { height: getHeight }]"
      :class="[customClass]"
    >
      <!-- 标题栏 -->
      <view
        v-if="showTitle"
        class="pi-justify-center pi-fz-32 pi-fw-500"
        :style="[{ padding: getTitlePadding }]"
      >
        <slot v-if="$slots.title" name="title" />
        <template v-else>{{ title }}</template>
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
      <scroll-view class="pi-scroll" scroll-y scroll-with-animation>
        <view
          v-for="item in getItems"
          :id="`id-${item[keyField]}`"
          :key="item[keyField]"
          :style="[itemStyle, getItemStyle]"
          :class="{ 'pi-solid-bottom-1': showItemBottomBorder, 'disabled': item.disabled }"
          class="select-item pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
          @tap.stop="handleSelectItem(item)"
        >
          <!-- 自定义列表项 -->
          <slot name="item" :item="item">
            <!-- item[displayField] -->
            {{ item[displayField] }}
          </slot>
          <pi-checkbox :value="item.isSelected" active-mode="fill" shape="round" readonly />
        </view>
      </scroll-view>
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

const TAG = 'PiSelect'
const { select } = getConfig()

export default {
  name: 'Select',
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
    // 工具条位置
    toolbarPosition: {
      // 'bottom', 'top'
      type: String,
      // 'bottom'
      default: select.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
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
    // 是否显示title
    showTitle: {
      type: Boolean,
      // false
      default: select.showTitle
    },
    // 标题
    title: {
      type: String,
      // '弹出选择'
      default: select.title
    },
    // 标题 padding
    titlePadding: {
      type: [String, Number],
      // '32rpx'
      default: select.titlePadding
    },
    // 弹出选择层的高度，不可填百分比
    height: {
      type: String,
      // '50vh'
      default: select.height
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
    // 是否点击确认的时候关闭弹窗
    onConfirmClose: {
      type: Boolean,
      // true
      default: select.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果
    borderRadius: {
      type: [String, Number],
      // '0 0 0 0'
      default: select.borderRadius
    },
    // 是否显示关闭图标
    showCloseIcon: {
      type: Boolean,
      // true
      default: select.showCloseIcon
    },
    // 关闭图标的名称
    closeIconName: {
      type: String,
      // 'close'
      default: select.closeIconName
    },
    // 关闭图标的padding
    closeIconPadding: {
      type: [String, Number],
      // '32rpx 32rpx'
      default: select.closeIconPadding
    },
    // 关闭图标的颜色
    closeIconColor: {
      type: String,
      // '#666666'
      default: select.closeIconColor
    },
    // 关闭图标的大小 值为数字 则单位默认rpx
    closeIconSize: {
      type: [String, Number],
      // 42
      default: select.closeIconSize
    },
    // 关闭图标的font-weight
    closeIconWeight: {
      type: [String, Number],
      // 800
      default: select.closeIconWeight
    },
    // 关闭图标位置
    closeIconPosition: {
      // tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
      type: String,
      // ''
      default: select.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（主要针对iPhoneX）
    safeAreaInsetTop: {
      type: Boolean,
      // true
      default: select.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离）
    safeAreaInsetBottom: {
      type: Boolean,
      // true
      default: select.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，格式：500、'500ms'、'0.5s'
    duration: {
      type: [Number, String],
      // 300
      default: select.duration
    },
    // 是否可以通过点击遮罩进行关闭
    maskClosable: {
      type: Boolean,
      // true
      default: select.maskClosable
    },
    // 是否隐藏TabBar
    hideTabBar: {
      required: false,
      type: Boolean,
      // false
      default: select.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）
    appendToBody: {
      type: Boolean,
      // false
      default: select.appendToBody
    },
    // 层级z-index
    zIndex: {
      type: [Number, String],
      // 100
      default: select.zIndex
    },
    // 背景颜色
    maskBackground: {
      type: String,
      // rgba(0, 0, 0, .5)
      default: select.maskBackground
    }
  },
  data() {
    return {
      selected: {}
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
    getItems() {
      return this.items.map(item => {
        let isSelected = false
        if (this.isMulti) {
          isSelected = this.selected.findIndex(s => s[this.keyField] === item[this.keyField]) !== -1
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
      let selected = this.defaultValue
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
    handleConfirm() {
      /**
       * 点击确定按钮后触发
       * @arg 当前选中的值 单选为对象，多选模式为数组
       */
      this.$emit('confirm', this.selected)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-select {
  height: 50vh;
  .select-item.disabled {
    opacity: 0.4;
  }
}
</style>
