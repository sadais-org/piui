<!--
 * @Author: zhangzhenfei
 * @Date: 2021-08-13 11:31:57
 * @LastEditTime: 2021-11-17 10:11:39
 * @LastEditors: zhangzhenfei
 * @Description: 图片上传组件
 * @FilePath: /piui-awesome/src/piui/components/pi-upload-img/index.vue
-->

<template>
  <view class="pi-upload-img" :style="[customStyle]" :class="[customClass]">
    <!-- 已上传图片展示 -->
    <view
      v-for="(img, index) in getImgs"
      :key="index"
      class="pi-rela pi-flex-column-center"
      @tap="handlePreviewImage(img)"
    >
      <view class="close" @tap.stop="handleDelete(index)">
        <pi-icon name="roundclosefill" color="#8e8e8e" size="36" />
      </view>
      <image
        :style="[getItemStyle]"
        class="pi-of-hidden"
        :mode="imageMode"
        :src="imgField ? img[imgField] : img"
      />
    </view>
    <!-- 上传框 -->
    <view v-if="getUploadMaxCount">
      <view :style="[getUploadBtnStyle]" class="pi-flex-column-center" @tap="handleChooseImage">
        <slot name="uploadBtn">
          <!-- 添加按钮 -->
          <pi-icon
            :custom-style="getUploadIcon.customStyle"
            :custom-class="getUploadIcon.customClass"
            :name="getUploadIcon.name"
            :dot="getUploadIcon.dot"
            :dot-radius="getUploadIcon.dotRadius"
            :badge="getUploadIcon.badge"
            :color="getUploadIcon.color"
            :size="getUploadIcon.size"
            :class-prefix="getUploadIcon.classPrefix"
          />
        </slot>
        <view v-if="uploadText" class="pi-mg-top-6 pi-fz-24 pi-light-gray">{{ uploadText }}</view>
      </view>
    </view>
    <!-- 剪裁弹窗 -->
    <pi-mask v-model="showCrop" :mask-closeable="false" background="rgba(0, 0, 0, .7)">
      <view class="pi-abso-full pi-flex-column">
        <view class="pi-flex-sub">
          <pi-img-cropper
            :custom-style="getCropOption.customStyle"
            :custom-class="getCropOption.customClass"
            :src="cropPic"
            :file-type="getCropOption.fileType"
            :quality="getCropOption.quality"
            :crop-size="getCropOption.cropSize"
            :min-crop-size="getCropOption.minCropSize"
            :boundary-detect="getCropOption.boundaryDetect"
            :keep-crop-ratio="getCropOption.keepCropRatio"
            :disable-rotate="getCropOption.disableRotate"
            :canvas-zoom="getCropOption.canvasZoom"
            :mask-background="getCropMaskBackground"
            @cropped="handleCrop"
          />
        </view>
        <pi-bottom-bar
          border-top="none"
          :background="getCropMaskBackground"
          :safe-area-bg-color="getCropMaskBackground"
        >
          <view class="pi-justify-between pi-align-center pi-pd-tb-32 pi-pd-lr-24 pi-fz-32">
            <view class="pi-white" @tap="handleCancelCrop">取消</view>
            <view class="pi-primary" @tap="handleCompelteCrop">完成</view>
          </view>
        </pi-bottom-bar>
      </view>
    </pi-mask>
  </view>
</template>

<script>
/**
 * 通过v-model控制蒙层是否显示
 * input	蒙层显示或者关闭的时候触发事件 value: boolean (蒙层是否显示)
 */
import ValueSync from '../../mixin/value-sync'
import { getConfig } from '../../config'

const TAG = 'PiUploadImg'
const { uploadImg } = getConfig()

const PI_DEFAULT_FN_FLAG = 'PI_DEFAULT_FN_FLAG'

