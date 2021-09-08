<template>
  <button
    class="pi-button fix-webkit-appearance"
    :style="[getCustomStyle, customStyle]"
    :class="[customClass, { round: round }]"
    :size="size"
    :type="type"
    :plain="plain"
    :disabled="disabled"
    :form-type="formType"
    :open-type="openType"
    :app-parameter="appParameter"
    :hover-stop-propagation="hoverStopPropagation"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :lang="lang"
    :session-from="sessionFrom"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :hover-class="getHoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :loading="loading"
    @tap.stop="handleButtonTap"
    @getphonenumber="handleGetPhoneNumber($event)"
    @getuserinfo="handleGetUserInfo($event)"
    @error="handleError($event)"
    @opensetting="handleOpenSetting($event)"
    @launchapp="handleLaunchApp($event)"
  >
    <!-- 按钮内容 -->
    <slot />
    <view v-if="ripple" class="pi-abso-full pi-of-hidden" :class="[{ round }]">
      <view class="wave-ripple" :class="[{ active: waveInfo.active }]" :style="[waveStyle]" />
    </view>
  </button>
</template>

<script>
/**
 * 属性和官方uniapp button属性保持一致，扩展了一部分常用属性
 * 因为小程序不兼容v-bind="$attrs"写法，所以只能把官网属性重定义一遍
 */
import { getConfig } from '../../config'

import { debounce } from '@sadais/piui-tool/tools/common'
const TAG = 'PiOpentypeButton'
const { button } = getConfig()

