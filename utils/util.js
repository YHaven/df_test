var config = require('config.js')
var authHttp = require('http/authHttp.js')
var api = require('api.js')
var {
  version
} = require('../version.js')
var tokenTimes = 0
var interval = null
// 时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const ProtoDate = Date
Date = function (str) {
  if (typeof str === 'string') {
    return new ProtoDate(str.replace(/-/g, '/'))
  } else {
    return new ProtoDate(...arguments)
  }
}

Date.now = function () {
  return ProtoDate.now()
}

Date.prototype.Format = function (formatStr) {
  var str = formatStr;
  var Week = ['日', '一', '二', '三', '四', '五', '六'];

  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

  str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
  str = str.replace(/M/g, (this.getMonth() + 1));

  str = str.replace(/w|W/g, Week[this.getDay()]);

  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
  str = str.replace(/d|D/g, this.getDate());

  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
  str = str.replace(/m/g, this.getMinutes());

  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
  str = str.replace(/s|S/g, this.getSeconds());

  return str;
}

//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
const formatDate = (dateInst, fmt) => {
  var o = {
    "M+": dateInst.getMonth() + 1, //月份 
    "d+": dateInst.getDate(), //日 
    "h+": dateInst.getHours(), //小时 
    "m+": dateInst.getMinutes(), //分 
    "s+": dateInst.getSeconds(), //秒 
    "q+": Math.floor((dateInst.getMonth() + 3) / 3), //季度 
    "S": dateInst.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateInst.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
  // return dateInst.Format(fmt)
}


function getAccessToken(cb, fail_cb) {
  var params = {}
  params.grant_type = 'client_credential';
  params.appid = config.appId;
  params.secret = config.appKey;
  wx.request({
    url: config.weixinApi.getaccesstoken,
    data: params,
    method: 'GET',
    // header: {'content-type': 'application/json'},
    success: function(res) {
      wx.stopPullDownRefresh()
      typeof cb == 'function' && cb(res)
    },
    fail: function() {
      wx.stopPullDownRefresh()
      typeof fail_cb == 'function' && fail_cb()
    }
  })
}

// 获取客户端系统信息
function getSystemInfoSync() {
  var resInfo = wx.getSystemInfo()
  var res = wx.getSystemInfoSync()
  var systemInfo = {}
  try {
    // console.log(res)
    // console.log(resInfo)
    systemInfo = {
      model: res.model,
      pixelRatio: res.pixelRatio,
      windowWidth: res.windowWidth,
      windowHeight: res.windowHeight,
      language: res.language,
      version: res.version,
      platform: res.platform,
      system: res.system,
      sysVersion: null
    }
    // 当前设备是否是平板通过计算设备显示的 PPI 值来计算，
    // 如 Apple New iPad 9.7英寸 2048x1536分辨率的 PPI 为 264，手机 5.3英寸 1280x720分辨率的 PPI 为 277
    let trimmedSystem = systemInfo.system.trim()
    let lastSpaceIdx = trimmedSystem.lastIndexOf(' ')
    if (lastSpaceIdx > 0) {
      systemInfo.system = trimmedSystem.substr(0, lastSpaceIdx)
      systemInfo.sysVersion = trimmedSystem.substr(lastSpaceIdx + 1)
    }

  } catch (e) {

  }
  var loginLog = {
    City: null, // 登录所在城市（需要请求用户授权获取手机定位）
    Province: null, // 登录所在省份（需要请求用户授权获取手机定位）
    Country: null, // 登录所在国家（需要请求用户授权获取手机定位）
    Language: null, // 浏览的语言风格 
    ThirdAppType: 1, // 第三方登录凭证类型（剧汇王朝用户登录时为空） = ['微信小程序' = 1, '其他' = 999], 使用数值，避免变更名称后出错
    SourceType: '小程序', // 登陆渠道 = ['Web', '小程序', 'App', '微信公众号', '其它']
    DeviceType: 'CellPhone', // 登录设备类型 = ['PC', 'Pad', 'CellPhone']
    Sysetm: null, // 客户机系统类型 
    SysVersion: null, // 客户机系统版本 
    Platform: null, // 产品寄宿的平台 
    PFMVersion: null, // 产品寄宿的平台的版本 
    ProductVersion: '0.3.1.2', // 产品版本与POMS版本一样
  }
  loginLog.Sysetm = systemInfo.system || null // 操作系统，如 iOS, Android
  loginLog.SysVersion = systemInfo.sysVersion || null // 操作系统，如 iOS 的 10.0.1，Android 的 5.0
  // loginLog.Platform = (systemInfo.platform == 'android' ? 'WeChat' : systemInfo.platform) // 小程序客户端平台名称（小程序开发工具为 devtools，手机微信客户端为）
  loginLog.Platform = 'WeChat'
  loginLog.PFMVersion = systemInfo.version || null // 微信版本号
  loginLog.Language = systemInfo.language || 'zh_CN'
  loginLog.ProductVersion = version || '0.3.1.1'
  return {
    systemInfo: systemInfo,
    loginLog: loginLog
  }
}

// 获取数据
function postData(url, params, method, cb, fail_cb) {
  var that = this
  if (typeof method === 'undefined') {
    method = 'POST'
  }
  if (method === 'GET') {
    authHttp.get(url, params).then(res => {
      if (that.setData) {
        that.setData({
          netTimeOut: false // 不超时
        })
      }
      typeof cb == 'function' && cb(res)
    }).catch(res => {
      // typeof fail_cb == 'function' && fail_cb(res) // 没有统一的错误处理时再调用业务的错误处理
      errorFunction(that, res, fail_cb)
    })
  } else {
    authHttp.post(url, params).then(res => {
      if (that.setData) {
        that.setData({
          netTimeOut: false // 不超时
        })
      }
      typeof cb == 'function' && cb(res)
    }).catch(res => {
      // typeof fail_cb == 'function' && fail_cb(res) // 没有统一的错误处理时再调用业务的错误处理
      errorFunction(that, res, fail_cb)
    })
  }
}

// 请求错误处理
function errorFunction(that, res, fail_cb) {
  console.log(res)
  wx.stopPullDownRefresh()
  if (res.errMsg.indexOf('request:fail') >= 0) {
    wx.showToast({
      title: '请求超时',
      icon: 'none',
      image: config.defaultImg.iconCry,
      duration: 1500
    })
    if (that.setData) {
      that.setData({
        netTimeOut: true
      })
    }
  } else {
    let status = res.statusCode
    switch (status) {
      // case 462:
      // case 463:
      // case 464:
      // case 465: // 短信验证码
      //   break
      // case 522: // 微信用户尚未注册
      //   break
      // case 526: // 微信用户登录POMS失败
      //   break
      case 460: // 入参校验失败
        // 微信手机注册时的错误460不需要提示
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 3000
        })
        break
      case 521: // 请求微信API换取微信用户Session失败
        wx.showToast({
          title: '微信出错了',
          icon: 'none',
          duration: 3000
        })
        break
      case 401:
        // 重新获取token
        // wx.showToast({ title: '未授权！理论上是不可能的', icon: 'none', duration: 3000 })
        console.log(res.statusCode)
        // 更新token
        if (!that.data.interval) {
          that.data.interval = setInterval(function () {
            tokenTimes++
            console.log(tokenTimes)
            if (tokenTimes < config.refreshTokenTimes) {
              refreshToken(that)
            } else {
              clearInterval(that.data.interval)
              that.data.interval = null // 清除了定时器后interval还需要手动置为null
              tokenTimes = 0
            }
          }, 5000)
        } else {
          console.error('401 错误已经触发了setInterval刷新令牌动作，不再启动新定时器')
        }
        break
      default:
        // 先统一话消息提示
        console.log(res)
        if (res && res.data) {
          if (Array.isArray(res.data)) {
            if (res.data.length > 0) {
              let message = ''
              res.data.forEach(item => {
                if (item) {
                  if(message) {
                    message += '\n' + item
                  } else{
                    message = item
                  }                  
                }
              })
              res.message = message
            }
          } else if (typeof (res.data) === 'string') {
            res.message = res.data
          }
          if (res.data.Message) {
            res.message = res.data.Message
          }
          if (res.data.Messages) {
            res.message = res.data.Messages[0]
          }
        } else {
          res = {}
        }
        // 如果业务已经定义了错误提示，则使用业务的处理
        if (fail_cb && typeof fail_cb == 'function') {
          fail_cb(res)
          return
        }        
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        })
    }


  }
}

