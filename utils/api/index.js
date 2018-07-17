import userLogin from './userLogin'
import userUnbinding from './userUnbinding'
import enterpriseManage from './enterpriseManage'
import troupeInfo from './troupeInfo'
import theatreInfo from './theatreInfo'
import schedBooking from './schedBooking'
import test from './test'
import ossSys from './ossSys'
import userCenter from './userCenter'
import operaDetail from './operaDetail'
import orderManage from './orderManage'
import reservationManage from './reservationManage'
import joinEntity from './joinEntity'
import operaList from './operaList.js'
import venueList from './venueList.js'
import entityList from './entityList'
import my from './my'

const api = { 
  ...test, 
  ...userLogin, 
  ...userUnbinding, 
  ...ossSys, 
  ...operaDetail, 
  ...orderManage,
  ...reservationManage,
  ...userCenter,
  ...joinEntity,
  ...enterpriseManage, 
  ...troupeInfo, 
  ...theatreInfo,
  ...schedBooking,
  ...operaList,
  ...entityList,
  ...my,
  ...venueList
}
// var api = Object.assign({}, userLogin)
// api = Object.assign(api, test)
module.exports = api
