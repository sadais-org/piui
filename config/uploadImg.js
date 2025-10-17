/*
 * @Author: zhangzhenfei
 * @Date: 2021-08-13 11:29:02
 * @LastEditTime: 2024-10-22 10:43:21
 * @LastEditors: zhangzhenfei
 * @Description: 图片上传
 * @FilePath: /piui-awesome/src/piui/config/uploadImg.js
 */
import icon from './icon.js'
import cropOption from './imgCropper.js'

export default {
  customClass: '', // 自定义样式类，字符串形式（''）
  customStyle: {}, // 自定义样式，对象形式（默认值：{}）
  imgField: '', // 上传图片的字段名称，字符串形式（默认值：''）
  action: '', // 上传接口地址，字符串形式（默认值：''）
  headers: {}, // 请求头，对象形式（默认值：{}）
  formData: {}, // 上传表单额外数据，对象形式（默认值：{}）
  name: 'file', // 上传的文件字段名
  itemStyle: {
    borderRadius: '8rpx'
  }, // 单个文件额外样式，对象形式（默认值：{}）
  uploadBtnStyle: {
    background: '#f3f3f3',
    borderRadius: '8rpx'
  },
  imageMode: 'aspectFill', // 上传图片模式，默认值：aspectFill
  size: '160', // 上传区域尺寸（半径）
  previewFullImage: true, // 是否在点击预览图后展示全屏图片预览
  deletable: true, // 是否可以删除上传的文件
  disabled: false, // 是否禁用上传
  maxCount: 9, // 上传文件的最大数量
  uploadText: '', // 上传区域文字提示
  crop: false, // 当maxCount设置为1的时候，可开启裁剪
  cropOption, // 裁剪配置
  // 上传区域图标
  uploadIcon: {
    ...icon,
    name: 'add',
    size: '60',
    color: '#999999'
  },
  type: 'image', // 上传文件类型，可选值为image、video、all
  fileTypes: [], // 当 type 为 all 时生效，允许上传的文件类型是否包含 video 和 image
  // 当type为 "all"时生效，调用uni.chooseFile参数
  chooseFileOpts: {
    sourceType: ['album', 'camera'], // （仅在type为image或video时可用）album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
    extension: [], // 允许上传的文件类型，不填则不限制
    maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒，默认60
    camera: 'back', // 前置或后置摄像头，默认back
    fromWxMessage: true // 是否来自微信消息
  },
  // 当type为 "image"时生效，调用uni.chooseImage参数
  chooseImageOpts: {
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认album
    extension: [], // 允许上传的文件类型，不填则不限制
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认compressed
    crop: {} // 图像裁剪参数，设置后 sizeType 失效
  },
  // 当type为 "video"时生效，调用uniapp.chooseVideo参数
  chooseVideoOpts: {
    sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄，默认二者都有
    compressed: true, // 是否压缩视频，默认true
    maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒，默认60
    camera: 'back', // 前置或后置摄像头，默认back
    extension: [] // 允许上传的文件类型，不填则不限制
  },
  parseResultFn: function(result) {
    try {
      return JSON.parse(result.data)?.data.url
    } catch (error) {
      console.error(
        '解析上传结果失败，请使用自定义解析函数 parseResultFn ',
        error
      )
    }
  },
  compressOption: {
    quality: 100,
    width: 'auto',
    height: 'auto',
    // 智能压缩配置
    smartCompress: true, // 是否启用智能压缩，默认启用
    // 智能压缩策略配置
    smartCompressConfig: {
      // 基础分辨率阈值，当图片最长边小于等于此值时保持原分辨率
      baseThreshold: 1080,
      // 不同比例区间的压缩策略
      ratioStrategies: {
        // 比例范围 (1:1~9:16)：压缩后最长边不超过 1664px
        normal: { maxSide: 1664, ratioRange: [1, 9 / 16] },
        // 比例范围 (9:16~1:2)：压缩后最长边不超过 1440px
        portrait: { maxSide: 1440, ratioRange: [9 / 16, 1 / 2] },
        // 比例范围 (1:2~1:∞)：压缩后最长边不超过 1280px
        extreme: { maxSide: 1280, ratioRange: [1 / 2, Infinity] }
      }
    }
  }, // 压缩配置
  beforeUpload: null, // 上传之前的钩子
  onProgress: null, // 文件上传时的钩子
  beforeRemove: null, // 删除之前的钩子
  customTakePhoto: false, // 是否自定义拍照（如果为true，则不调用相机，通过事件自己实现拍照上传）
  fileIconMap: {}, // 文件类型和图标映射关系，对象形式（{PDF: 'https://xxx'}）
  customUploadParams: {}, // 自定义上传参数，对象形式
  fileLimit: null, // 文件大小限制，单位为字节，null表示不限制
  customPreview: null, // 自定义预览功能
}
