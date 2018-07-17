/**
 * 以剧院身份进入"我的事项"页面
 * CQ
 */
import * as about from './myMatters_about.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...about.data,
    userInfo: {},
    iyanyiUser: {},
    hasUserInfo: false,
    currentTab: 2,
    waitForSubmit: [{},{},{},{}], // 待提交
    waitForPay: [{}, {}, {}, {}] // 待支付
  },
  ...about.methods,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.entityInfo.entityName||'剧汇王朝POMS',
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  // 预约剧目提交
  btnSubmit: function () {},
  // 预约剧目取消
  cancelSubmit: function () {},
  // 支付预约剧目
  btnPay: function () {},
  // 取消预约剧目
  cancelPay: function () {},
  // 跳转待提交或者待支付
  jumpToMore: function () {}
})