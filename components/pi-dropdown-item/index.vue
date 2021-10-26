<template>
  <view v-if="show" class="pi-dropdown-item pi-rela pi-w-100P">
    <view
      v-for="item in option"
      :key="item.id"
      class="item-btn pi-pd-24 pi-w-100P pi-justify-between pi-align-center"
      :class="customClass"
      :style="customStyle"
      @tap="handleChangeRadio(item)"
    >
      <text :style="{ color: item.id === val ? color : 'inherit' }">{{ item.name }}</text>
      <pi-icon v-if="item.id === val" name="blod-check" :color="color" size="32" />
    </view>
    <slot />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiDropdownItem'
const { dropdownItem } = getConfig()
const extendPidropDown = childInit('PiDropdown')

export default {
  name: TAG,
  mixins: [ValueSync, extendPidropDown], // 注入value与val，进行双向绑定、混入自定义样式customStyle和customClass
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
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 名称
    name: {
      type: String,
      default: ''
    },
    // 选项列表，默认
    option: {
      type: Array,
      default() {
        return dropdownItem.option
      }
    },
    tabs: {
      type: Object
    }
  },
  data() {
    return {
      options: this.option,
      show: false // 显示当前Item组件
    }
  },
  computed: {
    color() {
      return this._parent.activeColor
    }
  },
  methods: {
    showOption(bool) {
      this.show = bool
    },
    handleChangeRadio(item) {
      this.val = item.id
      setTimeout(() => {
        this._parent.handleChangeSubmit()
      }, 50) // 延迟 可见按钮点击动画
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-dropdown-item {
  .item-btn {
    &:active {
      background: #eeeeee;
    }
  }
}
</style>
