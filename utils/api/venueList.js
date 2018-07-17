var config = require('../config.js')
module.exports = {
  // https://pa.52drama.com/mix/api/v1/ScheduleBooking/TheaterVenueScheduleQuery
  TheaterVenueScheduleQuery: config.host + '/mix/api/v1/ScheduleBooking/TheaterVenueScheduleQuery',
  // https://pa.52drama.com/mix/api/v1/ScheduleBooking/TheaterVenueQuickQuery
  TheaterVenueQuickQuery: config.host + '/mix/api/v1/ScheduleBooking/TheaterVenueQuickQuery'
}
