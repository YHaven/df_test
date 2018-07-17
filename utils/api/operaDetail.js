var config = require('../config.js')
var bookHost = config.host + config.reverseProxyAlias.scheduleBookingAPI
var triHost = config.host + config.reverseProxyAlias.troupeInfoAPI
var thiHost = config.host + config.reverseProxyAlias.theaterInfoAPI
//bookHost = 'http://localhost:14812'
module.exports = {
  getOperaById: triHost + '/api/v1/Item/ById', // 剧目基本信息
  TroupeInfoMiddleTroupeItemBaseInfo: triHost + '/api/v1/TroupeInfoMiddle/TroupeItemBaseInfo', // 查询指定剧目信息
  getOperaGalleryBasic: triHost + '/api/v1/Item/QGallery', // 查询-剧目-图库信息(简要信息,用于查看)
  getOperaGalleryBeforeUpdate: triHost + '/api/v1/Item/RGallery', // 查询-剧目-图库信息(用户更新前的read)
  getOperaList: triHost + '/api/v1/Item/All', // 查询-剧目列表
  getOperaTourRequirements: triHost + '/api/v1/Item/TourRequirements', // 查询-剧目巡演要求
  getOperaActorInfoAll: triHost + '/api/v1/ItemActor', // 查询-查询剧目演职人员基本信息
  TroupeItemScheduleInfoSearchByOrderForRecentMonth: bookHost + '/api/v1/TroupeItemScheduleInfo/SearchByOrderForRecentMonth', // 查询-档期查询最近一月
  TroupeItemScheduleInfoSearchByOrder: bookHost + '/api/v1/TroupeItemScheduleInfo/SearchByOrder', // 查询-档期查询
  addOperaScheduleBooking: bookHost + '/api/v1/TroupeItemScheduleBooking/Add', // 添加剧目预约单  
  getTheaterBaseInfo: thiHost + '/api/v1/TheaterInfoMiddle/TheaterBaseInfo', // 获取剧院基本信息  
  getTroupeBaseInfo: triHost + '/api/v1/TroupeInfoMiddle/QTroupeBaseInfo', // 获取剧团基本信息 
}