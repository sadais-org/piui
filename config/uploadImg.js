/*
 * @Author: zhangzhenfei
 * @Date: 2021-08-13 11:29:02
 * @LastEditTime: 2022-07-21 11:20:15
 * @LastEditors: zhangzhenfei
 * @Description: 图片上传
 * @FilePath: /dt-weitibao-console/Users/feilin/workspace/piui/piui-awesome/src/piui/config/uploadImg.js
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
  // 调用uniapp.chooseImageOpts参数
  chooseImageOpts: {
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认compressed
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认album
    crop: {} // 图像裁剪参数，设置后 sizeType 失效
  },
  parseResultFn: function(result) {
    try {
      return JSON.parse(result.data)?.data.url
    } catch (error) {
      console.error('解析上传结果失败，请使用自定义解析函数 parseResultFn ', error)
    }
  },
  beforeUpload: null, // 上传之前的钩子
  onProgress: null, // 文件上传时的钩子
  beforeRemove: null // 删除之前的钩子
}
