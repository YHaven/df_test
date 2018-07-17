/// CQ 20180531
/// 基础的HTTP请求工具，封装了wx.request

import { Timeout } from './config.js'

export const get = function (url, data, header = {}) {
  return new Promise((resolve, reject) => {
    var requestTask = wx.request({
      url,
      data,
      header,
      method: 'GET',
      complete (resp) {
        if (resp.statusCode === 200) {
          resolve(resp)
        } else {
          reject(resp)
        }
      }
    })
    setTimeout(function () {
      requestTask.abort()
    }, Timeout)
  })
}

export const post = function (url, data, header = {}) {
  return new Promise((resolve, reject) => {
    var requestTask = wx.request({
      url,
      data,
      header,
      method: 'POST',
      complete(resp) {
        if (resp.statusCode === 200) {
          resolve(resp)
        } else {
          reject(resp)
        }
      }
    })
    setTimeout(function () {
      requestTask.abort()
    }, Timeout)
  })
}






