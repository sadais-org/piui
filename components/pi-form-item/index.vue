<template>
  <view
    class="pi-form-item"
    :style="[customStyle, itemStyle]"
    :class="getFormItemClass"
    @tap="handleItemClick"
  >
    <!-- 表单标题 -->
    <view
      v-if="label || $slots.label"
      class="form-label pi-pd-tb-8 pi-align-start pi-flex-nowrap"
      :style="[computedLabelStyle, getLabelStyle]"
      :class="[{ border: getWrap && getLabelWrapBorder }]"
    >
      <view v-if="required" style="color: #ed2235;" class="pi-mg-right-12" :style="[requiredStyle]">
        *
      </view>
      <!-- 表单项label -->
      <slot name="label">
        {{ label }}
      </slot>
      <view v-if="getColon" class="pi-pd-left-8">:</view>
    </view>

    <!-- 内容区域 -->
    <view
      class="content-wrap"
      :class="[
        { 'pi-flex-sub': !getWrap },
        getInputAlign,
        { 'wrap': getWrap, 'nowrap': !getWrap, 'wrap-bottom': getWrap && getWrapBottomGap }
      ]"
      :style="[contentWrapStyle]"
    >
      <view
        class="content-input pi-align-center"
        :style="[getInputAlignStyle]"
        :class="[getInputAlign]"
      >
        <!-- 表单项内容 -->
        <slot />
      </view>
      <view
        v-if="getErrorType === 'message' && validateState === 'error' && validateMessage"
        class="form-valid"
      >
        <view class="form-valid-item">{{ validateMessage }}</view>
      </view>
    </view>
    <!-- 右侧区域 -->
    <view v-if="$slots && $slots.right" class="pi-pd-left-24">
      <!-- 右侧区域内容 -->
      <slot name="right" />
    </view>
    <!-- 右侧箭头 -->
    <pi-icon
      v-else-if="getShowRightIcon"
      :custom-style="getRightIcon.customStyle"
      :custom-class="`pi-pd-left-4 ${getRightIcon.customClass}`"
      :name="getRightIcon.name"
      :dot="getRightIcon.dot"
      :dot-radius="getRightIcon.dotRadius"
      :badge="getRightIcon.badge"
      :color="getRightIcon.color"
      :size="getRightIcon.size"
      :class-prefix="getRightIcon.classPrefix"
    />
  </view>
</template>

<script>
import Emitter from '../../mixin/emitter'
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

import Schema from '../../plugins/async-validator'

const TAG = 'PiFormItem'
const { formItem } = getConfig()
const extendPiFrom = childInit('PiForm')

const alignFlexMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

const verticalAlignFlexMap = {
  top: 'pi-align-start',
  center: 'pi-align-center',
  bottom: 'pi-align-end'
}

