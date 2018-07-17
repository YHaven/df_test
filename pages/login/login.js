const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    errorMsg: false,
    netTimeOut: false,
    defaultImg: app.config.defaultImg,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.iyanyiUser = {}
    app.globalData.userData = {}
    app.globalData.entityInfo = {}
    app.globalData.employeeInfo = {}
    app.globalData.organInfo = {}  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      // app.util.commonViewTap('/pages/index/index', 1)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.util.commonViewTap(app.config.homepage, 1)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // console.log('33333')
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
    if (e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      // 判断是否绑定手机
      if (app.globalData.iyanyiUser && app.globalData.iyanyiUser.UserId) {
        app.util.commonViewTap(app.config.homepage, 1)
      } else {
        app.util.commonViewTap('/pages/bindPhone/bindPhone')
      }
    } else {
      console.log(e.detail.errMsg+ new Date().getTime())
      // this.closeWin()
    }
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  // 刷新
  refresh: function () {
    this.onShow()
  },
  // 登录页面返回关闭页面
  closeWin: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})