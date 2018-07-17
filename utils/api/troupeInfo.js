var config = require('../config.js')
var host = config.host + config.reverseProxyAlias.troupeInfoAPI
// 档期 API http://www.52drama.com:14808
module.exports = {
  getItemInfoById: host + '/api/v1/Item/ById', // 仅获取剧目信息
  getTroupeItemInfoById: host + '/api/v1/TroupeInfoMiddle/TroupeItemBaseInfo', // 根据参数获取 经营体 + 剧团 + 剧目
}