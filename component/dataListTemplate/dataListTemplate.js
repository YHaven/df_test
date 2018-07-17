const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    showGoTop: false,
    defaultImg: app.config.defaultImg,
    userInfo: {},
    iyanyiUser: {},
    hasUserInfo: false,
    hasMore: true,
    pageSize: 10,
    pageIndex: 1,
    showLoading: true,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserinfo()
  },
  getUserinfo: function () {
    if (app.globalData.iyanyiUser) {
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 刷新
  refresh: function () {
    this.onShow()
  },
  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  }
})