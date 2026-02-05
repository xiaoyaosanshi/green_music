import request from './request'

/**
 * 上传文件
 */
export function uploadFile(file, type = 'file') {
  const formData = new FormData()
  formData.append('file', file)
  if (type) {
    formData.append('type', type)
  }
  return request({
    url: '/admin/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

