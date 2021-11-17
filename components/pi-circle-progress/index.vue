<!--
 * @Author: zhouxianpan
 * @Date: 2021-09-06 10:07:33
 * @LastEditTime: 2021-11-17 09:51:45
 * @LastEditors: zhangzhenfei
 * @Description: 
 * @FilePath: /piui-doc/piui/components/pi-circle-progress/index.vue
-->
<template>
  <view
    class="circle-progress"
    :style="{
      width: widthPx + 'px',
      height: widthPx + 'px',
      backgroundColor: bgColor
    }"
  >
    <canvas
      :id="elBgId"
      :canvas-id="elBgId"
      class="pi-canvas-bg"
      :style="{
        width: widthPx + 'px',
        height: widthPx + 'px'
      }"
    ></canvas>
    <canvas
      :id="elId"
      :canvas-id="elId"
      class="pi-canvas"
      :style="{
        width: widthPx + 'px',
        height: widthPx + 'px'
      }"
    ></canvas>
  </view>
</template>
<script>
import { getConfig } from '../../config'
const { circleProgress } = getConfig()

export default {
  name: 'PiCircleProgress',
  props: {
    // 圆环进度百分比值
    percent: {
      type: Number,
      default: circleProgress.percent,
      // 限制值在0到100之间
      validator: val => {
        return val >= 0 && val <= 100
      }
    },
    // 整个圆环进度区域的背景色
    bgColor: {
      type: String,
      default: circleProgress.bgColor
    },
    // 底部圆环的颜色（灰色的圆环）
    inactiveColor: {
      type: String,
      default: circleProgress.inactiveColor
    },
    // 圆环激活部分的颜色
    activeColor: {
      type: String,
      default: circleProgress.activeColor
    },
    // 圆环线条的宽度，单位rpx
    borderWidth: {
      type: [Number, String],
      default: circleProgress.borderWidth
    },
    // 整个圆形的宽度，单位rpx
    width: {
      type: [Number, String],
      default: circleProgress.width
    },
    // 整个圆环执行一圈的时间，单位ms
    duration: {
      type: [Number, String],
      default: circleProgress.duration
    },
    // 主题类型
    type: {
      type: String,
      default: circleProgress.type
    },

    // 字体大小
    fontSize: {
      type: String,
      default: circleProgress.fontSize
    },
    //显示的文字 默认为空
    text: {
      type: String,
      default: circleProgress.text
    }
  },
  data() {
    return {
      elBgId: 'pCircleProgressBgId', // 微信小程序中不能使用this.$pi形式动态生成id值，否则会报错
      elId: 'pCircleProgressElId',
      elBgId: this.$pi.guid(), // 支付宝等小程序 动态生产ID
      elId: this.$pi.guid(),
      progressContext: null,
      //开始的角度
      widthPx: uni.upx2px(this.width), // 转成px后的整个组件的背景宽度
      borderWidthPx: uni.upx2px(this.borderWidth), // 转成px后的圆环的宽度
      startAngle: -Math.PI / 2, // canvas画圆的起始角度，默认为3点钟方向，定位到12点钟方向
      progressContext: '', // 活动圆的canvas上下文
      newPercent: 0, // 当动态修改进度值的时候，保存进度值的变化前后值，用于比较用
      oldPercent: 0 // 当动态修改进度值的时候，保存进度值的变化前后值，用于比较用
    }
  },
  mounted() {
    setTimeout(() => {
      // 背景圆
      this.drawProgressBg()
      // 进度圆
      this.drawCircleByProgress(this.percent)
    }, 50)
  },
  watch: {
    // 深度监听进度
    percent(nVal, oVal = 0) {
      if (nVal > 100) nVal = 100
      if (nVal < 0) oVal = 0
      // 此值其实等于this.percent，命名一个新值
      this.newPercent = nVal
      this.oldPercent = oVal
      setTimeout(() => {
        // 无论是百分比值增加还是减少，需要操作还是原来的旧的百分比值
        // 将此值减少或者新增到新的百分比值
        this.drawCircleByProgress(oVal)
      }, 50)
    }
  },
  computed: {
    // 有type主题时，优先起作用
    circleColor() {
      if (['success', 'error', 'info', 'primary', 'warning'].indexOf(this.type) >= 0)
        return this.$u.color[this.type]
      else return this.activeColor
    }
  },
  created() {
    console.log(this.$pi)
    this.newPercent = this.percent
    this.oldPercent = 0
  },
  methods: {
    drawProgressBg() {
      let ctx = uni.createCanvasContext(this.elBgId, this)
      ctx.setLineWidth(this.borderWidthPx) // 设置圆环宽度
      ctx.setStrokeStyle(this.inactiveColor) // 线条颜色
      ctx.beginPath() // 开始描绘路径
      // 设置一个原点(110,110)，半径为100的圆的路径到当前路径
      let radius = this.widthPx / 2
      ctx.arc(radius, radius, radius - this.borderWidthPx, 0, 2 * Math.PI, false)
      ctx.stroke() // 对路径进行描绘
      ctx.draw()
    },
    // 激活部分
    drawCircleByProgress(progress) {
      // 第一次操作进度环时将上下文保存到了this.data中，直接使用即可
      let ctx = this.progressContext
      if (!ctx) {
        ctx = uni.createCanvasContext(this.elId, this)
        this.progressContext = ctx
      }
      // 表示进度的两端为圆形
      ctx.setLineCap('round')
      // 设置线条的宽度和颜色
      ctx.setLineWidth(this.borderWidthPx)
      ctx.setStrokeStyle(this.circleColor)
      // 将总过渡时间除以100，得出每修改百分之一进度所需的时间
      let time = Math.floor(this.duration / 100)
      // 结束角的计算依据为：将2π分为100份，乘以当前的进度值，得出终止点的弧度值，加起始角，为整个圆从默认的
      // 3点钟方向开始画图，转为更好理解的12点钟方向开始作图，这需要起始角和终止角同时加上this.startAngle值
      let endAngle = ((2 * Math.PI) / 100) * progress + this.startAngle
      ctx.beginPath()
      // 半径为整个canvas宽度的一半
      let radius = this.widthPx / 2
      ctx.arc(radius, radius, radius - this.borderWidthPx, this.startAngle, endAngle, false)
      ctx.textAlign = 'center'
      ctx.font = this.fontSize + ' Arial'
      ctx.fillText(this.text, radius, radius)
      ctx.stroke()
      ctx.draw()
      // 如果变更后新值大于旧值，意味着增大了百分比
      if (this.newPercent > this.oldPercent) {
        // 每次递增百分之一
        progress++
        // 如果新增后的值，大于需要设置的值百分比值，停止继续增加
        if (progress > this.newPercent) return
      } else {
        // 同理于上面
        progress--
        if (progress < this.newPercent) return
      }
      setTimeout(() => {
        // 定时器，每次操作间隔为time值，为了让进度条有动画效果
        this.drawCircleByProgress(progress)
      }, time)
    }
  }
}
</script>
<style scoped lang="scss">
.circle-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pi-canvas-bg {
  position: absolute;
}
.pi-canvas {
  position: absolute;
}
</style>