// 重新获取token
function refreshToken(that) {
  wx.login({
    success: res_login => {
      console.log(res_login.code)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      let url = api.getWeChatUserByCode
      let params = {
        Code: res_login.code,
        LoginLogInfo: getSystemInfoSync().loginLog // 添加登录日志需要的额外信息
      }
      authHttp.post(url, params).then(res_a => {
        wx.setStorageSync('access_token', res_a.data.AuthResult.access_token)
        console.log(that.data.interval)
        clearInterval(that.data.interval)
        that.data.interval = null // 清除了定时器后interval还需要手动置为null
        // tokenTimes = 0   
        that.refresh()
      }).catch(res => {})
    }
  })
}

// 获取数据列表
function postDataList(url, params, method, cb, fail_cb) {
  var that = this
  postData.call(that, url, params, method,
    function(res) { // 成功
      that.setData({
        dataList: that.data.dataList.concat(res.data.DataRows),
        pageIndex: res.data.CurrentPageIndex
      })
      // 当前页码等于总页码则没有更多了
      if (res.data.PageCount === res.data.CurrentPageIndex) {
        that.setData({
          hasMore: false,
        })
      } else {
        that.setData({
          hasMore: true,
        })
      }
      typeof cb == 'function' && cb(res)
    },
    function(res) { // 失败
      typeof fail_cb == 'function' && fail_cb(res)
    },
  )
}

