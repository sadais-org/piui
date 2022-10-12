<template>
  <view class="pi-dropdown-item pi-w-100P pi-flex-column" :class="[{ show }]">
    <!-- extra slot -->
    <slot name="extra" />
    <scroll-view scroll-y class="pi-scroll">
      <slot>
        <view
          v-for="item in options"
          :key="item[getKeyField]"
          class="item-wrap pi-pd-tb-24 pi-pd-lr-32 pi-w-100P pi-align-center"
          :class="[
            customClass,
            item[getDisabledField] ? 'disabled' : '',
            getSelectedCheckbox === 'none' ? 'pi-justify-center' : 'pi-justify-between'
          ]"
          :style="[customStyle, getItemStyle]"
          @tap="handleSelectItem(item)"
        >
          <view :class="[{ 'pi-primary': item[getKeyField] === val }]">
            {{ item[getDisplayField] }}
          </view>
          <!-- 如果配置了图片地址，使用图片 -->
          <pi-img
            v-if="getSelectedImg.src && item[getKeyField] === val"
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
            custom-class="pi-mg-left-24"
          />
          <!-- 默认使用复选框 -->
          <pi-checkbox
            v-if="!getSelectedImg.src && getSelectedCheckbox !== 'none'"
            readonly
            :value="item[getKeyField] === val"
            :name="getSelectedCheckbox.name"
            :shape="getSelectedCheckbox.shape"
            :border-radius="getSelectedCheckbox.borderRadius"
            :border="getSelectedCheckbox.border"
            :disabled="getSelectedCheckbox.disabled"
            :size="getSelectedCheckbox.size"
            :icon-size="getSelectedCheckbox.iconSize"
            :active-color="getSelectedCheckbox.activeColor"
            :active-mode="getSelectedCheckbox.activeMode"
            custom-class="pi-mg-left-24"
          />
        </view>
      </slot>
    </scroll-view>
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const { dropdownItem } = getConfig()
const extendPiDropDown = childInit('PiDropdown')

export default {
  name: 'PiDropdownItem',
  mixins: [ValueSync, extendPiDropDown], // 注入value与val，进行双向绑定、混入自定义样式customStyle和customClass
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      default() {
        // {}
        return dropdownItem.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      default() {
        // ''
        return dropdownItem.customClass
      }
    },
    // 是否显示菜单
    showIcon: {
      type: Boolean,
      default: dropdownItem.showIcon
    },
    // 菜单图标配置
    iconOption: {
      type: Object,
      default() {
        return dropdownItem.iconOption
      }
    },
    // 菜单标题
    title: {
      type: String,
      default: dropdownItem.title
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: dropdownItem.disabled
    },
    // 选项列表，默认
    options: {
      type: Array,
      default() {
        return dropdownItem.options
      }
    },
    // 行高 值为数字，则单位默认rpx
    itemHeight: {
      type: [String, Number],
      // 110
      default: dropdownItem.itemHeight
    },
    // 选项id字段
    keyField: {
      type: String,
      // `id`
      default: dropdownItem.keyField
    },
    // 选项显示字段
    displayField: {
      type: String,
      // `text`
      default: dropdownItem.displayField
    },
    // 选项禁用字段，默认为disabled
    disabledField: {
      type: String,
      // `text`
      default: dropdownItem.disabledField
    },
    // 选中图标的配置
    selectedImg: {
      type: Object,
      default() {
        // 参照img
        return dropdownItem.selectedImg
      }
    },
    // 选中checkbox配置
    selectedCheckbox: {
      type: [Object, String],
      default() {
        // 参照checkbox
        return dropdownItem.selectedCheckbox
      }
    }
  },
  data() {
    return {
      show: false // 显示当前Item组件
    }
  },
  computed: {
    getIconOption() {
      return this.$pi.lang.mergeDeep(dropdownItem.iconOption, this.iconOption)
    },
    getItemHeight() {
      return this.inheritProps.itemHeight !== null ? this.inheritProps.itemHeight : this.itemHeight
    },
    getKeyField() {
      return this.inheritProps.keyField !== null ? this.inheritProps.keyField : this.keyField
    },
    getDisplayField() {
      return this.inheritProps.displayField !== null
        ? this.inheritProps.displayField
        : this.displayField
    },
    getDisabledField() {
      return this.inheritProps.disabledField !== null
        ? this.inheritProps.disabledField
        : this.disabledField
    },
    getSelectedImg() {
      const selectedImg = this.inheritProps.selectedImg || dropdownItem.selectedImg
      return this.$pi.lang.mergeDeep(selectedImg, this.selectedImg)
    },
    getSelectedCheckbox() {
      if (this.inheritProps.selectedCheckbox === 'none') {
        return this.inheritProps.selectedCheckbox
      }
      const selectedCheckbox = this.inheritProps.selectedCheckbox || dropdownItem.selectedCheckbox
      return this.$pi.lang.mergeDeep(selectedCheckbox, this.selectedCheckbox)
    },
    getItemStyle() {
      return {
        height: this.$pi.common.addUnit(this.getItemHeight)
      }
    }
  },
  methods: {
    emitChange(val) {
      this.val = val
      this.handleEmitChange()
    },
    handleSelectItem(item) {
      if (item[this.getDisabledField]) {
        return
      }
      this.emitChange(item[this.getKeyField])
      setTimeout(() => {
        this._parent.submit()
      }, 300) // 延迟 可见按钮点击动画
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/mixin.scss';

.pi-dropdown-item {
  max-height: 0;
  opacity: 0;
  transition: opacity $pi-animation-duration $pi-animation-timing-function,
    max-height $pi-animation-duration $pi-animation-timing-function;
  &.show {
    max-height: 600rpx;
    height: 600rpx;
    opacity: 1;
  }
  .item-wrap {
    &:not(:last-child) {
      @include pi-border;
      &::before {
        border: 0 solid $pi-list-border-color;
        border-bottom-width: $pi-list-border-width;
      }
    }
    &.disabled {
      opacity: $pi-disabled-opacity;
    }
  }
}
</style>
