const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    defaultImg: app.config.defaultImg,
    showMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '场厅详情',
    })
    let that = this
    if (options.id) {
      that.setData({
        tradeApplyId: options.id
      })
    }
    this.getUserinfo()

  },
  getUserinfo: function () {
    // console.log(app.globalData)
    if (app.globalData.iyanyiUser) {
      console.log(app.globalData.employeeInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        iyanyiUser: app.globalData.iyanyiUser,
        entityInfo: app.globalData.entityInfo,
        employeeInfo: app.globalData.employeeInfo,
        organInfo: app.globalData.organInfo,
        hasUserInfo: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
})