// 上传图片
function uploadImg(url, params, cb, fail_cb) {
  var that = this;
  // console.log(params)
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      var tempFilePaths = res.tempFilePaths;
      // var header = {
      //   'content-type': 'multipart/form-data'
      // }
      var access_token = wx.getStorageSync('access_token')
      var header = {
        "Authorization": access_token.startsWith('Bearer ') ? access_token : 'Bearer ' + access_token
      }
      wx.uploadFile({
        url: url,
        filePath: tempFilePaths[0],
        name: 'IsThumbnail',
        header: header,
        formData: params,
        success: function(res) {
          // console.log(res)
          typeof cb == 'function' && cb(res)
        }
      })
    }
  })
}

// 页面分享操作 app.util.commonShareAppMessage()
function commonShareAppMessage(params) {
  if (typeof params === 'undefined') {
    params = config.ShareMessage
  }
  return params
}

// 页面跳转操作 e:点击dom属性,t:跳转类型 default:navigate 后续再加   
// <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
// var data = e.currentTarget.dataset;
// var url = data.url
// app.util.commonViewTap(url)
// success fail complete
function commonViewTap(url, t) {
  switch (t) {
    case 1: // 关闭当前页面，跳转到应用内的某个页面。
      wx.redirectTo({
        url: url
      })
      break
    case 2: // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 需在 app.json 的 tabBar 字段定义的页面  路径后不能带参数
      wx.switchTab({
        url: url
      })
      break
    case 3: // 关闭所有页面，打开到应用内的某个页面。
      wx.reLaunch({
        url: url
      })
      break
    case 99: // 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
      wx.navigateBack({
        delta: 1
      })
      break
    default: //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面
      wx.navigateTo({
        url: url
      })
  }

}

// 通用校验规则
const validateRules = {
  // 校验11位手机号
  phoneNumber(value) {
    if (value) {
      if (/^[1][3,4,5,7,8][0-9]{9}$/g.test(value)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },
  // 校验邮箱名称允许汉字、字母、数字，域名只允许英文域名
  mailString(value) {
    if (value) {
      if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g.test(value)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

// 自定义MessageToast操作
const messageToast = {
  show: function(message, time) {
    let that = this
    if (typeof time === undefined) {
      time = 1500
    }
    that.setData({
      toastMsg: message
    })
    setTimeout(function() {
      that.setData({
        toastMsg: ''
      })
    }, time)
  }
}

function getPhoneNumberCodeString(phone) {
  let PhoneNumberString = phone ? phone.substring(0, 3) + '****' + phone.substring(7, 11) : '无'
  return PhoneNumberString
}

// 数字格式化
function toThousands(num) {
  var num = (num || 0).toString(),
    result = '',
    sof = '00'
  if (num.indexOf('.') > 0) {
    sof = num.split('.')[1]
    num = num.split('.')[0]
  }
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  if (result.indexOf('-') === 0) {
    result = result.replace('-,', '-')
  }
  return result + '.' + sof;
}

function getPrePage() {
  let pages = getCurrentPages()
  if (pages.length < 2) throw new Error("不存在前一页的Page")
  return pages[pages.length - 2]
}

function setPrePageData(data) {
  let pages = getCurrentPages()
  pages[pages.length-2].setData(data)
}
// 显示地图地址位置
function viewMapAddress(args) {
  if (!args || args.latitude === undefined || args.longitude === undefined) {
    // 如果是空值，调用openLocation会报错。错误的坐标会定位地图会进行处理，定位到北京
    return
  }
  //获取当前经纬度
  wx.getLocation({
    //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
    type: 'wgs84',
    success: function (res) {
      wx.openLocation({//​使用微信内置地图查看位置。
        latitude: args.latitude,//要去的纬度-地址
        longitude: args.longitude,//要去的经度-地址
        name: args.name, // 位置名
        address: args.address // 地址的详细说明
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  validateRules: validateRules, // 校验规则
  messageToast: messageToast, // 信息提醒
  commonShareAppMessage: commonShareAppMessage, // 分享
  commonViewTap: commonViewTap, // 跳转页面
  getPhoneNumberCodeString: getPhoneNumberCodeString, // 获取手机号****
  toThousands: toThousands, // 数字格式化 100,000,000.00
  getSystemInfoSync: getSystemInfoSync, // 获取客户端系统信息
  postData: postData, // ajax 请求
  postDataList: postDataList, // 列表ajax请求
  uploadImg: uploadImg, // 图片上传
  setPrePageData, // 返回上一页的时候可以调用将修改Page的data属性
  getPrePage,
  viewMapAddress: viewMapAddress // 在地图上查看位置
}