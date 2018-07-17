const app = getApp()
var config = require('../config.js')
module.exports = {
  GetOrganEntityByEntityID: config.host + '/om/api/v1/OrganEntity/GetOrganEntityByEntityID' // 经营体id查找经营体
}