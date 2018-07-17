var config = require('../config.js')
var bookHost = config.host + config.reverseProxyAlias.scheduleBookingAPI
var omHost = config.host + config.reverseProxyAlias.enterpriseManageAPI
var sysHost = config.host + config.reverseProxyAlias.systemBackAPI
//bookHost = 'http://localhost:14812'
module.exports = {
  // 查询剧目预约单列表
  TheatreOrderManageQueryScheduleBookingInfo: bookHost + '/api/v1/TheatreOrderManage/QueryScheduleBookingInfoForWechat', 
  // 预约单各个状态的数量
  TheatreOrderManageQueryApplyStatusNumInfo: bookHost + '/api/v1/TheatreOrderManage/QueryApplyStatusNumInfo', 
  // 查询预约单详情
  TheatreOrderManageGetScheduleBookingInfoById: bookHost + '/api/v1/TheatreOrderManage/GetScheduleBookingInfoById', 
  // 预约单支付
  TheatreOrderManagePay: bookHost + '/api/v1/TheatreOrderManage/Pay',
  // 预约单未提交取消
  TheatreOrderManageUnSubmitCancel: bookHost + '/api/v1/TheatreOrderManage/UnSubmitCancel',
  // 预约单等待受约方审核时 取消
  TheatreOrderManageCancelWhenWaitAboutReview: bookHost + '/api/v1/TheatreOrderManage/CancelWhenWaitAboutReview',
  // 预约单等待支付时取消
  TheatreOrderManageCancelWhenWaitPay: bookHost + '/api/v1/TheatreOrderManage/CancelWhenWaitPay',
  // 预约单预约剧目成功后取消
  TheatreOrderManageCancelWhenSuccess: bookHost + '/api/v1/TheatreOrderManage/CancelWhenSuccess',
  //获取预约单提交流程配置中间件
  submitOrderWorkFlowConfigScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/SubmitOrderWorkFlowConfig', 
  //查询第一个流程配置节点的备注
  queryFlowSetFirstNodeMark: omHost + '/api/v1/WorkFlow/QueryFlowSetFirstNodeMark', 
  // 获取员工有排除
  getEmployeeEmployees4FlowTo: omHost + '/api/v1/WorkFlowInstance/Employees4FlowTo', 
  // 预约单提交剧目流程配置中间
  submitTroupeItemScheduleBookingScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/SubmitTroupeItemScheduleBooking', 
  // 支付保证金工作流配置中间件
  paymentWorkFlowConfigScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/PaymentWorkFlowConfig',
  //上传支付凭证
  uploadPayUrl: config.resourceHost + '/api/v1/upload/PostPictureMore', 
  // 短信验证
  smsVerifyBiz: sysHost + '/api/v1/sms/VerifyBiz',
  smsConfirmOperation: sysHost + '/api/v1/sms/confirmoperation',
  // 收到未收到验证码
  smsVerifyBizTN: sysHost + '/api/v1/sms/VerifyBizTN',
  // 预约单各个状态的数量
  TroupeOrderManageQueryApplyBookStatusNumInfo: bookHost + '/api/v1/TroupeOrderManage/QueryApplyBookStatusNumInfo',
  // 查询预约单列表
  TroupeOrderManageQueryScheduleBookingInfo: bookHost + '/api/v1/TroupeOrderManage/QueryScheduleBookingInfo',
  // 查询预约单详情
  TroupeOrderManageGetScheduleBookingInfoById: bookHost + '/api/v1/TroupeOrderManage/GetScheduleBookingInfoById',
  // 预约单支付
  TroupeOrderManagePay: bookHost + '/api/v1/TroupeOrderManage/Pay',
  // 预约单未提交取消
  TroupeOrderManageUnSubmitCancel: bookHost + '/api/v1/TroupeOrderManage/UnSubmitCancel',
  // 预约单等待受约方审核时 取消
  TroupeOrderManageCancelWhenWaitAboutReview: bookHost + '/api/v1/TroupeOrderManage/CancelWhenWaitAboutReview',
  // 预约单等待支付时取消
  TroupeOrderManageCancelWhenWaitPay: bookHost + '/api/v1/TroupeOrderManage/CancelWhenWaitPay',
  // 预约单预约剧目成功后取消
  TroupeOrderManageCancelWhenSuccess: bookHost + '/api/v1/TroupeOrderManage/CancelWhenSuccess',
  // 预约单提交场厅流程配置中间件
  submitTheatreVenueScheduleBookingScheduleBookingMiddle: bookHost + '/api/v1/ScheduleBookingMiddle/SubmitTheatreVenueScheduleBooking', 
}