export default {
  name: 'PiOpentypeButton',
  props: {
    // 按钮尺寸
    size: {
      // `'default'` `'large'` `'medium'` `'small'` `'tiny'` `'mini'`
      type: String,
      // 'default'
      default: button.size,
      validator: function(value) {
        return ['default', 'large', 'medium', 'small', 'tiny', 'mini'].includes(value)
      }
    },
    // 按钮的预置样式
    type: {
      // `'default'` `'primary'` `'warn'` `'secondary'` `'line'`
      type: String,
      // 'default'
      default: button.type,
      validator: function(value) {
        return ['default', 'primary', 'warn', 'secondary', 'line'].includes(value)
      }
    },
    // 按钮是否镂空
    plain: {
      type: Boolean,
      // false
      default: button.plain
    },
    // 是否禁止状态
    disabled: {
      type: Boolean,
      // false
      default: button.disabled
    },
    // 是否加载中
    loading: {
      type: Boolean,
      // false
      default: button.loading
    },
    // 取值为submit（提交表单），reset（重置表单）
    formType: {
      type: String,
      // ''
      default: button.formType
    },
    // 开放能力，具体请看uniapp稳定关于button组件部分说明
    openType: {
      type: String,
      // ''
      default: button.openType
    },
    // 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果
    hoverClass: {
      type: String,
      // 'button-hover'
      default: button.hoverClass
    },
    // 按住后多久出现点击态，单位毫秒
    hoverStartTime: {
      type: Number,
      // 20
      default: button.hoverStartTime
    },
    // 手指松开后点击态保留时间，单位毫秒
    hoverStayTime: {
      type: Number,
      // 70
      default: button.hoverStayTime
    },
    // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
    appParameter: {
      type: String,
      // ''
      default: button.appParameter
    },
    // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
    hoverStopPropagation: {
      type: Boolean,
      // false
      default: button.hoverStopPropagation
    },
    // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
    lang: {
      type: String,
      // 'en'
      default: button.lang
    },
    // 会话来源，open-type="contact"时有效。只微信小程序有效
    sessionFrom: {
      type: String,
      // ''
      default: button.sessionFrom
    },
    // 会话内消息卡片标题，open-type="contact"时有效
    // 默认当前标题，只微信小程序有效
    sendMessageTitle: {
      type: String,
      // ''
      default: button.sendMessageTitle
    },
    // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
    // 默认当前分享路径，只微信小程序有效
    sendMessagePath: {
      type: String,
      // ''
      default: button.sendMessagePath
    },
    // 会话内消息卡片图片，open-type="contact"时有效
    // 默认当前页面截图，只微信小程序有效
    sendMessageImg: {
      type: String,
      // ''
      default: button.sendMessageImg
    },
    // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
    // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
    showMessageCard: {
      type: Boolean,
      // false
      default: button.showMessageCard
    },
    // 自定义样式，对象形式
    customStyle: {
      type: Object,
      // {}
      default() {
        return button.customStyle
      }
    },
    // 自定义样式类，字符串形式
    customClass: {
      type: String,
      // {}
      default() {
        return button.customClass
      }
    },
    // 按钮宽度，不设置默认自动撑开，如果需要占满一行，填写’100%‘
    width: {
      type: [String, Number],
      // ''
      default: button.width
    },
    // 自定义颜色按钮（type为default，可自定义设置）
    color: {
      type: String,
      // ''
      default: button.color
    },
    // 自定义背景色按钮（type为default，可自定义设置）
    bgColor: {
      type: String,
      // ''
      default: button.bgColor
    },
    // 按钮是否椭圆
    round: {
      type: Boolean,
      // false
      default: button.round
    },
    // 是否开启水波纹效果（默认值：true）
    ripple: {
      type: Boolean,
      // true
      default: button.ripple
    },
    // 水波纹的背景颜色（默认值：''）
    rippleBgColor: {
      type: String,
      // ''
      default: button.rippleBgColor
    }
  },
  data() {
    return {
      waveInfo: {
        active: false, // 激活水波纹
        top: '', // 水波纹的起点Y坐标到按钮上边界的距离
        left: '', // 水波纹起点X坐标到按钮左边界的距离
        fields: { targetWidth: 0 } // 波纹按钮节点信息
      }
    }
  },
  computed: {
    getCustomStyle() {
      const style = {}

      if (this.color) style.color = this.color
      if (this.bgColor) style.backgroundColor = this.bgColor
      if (this.width) style.width = this.$pi.common.addUnit(this.width)

      if (style.width === '100%') {
        style.display = 'block'
      }

      return style
    },
    getHoverClass() {
      if (this.loading || this.disabled || this.ripple) return 'none'
      return this.hoverClass
    },
    waveStyle() {
      return {
        'top': this.waveInfo.top + 'px',
        'left': this.waveInfo.left + 'px',
        'width': this.waveInfo.fields.targetWidth + 'px',
        'height': this.waveInfo.fields.targetWidth + 'px',
        'background-color': this.rippleBgColor || 'rgba(0, 0, 0, 0.05)'
      }
    },
    canIUseGetUserProfile() {
      // 兼容最新版本的用户获取授权信息
      return uni.canIUse('getUserProfile') && uni.getUserProfile
    }
  },
  methods: {
    handleButtonTap(e) {
      if (this.loading || this.disabled) return
      // 兼容微信获取用户信息
      // #ifdef MP-WEIXIN
      if (this.openType === 'getUserInfo' && this.canIUseGetUserProfile) {
        uni.getUserProfile({
          desc: '授权登录',
          complete: res => {
            this.$emit('getuserinfo', {
              type: 'getuserinfo',
              detail: res
            })
          }
        })
      }
      // #endif
      this.$emit('click', e)
      // 点击事件
      console.log(TAG, '触发按钮click事件')
      if (!this.ripple) return
      // 是否开启水波纹效果
      this.waveInfo.active = false
      this.$nextTick(function() {
        this.queryWaveInfo(e)
      })
    },
    // 查询按钮的节点信息
    queryWaveInfo(e) {
      this.getElRectQuery().then(res => {
        // 查询返回的是一个数组节点
        let data = res[0]
        // 查询不到节点信息，不操作
        if (!data.width || !data.width) return
        // 水波纹的最终形态是一个正方形(通过border-radius让其变为一个圆形)，这里要保证正方形的边长等于按钮的最长边
        // 最终的方形（变换后的圆形）才能覆盖整个按钮
        data.targetWidth = data.height > data.width ? data.height : data.width
        if (!data.targetWidth) return
        this.waveInfo.fields = data
        let touchesX = '',
          touchesY = ''
        // #ifdef MP-BAIDU
        touchesX = e.changedTouches[0].clientX
        touchesY = e.changedTouches[0].clientY
        // #endif
        // #ifdef MP-ALIPAY
        touchesX = e.detail.clientX
        touchesY = e.detail.clientY
        // #endif
        // #ifndef MP-BAIDU || MP-ALIPAY
        touchesX = e.touches[0].clientX
        touchesY = e.touches[0].clientY
        // #endif
        // 获取触摸点相对于按钮上边和左边的x和y坐标，原理是通过屏幕的触摸点（touchesY），减去按钮的上边界data.top
        // 但是由于`transform-origin`默认是center，所以这里再减去半径才是水波纹view应该的位置
        // 总的来说，就是把水波纹的矩形（变换后的圆形）的中心点，移动到我们的触摸点位置
        this.waveInfo.top = touchesY - data.top - data.targetWidth / 2
        this.waveInfo.left = touchesX - data.left - data.targetWidth / 2
        this.$nextTick(() => {
          this.waveInfo.active = true
        })
      })
    },
    // 获取节点区域信息
    getElRectQuery() {
      return new Promise(resolve => {
        let queryInfo = ''
        queryInfo = uni.createSelectorQuery().in(this)
        // #ifdef MP-ALIPAY
        queryInfo = uni.createSelectorQuery()
        // #endif
        queryInfo.select('.pi-button').boundingClientRect()
        queryInfo.exec(data => {
          resolve(data)
        })
      })
    },
    handleGetPhoneNumber(e) {
      // 微信小程序中获取用户手机号回调，需设置open-type="getPhoneNumber"
      this.$emit('getphonenumber', e)
    },
    handleGetUserInfo(e) {
      // 微信小程序中用户点击该按钮时，会返回获取到的用户信息，从返回参数的detail中获取到的值同uni.getUserInfo，需设置open-type="getUserInfo"
      if (this.canIUseGetUserProfile) return
      this.$emit('getuserinfo', e)
    },
    handleError(e) {
      // 微信小程序中当使用开放能力时，发生错误的回调
      this.$emit('error', e)
    },
    handleOpenSetting(e) {
      // 微信小程序中在打开授权设置页并关闭后回调，需设置open-type="openSetting"
      this.$emit('opensetting', e)
    },
    handleLaunchApp(e) {
      // 微信小程序中从小程序打开 App 成功的回调
      this.$emit('launchapp', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.round {
  overflow: hidden;
  border-radius: 500000rpx !important;
}

.pi-button {
  position: relative;
  display: inline-block;
  padding: $pi-button-default-padding;
  border: none;
  border-radius: $pi-button-default-radius;
  // 默认样式
  &[type='default'] {
    color: #333333;
    background-color: #e5e5e5;
  }

  &::after {
    border: none;
  }
  &[disabled] {
    opacity: $pi-disabled-opacity;
  }
  &[loading]::before {
    margin-right: 12rpx;
  }
  // 椭圆
  &.round {
    &::after {
      @extend .round;
    }
  }
  // 默认
  &[size='default'] {
    height: $pi-button-default-height;
    padding: $pi-button-default-padding;
    font-size: $pi-button-default-font-size;
    line-height: $pi-button-default-height;
    &[plain]::after {
      border: 8rpx solid #e5e5e5;
    }
  }
  // 大
  &[size='large'] {
    height: $pi-button-large-height;
    padding: $pi-button-large-padding;
    font-size: $pi-button-large-font-size;
    line-height: $pi-button-large-height;
    border-radius: $pi-button-large-radius;
  }
  // 中
  &[size='medium'] {
    height: $pi-button-medium-height;
    padding: $pi-button-medium-padding;
    font-size: $pi-button-medium-font-size;
    line-height: $pi-button-medium-height;
    border-radius: $pi-button-medium-radius;
  }
  // 小
  &[size='small'] {
    height: $pi-button-small-height;
    padding: $pi-button-small-padding;
    font-size: $pi-button-small-font-size;
    line-height: $pi-button-small-height;
    border-radius: $pi-button-small-radius;
  }
  // 超小
  &[size='tiny'] {
    height: $pi-button-tiny-height;
    padding: $pi-button-tiny-padding;
    font-size: $pi-button-tiny-font-size;
    line-height: $pi-button-tiny-height;
    border-radius: $pi-button-tiny-radius;
  }
  // 迷你
  &[size='mini'] {
    height: $pi-button-mini-height;
    padding: $pi-button-mini-padding;
    font-size: $pi-button-mini-font-size;
    line-height: $pi-button-mini-height;
    border-radius: $pi-button-mini-radius;
  }

  // 主要样式
  &[type='primary'] {
    background-color: $pi-primary-color;
  }
  &.button-hover[type='primary'] {
    background-color: rgba($pi-primary-color, 0.8);
  }

  // 次要
  &[type='secondary'] {
    color: $pi-primary-color;
    background-color: rgba($pi-primary-color, 0.1);
  }
  &.button-hover[type='secondary'] {
    background-color: rgba($pi-primary-color, 0.08);
  }

  // 线框
  &[type='line'] {
    color: $pi-primary-color;
    background-color: #ffffff;
    &::after {
      border: 8rpx solid $pi-primary-color;
    }
  }
  &.button-hover[type='line'] {
    background-color: rgba($pi-primary-color, 0.08);
  }

  .wave-ripple {
    position: absolute;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    background-clip: padding-box;
    border-radius: 100%;
    opacity: 1;
    transform: scale(0);
    transform-origin: center;
    &.active {
      opacity: 0;
      transition: opacity 1s linear, transform 0.4s linear;
      transform: scale(2);
    }
  }
}
</style>
