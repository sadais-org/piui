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
          :class="{
            'pi-solid-bottom-1': showItemBottomBorder,
            'disabled': item.disabled
          }"
          class="select-item pi-justify-between pi-align-center pi-fz-30 pi-pd-lr-32"
          @tap.stop="handleSelectItem(item)"
        >
          <!-- 自定义列表项 -->
          <slot name="item" :item="item" class="pi-w-100P">
            <!-- item[displayField] -->
            {{ item[displayField] }}
          </slot>
          <pi-checkbox :value="item.isSelected" active-mode="fill" shape="round" readonly />
        </view>
      </scroll-view>
      <!-- 顶部操作条, 底部安全区域由popup控制 -->
      <pi-bottom-bar v-if="toolbarPosition === 'bottom'" :safe-area="false">
        <slot v-if="$slots.toolbar" name="toolbar" />
        <view v-else class="pi-align-center">
          <view v-if="getCancelBtn.show" class="pi-button-wrap">
            <pi-button
              :color="getCancelBtn.color"
              :bg-color="getCancelBtn.bgColor"
              custom-class="pi-w-100P"
              :custom-style="getCancelBtn.customStyle"
              @click="handlePopupClose"
            >
              {{ getCancelBtn.text }}
            </pi-button>
          </view>
          <view v-if="getConfirmBtn.show" class="pi-button-wrap">
            <pi-button
              :type="getConfirmBtn.bgColor ? 'default' : 'primary'"
              :color="getConfirmBtn.color"
              :bg-color="getConfirmBtn.bgColor"
              custom-class="pi-w-100P"
              :custom-style="getConfirmBtn.customStyle"
              @click="handleConfirm"
            >
              {{ getConfirmBtn.text }}
            </pi-button>
          </view>
        </view>
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
    getConfirmBtn() {
      return this.$pi.lang.mergeDeep(select.confirmBtn, this.confirmBtn)
    },
    getCancelBtn() {
      return this.$pi.lang.mergeDeep(select.cancelBtn, this.cancelBtn)
    },
    getPopup() {
      return this.$pi.lang.mergeDeep(select.popup, this.popup)
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
    /**
     * @vuese
     * 全选或全清选择值
     * @selected 是否勾选
     * @nodes 需要改变的节点，不填默认全部
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
          toggleNode = nodes.findIndex(node[this.keyField] === item[this.keyField]) !== -1
        }
        return toggleNode && !item.disabled
      })
      if (!toggleSelect.length) return
      this.selected = toggleSelect
    },
    handleConfirm() {
      /**
       * @vuese
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
