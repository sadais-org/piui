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
    <view
      class="pi-cascader pi-h-100P pi-flex-column"
      :style="[customStyle]"
      :class="[customClass]"
    >
      <slot name="header" />
      <view class="cascader-wrap pi-flex-sub pi-flex-column">
        <!-- 顶部面包屑 -->
        <scroll-view class="node-breadcrumb pi-solid-bottom-1" scroll-x>
          <view
            v-for="(item, index) in pathItems"
            :key="index"
            class="breadcrumb-item"
            @click="handleClickItem(item)"
          >
            <pi-icon v-if="item[keyField] !== ROOT_NODE" name="right" custom-class="pi-mg-lr-6" />
            <view
              class="breadcrumb-item-title"
              :class="{
                active: currentItem && currentItem[keyField] === item[keyField]
              }"
            >
              {{ item[displayField] }}
            </view>
          </view>
        </scroll-view>
        <!-- 选择区域 -->
        <scroll-view class="scroll-view" :scroll-left="scrollLeft" scroll-x scroll-with-animation>
          <scroll-view
            v-for="(col, index) of columns"
            :key="index"
            scroll-y
            class="column"
            :style="[{ width: isOnlyColumn ? '100%' : '50%' }]"
          >
            <view
              v-for="item in col"
              :key="item[keyField]"
              class="column-item pi-align-center"
              :class="{
                active: activeIds.includes(item[keyField]),
                selected: selectedIds.includes(item[keyField])
              }"
            >
              <view class="pi-flex-sub">
                <slot name="item" :item="item">
                  <view class="pi-align-center">
                    <pi-checkbox
                      v-if="parentCanSelect"
                      :value="selectedIds.includes(item[keyField])"
                      shape="round"
                      active-mode="fill-circle"
                      class="pi-mg-right-16"
                      @change="handleChangeParentSelect(item, $event)"
                    />
                    <text class="pi-lh-36 pi-flex-sub" @click="handleClickItem(item)">
                      {{ item[displayField] || '' }}
                    </text>
                  </view>
                </slot>
              </view>
              <pi-icon
                v-if="!parentCanSelect && selectedIds.includes(item[keyField])"
                name="blod-check"
                size="36"
              />
              <pi-icon
                v-if="item[childrenField] && item[childrenField].length > 0"
                name="right"
                @click="handleClickItem(item)"
              />
            </view>
          </scroll-view>
        </scroll-view>
        <!-- 已选区域 -->
        <view class="cascader-area">
          <text>{{ `已选（${selectedIds.length}）` }}</text>
          <scroll-view class="scroll-area" scroll-x>
            <view
              v-for="id in selectedIds"
              :key="id"
              class="cascader-item"
              @tap="handleRemoveItem(id)"
            >
              <text class="pi-mg-right-12">
                {{ itemsMap && itemsMap[id] && itemsMap[id][displayField] }}
              </text>
              <pi-icon name="close" />
            </view>
          </scroll-view>
        </view>
      </view>
      <slot name="footer" />
    </view>
  </pi-popup-select>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import cloneDeep from 'lodash/cloneDeep'
import { getConfig } from '../../config'

const TAG = 'PiCascader'
const ROOT_NODE = 'ROOT'
const { cascader } = getConfig()

