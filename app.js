var configAll = require('/utils/index.js')
// import { refreshToken,get } from './utils/http/authHttp.js'
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    /* 测试调用om接口*/
    // wx.setStorageSync('refresh_token', '48833d780ad3bbc7501ffe8c8855461833600df24e0f94c07f5960ab2dcd3058')
    // refreshToken().then(res => {
    //   console.log(res)
    //   wx.setStorageSync('refresh_token', res.data.refresh_token)
    //   wx.setStorageSync('access_token', res.data.access_token)
    //   get('https://apiwx.52drama.com:64817/om/api/v1/OrganEntity/Departs', { entityId: '0595c7d1-c237-480a-8391-045511064cde'}).then(res=>{
    //     console.log(res)
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // })
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // this.wxLogin()
    this.getSystemInfoSync()
  },
  onShow: function () {
    
  },
  wxGetUserInfo: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          // 已经授权，去主页
          // this.util.commonViewTap('/pages/index/index', 1)
        } else {
          //未授权，去登录页授权
          // this.util.commonViewTap('/pages/login/login', 1)
        }
      }
    })
  },
  getSystemInfoSync:function() {
    var res = this.util.getSystemInfoSync()
    this.globalData.systemInfo = res.systemInfo
    this.globalData.loginLog = res.loginLog
  },
  wxLogin: function () {
    let that = this
    // 登录
    wx.login({
      success: res => {
        // console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let url = that.api.getWeChatUserByCode
        let params = {
          Code: res.code,
          LoginLogInfo: that.globalData.loginLog // 添加登录日志需要的额外信息
        }
        that.util.postData.call(that, url, params, 'POST', 
          function (res) {  // 成功
            // console.log(res)
            wx.setStorageSync('access_token', res.data.AuthResult.access_token)
            res.data.PhoneNumberString = that.util.getPhoneNumberCodeString(res.data.Phone)
            that.globalData.iyanyiUser = res.data  // 获取系统用户信息
            that.wxGetUserInfo() // 获取微信用户信息
            that.util.commonViewTap(that.config.homepage, 1)
            if (that.netTimeOutCallback) {
              that.netTimeOutCallback(false)
            }
          },
          function (res) {  // 失败
            console.log(res)
            if (res.errMsg.indexOf('request:fail') >= 0) {
              if (that.netTimeOutCallback) {
                that.netTimeOutCallback(true)
              }
            } else {
              that.util.commonViewTap('/pages/login/login', 1)
            }
          }
        )
      }
    })
  },
  api: configAll.api,
  config: configAll.config,
  util: configAll.util,
  AreaInfoUtil: configAll.AreaInfoUtil,
  globalData: {
    systemInfo: null,
    userInfo: null, // 微信用户
    iyanyiUser: {
      UserId: undefined,
    },
    userData: {}, // 用户信息
    organInfo: {
      organId: undefined,
    }, // 组织信息
     // 系统用户
    entityInfo: {
      entityID: undefined,
    },
    employeeInfo: {
      employeeId: undefined,
      employeeName: undefined,
      employeePhoneNumber: undefined,
    },
    loginLog: {
      City: null, // 登录所在城市（需要请求用户授权获取手机定位）
      Province: null, // 登录所在省份（需要请求用户授权获取手机定位）
      Country: null, // 登录所在国家（需要请求用户授权获取手机定位）
      Language: null, // 浏览的语言风格 
      ThirdAppType: 1, // 第三方登录凭证类型（剧汇王朝用户登录时为空） = ['微信小程序' = 1, '其他' = 999], 使用数值，避免变更名称后出错
      SourceType: '小程序', // 登陆渠道 = ['Web', '小程序', 'App', '微信公众号', '其它']
      DeviceType: 'CellPhone', // 登录设备类型 = ['PC', 'Pad', 'CellPhone']
      Sysetm: null, // 客户机系统类型 
      SysVersion: null, // 客户机系统版本 
      Platform: 'WeChat', // 产品寄宿的平台 
      PFMVersion: null, // 产品寄宿的平台的版本 
      ProductVersion: '0.3.1.2', // 产品版本与POMS版本一样
    }
  }
})