export default {
  name: 'PiUploadImg',
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false,
      type: [Array, String],
      default() {
        return []
      }
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default() {
        // {}
        return uploadImg.customStyle
      }
    },
    // 自定义样式类
    customClass: {
      type: String,
      default() {
        // ''
        return uploadImg.customClass
      }
    },
    // 上传按钮样式
    itemStyle: {
      type: Object,
      default() {
        // {}
        return uploadImg.itemStyle
      }
    },
    // 上传按钮样式
    uploadBtnStyle: {
      type: Object,
      default() {
        // {}
        return uploadImg.uploadBtnStyle
      }
    },
    // 上传图片的字段名称，字符串形式（默认值：''）
    imgField: {
      type: String,
      default() {
        return uploadImg.imgField
      }
    },
    // 显示的图片模式
    imageMode: {
      type: String,
      default() {
        // 'aspectFill'
        return uploadImg.imageMode
      }
    },
    // 上传接口地址，字符串形式（默认值：''）
    action: {
      type: String,
      default() {
        return uploadImg.action
      }
    },
    // 请求头，对象形式（默认值：{}）
    headers: {
      type: Object,
      default() {
        return uploadImg.headers
      }
    },
    // 上传表单额外数据，对象形式（默认值：{}）
    formData: {
      type: Object,
      default() {
        return uploadImg.formData
      }
    },
    // 上传的文件字段名
    name: {
      type: String,
      default() {
        return uploadImg.name
      }
    },
    // 上传区域尺寸（半径）
    size: {
      type: [String, Number],
      default() {
        // ''
        return uploadImg.size
      }
    },
    // 是否在点击预览图后展示全屏图片预览
    previewFullImage: {
      type: Boolean,
      default() {
        return uploadImg.previewFullImage
      }
    },
    // 是否可以删除上传的文件
    deletable: {
      type: Boolean,
      default() {
        return uploadImg.deletable
      }
    },
    // 是否禁用上传
    disabled: {
      type: Boolean,
      default() {
        return uploadImg.disabled
      }
    },
    // 上传文件的最大数量
    maxCount: {
      type: [String, Number],
      default() {
        return uploadImg.maxCount
      }
    },
    // 上传区域文字提示
    uploadText: {
      type: String,
      default() {
        return uploadImg.uploadText
      }
    },
    // 上传区域图标
    uploadIcon: {
      type: Object,
      default() {
        return uploadImg.uploadIcon
      }
    },
    // 调用uniapp.chooseImageOpts参数
    chooseImageOpts: {
      type: Object,
      default() {
        return uploadImg.chooseImageOpts
      }
    },
    // 当maxCount设置为1的时候，可开启裁剪
    crop: {
      type: Boolean,
      // `false`
      default: uploadImg.crop
    },
    // 裁剪参数
    cropOption: {
      type: Object,
      default() {
        return uploadImg.cropOption
      }
    },
    // 上传成功解析对象方法
    parseResultFn: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.parseResultFn
        }
      }
    },
    // 上传之前的钩子
    beforeUpload: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.beforeUpload
        }
      }
    },
    // 文件上传时的钩子
    onProgress: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.onProgress
        }
      }
    },
    // 删除之前的钩子
    beforeRemove: {
      type: [Object, Function],
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.beforeRemove
        }
      }
    }
  },
  data() {
    return {
      showCrop: false, // 是否显示裁剪工具
      cropPic: '', // 需要剪裁的图片
      cropedPic: '' // 剪裁后的图片
    }
  },
  computed: {
    isValString() {
      return this.$pi.lang.isString(this.val)
    },
    getImgs() {
      return this.isValString ? (this.val ? [this.val] : []) : this.val.filter(img => img)
    },
    getItemStyle() {
      return this.$pi.lang.mergeDeep(uploadImg.itemStyle, this.itemStyle)
    },
    getUploadBtnStyle() {
      return this.$pi.lang.mergeDeep(uploadImg.uploadBtnStyle, this.uploadBtnStyle)
    },
    getUploadIcon() {
      return this.$pi.lang.mergeDeep(uploadImg.uploadIcon, this.uploadIcon)
    },
    getChooseImageOpts() {
      // 以覆盖的方式合并数组
      return this.$pi.lang.mergeDeep(uploadImg.chooseImageOpts, this.chooseImageOpts, {
        arrayMerge: (target, source) => source
      })
    },
    getUploadMaxCount() {
      const maxCount = parseInt(this.maxCount, 10)
      return maxCount - this.getImgs.length
    },
    getCropMaskBackground() {
      return 'rgba(0, 0, 0, .5)'
    },
    getCropOption() {
      return this.$pi.lang.mergeDeep(uploadImg.cropOption, this.cropOption)
    }
  },
  methods: {
    async handleDelete(index) {
      let val = null
      const beforeRemove = this.beforeRemove[PI_DEFAULT_FN_FLAG]
        ? this.beforeRemove.fn
        : this.beforeRemove
      if (this.$pi.lang.isFunction(beforeRemove)) {
        // 上传之前的钩子， 如果定义了则使用钩子上传文件
        val = await beforeRemove(index)
      } else {
        val = this.isValString ? '' : this.val.filter((_, i) => i !== index)
      }
      this.val = val
      this.handleEmitChange()
    },
    // 预览图片
    handlePreviewImage(img) {
      if (!this.previewFullImage) return
      let urls = []
      let current = ''

      if (this.isValString) {
        current = this.val
        urls = [this.val]
      } else {
        urls = this.imgField ? this.val.map(img => img[this.imgField]) : this.val
        current = this.imgField ? img[this.imgField] : img
      }

      // eslint-disable-next-line no-undef
      uni.previewImage({
        urls,
        current,
        indicator: 'default',
        success: () => {
          this.$emit('preview', current, urls)
        }
      })
    },
    async handleUpload(paths) {
      const beforeUpload = this.beforeUpload[PI_DEFAULT_FN_FLAG]
        ? this.beforeUpload.fn
        : this.beforeUpload
      // const onProgress = this.onProgress[PI_DEFAULT_FN_FLAG]
      //   ? this.onProgress.fn
      //   : this.onProgress
      const parseResultFn = this.parseResultFn[PI_DEFAULT_FN_FLAG]
        ? this.parseResultFn.fn
        : this.parseResultFn
      try {
        for await (const filePath of paths) {
          let uploadResult = null
          const params = {
            url: this.action,
            filePath: filePath,
            name: this.name,
            formData: this.formData,
            header: this.headers
          }

          if (this.$pi.lang.isFunction(beforeUpload)) {
            console.log(TAG, '使用自定义上传函数')
            // 上传之前的钩子， 如果定义了则使用钩子上传文件
            uploadResult = await beforeUpload(params)
          } else {
            const [, uploadFileResult] = await uni.uploadFile(params)
            uploadResult = uploadFileResult
          }

          const item = await parseResultFn(uploadResult)
          if (item) {
            this.isValString ? (this.val = item) : this.val.push(item)
            this.handleEmitChange()
          }
        }
      } catch (e) {
        this.$emit('fail', e)
      }
    },
    handleCrop(res) {
      console.log(TAG, '处理剪裁')
      this.cropedPic = res.img
    },
    handleCancelCrop() {
      console.log(TAG, '取消剪裁')
      this.showCrop = false
      this.cropPic = ''
    },
    handleCompelteCrop() {
      console.log(TAG, '完成剪裁')
      this.showCrop = false
      this.handleUpload([this.cropedPic])
    },
    async handleChooseImage() {
      if (this.disabled || !this.getUploadMaxCount) return
      // 检查上传地址
      if (!this.beforeUpload && !this.action) {
        this.$toast('请配置上传地址')
        return
      }
      if (this.$pi.lang.isEmpty(this.headers)) {
        console.log(TAG, '当前图片上传headers为空，请检查是否需要配置授权信息')
      }
      const { sizeType, extension, sourceType, crop } = this.getChooseImageOpts
      try {
        const [, result] = await uni.chooseImage({
          count: this.getUploadMaxCount,
          sizeType,
          extension,
          sourceType,
          crop
        })
        const { errMsg, tempFilePaths } = result
        if (errMsg !== 'chooseImage:ok') {
          throw new Error(errMsg)
        }
        if (this.getUploadMaxCount === 1 && this.crop && tempFilePaths.length === 1) {
          // 单张图片设置了剪裁
          this.showCrop = true
          this.cropPic = tempFilePaths[0]
          return
        }
        this.handleUpload(tempFilePaths)
      } catch (error) {
        this.$emit('fail', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-upload-img {
  display: flex;
  flex-wrap: wrap;
  .close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38rpx;
    height: 38rpx;
    font-weight: 500;
    background: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 50%;
    transform: translate(40%, -40%);
  }
  & > view {
    margin-right: 24rpx;
    margin-bottom: 24rpx;
  }
}
</style>