export default {
  name: 'PiCascader',
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
        return cascader.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      // ''
      default() {
        return cascader.customClass
      }
    },
    // 数据源
    items: {
      type: Array,
      default() {
        return []
      }
    },
    defaultValue: {
      type: [Array, String, Number],
      default: () => []
    },
    // 列表选项的唯一标识
    keyField: {
      type: String,
      // 'id'
      default: cascader.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // 'text'
      default: cascader.displayField
    },
    // children字段，默认为desc
    childrenField: {
      type: String,
      // 'children'
      default: cascader.childrenField
    },
    // 父节点是否可选（默认：'false'）
    parentCanSelect: {
      type: Boolean,
      // false
      default: cascader.parentCanSelect
    },
    // 是否单选（默认：'false'）
    isSingle: {
      type: Boolean,
      // false
      default: cascader.isSingle
    },
    // 弹窗选择参数设置
    popupSelect: {
      type: Object,
      default() {
        // 参照popupSelect
        return cascader.popupSelect
      }
    },
    // 确认按钮配置
    confirmBtn: {
      type: Object,
      default() {
        return cascader.confirmBtn
      }
    },
    // 取消按钮配置
    cancelBtn: {
      type: Object,
      default() {
        return cascader.cancelBtn
      }
    },
    // 弹窗参数设置
    popup: {
      type: Object,
      default() {
        // 参照popup
        return cascader.popup
      }
    }
  },
  data() {
    const rootItem = {
      [this.displayField]: '全部',
      [this.keyField]: ROOT_NODE
    }
    return {
      rootItem,
      currentItem: cloneDeep(rootItem),
      innerItems: [],
      itemsMap: {}, // 已选数据id索引
      selectedIds: [], // 已选数据
      cascaderWidth: 0, // 容器宽度
      scrollLeft: 0 // 视图左侧滚动区域，自动对齐到选择的栏目
    }
  },
  computed: {
    ROOT_NODE() {
      return ROOT_NODE
    },
    getPopupSelect() {
      const popupSelect = this.$pi.lang.mergeDeep(cascader.popupSelect, this.popupSelect)
      if (!this.singleCancel && this.singleConfirm) {
        popupSelect.toolbarPosition = 'none'
      }
      return popupSelect
    },
    getConfirmBtn() {
      const cascaderConfirmBtn = this.$pi.lang.mergeDeep(
        cascader.confirmBtn,
        this.popupSelect.confirmBtn
      )
      return this.$pi.lang.mergeDeep(cascaderConfirmBtn, this.confirmBtn)
    },
    getCancelBtn() {
      const cascaderCancelBtn = this.$pi.lang.mergeDeep(
        cascader.cancelBtn,
        this.popupSelect.cancelBtn
      )
      return this.$pi.lang.mergeDeep(cascaderCancelBtn, this.cancelBtn)
    },
    getPopup() {
      const cascaderPopup = this.$pi.lang.mergeDeep(cascader.popup, this.popupSelect.popup)
      return this.$pi.lang.mergeDeep(cascaderPopup, this.popup)
    },
    getItemStyle() {
      return {
        height: this.$pi.common.addUnit(this.itemHeight)
      }
    },
    columns() {
      let columns = []
      if (this.currentItem) {
        // 如果有当前显示的节点，往上找父节点下的所有children放到数组的前面
        let p = this.currentItem
        while (p) {
          const children = p[this.childrenField] || []
          if (children.length > 0) {
            columns.unshift(children)
          }
          p = p.pid ? this.itemsMap[p.pid] : undefined
        }
        columns.unshift(this.innerItems)
      } else {
        columns = [this.innerItems]
      }
      return columns
    },
    isOnlyColumn() {
      return this.columns.length === 1
    },
    activeIds() {
      return this.pathItems.map(i => i[this.keyField])
    },
    pathItems() {
      const pathItems = []
      if (this.currentItem[this.keyField] !== ROOT_NODE) {
        // 往上找构建完整路径
        let p = this.currentItem
        while (p) {
          pathItems.unshift(p)
          p = this.itemsMap[p.pid]
        }
      }
      return [
        {
          [this.displayField]: '全部',
          [this.keyField]: 'ROOT'
        }
      ].concat(pathItems)
    }
  },
  watch: {
    items: {
      immediate: true,
      handler() {
        this.rebuildItems()
      }
    },
    defaultValue: {
      immediate: true,
      handler(vals) {
        this.selectedIds = this.isSingle ? [vals] : vals
      }
    }
  },

  methods: {
    rebuildItems() {
      /**
       * 以非递归的方式 深度拷贝items 且建立父子节点关系
       * 目的为了不影响外部传入的prop: items
       * 写成非递归的目的 是为了防止树的层次太深，
       * 递归调用太多次，导致栈溢出
       */
      const innerItems = []
      // 初始化堆栈 为items的根节点
      const stack = [...this.items]
      const itemsMap = {}
      while (stack.length > 0) {
        // 将栈顶元素出栈进行处理
        let item = stack.shift()
        if (!item.pid) {
          item = {
            ...item,
            level: 0
          }
          innerItems.push(item)
        }
        const children = item[this.childrenField] || []
        const newChilds = []
        for (let i = children.length - 1; i >= 0; i--) {
          // 浅拷贝子孩子
          const subItem = {
            ...children[i],
            level: item.level + 1
          }
          // 建立父子关系
          subItem.pid = item[this.keyField]
          // 放置到新数组中
          newChilds.unshift(subItem)
          // 入栈 模拟递归效果 等待之后的while循环出栈进行处理
          stack.unshift(subItem)
        }
        // 更新children 为新的数组
        item[this.childrenField] = newChilds
        itemsMap[item[this.keyField]] = item
      }
      // 此时的innerItems无论怎么修改 均不影响items
      this.innerItems = innerItems
      // 方便通过节点的id 为key快速定位到对应的节点dto
      this.itemsMap = itemsMap
      if (this.currentItem[this.keyField] === ROOT_NODE) {
        if (this.isSingle && this.defaultValue) {
          this.currentItem = this.getItemByKeyField(this.defaultValue)
        }
        if (!this.isSingle && this.defaultValue.length > 0) {
          this.currentItem = this.getItemByKeyField(this.defaultValue[0])
        }
      }
    },
    handleRemoveItem(id) {
      this.selectedIds = this.selectedIds.filter(i => i !== id)
    },
    handleClickItem(item) {
      // 点击全部
      if (item[this.keyField] === ROOT_NODE) {
        this.currentItem = cloneDeep(this.rootItem)
        this.$nextTick(this.syncScrollLeft)
        return
      }
      const isLeafNode = !item[this.childrenField] || item[this.childrenField]?.length === 0
      // 点击非叶子节点
      if (item && !isLeafNode && this.currentItem[this.keyField] !== item[this.keyField]) {
        this.currentItem = item
        this.$nextTick(this.syncScrollLeft)
        return
      }
      // 点击的是叶子节点
      if (isLeafNode) {
        if (this.selectedIds.includes(item[this.keyField])) {
          this.handleRemoveItem(item[this.keyField])
        } else {
          // 选中
          if (this.isSingle) {
            this.selectedIds = [item[this.keyField]]
          } else {
            this.selectedIds.push(item[this.keyField])
          }
        }
      }
    },
    handleChangeParentSelect(item, selected) {
      if (this.selectedIds.includes(item[this.keyField])) {
        this.handleRemoveItem(item[this.keyField])
      } else {
        // 选中
        this.selectedIds.push(item[this.keyField])
      }
    },
    async syncScrollLeft() {
      // 调用此方法的时候，必须使用$nextTick，因为column是动态变化的，需要等待界面更新渲染后，才能正确设置scrollLeft的位置
      let scrollLeft = 0
      if (this.cascaderWidth === 0) {
        const srollWrapRect = await this.$pi.common.queryRect(this, '.pi-cascader', false)
        if (srollWrapRect) {
          this.cascaderWidth = srollWrapRect.width
        }
      }
      if (this.columns.length > 2) {
        scrollLeft = (this.columns.length - 2) * (this.cascaderWidth / 2)
      }
      this.scrollLeft = scrollLeft
    },
    handlePopupClose() {
      this.val = false
      // 关闭弹窗
      this.$emit('close')
      this.handleEmitChange()
    },
    /**
     * @vuese
     * 根据id获取item
     */
    getItemByKeyField(keyField) {
      return this.itemsMap[keyField]
    },
    /**
     * @vuese
     * 取消选择
     */
    handleCancel() {
      this.$emit('cancel')
      this.selectedIds = this.isSingle ? [this.defaultValue] : [...this.defaultValue]
      this.getPopupSelect.onCancelClose && this.handlePopupClose()
    },
    /**
     * @vuese
     * 确认选择
     */
    handleConfirm() {
      this.$emit('confirm', this.isSingle ? this.selectedIds[0] || '' : this.selectedIds)
      this.getPopupSelect.onConfirmClose && this.handlePopupClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.cascader-wrap {
  width: 100%;
  height: 100%;
  background: #f4f2f6;
}
.scroll-view {
  width: 100%;
  flex: 1;
  white-space: nowrap;
  overflow: auto hidden;
  .column {
    display: inline-block;
    height: 100%;
    width: 50%;
    overflow: hidden auto;
    &:last-child {
      background: #ffffff;
    }
    .column-item {
      position: relative;
      height: 100rpx;
      width: 100%;
      white-space: initial;
      padding: 0 16rpx 0 32rpx;
      font-size: 28rpx;
      color: #333333;
      overflow: hidden;
      &.active {
        color: $pi-primary-color;
        background: #ffffff;
        ::v-deep .pi-icon-right {
          color: #333333;
        }
      }
      &.selected {
        color: $pi-primary-color;
        ::v-deep .pi-icon-right {
          color: #333333;
        }
      }
    }
  }
}

.node-breadcrumb {
  width: 100%;
  padding-left: 32rpx;
  background: #ffffff;
  white-space: nowrap;
  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    padding: 32rpx 0;

    .breadcrumb-item-title.active {
      color: $pi-primary-color;
    }
  }
}

.cascader-area {
  background: #ffffff;
  padding: 22rpx 24rpx;
  color: #333333;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .scroll-area {
    width: calc(100% - 128rpx);
    flex: 1;
    white-space: nowrap;
  }
  .cascader-item {
    display: inline-flex;
    padding: 14rpx 24rpx;
    background: rgba($pi-primary-color, 0.1);
    align-items: center;
    margin-left: 16rpx;
    border-radius: 8rpx;
    color: $pi-primary-color;
  }
}
</style>
