var config = require('../config.js')
module.exports = {
  getWeChatUserByCode: config.host + '/api/v1/ID/GetAndLogin', // 用户登录
  userLogin: config.host + '/api/v1/ID/Login', // 用户登录
  getUserInfo: config.host + '/uc/api/v1/User/GetInfo', // 用户信息
  sendBindingCode: config.host + '/api/v1/ID/SendBindingCode', // 发送绑定验证码
  exchangePhone: config.host + '/api/v1/ID/Exchange4Phone', // 微信手机号解码
  getEntitiesByUserIDForPage: config.host + '/om/api/v1/OrganEntity/GetEntitiesByUserIDForPage', // 经营体列表
  uploadImg: config.host + '',//上传图片
  deleImg: config.host + '',//删除图片 imgId
  getDataList: config.host + ''
}