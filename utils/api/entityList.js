const app = getApp()
var config = require('../config.js')
module.exports = {
  getEmployeeInfo: config.host + '/om/api/v1/OrganEntity/GetEmployeeInfo'  // 获取员工信息
}