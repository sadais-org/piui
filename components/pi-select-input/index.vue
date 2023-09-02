<!--
 * @Author: zhangzhenfei
 * @Date: 2022-05-18 11:08:49
 * @LastEditTime: 2023-09-02 11:40:02
 * @LastEditors: zhangzhenfei
 * @Description: 选择输入
 * @FilePath: \piui-awesome\src\piui\components\pi-select-input\index.vue
-->

<template>
  <view class="pi-select-input">
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

    <!-- 选择弹出框 -->
    <pi-select
      v-model="show"
      :default-value="val"
      :key-default-value="getSelect.keyDefaultValue"
      :custom-class="getSelect.customClass"
      :custom-style="getSelect.customStyle"
      :items="getSelect.items"
      :key-field="getSelect.keyField"
      :display-field="getSelect.displayField"
      :is-multi="getSelect.isMulti"
      :single-cancel="getSelect.singleCancel"
      :single-confirm="getSelect.singleConfirm"
      :item-height="getSelect.itemHeight"
      :show-item-bottom-border="getSelect.showItemBottomBorder"
      :item-style="getSelect.itemStyle"
      :selected-img="getSelect.selectedImg"
      :selected-checkbox="getSelect.selectedCheckbox"
      :popup-select="getSelect.popupSelect"
      :popup="getSelect.popup"
      :confirm-btn="getSelect.confirmBtn"
      :cancel-btn="getSelect.cancelBtn"
      @confirm="handleSelectConfirm"
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

const TAG = 'PiSelectInput'
const { selectInput } = getConfig()

const PI_DEFAULT_FN_FLAG = 'PI_DEFAULT_FN_FLAG'

export default {
  name: 'PiSelectInput',
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
        return selectInput.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // ''
      default() {
        return selectInput.customClass
      }
    },
    // input输入设置
    input: {
      type: Object,
      default() {
        // 参照select
        return selectInput.input
      }
    },
    // 日历弹窗参数设置
    select: {
      type: Object,
      default() {
        // 参照select
        return selectInput.select
      }
    },
    // 范围选择时间分隔符，默认（','）
    rangeSplit: {
      type: String,
      // ','
      default: selectInput.rangeSplit
    },
    // 解析值的方法，如果配置了，则读取该函数的返回值作为显示的内容
    parseValueFn: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: selectInput.parseValueFn
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
    getSelect() {
      return this.$pi.lang.mergeDeep(selectInput.select, this.select)
    },
    getInput() {
      return this.$pi.lang.mergeDeep(selectInput.input, this.input)
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
      if (this.getSelect.keyDefaultValue) {
        if (this.getSelect.isMulti) {
          return this.getSelect.items
            .filter(item => this.val.includes(item[this.getSelect.keyField]))
            .map(item => item[this.getSelect.displayField])
            .join(this.rangeSplit)
        } else {
          const val = this.getSelect.items.find(item => item[this.getSelect.keyField] === this.val)
          return val ? val[this.getSelect.displayField] : ''
        }
      } else {
        // 这里需要从items再次获取，防止用户设置的默认值没有设置displayField的情况
        if (this.getSelect.isMulti) {
          return this.getSelect.items
            .filter(item =>
              this.val.some(v => v[this.getSelect.keyField] === item[this.getSelect.keyField])
            )
            .map(item => item[this.getSelect.displayField])
            .join(this.rangeSplit)
        } else {
          const val = this.getSelect.items.find(
            item => item[this.getSelect.keyField] === this.val[this.getSelect.keyField]
          )
          return val ? val[this.getSelect.displayField] : ''
        }
      }
    }
  },
  methods: {
    handlePopupClose() {
      this.val = false
      // 关闭
      this.$emit('close')
      this.handleEmitChange()
    },
    handleSelectConfirm(value) {
      this.val = value
      this.handleEmitChange()
    },
    handleClearValue() {
      if (this.getSelect.isMulti) {
        this.handleSelectConfirm([])
      } else {
        $pi.lang.isObject(this.val)
          ? this.handleSelectConfirm({ [this.getSelect.keyField]: '' })
          : this.handleSelectConfirm('')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-select-input {
  width: 100%;
}
</style>
