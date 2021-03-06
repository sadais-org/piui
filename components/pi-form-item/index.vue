<template>
  <view
    class="pi-form-item"
    :style="[customStyle, itemStyle]"
    :class="[{ border: getBorder }, { 'pi-align-baseline': !getWrap }, customClass]"
    @tap.stop="handleItemClick"
  >
    <!-- 表单标题 -->
    <view
      v-if="label || $slots.label"
      class="form-label pi-align-start pi-flex-nowrap"
      :style="[getLabelStyle, labelStyle]"
      :class="[{ border: getWrap && getLabelWrapBorder }]"
    >
      <view v-if="required" style="color: ed2235;" class="pi-mg-right-12" :style="[requiredStyle]">
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
      :class="[{ 'pi-flex-sub': !getWrap }, getInputAlign, { wrap: getWrap, nowrap: !getWrap }]"
      :style="[contentWrapStyle]"
    >
      <view class="content-input pi-align-center" :style="[getInputAlignStyle]">
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
  </view>
</template>

<script>
import Emitter from '../../mixin/emitter'
import { childInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

import Schema from '../../plugins/async-validator'

const TAG = 'PiFormItem'
const { formItem } = getConfig()
const extendPiFrom = childInit('Form')

const alignFlexMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

export default {
  name: 'FormItem',
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
      type: String,
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
    // 表单label区域 label 对齐方式，可选值为 left center right
    labelAlign: {
      type: String,
      default() {
        // 'left'
        return formItem.labelAlign
      },
      validator: function(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    // 表单输入区域 label 对齐方式，可选值为 left center right
    inputAlign: {
      type: String,
      default() {
        // 'right'
        return formItem.inputAlign
      },
      validator: function(value) {
        return ['left', 'center', 'right'].includes(value)
      }
    },
    // 是否以换行样式显示表单
    wrap: {
      type: Boolean,
      // false
      default: formItem.wrap
    },
    // wrap样式label是否显示边框
    labelWrapBorder: {
      type: Boolean,
      // true
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
    }
  },
  data() {
    return {
      initialValue: '', // 初始值
      validateState: '', // 是否校验成功
      validateMessage: '' // 校验失败的提示语
    }
  },
  computed: {
    getBorder() {
      return this.inheritProps.border !== null ? this.inheritProps.border : this.border
    },
    getWrap() {
      return this.inheritProps.wrap !== null ? this.inheritProps.wrap : this.wrap
    },
    getLabelWrapBorder() {
      return this.inheritProps.labelWrapBorder !== null
        ? this.inheritProps.labelWrapBorder
        : this.labelWrapBorder
    },
    getColon() {
      return this.inheritProps.colon !== null ? this.inheritProps.colon : this.colon
    },
    getLabelAlign() {
      return this.inheritProps.labelAlign !== null ? this.inheritProps.labelAlign : this.labelAlign
    },
    getInputAlign() {
      return this.inheritProps.inputAlign !== null ? this.inheritProps.inputAlign : this.inputAlign
    },
    getErrorType() {
      return this.inheritProps.errorType
    },
    itemStyle() {
      const style = {}
      if (!this.getWrap) {
        style.padding = this.padding
      }
      const height = this.height || this.inheritProps.height
      if (!this.getWrap && height) {
        style.minHeight = this.$pi.common.addUnit(height)
      }
      return style
    },
    getLabelStyle() {
      const style = {}
      if (this.getWrap) {
        style.padding = this.padding
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
        style.padding = this.padding
      }
      return style
    },
    getInputAlignStyle() {
      return {
        justifyContent: alignFlexMap[this.getInputAlign]
      }
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
    // 从u-form的rules属性中，取出当前u-form-item的校验规则
    getRules() {
      // 父组件的所有规则
      let rules = this._parent.rules
      rules = rules ? rules[this.prop] : []
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
          return resolve(_getResolve())
        }
        const fieldValue = this._parent.model[this.prop]
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
            console.log(TAG, '表单校验失败', this.prop, errors, fields)
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
@import '../../scss/border.scss';

.pi-form-item {
  font-size: $pi-form-size;
  &.border {
    @include pi-border;
    &::after {
      border: 0 solid $pi-form-border-color;
      border-bottom-width: $pi-form-border-width;
    }
  }
  .form-label {
    font-weight: $pi-form-label-weight;
    color: $pi-form-label-color;
    &.border {
      @include pi-border;
      &::after {
        border: 0 solid $pi-form-border-color;
        border-bottom-width: $pi-form-border-width;
      }
    }
  }
  .content-wrap {
    &.nowrap {
      margin-left: 24rpx;
    }
    &.wrap {
      margin-top: 24rpx;
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
  /deep/ .content-wrap {
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
}
</style>