export default {
  name: 'PiFormItem',
  mixins: [extendPiFrom, Emitter], // 注入inheritProps
  options: {
    styleIsolation: 'shared'
  },
  props: {
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return formItem.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return formItem.customClass
      }
    },
    // 绑定字段
    prop: {
      type: [String, Number],
      // ''
      default: ''
    },
    // 是否必填
    required: {
      type: Boolean,
      default() {
        // false
        return formItem.required
      }
    },
    // 必填标志自定义样式
    requiredStyle: {
      type: Object,
      default() {
        // {}
        return formItem.requiredStyle
      }
    },
    // 高度
    height: {
      type: [String, Number],
      default() {
        // 100
        return formItem.height
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      default() {
        // '32rpx'
        return formItem.padding
      }
    },
    label: {
      type: String
    },
    // 表单项 label 宽度，默认单位为rpx
    labelWidth: {
      type: [String, Number],
      default() {
        // null
        return formItem.labelWidth
      }
    },
    // 表单项 label样式
    labelStyle: {
      type: Object,
      default() {
        // {}
        return formItem.labelStyle
      }
    },
    // 表单项垂直对齐方式，可选值为 top center bottom
    itemVerticalAlign: {
      // `'top'` `'center'` `'bottom'`
      type: String,
      // 'center'
      default() {
        return formItem.itemVerticalAlign
      },
      validator: function(value) {
        return [null, 'top', 'center', 'bottom'].includes(value)
      }
    },
    // 表单label区域 label 对齐方式
    labelAlign: {
      // `'left'` `'center'` `'right'`
      type: String,
      // 'left'
      default() {
        return formItem.labelAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 表单输入区域 label 对齐方式
    inputAlign: {
      // `'left'` `'center'` `'right'`
      type: String,
      // 'right'
      default() {
        return formItem.inputAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 是否以换行样式显示表单
    wrap: {
      type: Boolean,
      // false
      default: formItem.wrap
    },
    // wrap模式下是否在底部增加表单项之间的间距
    wrapBottomGap: {
      type: Boolean,
      // null
      default: formItem.wrapBottomGap
    },
    // wrap样式label是否显示边框
    labelWrapBorder: {
      type: Boolean,
      // false
      default: formItem.labelWrapBorder
    },
    // 是否在 label 后面添加冒号
    colon: {
      type: Boolean,
      // false
      default: formItem.colon
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      // false
      default: formItem.disabled
    },
    // 是否显示边框
    border: {
      type: Boolean,
      // false
      default: formItem.border
    },
    // 是否显示右边icon
    showRightIcon: {
      type: Boolean,
      // true
      default() {
        // true
        return formItem.showRightIcon
      }
    },
    // 右侧icon配置
    rightIcon: {
      type: Object,
      default() {
        return formItem.rightIcon
      }
    }
  },
  data() {
    return {
      initialValue: '', // 初始值
      validateState: 'success', // 是否校验成功
      validateMessage: '' // 校验失败的提示语
    }
  },
  computed: {
    getShowRightIcon() {
      return this.$pi.expand.getPropValue(this.inheritProps.showRightIcon, this.showRightIcon)
    },
    getRightIcon() {
      const rightIcon = this.$pi.lang.mergeDeep(this.inheritProps.rightIcon, this.rightIcon)
      return this.$pi.lang.mergeDeep(formItem.rightIcon, rightIcon)
    },
    getBorder() {
      return this.$pi.expand.getPropValue(this.inheritProps.border, this.border)
    },
    getWrap() {
      return this.$pi.expand.getPropValue(this.inheritProps.wrap, this.wrap)
    },
    getWrapBottomGap() {
      return this.$pi.expand.getPropValue(this.inheritProps.wrapBottomGap, this.wrapBottomGap)
    },
    getLabelWrapBorder() {
      return this.inheritProps.labelWrapBorder !== null
        ? this.inheritProps.labelWrapBorder
        : this.labelWrapBorder
    },
    getColon() {
      return this.$pi.expand.getPropValue(this.inheritProps.colon, this.colon)
    },
    getDisabled() {
      return this.$pi.expand.getPropValue(this.inheritProps.disabled, this.disabled)
    },
    getLabelAlign() {
      return this.$pi.expand.getPropValue(this.inheritProps.labelAlign, this.labelAlign)
    },
    getInputAlign() {
      return this.$pi.expand.getPropValue(this.inheritProps.inputAlign, this.inputAlign)
    },
    getErrorType() {
      return this.inheritProps.errorType
    },
    getPadding() {
      const padding = this.$pi.expand.getPropValue(this.inheritProps.padding, this.padding)
      return this.$pi.common.addUnit(padding)
    },
    getHeight() {
      const height = this.$pi.expand.getPropValue(this.inheritProps.height, this.height)
      return this.$pi.common.addUnit(height)
    },
    itemStyle() {
      const style = {}
      if (!this.getWrap) {
        style.padding = this.getPadding
      }
      return style
    },
    getLabelStyle() {
      return this.$pi.expand.getPropValue(this.inheritProps.labelStyle, this.labelStyle)
    },
    getItemVerticalAlign() {
      return this.$pi.expand.getPropValue(
        this.inheritProps.itemVerticalAlign,
        this.itemVerticalAlign
      )
    },
    computedLabelStyle() {
      const style = {}
      if (this.getWrap) {
        style.padding = this.getPadding
      }
      const labelWidth = this.labelWidth || this.inheritProps.labelWidth
      if (labelWidth) {
        style.minWidth = this.$pi.common.addUnit(labelWidth)
      }
      const height = this.height || this.inheritProps.height
      if (this.getWrap && height) {
        style.minHeight = this.$pi.common.addUnit(height)
      }
      style.justifyContent = alignFlexMap[this.getLabelAlign]
      return style
    },
    contentWrapStyle() {
      const style = {}
      if (this.getWrap) {
        style.padding = this.getPadding
        style.paddingTop = 0
      }
      return style
    },
    getInputAlignStyle() {
      return {
        justifyContent: alignFlexMap[this.getInputAlign]
      }
    },
    getFormItemClass() {
      const classList = [this.customClass]
      if (this.getDisabled) {
        classList.push('disabled')
      }
      if (this.getBorder) {
        classList.push('border')
      }
      if (!this.getWrap && this.getItemVerticalAlign) {
        classList.push(verticalAlignFlexMap[this.getItemVerticalAlign])
      }
      return classList
    }
  },
  mounted() {
    this.initRulesValidation()
  },
  methods: {
    handleItemClick(e) {
      this.$emit('click', e)
    },
    initRulesValidation() {
      if (
        this.prop &&
        this._parent &&
        this._parent.model &&
        this._parent.model.hasOwnProperty(this.prop)
      ) {
        // 初始化默认值
        this.initialValue = this._parent.model[this.prop]
      }
      // blur事件
      this.$on('form-blur', () => {
        this.validation('blur')
      })
      // change事件
      this.$on('form-change', () => {
        this.validation('change')
      })
    },
    // 从pi-form的rules属性中，取出当前pi-form-item的校验规则
    getRules() {
      // 父组件的所有规则
      const parentRules = this._parent && this._parent.validRules
      const rules = parentRules ? parentRules[this.prop] : []
      return [].concat(rules || [])
    },
    // 过滤出符合要求的rule规则
    getFilteredRule(triggerType = '') {
      let rules = this.getRules()
      // 整体验证表单时，triggerType为空字符串
      if (!triggerType) return rules
      return rules.filter(res => res.trigger && res.trigger.indexOf(triggerType) !== -1)
    },
    // 校验数据
    validation(trigger) {
      const _getResolve = () => {
        return {
          prop: this.prop,
          validateState: this.validateState,
          validateMessage: this.validateMessage
        }
      }
      return new Promise((resolve, reject) => {
        const rules = this.getFilteredRule(trigger)
        if (!this.prop || !rules || rules.length === 0) {
          this.validateState = 'success'
          this.validateMessage = ''
          console.log(TAG, '字段无需校验', this.prop)
          return resolve(_getResolve())
        }
        const fieldValue = this._parent ? this._parent.model[this.prop] : undefined
        // 设置当前的装填，标识为校验中
        this.validateState = 'validating'
        // 调用async-validator的方法
        const validator = new Schema({
          [this.prop]: rules
        })
        validator
          .validate(
            {
              [this.prop]: fieldValue
            },
            {
              first: true,
              firstFields: true
            }
          )
          .then(() => {
            console.log(TAG, '表单校验成功', this.prop)
            this.validateState = 'success'
            this.validateMessage = ''
            resolve(_getResolve())
          })
          .catch(({ errors, fields }) => {
            console.log(TAG, '表单校验失败', `字段名：${this.prop}，字段值：${fieldValue}`)
            console.log(TAG, '字段值：', fieldValue)
            console.log(TAG, '错误信息', errors)
            console.log(TAG, '校验规则', fields)
            // 记录状态和报错信息
            this.validateState = 'error'
            this.validateMessage = errors ? errors[0].message : ''
            resolve(_getResolve())
          })
      })
    },
    resetValidation() {
      // 清除校验信息
      this.validateState = 'success'
      this.validateMessage = ''
      // 还原默认值
      if (
        this.prop &&
        this._parent &&
        this._parent.model &&
        this._parent.model.hasOwnProperty(this.prop)
      ) {
        this._parent.model[this.prop] = this.initialValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/mixin.scss';

.pi-form-item {
  overflow: hidden;
  font-size: $pi-form-size;
  &.disabled {
    pointer-events: none;
    opacity: $pi-disabled-opacity;
  }
  &.border {
    @include pi-border;
    &::before {
      border: 0 solid $pi-form-border-color;
      border-bottom-width: $pi-form-border-width;
    }
  }
  .form-label {
    font-weight: $pi-form-label-weight;
    color: $pi-form-label-color;
    white-space: nowrap;
    &.border {
      @include pi-border;
      &::before {
        border: 0 solid $pi-form-border-color;
        border-bottom-width: $pi-form-border-width;
      }
    }
  }
  .content-wrap {
    overflow: hidden;
    &.nowrap {
      margin-left: 24rpx;
    }
    &.wrap-bottom {
      margin-bottom: 24rpx;
    }
    .form-valid {
      font-size: 24rpx;
      color: #ed2235;
      .form-valid-item {
        margin-bottom: 8rpx;
        &:first-child {
          margin-top: 8rpx;
        }
      }
    }
  }
  // 解决slot宽度没有占满100%的问题
  ::v-deep .content-wrap {
    & > pi-input {
      width: 100%;
    }
    .pi-input-wrap {
      width: 100%;
    }
    &.left {
      .form-valid,
      .pi-input-wrap,
      pi-input {
        text-align: left;
      }
      .pi-checkbox-group.horizontal,
      .pi-radio-group.horizontal {
        justify-content: flex-start;
      }
    }
    &.center {
      .form-valid,
      .pi-input-wrap,
      pi-input {
        text-align: center;
      }
      .pi-checkbox-group.horizontal,
      .pi-radio-group.horizontal {
        justify-content: center;
      }
    }
    &.right {
      .form-valid,
      .pi-input-wrap,
      pi-input {
        text-align: right;
      }
      .pi-checkbox-group.horizontal,
      .pi-radio-group.horizontal {
        justify-content: flex-end;
      }
    }
  }
  // 处理表单项input的字体对齐方式
  ::v-deep .content-input {
    &.left .input {
      text-align: left;
    }
    &.center .input {
      text-align: center;
    }
    &.right .input {
      text-align: right;
    }
  }
  ::v-deep pi-calendar-input {
    width: 100%;
  }
}
</style>
