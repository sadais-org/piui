import { debounce } from '@sadais/piui-tool/tools/common'

export default {
  data() {
    return {
      touch: {
        prev: null,
        deltaX: 0,
        deltaY: 0,
        prevVector: null
      },
      cutMode: null
    }
  },
  methods: {
    setCutMode(mode) {
      this.cutMode = mode
      console.log('setCutMode: ', mode)
    },
    handleStart(e) {
      const touches = (e && e.touches) || []
      const touch = touches[0] || e
      this.touch.prev = { x: touch.pageX, y: touch.pageY }
      this.focus = false
      if (touches.length > 1) {
        const p = touches[1]
        this.touch.prevVector = {
          x: p.pageX - touch.pageX,
          y: p.pageY - touch.pageY
        }
      }
    },
    handleMove(e) {
      const touches = (e && e.touches) || []
      const touch = touches[0] || e
      this.focus = false
      if (this.touch.prev) {
        this.touch.deltaX = touch.pageX - this.touch.prev.x
        this.touch.deltaY = touch.pageY - this.touch.prev.y
        this.cutMode ? this.updateCrop() : this.updateImgTranslate()
      }
      if (touches.length > 1) {
        const p = touches[1]
        const curVector = { x: p.pageX - touch.pageX, y: p.pageY - touch.pageY }
        if (this.touch.prevVector) {
          if (!this.disableRotate) {
            this.img.transform.rotate += this.angle(this.touch.prevVector, curVector)
          }
          const zoom = this.mod(curVector) / this.mod(this.touch.prevVector)
          this.img.transform.scale *= zoom
        }
        this.touch.prevVector = curVector
      }
      this.touch.prev = { x: touch.pageX, y: touch.pageY }
    },
    handleEnd(e) {
      this.touch = {}
      this.cutMode = null
      this.focus = true
      this.draw()
    },
    updateImgTranslate() {
      const transform = this.img.transform
      transform.x += this.touch.deltaX
      transform.y += this.touch.deltaY
      this.detectBoundary()
    },
    ensureCropMinSize() {
      const crop = this.crop
      const touch = this.touch
      const mode = this.cutMode
      const minW = this.toPx(this.minCropSize.width)
      const minH = this.toPx(this.minCropSize.height)
      switch (mode) {
        case 'lt': {
          if (touch.deltaX > 0 || touch.deltaY > 0) {
            touch.deltaX = Math.min(touch.deltaX, crop.width - minW)
            touch.deltaY = Math.min(touch.deltaY, crop.height - minH)
          }
          break
        }
        case 'rt': {
          if (touch.deltaX < 0 || touch.deltaY > 0) {
            touch.deltaX = Math.max(touch.deltaX, minW - crop.width)
            touch.deltaY = Math.min(touch.deltaY, crop.height - minH)
          }
          break
        }
        case 'rb': {
          if (touch.deltaX < 0 || touch.deltaY < 0) {
            touch.deltaX = Math.max(touch.deltaX, minW - crop.width)
            touch.deltaY = Math.max(touch.deltaY, minH - crop.height)
          }
          break
        }
        case 'lb': {
          if (touch.deltaX > 0 || touch.deltaY < 0) {
            touch.deltaX = Math.min(touch.deltaX, crop.width - minW)
            touch.deltaY = Math.max(touch.deltaY, minH - crop.height)
          }
          break
        }
      }
    },
    updateCrop() {
      this.ensureCropMinSize()
      let { deltaX, deltaY } = this.touch
      if (this.keepCropRatio) {
        deltaY = deltaX * this.crop.ratio
      }

      const crop = this.crop
      switch (this.cutMode) {
        case 'lt': {
          crop.top += deltaY
          crop.left += deltaX
          break
        }
        case 'rt': {
          crop.right += -deltaX
          crop.top += this.keepCropRatio ? -deltaY : deltaY
          break
        }
        case 'rb': {
          crop.right += -deltaX
          crop.bottom += -deltaY
          break
        }
        case 'lb': {
          crop.left += deltaX
          crop.bottom -= deltaY
          break
        }
      }
      crop.width = this.root.width - crop.left - crop.right
      crop.height = this.root.height - crop.top - crop.bottom
    },
    detectBoundary: debounce(function(e) {
      if (this.boundaryDetect) {
        console.log('图片剪裁插件 -> 边界检查')
        const angle = (this.img.transform.rotate * Math.PI) / 180
        const cos = Math.cos,
          sin = Math.sin,
          abs = Math.abs
        const { width: w, height: h } = this.img
        const scale = this.img.transform.scale
        const realW = (w * abs(cos(angle)) + h * abs(sin(angle))) * scale
        const realH = (w * abs(sin(angle)) + h * abs(cos(angle))) * scale
        const minX = this.crop.left + this.crop.width - w - (realW - w) / 2
        const maxX = this.crop.left + (realW - w) / 2
        let x = this.img.transform.x
        x = Math.floor(x < minX ? minX : x > maxX ? maxX : x)
        this.img.transform.x = x

        const minY = this.crop.top + this.crop.height - h - (realH - h) / 2
        const maxY = this.crop.top + (realH - h) / 2
        let y = this.img.transform.y
        y = Math.floor(y < minY ? minY : y > maxY ? maxY : y)
        this.img.transform.y = y
      }
    }, 200)
  }
}
