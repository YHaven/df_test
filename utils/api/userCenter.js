const app = getApp()
var config = require('../config.js')
module.exports = {
  modifyHeadImg: config.host + '/uc/api/v1/User/SetInfo', // 修改用户头像
  modifyUserName: config.host + '/uc/api/v1/User/SetUserName', // 修改用户名
  modifyName: config.host + '/uc/api/v1/User/SetInfo', // 修改姓名
  modifyNickName: config.host + '/uc/api/v1/User/SetInfo', // 修改昵称
  modifyMale: config.host + '/uc/api/v1/User/SetInfo', // 修改性别
  modifyBirthday: config.host + '/uc/api/v1/User/SetInfo', // 修改生日
  modifyPassword: config.host + '/uc/api/v1/User/ChangePassword' // 修改密码
}