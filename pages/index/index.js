//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    errorMsg: false,
    netTimeOut: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    app.wxLogin()
    // 查看是否是登录超时
    app.netTimeOutCallback = (res) => {
      that.setData({
        netTimeOut: res
      })
      wx.hideLoading()
    }
  },
  // 原先onLoad逻辑
  oldLogin: function () {
    let that = this
    // 此页面用来做首屏展示，登录转发
    if (that.checkLogin()) {
      // 如果存在则跳转，不存在则选择
      app.util.commonViewTap(app.config.homepage, 1)
    } else {
      wx.showLoading({
        title: '加载中'
      })
      setTimeout(function () {
        if (!that.checkLogin()) {
          that.setData({
            netTimeOut: true
          })
          wx.hideLoading()
        }
      }, 10000)
    }
    // 查看是否是登录超时
    app.netTimeOutCallback = (res) => {
      that.setData({
        netTimeOut: res
      })
    }
  },
  checkLogin: function () {
    let access_token = wx.getStorageSync('access_token')
    if (access_token && app.globalData.iyanyiUser) {
      return true
    } else {
      return false
    }
  },
  refresh: function () {
    app.wxLogin()
    this.onLoad()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.util.commonShareAppMessage()
  },

  // ========================================以下方法只是测试用的===========================
  loadUser: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  closeWin: function () {
    wx.navigateBack({
      delta: 2
    })
  }
})
