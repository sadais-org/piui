export default {
  data() {
    return {
      canvasId: ''
    }
  },
  created() {
    this.canvasId = this.generateCanvasId()
  },
  computed: {
    canvasStyle() {
      const w = this.crop.width * this.canvasZoom
      const h = this.crop.height * this.canvasZoom
      return {
        width: `${w}px`,
        height: `${h}px`
      }
    }
  },
  methods: {
    // this method copy from: https://github.com/prianyu/uniapp-nice-cropper/blob/master/src/cropper.js
    generateCanvasId() {
      const seeds = 'abcdefghijklmnopqrstuvwxyz'
      const arr = seeds
        .split('')
        .concat(seeds.toUpperCase().split(''))
        .concat('0123456789'.split(''))
      let m = arr.length
      let i
      while (m) {
        i = Math.floor(Math.random() * m--)
        const temp = arr[m]
        arr[m] = arr[i]
        arr[i] = temp
      }
      return arr.slice(0, 16).join('')
    },
    draw() {
      let ctx
      // #ifdef MP-ALIPAY
      ctx = uni.createCanvasContext(this.canvasId)
      // #endif
      // #ifndef MP-ALIPAY
      ctx = uni.createCanvasContext(this.canvasId, this)
      // #endif
      ctx.save()
      // 填充裁剪窗口
      ctx.setFillStyle('#ffffff')
      // 绘制之前
      // @arg ctx 结构: {ctx: canvas实例, width, height}
      this.$emit('beforeDraw', {
        ctx,
        width: this.crop.width,
        height: this.crop.height
      })
      ctx.fillRect(0, 0, this.crop.width * this.canvasZoom, this.crop.height * this.canvasZoom)
      // 将画布的坐标原点 移动到裁剪窗口左上角对应的那个像素点的位置
      ctx.translate(
        (this.img.width * 0.5 + this.img.transform.x - this.crop.left) * this.canvasZoom,
        (this.img.height * 0.5 + this.img.transform.y - this.crop.top) * this.canvasZoom
      )
      // 旋转图片
      ctx.rotate((this.img.transform.rotate * Math.PI) / 180)
      // 将坐标原点移动回左上角
      ctx.translate(
        -this.img.width * 0.5 * this.img.transform.scale * this.canvasZoom,
        -this.img.height * 0.5 * this.img.transform.scale * this.canvasZoom
      )

      ctx.drawImage(
        this.img.path,
        0,
        0,
        this.img.width * this.img.transform.scale * this.canvasZoom,
        this.img.height * this.canvasZoom * this.img.transform.scale
      )
      // 绘制完裁剪图片之后
      // @arg ctx 结构: {ctx: canvas实例, width, height}
      ctx.restore()
      this.$emit('afterDraw', {
        ctx,
        width: this.crop.width * this.canvasZoom,
        height: this.crop.height * this.canvasZoom
      })
      ctx.draw(false, () => {
        uni.canvasToTempFilePath(
          {
            canvasId: this.canvasId,
            quality: this.quality,
            fileType: this.fileTpe,
            success: res => {
              // 裁剪成功
              // @arg 参数1 结构：{ img: 本地路径 or base64(h5端), width, height }
              this.$emit('cropped', {
                img: res.tempFilePath,
                width: this.crop.width * this.canvasZoom,
                height: this.crop.height * this.canvasZoom
              })
            }
          },
          this
        )
      })
    }
  }
}
