<!--
 * @Author: zhangzhenfei
 * @Date: 2021-08-13 11:31:57
 * @LastEditTime: 2024-10-15 16:45:22
 * @LastEditors: zhangzhenfei
 * @Description: 图片上传组件
 * @FilePath: /piui-awesome/src/piui/components/pi-upload-img/index.vue
-->

<template>
  <view
    class="pi-upload-img"
    :style="[customStyle]"
    :class="[customClass, { 'pi-pd-top-12': !getDisabled }]"
  >
    <!-- 已上传图片展示 -->
    <view
      v-for="(img, index) in getImgs"
      :key="index"
      class="pi-rela pi-flex-column-center"
      @tap="handlePreview(img)"
    >
      <view v-if="!getDisabled" class="close" @tap.stop="handleDelete(index)">
        <pi-icon name="roundclosefill" color="#8e8e8e" size="36" />
      </view>
      <image
        v-if="isImageFilename(imgField ? img[imgField] : img)"
        :style="[getItemStyle]"
        class="pi-of-hidden"
        :mode="imageMode"
        :src="imgField ? img[imgField] : img"
      />
      <view
        v-else
        class="pi-rela pi-of-hidden pi-radius-8"
        :style="[getItemStyle]"
      >
        <view class="file-mask">
          <pi-icon
            :name="
              isVideoFilename(imgField ? img[imgField] : img)
                ? 'videofill'
                : 'activity-fill'
            "
            size="48"
            color="#0C6DF4"
          />
          <view class="pi-mg-top-12 pi-fz-22">
            {{ getFileType(imgField ? img[imgField] : img) }}
          </view>
        </view>
      </view>
    </view>
    <!-- 上传框 -->
    <view v-if="getUploadMaxCount && !getDisabled">
      <view
        :style="[getUploadBtnStyle]"
        class="pi-flex-column-center"
        @tap="handleChoose"
      >
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
        <view v-if="uploadText" class="pi-mg-top-6 pi-fz-24 pi-light-gray">{{
          uploadText
        }}</view>
      </view>
    </view>
    <!-- 剪裁弹窗 -->
    <pi-mask
      v-model="showCrop"
      :mask-closeable="false"
      background="rgba(0, 0, 0, .9)"
    >
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
          <view
            class="pi-justify-between pi-align-center pi-pd-tb-32 pi-pd-lr-24 pi-fz-32"
          >
            <view class="pi-white" @tap="handleCancelCrop">取消</view>
            <view class="pi-primary" @tap="handleCompelteCrop">完成</view>
          </view>
        </pi-bottom-bar>
      </view>
    </pi-mask>
    <!-- 上传视频操作面板（小程序专用） -->
    <pi-action-sheet
      v-model="showActionSheet"
      :items="actionSheetItems"
      :popup="{
        borderRadius: 0
      }"
      @select="handleActionSheetSelect"
    />
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

function isImageFilename(filename) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i
  return imageExtensions.test(filename)
}

