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
          :class="{ 'pi-solid-bottom-1': showItemBottomBorder }"
          class="pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
          @tap.stop="handleSelectItem(item)"
        >
          <slot name="item" :item="item">
            <!-- 后备内容 -->
            {{ item[displayField] }}
          </slot>
          <pi-checkbox :value="item.isSelected" active-mode="fill" shape="round" />
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
  name: TAG,
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
        return select.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return select.customClass
      }
    },
    toolbarPosition: {
      type: String,
      default: select.toolbarPosition,
      validator: function(value) {
        return ['top', 'bottom'].includes(value)
      }
    },
    // 选项列表，默认（[]）
    items: {
      type: Array,
      default() {
        return select.items
      }
    },
    // 选项id字段，默认为id
    keyField: {
      type: String,
      default: select.keyField
    },
    // 选项显示字段，默认为text
    displayField: {
      type: String,
      default: select.displayField
    },
    // 默认值，单选是传Object，多选时传Array，默认null
    defaultValue: {
      type: [Object, Array],
      default: select.defaultValue
    },
    // 是否多选，（默认：false）
    isMulti: {
      type: Boolean,
      default: select.isMulti
    },
    // 是否显示title（默认：true）
    showTitle: {
      type: Boolean,
      default: select.showTitle
    },
    // 标题（默认：日期选择）
    title: {
      type: String,
      default: select.title
    },
    // 标题 padding（默认：24rpx）
    titlePadding: {
      type: [String, Number],
      default: select.titlePadding
    },
    // 弹出选择层的高度，不可填百分比（默认：'50vh'）
    height: {
      type: String,
      default: select.height
    },
    // 行高（默认：'110rpx'）
    itemHeight: {
      type: [String, Number],
      default: select.itemHeight
    },
    // 是否显示item下边框（默认：'true'）
    showItemBottomBorder: {
      type: Boolean,
      default: select.showItemBottomBorder
    },
    // 行样式（默认：'{}'）
    itemStyle: {
      type: Object,
      default() {
        return select.itemStyle
      }
    },
    // 是否点击确认的时候关闭弹窗（默认：'true'）
    onConfirmClose: {
      type: Boolean,
      default: select.onConfirmClose
    },
    /**
     * 弹窗的配置，默认选项请参照popup
     * ---------------------------------------------------------------------------------------------
     */
    // 控制弹窗的四个角圆角效果（默认'0 0 0 0'）
    borderRadius: {
      type: [String, Number],
      default: select.borderRadius
    },
    // 是否显示关闭图标，默认（true）
    showCloseIcon: {
      type: Boolean,
      default: select.showCloseIcon
    },
    // 关闭图标的名称，默认（close）
    closeIconName: {
      type: String,
      default: select.closeIconName
    },
    closeIconPadding: {
      type: [String, Number],
      default: select.closeIconPadding
    },
    // 关闭图标的颜色，默认（'#666666'）
    closeIconColor: {
      type: String,
      default: select.closeIconColor
    },
    // 关闭图标的大小，默认（'42rpx'）
    closeIconSize: {
      type: [String, Number],
      default: select.closeIconSize
    },
    closeIconWeight: {
      type: [String, Number],
      default: select.closeIconWeight
    },
    // 关闭图标位置，tl为左上角，tr为右上角，bl为左下角，br为右下角，若不指定，则按照弹出位置自动显示在合适的位置
    closeIconPosition: {
      type: String,
      default: select.closeIconPosition,
      validator: function(value) {
        return ['', 'tl', 'tr', 'bl', 'br'].includes(value)
      }
    },
    // 顶部安全适配（状态栏高度，默认true）
    safeAreaInsetTop: {
      type: Boolean,
      default: select.safeAreaInsetTop
    },
    // 底部安全适配（iPhoneX 留出底部安全距离，默认true）
    safeAreaInsetBottom: {
      type: Boolean,
      default: select.safeAreaInsetBottom
    },
    /**
     * mask props
     * ---------------------------------------------------------------------------------------------
     */
    // 遮罩的过渡时间，单位为ms，默认（500）
    duration: {
      type: [Number, String],
      default: select.duration
    },
    // 是否可以通过点击遮罩进行关闭，默认（true）
    maskClosable: {
      type: Boolean,
      default: select.maskClosable
    },
    // 是否隐藏TabBar，默认（false）
    hideTabBar: {
      required: false,
      type: Boolean,
      default: select.hideTabBar
    },
    // 是否挂载到body下，防止嵌套层级无法遮罩的问题（仅H5环境生效）,默认（false）
    appendToBody: {
      type: Boolean,
      default: select.appendToBody
    },
    // 层级z-index，（默认1000）
    zIndex: {
      type: [Number, String],
      default: select.zIndex
    },
    // 背景颜色（默认'rgba(0, 0, 0, .5)'）
    maskBackground: {
      type: String,
      default: select.maskBackground
    }
  },
  data() {
    return {
      selected: {}
    }
  },
  computed: {
    options() {
      const watchs = ['defaultValue', 'items', 'keyField', 'displayField', 'isMulti']
      const options = watchs
        .filter(d => this[d])
        .map(d => this[d].toString())
        .join('-')
      return options
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
    // ! 因为使用对象，在H5端watch的时候，就算没有发生改变，也会触发，这里直接监听toString后的值
    options(val) {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let selected = this.defaultValue
      if (!selected) {
        selected = this.isMulti ? [] : {}
      }
      this.selected = selected
    },
    handlePopupClose() {
      this.val = false
      this.$emit('close')
      this.handleEmitChange()
    },
    handleSelectItem(item) {
      if (!this.isMulti) {
        // 单选
        this.selected = this.$pi.lang.isEmpty(this.selected) ? item : {}
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
      this.$emit('confirm', this.selected)
      this.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-select {
  height: 50vh;
}
</style>
