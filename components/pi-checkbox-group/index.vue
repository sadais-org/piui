<template>
  <view
    class="pi-checkbox-group"
    :style="[customStyle]"
    :class="[
      { horizontal: direction === 'horizontal' },
      { vertical: direction === 'vertical' },
      customClass
    ]"
  >
    <slot />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiCheckbox'
const { checkboxGroup } = getConfig()

export default {
  name: 'PiCheckboxGroup',
  // 混入自定义样式customStyle和customClass
  mixins: [ValueSync], // 注入value与val，进行双向绑定
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return checkboxGroup.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return checkboxGroup.customClass
      }
    },
    // 最大可选数，-1为无限制
    max: {
      type: [String, Number],
      default: checkboxGroup.max
    },
    // 排列方向，可选值为 horizontal vertical
    direction: {
      type: String,
      default: checkboxGroup.direction,
      validator: function(value) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    // 形状 round || square（默认'round'）
    shape: {
      type: String,
      default: checkboxGroup.shape,
      validator: function(value) {
        return ['square', 'round'].includes(value)
      }
    },
    // 是否禁用复选框
    disabled: {
      type: Boolean,
      default: checkboxGroup.disabled
    },
    // checkbox大小，单位rpx
    size: {
      type: [String, Number],
      default: checkboxGroup.size
    },
    // checkbox icon 大小，单位rpx
    iconSize: {
      type: [String, Number],
      default: checkboxGroup.iconSize
    },
    // 选中时图标的颜色
    activeColor: {
      type: [String],
      default: checkboxGroup.activeColor
    },
    // 激活模式（line: 线框模式，fill: 实底模式）
    activeMode: {
      type: [String],
      default: checkboxGroup.activeMode,
      validator: function(value) {
        return ['line', 'fill'].includes(value)
      }
    }
  },
  computed: {
    getMax() {
      return parseInt(this.max, 10)
    }
  },
  provide() {
    return {
      piCheckboxGroup: this
    }
  },
  created() {
    this.children = []
  },
  methods: {
    emitChange() {
      const vals = []
      this.children.map(val => {
        if (val.val && val.name) vals.push(val.name)
      })
      this.val = vals
      this.handleEmitChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-checkbox-group {
  display: inline-flex;
  &.horizontal {
    flex-direction: row;
    align-items: center;
  }
  &.vertical {
    flex-direction: column;
  }
}
</style>
