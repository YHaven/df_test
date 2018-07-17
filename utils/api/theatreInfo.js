var config = require('../config.js')
var host = config.host + config.reverseProxyAlias.theaterInfoAPI
// 档期 API http://www.52drama.com:14807
module.exports = {
  getAllVenues: host + '/api/v1/VenueInfo/List', // 获取剧院下所有场厅，不管发没发布
}