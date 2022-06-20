<template>
  <view class="pi-form" :style="[customStyle]" :class="[{ border }, customClass]">
    <pi-section
      v-if="title"
      :title="title"
      :desc="desc"
      :custom-style="titleStyle"
      padding="24rpx 32rpx"
    />
    <slot />
  </view>
</template>

<script>
import { parentInit } from '../../mixin/props-sync'
import { getConfig } from '../../config'

const TAG = 'PiForm'
const { form } = getConfig()

// 仅仅作为一个容器，批量设置form-item的属性
export default {
  name: 'PiForm',
  mixins: [
    parentInit([
      'height',
      'border',
      'padding',
      'labelWidth',
      'labelAlign',
      'labelStyle',
      'itemVerticalAlign',
      'inputAlign',
      'wrap',
      'wrapBottomGap',
      'labelWrapBorder',
      'colon',
      'disabled',
      'border',
      'errorType',
      'showRightIcon',
      'rightIcon'
    ])
  ],
  props: {
    // 表单项值
    model: {
      required: false
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return form.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return form.customClass
      }
    },
    // 列表面板标题
    title: {
      type: String,
      default() {
        // ''
        return form.title
      }
    },
    // 列表面板描述
    desc: {
      type: String,
      default() {
        // ''
        return form.desc
      }
    },
    // 标题自定义样式
    titleStyle: {
      type: Object,
      default() {
        // {}
        return form.titleStyle
      }
    },
    // 高度
    height: {
      type: [String, Number],
      default() {
        // null
        return form.height
      }
    },
    // 列表项内边距
    padding: {
      type: String,
      default() {
        // ''
        return form.padding
      }
    },
    // 表单项 label 宽度，默认单位为rpx
    labelWidth: {
      type: [String, Number],
      default() {
        // 120
        return form.labelWidth
      }
    },
    // 表单label区域 label 对齐方式
    labelAlign: {
      // `'left'` `'center'` `'right'`
      type: [Object, String],
      default() {
        // null
        return form.labelAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 表单项 label样式
    labelStyle: {
      type: Object,
      default() {
        // {}
        return form.labelStyle
      }
    },
    // 表单项垂直对齐方式，可选值为 top center bottom
    itemVerticalAlign: {
      // `'top'` `'center'` `'bottom'`
      type: String,
      // 'center'
      default() {
        return form.itemVerticalAlign
      },
      validator: function(value) {
        return [null, 'top', 'center', 'bottom'].includes(value)
      }
    },
    // 表单输入区域 label 对齐方式
    inputAlign: {
      // `'left'` `'center'` `'right'`
      type: [Object, String],
      default() {
        // null
        return form.inputAlign
      },
      validator: function(value) {
        return [null, 'left', 'center', 'right'].includes(value)
      }
    },
    // 是否以换行样式显示表单
    wrap: {
      type: Boolean,
      // null
      default: form.wrap
    },
    // wrap模式下是否在底部增加表单项之间的间距
    wrapBottomGap: {
      type: Boolean,
      // null
      default: form.wrapBottomGap
    },
    // wrap样式label是否显示边框
    labelWrapBorder: {
      type: Boolean,
      // null
      default: form.labelWrapBorder
    },
    // 是否在 label 后面添加冒号
    colon: {
      type: Boolean,
      // false
      default: form.colon
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      // false
      default: form.disabled
    },
    // 是否显示边框
    border: {
      type: Boolean,
      // false
      default: form.border
    },
    // 表单校验两种提示
    errorType: {
      // `'message'-输入框下方提示` `'toast'-提示(只提示第一个错误)`
      type: String,
      // 'message'
      default() {
        return form.errorType
      },
      validator: function(value) {
        return ['message', 'toast'].includes(value)
      }
    },
    // 是否显示右边icon
    showRightIcon: {
      type: Boolean,
      // true
      default() {
        // true
        return form.showRightIcon
      }
    },
    // 右侧icon配置
    rightIcon: {
      type: Object,
      default() {
        return form.rightIcon
      }
    },
    // 表单校验规则
    rules: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      validRules: {}
    }
  },
  watch: {
    rules: {
      deep: true,
      immediate: true,
      handler(value) {
        this.setRules(value)
      }
    }
  },
  methods: {
    // 由于跨平台限制，无法通过props传递方法，通过refs方式在onReady生命周期设置校验规则
    setRules(rules) {
      this.validRules = rules
    },
    // 校验数据
    async validation() {
      const validations = this._children.map(c => c.validation())
      const results = await Promise.all(validations)
      const failedResults = results.filter(result => result.validateState === 'error')
      if (this.errorType === 'toast' && failedResults.length > 0) {
        this.$toast(failedResults[0].validateMessage)
      }
      return failedResults
    },
    /*  @vuese
     * 重置表单项，支持传入prop来重置单个或部分表单项
     * @arg prop 需要重置校验的表单项prop,不传为重置全部表单项校验
     */
    resetValidation(prop = '') {
      if (prop) {
        const target = this._children.find(c => c.prop === prop)
        target && target.resetValidation()
      } else {
        this._children.forEach(c => c.resetValidation())
      }
    }
  }
}
</script>
