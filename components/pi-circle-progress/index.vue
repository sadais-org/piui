<!--
 * @Author: zhouxianpan
 * @Date: 2021-09-06 10:07:33
 * @LastEditTime: 2021-11-16 20:01:27
 * @LastEditors: zhangzhenfei
 * @Description: 
 * @FilePath: \piui\components\pi-circle-progress\index.vue
-->
<template>
<view>
      <canvas :id="elBgId" class="pi-canvas-bg"></canvas>
      <canvas :id="elId" class="pi-canvas"></canvas>
</view>
</template>

<script >

import { getConfig } from '../../config'
const { CircleProgress } = getConfig()
const TAG = 'PiCircleProgress'

export default {
    name: 'PiCircleProgress',
  props: {
     // 进度 默认50%
    percent: {
      type:number,
      default() {
        return PiCircleProgress.percent
    },
    // 动画时间  默认1秒
    duration: {
      type:number,
      default() {
        return PiCircleProgress.duration
      }
    },
    // 圆的半径
    radius : {
      type:number,
      default() {
        return PiCircleProgress.radius
      }
    },
    // 环形进度的width
    lineWidth : {
    type:number,
      default() {
        return PiCircleProgress.lineWidth
      }
    },
    // 进度条的底色
    strokeStyle: {
      type:string,
      default(){
        return PiCircleProgress.strokeStyle
      }
    },
    // 激活进度条的底色
    circleColor: {
      type:string,
      default(){
        return PiCircleProgress.circleColor
      }
    },
    // 进度条的形态
    lineCap : {
    type:string,
      default(){
        return 'round'
      }
    },
    // 中间显示的文字
    text: {
    type:string,
    default(){
        return PiCircleProgress.text
      }
    },
    // 显示字体颜色
    fontColor : {
    type:string,
    default(){
        return PiCircleProgress.fontColor
      }
    },
    // 显示字体大小
    fontSize : {
    type:number,
    default(){
        return PiCircleProgress.fontSize
      }
    },
  },
  data() {
return {
      progressContext: null,
      //开始的角度
      startAngle: -Math.PI / 2,
      newVal: 0,
      oldVal: 0,
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
            percent: {
                handler(newVal, oldVal) {
                    console.log(newVal);
                    console.log(oldVal);
                    if (newVal > 100) newVal = 100;
                    if (newVal < 0) oldVal = 0
                    this.newVal = newVal
                    this.oldVal = oldVal
                    this.drawCircleByProgress(oldVal)
                },
                deep: true
            }
        },
        computed: {
            // 圆的实际半径 =半径+环形进度条的宽度
            moveWith() {
                return this.radius + this.lineWidth
            },

        },
        created() {
            this.newVal = this.percent
            this.oldVal = 0
            console.log(-Math.PI / 2);

        },
        methods: {

            drawProgressBg() {
                let canvas = document.getElementById(this.elBgId)
                    // 宽高
                canvas.width = this.moveWith * 2
                canvas.height = this.moveWith * 2
                let ctx = canvas.getContext('2d')
                ctx.beginPath();
                // X,Y轴中心点+半径+起始方向+结束 +是否顺逆
                ctx.arc(this.moveWith, this.moveWith, this.radius, 0, Math.PI * 2, false);
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.strokeStyle;
                // 文字
                ctx.font = 'bold ' + this.fontSize + 'px' + ' Arial'
                ctx.fillStyle = this.fontColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.moveWith, this.moveWith, this.radius);
                ctx.stroke();
                ctx.closePath();

            },
            // 激活部分
            drawCircleByProgress(progress) {
                let canvas = document.getElementById(this.elId)
                canvas.width = this.moveWith * 2
                canvas.height = this.moveWith * 2
                let ctx = canvas.getContext('2d')
                let endAngel = ((2 * Math.PI) / 100) * progress + this.startAngle
                ctx.beginPath()
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.circleColor;
                ctx.lineCap = this.lineCap
                ctx.arc(this.moveWith, this.moveWith, this.radius, this.startAngle, endAngel, false);
                ctx.stroke();
                ctx.closePath();
                // 实际时间
                let time = Math.floor(this.duration / 100)
                if (this.newVal > this.oldVal) {

                    progress++;

                    if (progress > this.newVal) return;
                } else {

                    progress--;
                    if (progress < this.newVal) return;
                }
                // 动画
                setTimeout(() => {
                    // 定时器 进度条有动画效果
                    this.drawCircleByProgress(progress);
                }, time);
            }
        }
    }

</script>
<style scoped lang="scss">
.pi-canvas-bg {
        position: absolute;
    }

  .pi-canvas {
        position: absolute;
    }

</style>