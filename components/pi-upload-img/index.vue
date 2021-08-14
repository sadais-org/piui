<!--
 * @Author: zhangzhenfei
 * @Date: 2021-08-13 11:31:57
 * @LastEditTime: 2021-08-14 17:15:23
 * @LastEditors: zhangzhenfei
 * @Description: 图片上传组件
 * @FilePath: /piui-awesome/src/piui/components/pi-upload-img/index.vue
-->

<template>
  <view class="pi-upload-img" :style="[customStyle]" :class="[customClass]">
    <!-- 已上传图片展示 -->
    <view
      v-for="(img, index) in getImgs"
      :key="img"
      :style="[getItemStyle]"
      class="pi-rela pi-flex-column-center"
      @tap="handlePreviewImage(img)"
    >
      <view class="close" @tap.stop="handleDelete(index)">
        <pi-icon name="roundclosefill" color="#8e8e8e" size="36" />
      </view>
      <view :style="[getItemStyle]" class="pi-of-hidden">
        <pi-img width="100%" height="100%" :mode="imageMode" :src="img" />
      </view>
    </view>
    <!-- 上传框 -->
    <view v-if="getUploadCount">
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
  name: TAG,
  // 混入v-model
  mixins: [ValueSync],
  props: {
    // 初始值
    value: {
      required: false,
      type: Array,
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
    // 上传成功解析对象方法
    parseResultUrlFn: {
      type: Function,
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.parseResultUrlFn
        }
      }
    },
    // 上传之前的钩子
    beforeUpload: {
      type: Function,
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.beforeUpload
        }
      }
    },
    // 删除之前的钩子
    beforeRemove: {
      type: Function,
      default() {
        return {
          [PI_DEFAULT_FN_FLAG]: true,
          fn: uploadImg.beforeRemove
        }
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    getImgs() {
      return this.val.filter(img => img)
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
    getUploadCount() {
      const maxCount = parseInt(this.maxCount, 10)
      return maxCount - this.getImgs.length
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
        val = this.val.filter((_, i) => i !== index)
      }
      this.val = val
      this.handleEmitChange()
    },
    // 预览图片
    handlePreviewImage(url) {
      if (!this.previewFullImage) return
      uni.previewImage({
        urls: this.val,
        current: url,
        indicator: 'default',
        success: () => {
          this.$emit('preview', url, this.val)
        }
      })
    },
    async handleChooseImage() {
      if (this.disabled || !this.getUploadCount) return
      const _this = this
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
          count: this.getUploadCount,
          sizeType,
          extension,
          sourceType,
          crop
        })
        const { errMsg, tempFilePaths } = result
        if (errMsg !== 'chooseImage:ok') {
          throw new Error(errMsg)
        }

        for await (const filePath of tempFilePaths) {
          let uploadResult = null
          const params = {
            url: this.action,
            filePath: filePath,
            name: this.name,
            formData: this.formData,
            header: this.headers
          }
          const beforeUpload = this.beforeUpload[PI_DEFAULT_FN_FLAG]
            ? this.beforeUpload.fn
            : this.beforeUpload
          if (this.$pi.lang.isFunction(beforeUpload)) {
            // 上传之前的钩子， 如果定义了则使用钩子上传文件
            uploadResult = await beforeUpload(params)
          } else {
            const [, uploadFileResult = result] = await uni.uploadFile(params)
            uploadResult = uploadFileResult
          }
          const parseResultUrlFn = this.parseResultUrlFn[PI_DEFAULT_FN_FLAG]
            ? this.parseResultUrlFn.fn
            : this.parseResultUrlFn
          const url = await parseResultUrlFn(uploadResult)
          if (url) {
            this.val.push(url)
            this.handleEmitChange()
          }
        }
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
