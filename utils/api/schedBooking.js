var config = require('../config.js')
var host = config.host + config.reverseProxyAlias.scheduleBookingAPI
//host = 'http://www.52drama.com:14812'
// 档期 API http://www.52drama.com:14812
module.exports = {
  getSubmitOrderWFConfig: host + '/api/v1/ScheduleBookingMiddle/SubmitOrderWorkFlowConfig', // 查询提交预约单流程配置
  
  getTroupeOrderInfoById: host + '/api/v1/TheatreOrderManage/GetScheduleBookingInfoById', // 获取指定剧目预约信息,
  submitTroupeOrder: host + '/api/v1/ScheduleBookingMiddle/SubmitTroupeItemScheduleBooking', //

  getTheatreOrderInfoById: host + '/api/v1/TroupeOrderManage/GetScheduleBookingInfoById', // 获取指定场厅预约信息,

}