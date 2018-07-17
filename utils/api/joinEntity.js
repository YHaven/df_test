const app = getApp()
var config = require('../config.js')
module.exports = {
  getSimilarNameEntity: config.host + '/om/api/v1/OrganEntity/GetSimilarNameEntitiesContainUserRelation', // 查找同名经营体
  joinEntity: config.host + '/om/api/v1/Organization/JoinUs' // 加入经营体
}