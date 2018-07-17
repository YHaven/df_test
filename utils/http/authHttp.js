/// CQ 20180531
/// 授权HTTP请求工具

import * as basicHttp from './basicHttp.js'
import { refreshTokenConfig } from '../config.js'

function getAccessToken() {
  // 获取access_token
  var access_token = wx.getStorageSync('access_token')
  if (!access_token) {
    return ''
  }
  else {
    return access_token
  }
}

function getRefreshToken(){
  var refresh_token = wx.getStorageSync('refresh_token')
  if (!refresh_token) {
    return ''
  }
  else {
    return refresh_token
  }
}

function authorization(t) {
  return t.startsWith('Bearer ') ? t : 'Bearer ' + t
}

export const get = function (url, data, header = {}) {
  var access_token = getAccessToken()
  return basicHttp.get(url, data, Object.assign(header, { "Authorization": authorization(access_token) }))
}

export const post = function (url, data, header = {}) {
  var access_token = getAccessToken()
  return basicHttp.post(url, data, Object.assign(header, { "Authorization": authorization(access_token) }))
}

export const refreshToken = function () {
  var refresh_token = getRefreshToken()
  if (!refresh_token) {
    return new Promise((resolve, reject) => {
      reject({ statusCode: 600, data: { error: 'not exist refresh_token'} })
    })
  }
  var client_id = refreshTokenConfig.client_id
  var client_secret = refreshTokenConfig.client_secret
  var grant_type = refreshTokenConfig.grant_type
  return basicHttp.post(refreshTokenConfig.endpoint, {
    client_id,
    client_secret,
    grant_type,
    refresh_token
  }, { 'Content-Type': 'application/x-www-form-urlencoded' })
}


