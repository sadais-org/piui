<template>
  <button
    class="pi-button fix-webkit-appearance"
    :style="[getCustomStyle]"
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
    @tap="handleButtonTap"
    @getphonenumber="$emit('getphonenumber', $event)"
    @getuserinfo="$emit('getuserinfo', $event)"
    @error="$emit('error', $event)"
    @opensetting="$emit('opensetting', $event)"
    @launchapp="$emit('launchapp', $event)"
  >
    <slot />
    <view v-if="ripple" class="pi-abso-full" :class="[{ round: round }]">
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

import { debounce } from '../../tools/common'
const TAG = 'PiButton'
const { button } = getConfig()

export default {
  name: TAG,
  props: {
    /**
     * uniapp button 官方属性定义
     * ---------------------------------------------------------------------------------------------
     */
    // 按钮尺寸，default，medium, mini（默认值：'default'）
    size: {
      type: String,
      default: button.size
    },
    // 按钮的预置样式，default，primary，warn（默认值：'default'）
    type: {
      type: String,
      default: button.type
    },
    // 按钮是否镂空（默认值：false）
    plain: {
      type: Boolean,
      default: button.plain
    },
    // 是否禁止状态（默认值：false）
    disabled: {
      type: Boolean,
      default: button.disabled
    },
    // 是否加载中（默认值：false）
    loading: {
      type: Boolean,
      default: button.loading
    },
    // 取值为submit（提交表单），reset（重置表单）（默认值：''）
    formType: {
      type: String,
      default: button.formType
    },
    // 开放能力，具体请看uniapp稳定关于button组件部分说明（默认值：''）
    openType: {
      type: String,
      default: button.openType
    },
    // 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果，默认（button-hover）
    hoverClass: {
      type: String,
      default: button.hoverClass
    },
    // 按住后多久出现点击态，单位毫秒（默认值：20）
    hoverStartTime: {
      type: Number,
      default: button.hoverStartTime
    },
    // 手指松开后点击态保留时间，单位毫秒（默认值：70）
    hoverStayTime: {
      type: Number,
      default: button.hoverStayTime
    },
    // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效（默认值：''）
    appParameter: {
      type: String,
      default: button.appParameter
    },
    // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效（默认值：false）
    hoverStopPropagation: {
      type: Boolean,
      default: button.hoverStopPropagation
    },
    // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效（默认值：'en'）
    lang: {
      type: String,
      default: button.lang
    },
    // 会话来源，open-type="contact"时有效。只微信小程序有效（默认值：''）
    sessionFrom: {
      type: String,
      default: button.sessionFrom
    },
    // 会话内消息卡片标题，open-type="contact"时有效（默认值：''）
    // 默认当前标题，只微信小程序有效
    sendMessageTitle: {
      type: String,
      default: button.sendMessageTitle
    },
    // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效（默认值：''）
    // 默认当前分享路径，只微信小程序有效
    sendMessagePath: {
      type: String,
      default: button.sendMessagePath
    },
    // 会话内消息卡片图片，open-type="contact"时有效（默认值：''）
    // 默认当前页面截图，只微信小程序有效
    sendMessageImg: {
      type: String,
      default: button.sendMessageImg
    },
    // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
    // 用户点击后可以快速发送小程序消息，open-type="contact"时有效（默认值：'false'）
    showMessageCard: {
      type: Boolean,
      default: button.showMessageCard
    },
    /**
     * 自定义属性扩展
     * ---------------------------------------------------------------------------------------------
     */
    // 自定义样式，对象形式（默认值：{}）
    customStyle: {
      type: Object,
      default() {
        return button.customStyle
      }
    },
    // 自定义样式类，字符串形式（''）
    customClass: {
      type: String,
      default() {
        return button.customClass
      }
    },
    // 自定义颜色按钮（type为default，可自定义设置）
    color: {
      type: String,
      default: ''
    },
    // 自定义背景色按钮（type为default，可自定义设置）
    bgColor: {
      type: String,
      default: ''
    },
    // 按钮是否椭圆（默认值：false）
    round: {
      type: Boolean,
      default: button.round
    },
    // 是否开启水波纹效果（默认值：true）
    ripple: {
      type: Boolean,
      default: button.ripple
    },
    // 水波纹的背景颜色（默认值：''）
    rippleBgColor: {
      type: String,
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
      const customStyle = {
        ...this.customStyle
      }
      if (this.type === 'default') {
        if (this.color) customStyle.color = this.color
        if (this.bgColor) customStyle.backgroundColor = this.bgColor
      }
      return customStyle
    },
    getHoverClass() {
      if (this.loading || this.disabled || this.ripple) return ''
      return this.hoverClass
    },
    waveStyle() {
      return {
        'top': this.waveInfo.top + 'px',
        'left': this.waveInfo.left + 'px',
        'width': this.waveInfo.fields.targetWidth + 'px',
        'height': this.waveInfo.fields.targetWidth + 'px',
        'background-color': this.rippleBgColor || 'rgba(0, 0, 0, 0.1)'
      }
    }
  },
  methods: {
    handleButtonTap: debounce(function(e) {
      if (this.loading || this.disabled || !this.ripple) return
      // 是否开启水波纹效果
      this.waveInfo.active = false
      this.$emit('click', e)
      this.$emit('tap', e)
      this.$nextTick(function() {
        this.queryWaveInfo(e)
      })
    }, 200),
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
    }
  }
}
</script>

<style lang="scss" scoped>
.round {
  overflow: hidden;
  border-radius: 500000rpx;
}

.pi-button {
  position: relative;
  border: none;
  &::after {
    border: none;
  }
  &[disabled] {
    opacity: 0.6;
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
  // 默认尺寸
  &[size='default'] {
    height: $pi-button-default-height;
    font-size: $pi-button-default-font-size;
    line-height: $pi-button-default-height;
  }
  &[size='medium'] {
    display: inline-block;
    height: $pi-button-medium-height;
    padding: $pi-button-medium-padding;
    font-size: $pi-button-medium-font-size;
    line-height: $pi-button-medium-height;
  }
  &[size='mini'] {
    display: inline-block;
    height: $pi-button-mini-height;
    padding: $pi-button-mini-padding;
    font-size: $pi-button-mini-font-size;
    line-height: $pi-button-mini-height;
  }
  // 主要样式
  &[type='primary'] {
    background-color: $pi-primary-color;
  }
  &.button-hover[type='primary'] {
    background-color: rgba($pi-primary-color, 0.8);
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