function isVideoFilename(filename) {
  const videoExtensions = /\.(mp4|avi|mov|wmv|mpg|flv|mkv)$/i
  return videoExtensions.test(filename)
}

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
    // 当maxCount设置为1的时候，且type为‘image’，可开启裁剪
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
    },
    // 压缩参数
    compressOption: {
      type: Object,
      default() {
        return uploadImg.compressOption
      }
    },
    // 文件类型
    type: {
      type: String,
      default() {
        return uploadImg.type // 'all', 'image', 'video'
      }
    },
    // 当 type 为 all 时生效，允许上传的文件类型是否包含 video 和 image
    fileTypes: {
      type: Array,
      default() {
        return uploadImg.fileTypes
      }
    },
    // 当type为 "all"时生效，调用uni.chooseFile参数
    chooseFileOpts: {
      type: Object,
      default() {
        return uploadImg.chooseFileOpts
      }
    },
    // 当type为 "image"时生效，调用uni.chooseImage参数
    chooseImageOpts: {
      type: Object,
      default() {
        return uploadImg.chooseImageOpts
      }
    },
    // 当type为 "video"时生效，调用uniapp.chooseVideo参数
    chooseVideoOpts: {
      type: Object,
      default() {
        return uploadImg.chooseVideoOpts
      }
    }
  },
  data() {
    return {
      showCrop: false, // 是否显示裁剪工具
      cropPic: '', // 需要剪裁的图片
      cropedPic: '', // 剪裁后的图片
      showActionSheet: false // 是否显示上传视频操作面板
    }
  },
  computed: {
    getDisabled() {
      const parent = this.$pi.parent(this, 'PiFormItem')
      return this.disabled || (parent && parent.getDisabled)
    },
    actionSheetItems() {
      return [
        {
          id: 1,
          text: '选择媒体图片/视频'
        },
        {
          id: 2,
          text: '选择微信聊天文件'
        }
      ]
    },
    selectOnlyFile() {
      return this.type === 'all' && this.fileTypes.length === 0
    },
    isValString() {
      return this.$pi.lang.isString(this.val)
    },
    getImgs() {
      if (this.val === null || this.val === undefined) {
        return []
      }
      return this.isValString
        ? this.val
          ? [this.val]
          : []
        : this.val.filter(img => img)
    },
    getItemStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      const uploadStyle = this.$pi.lang.mergeDeep(
        uploadImg.itemStyle,
        this.itemStyle
      )
      return this.$pi.lang.mergeDeep(style, uploadStyle)
    },
    getSize() {
      return this.$pi.common.addUnit(this.size)
    },
    getUploadBtnStyle() {
      const style = {
        width: this.getSize,
        height: this.getSize
      }
      const uploadBtnStyle = this.$pi.lang.mergeDeep(
        uploadImg.uploadBtnStyle,
        this.uploadBtnStyle
      )
      return this.$pi.lang.mergeDeep(style, uploadBtnStyle)
    },
    getUploadIcon() {
      return this.$pi.lang.mergeDeep(uploadImg.uploadIcon, this.uploadIcon)
    },
    getChooseImageOpts() {
      // 以覆盖的方式合并数组
      return this.$pi.lang.mergeDeep(
        uploadImg.chooseImageOpts,
        this.chooseImageOpts,
        {
          arrayMerge: (_target, source) => source
        }
      )
    },
    getChooseFileOpts() {
      return this.$pi.lang.mergeDeep(
        uploadImg.chooseFileOpts,
        this.chooseFileOpts,
        {
          arrayMerge: (_target, source) => source
        }
      )
    },
    getChooseVideoOpts() {
      return this.$pi.lang.mergeDeep(
        uploadImg.chooseVideoOpts,
        this.chooseVideoOpts,
        {
          arrayMerge: (_target, source) => source
        }
      )
    },
    getUploadMaxCount() {
      // 如果 maxCount 为 0 或者 undefined，则不限制上传数量
      if (!this.maxCount) return 9
      const maxCount = parseInt(this.maxCount, 10)
      return maxCount - this.getImgs.length
    },
    getCropMaskBackground() {
      return 'rgba(0, 0, 0, .3)'
    },
    getCropOption() {
      return this.$pi.lang.mergeDeep(uploadImg.cropOption, this.cropOption)
    },
    getExtension() {
      let extension = []
      if (this.type === 'image') {
        extension = this.getChooseImageOpts.extension || []
      } else if (this.type === 'video') {
        extension = this.getChooseVideoOpts.extension || []
      } else {
        // all
        extension = [
          ...this.getChooseFileOpts.extension,
          ...(this.fileTypes.includes('image')
            ? this.getChooseImageOpts.extension
            : []),
          ...(this.fileTypes.includes('video')
            ? this.getChooseVideoOpts.extension
            : [])
        ]
      }
      return extension?.filter(ext => !!ext)
    }
  },
  methods: {
    isImageFilename,
    isVideoFilename,
    getFileType(file) {
      if (!file) return ''
      const ext = file.split('.').pop()
      return ext.toLocaleUpperCase()
    },
    isRightType(selectFile) {
      const isRightType = this.getExtension.some(ext =>
        selectFile.name.endsWith(ext)
      )
      console.log(
        TAG,
        '当前文件扩展名配置为：',
        this.getExtension,
        '当前选择文件：',
        selectFile.name,
        '是否符合：',
        isRightType
      )
      if (!isRightType) {
        this.$toast(`请选择${this.getExtension.join('/')}文件上传`)
      }
      return isRightType
    },
    async handleDelete(index) {
      let val = null
      const beforeRemove = this.beforeRemove[PI_DEFAULT_FN_FLAG]
        ? this.beforeRemove.fn
        : this.beforeRemove
      if (this.$pi.lang.isFunction(beforeRemove)) {
        // 删除之前的钩子， 如果定义了则使用钩子删除文件
        val = await beforeRemove(index)
      } else {
        val = this.isValString ? '' : this.val.filter((_, i) => i !== index)
      }
      this.$emit('remove', index)
      this.val = val
      this.handleEmitChange()
    },
    handlePreview(img) {
      const file = this.imgField ? img[this.imgField] : img
      if (isImageFilename(file)) {
        this.handlePreviewImage(file)
        return
      }
      if (isVideoFilename(file)) {
        this.$emit('previewVideo', file)
        return
      }
      // 文件预览
      uni.downloadFile({
        url: file,
        success: res => {
          const filePath = res.tempFilePath
          // fileType 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx，支付宝小程序仅支持pdf
          // 支付宝小程序必填，其他平台非必填
          uni.openDocument({
            filePath,
            complete: res => {
              console.log('文件预览', res)
            }
          })
        }
      })
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
        urls = this.imgField
          ? this.val.map(img => img[this.imgField])
          : this.val
        current = img
      }

      // 过滤出图片类型的文件
      urls = urls.filter(url => isImageFilename(url))

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
      const onProgress = this.onProgress[PI_DEFAULT_FN_FLAG]
        ? this.onProgress.fn
        : this.onProgress
      const parseResultFn = this.parseResultFn[PI_DEFAULT_FN_FLAG]
        ? this.parseResultFn.fn
        : this.parseResultFn
      try {
        for await (const filePath of paths) {
          // ---------- 上传之前的钩子 ----------
          const file = filePath

          let beforeUploadResult = true
          if (this.$pi.lang.isFunction(beforeUpload)) {
            console.log(TAG, '调用文件上传前钩子')
            beforeUploadResult = await beforeUpload(file)
          }
          if (!beforeUploadResult) {
            console.log(TAG, '文件上传前钩子返回false，跳过上传')
            continue
          }

          // ---------- 上传文件 ----------

          let uploadResult = null
          const params = {
            url: this.action,
            filePath: file,
            name: this.name,
            formData: this.formData,
            header: this.headers
          }
          if (this.$pi.lang.isFunction(onProgress)) {
            console.log(TAG, '使用自定义上传函数')
            // 上传之前的钩子， 如果定义了则使用钩子上传文件
            uploadResult = await onProgress(params)
          } else {
            const [, uploadFileResult] = await uni.uploadFile(params)
            uploadResult = uploadFileResult
          }
          console.log(TAG, '上传文件结果', uploadResult)

          // ---------- 解析上传结果 ----------
          this.$emit('uploaded', uploadResult)
          const item = await parseResultFn(uploadResult)
          if (item) {
            this.isValString ? (this.val = item) : this.val.push(item)
            this.handleEmitChange()
          }
        }
      } catch (e) {
        console.log(TAG, '上传文件失败', e)
        this.$emit('fail', e)
      }
    },
    handleCrop(res) {
      console.log(TAG, '处理剪裁')
      this.$emit('crop', res.img)
      this.cropedPic = res.img
    },
    handleCancelCrop() {
      console.log(TAG, '取消剪裁')
      this.$emit('cancelCrop')
      this.showCrop = false
      this.cropPic = ''
    },
    handleCompelteCrop() {
      console.log(TAG, '完成剪裁')
      this.$emit('croped', [this.cropedPic])
      this.showCrop = false
      this.handleUpload([this.cropedPic])
    },
    async handleCompressImgs(tempFilePaths) {
      const compressUrls = []

      for (let index = 0; index < tempFilePaths.length; index++) {
        const url = tempFilePaths[index]
        const [, result] = await uni.compressImage({
          src: url,
          ...this.compressOption
        })
        const { errMsg, tempFilePath } = result
        if (
          errMsg == 'compressImage:ok' &&
          tempFilePath &&
          typeof tempFilePath == 'string'
        ) {
          compressUrls.push(tempFilePath)
          console.log(TAG, '压缩图片成功', tempFilePath, 'src=' + url)
        } else {
          compressUrls.push(url)
          console.log(TAG, '压缩图片成功', tempFilePath, 'src=' + url)
        }
      }
      return compressUrls
    },
    handleChoose() {
      if (this.disabled || !this.getUploadMaxCount) return
      // 检查上传地址
      const onProgress = this.onProgress[PI_DEFAULT_FN_FLAG]
        ? this.onProgress.fn
        : this.onProgress
      if (!onProgress && !this.action) {
        this.$toast('请配置上传地址')
        return
      }
      if (this.$pi.lang.isEmpty(this.headers)) {
        console.log(TAG, '当前图片上传headers为空，请检查是否需要配置授权信息')
      }
      console.log('当前上传文件类型：', this.type)
      if (this.type === 'all') {
        // #ifndef MP-WEIXIN
        this.handleChooseFile()
        // #endif

        // #ifdef MP-WEIXIN
        const { fromWxMessage } = this.getChooseFileOpts
        if (fromWxMessage) {
          if (this.selectOnlyFile) {
            this.handleSelectMessageFile()
            return
          }
          this.$emit('show-actions')
          this.showActionSheet = true
        } else {
          this.handleChooseMedia()
        }
        // #endif

        return
      }
      if (this.type === 'image') {
        this.handleChooseImage()
        return
      }
      if (this.type === 'video') {
        // #ifndef MP-WEIXIN
        this.handleChooseVideo()
        // #endif

        // #ifdef MP-WEIXIN
        this.handleChooseMedia()
        // #endif

        return
      }
    },
    async handleChooseFile() {
      const { sizeType, sourceType, crop } = this.getChooseFileOpts
      try {
        const [, result] = await uni.chooseFile({
          count: this.getUploadMaxCount,
          sizeType,
          sourceType,
          crop
        })
        let { errMsg, tempFiles } = result
        console.log(TAG, '上传文件结果', result)
        if (errMsg !== 'chooseFile:ok') {
          throw new Error(errMsg)
        }
        this.handleUpload(tempFiles)
      } catch (error) {
        console.log(TAG, '上传文件失败', error)
        this.$emit('fail', error)
      }
    },
    // 从微信聊天会话中选择文件
    async handleSelectMessageFile() {
      // #ifndef MP-WEIXIN
      this.$toast('请在微信小程序中使用')
      // #endif

      console.log('从微信聊天会话中选择文件')

      // #ifdef MP-WEIXIN
      this.showSheet = false
      try {
        const [, result] = await uni.chooseMessageFile({
          count: this.getUploadMaxCount,
          type:
            this.fileTypes.includes('image') || this.fileTypes.includes('video')
              ? 'all'
              : 'file'
        })
        if (!result) {
          return
        }
        let { errMsg, tempFiles } = result
        console.log(TAG, '选择微信聊天记录文件', result)
        if (errMsg !== 'chooseMessageFile:ok') {
          throw new Error(errMsg)
        }
        // chooseMessageFile 没有扩展名限制，这里自己做过滤
        tempFiles = tempFiles.filter(file => {
          return this.isRightType(file)
        })
        console.log(TAG, '过滤后的文件列表：', tempFiles)
        this.handleUpload(tempFiles)
      } catch (error) {
        console.log(error)
      }
      // #endif
    },
    async handleChooseImage() {
      const { sizeType, sourceType, crop } = this.getChooseImageOpts
      try {
        const [, result] = await uni.chooseImage({
          count: this.getUploadMaxCount,
          sizeType,
          sourceType,
          crop
        })
        let { errMsg, tempFilePaths } = result
        if (errMsg !== 'chooseImage:ok') {
          throw new Error(errMsg)
        }
        // #ifndef H5
        // 压缩图片
        if (
          this.compressOption &&
          this.$pi.system.systemInfo.platform !== 'devtools'
        ) {
          tempFilePaths = await this.handleCompressImgs(tempFilePaths)
        }
        // #endif
        if (
          this.getUploadMaxCount === 1 &&
          this.crop &&
          tempFilePaths.length === 1
        ) {
          // 单张图片设置了剪裁
          this.showCrop = true
          this.cropPic = tempFilePaths[0]
          return
        }
        this.handleUpload(tempFilePaths)
      } catch (error) {
        console.log(TAG, '上传文件失败', error)
        this.$emit('fail', error)
      }
    },
    async handleChooseVideo() {
      const { sourceType, maxDuration, camera } = this.getChooseVideoOpts
      try {
        const [, result] = await uni.chooseVideo({
          sourceType,
          maxDuration,
          camera
        })
        let { errMsg, tempFilePath, tempFile } = result
        if (errMsg !== 'chooseVideo:ok') {
          throw new Error(errMsg)
        }
        tempFile.path = tempFilePath
        console.log(TAG, '上传视频结果', result)
        this.handleUpload([tempFile])
      } catch (error) {
        console.log(TAG, '上传视频失败', error)
        this.$emit('fail', error)
      }
    },
    async handleChooseMedia() {
      const { sourceType, maxDuration, camera } =
        this.type === 'video' ? this.getChooseVideoOpts : this.getChooseFileOpts
      try {
        const [, result] = await uni.chooseMedia({
          count: this.getUploadMaxCount,
          mediaType: this.type === 'video' ? ['video'] : ['mix'],
          extension: this.getExtension,
          sourceType,
          maxDuration,
          camera
        })
        let { errMsg, tempFiles } = result
        if (errMsg !== 'chooseMedia:ok') {
          throw new Error(errMsg)
        }
        console.log(TAG, '上传媒体结果', result)

        // #ifndef H5
        // 非H5端/开发者工具，上传视频，执行压缩视频操作
        if (this.$pi.system.systemInfo.platform !== 'devtools') {
          const compressTempFiles = []
          for await (const tempFile of tempFiles) {
            const tempFilePath = tempFile.tempFilePath
            let filePath = ''
            if (isImageFilename(tempFilePath)) {
              const filePaths = await this.handleCompressImgs([
                tempFile.tempFilePath
              ])
              filePath = filePaths[0]
            } else {
              filePath = await this.handleCompressVideo(tempFile.tempFilePath)
            }

            compressTempFiles.push(filePath)
          }
          this.handleUpload(compressTempFiles)
          return
        }
        // #endif

        this.handleUpload(tempFiles.map(file => file.tempFilePath))
      } catch (error) {
        console.log(TAG, '上传视频失败', error)
        this.$emit('fail', error)
      }
    },
    // 压缩视频接口
    async handleCompressVideo(tempUrl) {
      console.log('视频压缩中')
      uni.showLoading({
        title: '视频压缩中...'
      })
      const [, result] = await uni.compressVideo({
        src: tempUrl,
        quality: 'high' // 压缩质量 支持low, medium, high
      })
      uni.hideLoading()
      const { errMsg, tempFilePath } = result
      if (errMsg == 'compressVideo:ok') {
        return tempFilePath
      }
      return tempUrl
    },
    handleActionSheetSelect(type) {
      if (type.id === 1) {
        this.handleChooseMedia()
      } else {
        this.handleSelectMessageFile()
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
  .file-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
