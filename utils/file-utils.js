/**
 * 文件处理工具函数
 * @Author: zhangzhenfei
 * @Date: 2025-01-27
 * @Description: 文件大小解析、格式化、信息获取和图片压缩计算等工具函数
 */

/**
 * 判断是否是图片文件
 * @param {*} filename
 * @returns
 */
export function isImageFilename(filename) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i
  return imageExtensions.test(filename) || filename.startsWith('data:')
}

/**
 * 判断是否是视频文件
 * @param {*} filename
 * @returns
 */
export function isVideoFilename(filename) {
  const videoExtensions = /\.(mp4|avi|mov|wmv|mpg|flv|mkv)$/i
  return videoExtensions.test(filename)
}

/**
 * 解析文件大小字符串或数字为字节数
 * @param {string|number} size - 文件大小，支持字符串格式如 "2MB" 或数字格式
 * @returns {number} 字节数
 */
export function parseFileSize(size) {
  if (typeof size === 'number') return size
  if (typeof size === 'string') {
    const units = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024
    }

    const regex = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i
    const match = size.trim().match(regex)

    if (match) {
      const value = parseFloat(match[1])
      const unit = match[2].toUpperCase()
      return value * units[unit]
    }

    // 如果没有单位，默认为字节
    const numSize = parseInt(size, 10)
    return isNaN(numSize) ? 0 : numSize
  }
  return 0
}

/**
 * 格式化文件大小显示
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小字符串
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * 获取文件路径的文件信息（包含大小）
 * @param {Array<string>} filePaths - 文件路径数组
 * @returns {Promise<Array>} 包含文件信息的数组
 */
export async function getFileInfoForPaths(filePaths) {
  const fileInfos = []

  for (const filePath of filePaths) {
    try {
      const [, fileInfo] = await uni.getFileInfo({
        filePath: filePath
      })

      if (fileInfo && fileInfo.size !== undefined) {
        fileInfos.push({
          path: filePath,
          size: fileInfo.size
        })
      } else {
        // 如果无法获取文件信息，保持原路径（跳过大小检查）
        fileInfos.push(filePath)
      }
    } catch (error) {
      console.log('获取文件信息失败', error)
      // 如果获取文件信息失败，保持原路径（跳过大小检查）
      fileInfos.push(filePath)
    }
  }

  return fileInfos
}

/**
 * 获取图片的宽高信息
 * @param {string} imagePath - 图片路径
 * @returns {Promise<Object|null>} 图片信息对象或null
 */
export async function getImageInfo(imagePath) {
  try {
    const [, imageInfo] = await uni.getImageInfo({
      src: imagePath
    })

    if (imageInfo && imageInfo.width && imageInfo.height) {
      // 处理可能的宽高反转问题
      let { width, height, orientation } = imageInfo

      // 根据图片方向调整宽高
      if (orientation && (orientation === 6 || orientation === 8)) {
        // 旋转90度或270度的图片，宽高需要交换
        ;[width, height] = [height, width]
      }

      return {
        width,
        height,
        orientation,
        aspectRatio: width / height,
        maxDimension: Math.max(width, height)
      }
    }

    return null
  } catch (error) {
    console.log('获取图片信息失败', error)
    return null
  }
}

/**
 * 智能压缩算法：根据图片比例和尺寸计算目标宽高
 * @param {Object} imageInfo - 图片信息对象
 * @param {Object} compressOption - 压缩配置选项
 * @returns {Object} 目标宽高对象 {width, height}
 */
export function calculateCompressDimensions(imageInfo, compressOption = {}) {
  if (!imageInfo) {
    // 如果无法获取图片信息，使用默认压缩参数
    return { width: 1080, height: 1080 }
  }

  const { width, height, aspectRatio, maxDimension } = imageInfo

  // 获取智能压缩配置
  const smartConfig = compressOption?.smartCompressConfig || {}
  const baseThreshold = smartConfig.baseThreshold || 1080
  const ratioStrategies = smartConfig.ratioStrategies || {
    normal: { maxSide: 1664, ratioRange: [1, 9 / 16] },
    portrait: { maxSide: 1440, ratioRange: [9 / 16, 1 / 2] },
    extreme: { maxSide: 1280, ratioRange: [1 / 2, Infinity] }
  }

  // 当原图宽/高最大值≤基础阈值时，保持原始分辨率，仅进行无损压缩优化
  if (maxDimension <= baseThreshold) {
    return { width, height }
  }

  // 根据图片比例确定压缩后的最长边限制
  let maxSideLength = baseThreshold // 默认最长边
  let strategy = 'default'

  // 遍历策略配置，找到匹配的比例范围
  for (const [strategyName, strategyConfig] of Object.entries(
    ratioStrategies
  )) {
    const [minRatio, maxRatio] = strategyConfig.ratioRange
    if (aspectRatio >= minRatio && aspectRatio <= maxRatio) {
      maxSideLength = strategyConfig.maxSide
      strategy = strategyName
      break
    }
  }

  // 按原图比例等比压缩，使最长边不超过限制
  let targetWidth = width
  let targetHeight = height

  if (width > height) {
    // 横向图片
    if (width > maxSideLength) {
      targetWidth = maxSideLength
      targetHeight = Math.round((height * maxSideLength) / width)
    }
  } else {
    // 纵向图片或正方形
    if (height > maxSideLength) {
      targetHeight = maxSideLength
      targetWidth = Math.round((width * maxSideLength) / height)
    }
  }

  console.log('智能压缩计算', {
    原始尺寸: `${width}x${height}`,
    宽高比: aspectRatio.toFixed(3),
    最长边: maxDimension,
    目标尺寸: `${targetWidth}x${targetHeight}`,
    最长边限制: maxSideLength,
    压缩策略: strategy,
    基础阈值: baseThreshold
  })

  return { width: targetWidth, height: targetHeight }
}

/**
 * 压缩图片处理
 * @param {Array<string>} tempFilePaths - 临时文件路径数组
 * @param {Object} compressOption - 压缩配置选项
 * @returns {Promise<Array<string>>} 压缩后的文件路径数组
 */
export async function handleCompressImgs(tempFilePaths, compressOption = {}) {
  const compressUrls = []

  for (let index = 0; index < tempFilePaths.length; index++) {
    const url = tempFilePaths[index]

    // 获取图片信息并计算智能压缩参数
    const imageInfo = await getImageInfo(url)
    const compressDimensions = calculateCompressDimensions(
      imageInfo,
      compressOption
    )

    // 构建压缩参数
    const compressParams = {
      src: url,
      ...compressOption
    }

    // 如果启用了智能压缩，添加宽高参数
    if (compressOption && compressOption.smartCompress) {
      compressParams.compressedWidth = compressDimensions.width
      compressParams.compressedHeight = compressDimensions.height
    }

    console.log('图片压缩参数', compressParams)

    const [, result] = await uni.compressImage(compressParams)
    const { errMsg, tempFilePath } = result

    if (
      errMsg == 'compressImage:ok' &&
      tempFilePath &&
      typeof tempFilePath == 'string'
    ) {
      compressUrls.push(tempFilePath)
      console.log('智能压缩图片成功', tempFilePath)
    } else {
      compressUrls.push(url)
      console.log('压缩图片失败，使用原图', tempFilePath, 'src=' + url)
    }
  }
  return compressUrls
}
