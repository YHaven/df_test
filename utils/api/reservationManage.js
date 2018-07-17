var config = require('../config.js')
var bookHost = config.host + config.reverseProxyAlias.scheduleBookingAPI
var omHost = config.host + config.reverseProxyAlias.enterpriseManageAPI
var sysHost = config.host + config.reverseProxyAlias.systemBackAPI
//bookHost = 'http://localhost:14812'
module.exports = {
  // 查询受约单列表
  TheatreVenueAboutTradeApplyInfo: bookHost + '/api/v1/TheatreVenueAbout/QueryTradeApplyInfo', 
  // 查询受约单详情
  TheatreVenueAboutGetScheduleBookingInfoById: bookHost + '/api/v1/TheatreVenueAbout/GetScheduleBookingInfoById', 
  // 受约单各个状态的数量
  TheatreVenueAboutQueryApplyAboutStatusNumInfo: bookHost + '/api/v1/TheatreVenueAbout/QueryApplyAboutStatusNumInfo', 
  // 受约单确认
  TheatreVenueAboutBookingConfirm: bookHost + '/api/v1/TheatreVenueAbout/BookingConfirm', 
  // 受约单拒绝
  TheatreVenueAboutBookingRefuse: bookHost + '/api/v1/TheatreVenueAbout/BookingRefuse', 
  // 收到保证金
  TheatreVenueAboutReceiveBooking: bookHost + '/api/v1/TheatreVenueAbout/ReceiveBooking', 
  // 未收到保证金
  TheatreVenueAboutNoReceiveBooking: bookHost + '/api/v1/TheatreVenueAbout/NoReceiveBooking', 
  // 受约单取消, 等待预约方支付时
  TheatreVenueAboutBookingCancel: bookHost + '/api/v1/TheatreVenueAbout/BookingCancel', 
  // 预约场厅成功后，受约方取消
  TheatreVenueAboutCancelWhenSuccess: bookHost + '/api/v1/TheatreVenueAbout/CancelWhenSuccess', 

  // 查询受约单列表
  TroupeItemAboutTradeApplyInfo: bookHost + '/api/v1/TroupeItemAbout/QueryTroupeTradeApplyInfo', 
  // 查询受约单详情
  TroupeItemAboutGetScheduleBookingInfoById: bookHost + '/api/v1/TroupeItemAbout/GetScheduleBookingInfoById', 
  // 受约单各个状态的数量
  TroupeItemAboutQueryApplyAboutStatusNumInfo: bookHost + '/api/v1/TroupeItemAbout/QueryApplyAboutStatusNumInfo', 
  // 受约单确认
  TroupeItemAboutBookingConfirm: bookHost + '/api/v1/TroupeItemAbout/BookingConfirm', 
  // 受约单拒绝
  TroupeItemAboutBookingRefuse: bookHost + '/api/v1/TroupeItemAbout/BookingRefuse', 
  // 收到保证金
  TroupeItemAboutReceiveBooking: bookHost + '/api/v1/TroupeItemAbout/ReceiveBooking',
  // 未收到保证金
  TroupeItemAboutNoReceiveBooking: bookHost + '/api/v1/TroupeItemAbout/NoReceiveBooking', 
  // 受约单取消, 等待预约方支付时
  TroupeItemAboutBookingCancel: bookHost + '/api/v1/TroupeItemAbout/BookingCancel',
  // 预约场厅成功后，受约方取消
  TroupeItemAboutCancelWhenSuccess: bookHost + '/api/v1/TroupeItemAbout/CancelWhenSuccess', 

  // 同意受约审核流程配置
  agreeAboutWorkFlowConfigScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/AgreeAboutWorkFlowConfig', 
  // 收到保证金审核流程配置
  receiveWorkFlowConfigScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/ReceiveWorkFlowConfig', 
  
}

