const app = getApp()
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
// pages/venuePublishList/venuePublishList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    hasMore: true,
    waitForSubmit: [{}, {}, {}, {}], // 待提交
    ifHasManToExamine: false, // 是否有内部审核人
    reasonOptionsWx: ['不想预约了', '信息填写错误', '档期计划有变', '其他原因'],
    reasonOptions: [{
      label: '不想预约了',
      value: '不想预约了'
    },
    {
      label: '信息填写错误',
      value: '信息填写错误'
    },
    {
      label: '档期计划有变',
      value: '档期计划有变'
    },
    {
      label: '其他原因',
      value: '其他原因'
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  // 预约剧目提交
  btnSubmit: function () { },
  // 预约剧目取消
  cancelSubmit: function () { },
  // 跳转预约单详情
  jumpToOrderDetail: function () {},
  openCancelBox: function (e) {
    let that = this
    let result = {}
    result.PhoneNum = e.detail.PhoneNum
    result.BusinessCode = e.detail.BusinessCode
    result.CheckCode = e.detail.CheckCode
    result.RawId = that.data.currentItem.TradeApplyRawId
    if (!result.RawId) return false
    result.BookingStatus = that.data.currentItem.BookingStatus.Key
    result.ReasonInfo = that.data.cancelReason
    // console.log(result)
    that.cancelBookingDo(result)
    // that.onShow()
    that.hideCancelBox()
  },
  hideCancelBox: function (e) {
    this.setData({
      showCancelBox: false
    })
  },
  cancelOrder: function (e) {
    let that = this
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
    wx.showActionSheet({
      itemList: that.data.reasonOptionsWx,
      success: function (res) {
        that.setData({
          cancelReason: that.data.reasonOptionsWx[res.tapIndex]
        })
        if (that.data.currentItem.BookingStatus.Key === 6) {
          // 打开手机验证对话框
          let isPartyA = that.data.currentItem.IsItemOrdering ? that.data.currentItem.TheatreId === that.data.entityInfo.entityID : that.data.currentItem.TroupeId === that.data.entityInfo.entityID
          that.setData({
            showCancelBox: true,
            codeActionUrl: app.api.smsVerifyBiz,
            isPartyA: isPartyA
          })
        } else {
          // 直接去取消
          let result = {}
          result.RawId = that.data.currentItem.TradeApplyRawId
          if (!result.RawId) return false
          result.BookingStatus = that.data.currentItem.BookingStatus.Key
          result.ReasonInfo = that.data.cancelReason
          that.cancelBookingDo(result)
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 取消预约单
  cancelBookingDo(params) {
    let that = this
    params = that.getCommonParam(params)
    if (params.BookingStatus === 1) {
      that.unSubmitCancel(params)
    }
    if (params.BookingStatus === 3) {
      that.cancelWhenWaitAboutReview(params)
    }
    if (params.BookingStatus === 4) {
      that.cancelWhenWaitAboutReview(params)
    }
    if (params.BookingStatus === 6) {
      that.cancelWhenSuccessAboutReview(params)
    }
  },
})