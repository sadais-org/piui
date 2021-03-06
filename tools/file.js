/*
 * @Author: zhangzhenfei
 * @Date: 2021-03-05 18:03:20
 * @LastEditTime: 2021-03-05 18:41:17
 * @LastEditors: zhangzhenfei
 * @Description: base64 blob file 等转换
 * @FilePath: /piui-awesome/src/piui/tools/file.js
 */

import { formatDate } from './date'

export function base64ToBlob(dataURI, filename) {
  const byteString = base64ToByteString(dataURI)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const mimeType = getMimeTypeFromDataURI(dataURI)

  if (!filename) {
    const nowDate = formatDate(new Date(), 'YYYY-MM-DD_HH:mm:ss')
    const random = (Math.random() * 100000).toFixed(0)
    filename = nowDate + '_' + random + '.' + getExtensionByMimeType(mimeType)
  }

  return blobToFile(createBlob(ab, mimeType), filename)
}

export function blobToFile(blob, filename) {
  if ('lastModified' in File.prototype) {
    blob.lastModified = new Date()
  } else {
    blob.lastModifiedDate = new Date()
  }
  blob.name = filename
  return blob
}

// #ifdef H5
export function base64ToByteString(dataURI) {
  // get data part of string (remove data:image/jpeg...,)
  const dataPart = dataURI.split(',')[1]

  // remove any whitespace as that causes InvalidCharacterError in IE
  const dataPartCleaned = dataPart.replace(/\s/g, '')

  // to bytestring
  return atob(dataPartCleaned)
}
// #endif

export function getMimeTypeFromDataURI(dataUri) {
  if (!dataUri) {
    return null
  }
  const matches = dataUri.substr(0, 16).match(/^.+;/)
  if (matches.length) {
    return matches[0].substring(5, matches[0].length - 1)
  }
  return null
}

export function getExtensionByMimeType(mimetype) {
  const MimeTypes = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png',
    gif: 'image/gif'
  }
  let type = void 0
  for (type in MimeTypes) {
    if (!MimeTypes.hasOwnProperty(type)) {
      continue
    }
    if (MimeTypes[type] === mimetype) {
      return type
    }
  }
  return mimetype
}

// #ifdef H5
export function createBlob(data, mimeType) {
  const BB = (window.BlobBuilder =
    window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)

  if (BB) {
    const bb = new BB()
    bb.append(data)
    return bb.getBlob(mimeType)
  }

  return new Blob([data], {
    type: mimeType
  })
}
// #endif
