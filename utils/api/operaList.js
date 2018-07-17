var config = require('../config.js')
module.exports = {
  ShowItemBookingQuery: config.host + '/mix/api/v1/ScheduleBooking/ShowItemBookingQuery',//引进剧目列表
  // POST /api/v{version } /ScheduleBooking/ShowItemQuickQuery
  ShowItemQuickQuery: config.host + '/mix/api/v1/ScheduleBooking/ShowItemQuickQuery'
}



