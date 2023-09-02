<!--
 * @Author: zhangzhenfei
 * @Date: 2022-05-18 11:08:49
 * @LastEditTime: 2023-09-02 11:40:33
 * @LastEditors: zhangzhenfei
 * @Description: 日历输入
 * @FilePath: \piui-awesome\src\piui\components\pi-regions-select-input\index.vue
-->

<template>
  <view class="pi-regions-select-input">
    <!-- 输入框 -->
    <view v-if="$slots.default || $slots.$default" class="pi-w-100P" @click="show = true">
      <slot />
    </view>
    <pi-input
      v-else
      type="text"
      :value="getInputValue"
      :custom-class="getInput.customClass"
      :custom-style="getInput.customStyle"
      :placeholder="getInput.placeholder"
      :placeholder-style="getInput.placeholderStyle"
      :placeholder-class="getInput.placeholderClass"
      :disabled="getInput.disabled"
      :border="getInput.border"
      :maxlength="getInput.maxlength"
      :password="getInput.password"
      :cursor-spacing="getInput.cursorSpacing"
      :focus="getInput.focus"
      :confirm-type="getInput.confirmType"
      :confirm-hold="getInput.confirmHold"
      :cursor="getInput.cursor"
      :selection-start="getInput.selectionStart"
      :selection-end="getInput.selectionEnd"
      :adjust-position="getInput.adjustPosition"
      :hold-keyboard="getInput.holdKeyboard"
      :auto-blur="getInput.autoBlur"
      :show-confirmbar="getInput.showConfirmbar"
      :auto-height="getInput.autoHeight"
      :fixed="getInput.fixed"
      :disable-default-padding="getInput.disableDefaultPadding"
      :clearable="getInput.clearable"
      :clear-icon="getInput.clearIcon"
      @click="show = true"
      @clear="handleClearValue"
    />

    <!-- 地区弹出框 -->
    <pi-regions-select
      v-model="show"
      :default-value="val"
      :custom-class="getRegionsSelect.customClass"
      :custom-style="getRegionsSelect.customStyle"
      :regions-data="getRegionsSelect.regionsData"
      :key-field="getRegionsSelect.keyField"
      :display-field="getRegionsSelect.displayField"
      :key-default-value="getRegionsSelect.keyDefaultValue"
      :item-height="getRegionsSelect.itemHeight"
      :show-item-bottom-border="getRegionsSelect.showItemBottomBorder"
      :item-style="getRegionsSelect.itemStyle"
      :popup-select="getRegionsSelect.popupSelect"
      :popup="getRegionsSelect.popup"
      :confirm-btn="getRegionsSelect.confirmBtn"
      :cancel-btn="getRegionsSelect.cancelBtn"
      @confirm="handleRegionsSelectConfirm"
      @close="$emit('close', $event)"
      @closed="$emit('closed', $event)"
      @show="$emit('show', $event)"
      @showed="$emit('showed', $event)"
    />
  </view>
</template>

<script>
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiRegionsSelectInput'
const { regionsSelectInput } = getConfig()

const PI_DEFAULT_FN_FLAG = 'PI_DEFAULT_FN_FLAG'

export default {
  name: 'PiRegionsSelectInput',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return regionsSelectInput.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return regionsSelectInput.customClass
      }
    },
    // input输入设置
    input: {
      type: Object,
      default() {
        // 参照RegionsSelect
        return regionsSelectInput.input
      }
    },
    // 日历弹窗参数设置
    regionsSelect: {
      type: Object,
      default() {
        // 参照RegionsSelect
        return regionsSelectInput.RegionsSelect
      }
    },
    // 地区分隔符，默认（'/'）
    rangeSplit: {
      type: String,
      // '/'
      default: regionsSelectInput.rangeSplit
    },
    // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
    parseValueFn: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: regionsSelectInput.parseValueFn
        }
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    getInput() {
      return this.$pi.lang.mergeDeep(regionsSelectInput.input, this.input)
    },
    getRegionsSelect() {
      return this.$pi.lang.mergeDeep(regionsSelectInput.regionsSelect, this.regionsSelect)
    },
    getInputValue() {
      const parseValueFn = this.parseValueFn[PI_DEFAULT_FN_FLAG]
        ? this.parseValueFn.fn
        : this.parseValueFn
      if (this.$pi.lang.isFunction(parseValueFn)) {
        const parseValue = parseValueFn(this.val)
        return parseValue
      }
      if (this.$pi.lang.isEmpty(this.val)) return ''
      // 常规字段正常返回
      const code = this.getRegionsSelect.keyDefaultValue
        ? this.val
        : this.val[this.getRegionsSelect.keyField]
      const regions = this.$pi.regions.parseRegions(code, this.getRegionsSelect.regionsData)
      return this.generateRegionsName(regions)
    }
  },
  methods: {
    generateRegionsName(regions) {
      const addressFields = ['province', 'city', 'county', 'street']
      return addressFields
        .reduce((prev, curr) => {
          const name = regions[curr][this.getRegionsSelect.displayField]
          name && prev.push(name)
          return prev
        }, [])
        .join(this.rangeSplit)
    },
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleRegionsSelectConfirm(value) {
      this.val = value
      this.handleEmitChange()
    },
    handleClearValue() {
      this.handleRegionsSelectConfirm(null)
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-regions-select-input {
  width: 100%;
}
</style>
