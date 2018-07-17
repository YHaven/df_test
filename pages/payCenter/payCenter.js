const app = getApp()
const ossTool = require('../../utils/alioss/ossTool.js');
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    tradeApplyRawId:'',
    uploadImgUrl:'',
    orderData: {},
    operaInfo: {},
    AboutBaseInfo: {},
    Payments: {},
    ShowPrice: 0,   // 演出价总额
    ShowEpositPrice: 0,  // 保证金总额
    ShowPriceStr: '0.00', // 演出价总额
    ShowEpositPriceStr: '0.00', // 保证金总额
    allPrice: 0,
    allPriceStr: '0.00', // 总计

    showTransferRuleBox: false,

    userData: {}, // 当前用户信息
    organInfo: {}, // 当前组织信息
    entityInfo: {}, // 当前经营体信息
    employeeInfo: {} // 用户的员工身份信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '支付中心',
    })
    let that = this
    // options.id = 'e6ba99d4-cc38-4fae-b0af-3630e9f7c6a1' // 临时测试设置一个待付款的预约单
    if (options.id) {
      that.setData({
        tradeApplyRawId: options.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单信息
    this.getOrderInfo()
    this.initEmployeeInfo()
  },
  /**
   * 初始化当前登录用户的Id、组织信息、经营体信息、员工信息
   */
  initEmployeeInfo: function () {
    // 待公共的选择经营体编写完毕后，从真实的信息来源获取,暂时设置为固定值
    this.setData({
      userData: app.globalData.userData,
      organInfo: app.globalData.organInfo,
      entityInfo: app.globalData.entityInfo,
      employeeInfo: app.globalData.employeeInfo,
    })
  },
  getCommonParam(params) {
    let that = this
    if(!params) {
      params = {}
    }
    params.RegisteOrganRawID = that.data.organInfo.organId
    params.EntityRawID = that.data.entityInfo.entityID
    params.UserRawId = that.data.userData.userId
    params.EmployeeId = that.data.employeeInfo.employeeId
    params.EmployeeName = that.data.employeeInfo.employeeName
    params.EmployeePhoneNum = that.data.employeeInfo.employeePhoneNumber
    params.EmployeePhone = that.data.employeeInfo.employeePhoneNumber
    if (that.data.employeeInfo.employeePhoneNumber === '') {
      params.EmployeePhoneNum = that.data.userData.phone
      params.EmployeePhone = that.data.userData.phone
    }
    return params
  },
  getOrderInfo: function(){
    let that = this
    let url = app.api.TheatreOrderManageGetScheduleBookingInfoById
    let params = { rawId: that.data.tradeApplyRawId}
    app.util.postData.call(that, url, params, 'GET',
      function (res) { // 成功

        if (res.statusCode === 200) {
          let orderData = res.data.TheatreOrderScheduleBase
          let sortSchedules = orderData.OrderSchedules
          let ShowPrice = 0 // 演出价
          let ShowEpositPrice = 0 // 保证金
          let AdditionalPrice = Number(orderData.AdditionalPrice) || 0
          sortSchedules.forEach(s => {
            ShowPrice += s.Price
            ShowEpositPrice += s.EpositPrice
          })
          that.setData({
            orderData: orderData,
            operaInfo: orderData.TroupeItemOutline,
            AboutBaseInfo: res.data.AboutBaseInfo,
            Payments: orderData.Payments[0],
            ShowPrice: ShowPrice,   // 演出价总额
            ShowEpositPrice: ShowEpositPrice,  // 保证金总额
            ShowPriceStr: app.util.toThousands(ShowPrice), // 演出价总额
            ShowEpositPriceStr: app.util.toThousands(ShowEpositPrice), // 保证金总额
            allPrice: AdditionalPrice + ShowPrice,
            allPriceStr: app.util.toThousands(AdditionalPrice + ShowPrice) // 总计
          })
          that.selectComponent("#timeCountDown").lastSecond() // 启动剩余时间倒计时
        }
        
      }, function (res) { // 失败

      })
  },
  // 刷新
  refresh: function () {
    this.onShow()
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
  // 预约须知
  showTransferRule: function () {
    this.setData({
      showTransferRuleBox: true
    })
  },
  hideTransferRule: function () {
    this.setData({
      showTransferRuleBox: false
    })
  },
  // 上传凭证
  uploadImg: function(){
    let that = this
    var cb = function (res) {
      that.setData({
        uploadImgUrl: res.url
      })
    }
    var fail_cb = function (res) {
      that.setData({
        errorMsg: '上传图片失败,请重新上传'
      })
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log('chooseImage success, temp path is: ', tempFilePaths[0])
        ossTool.uploadFile(
        {
          filePath: tempFilePaths[0],
          dir: app.config.ossFilePaths.payimage, // 支付凭证的文件路径
          success: function (res) {
            console.log("上传成功,文件地址为:" + res? res.url:'');
            cb(res)
          },
          fail: function (res) {
            if (res) {
              console.log(res);
            }
            fail_cb(res)
          }
        })
      }
    })
  },
  submitOrder:function(){
    let that = this
    if (that.data.uploadImgUrl == ''){
      topMsgTip.show.call(that, '请上传支付凭证', 1500)
      return false
    }
    let params = {
      PaymentUrl: that.data.uploadImgUrl,
      PaymentRawId: that.data.Payments.PaymentRawId,
      // 已经审核通过(如果有审核)才会进入支付中心页面，审核人和流程配置这两个参数这时不需要了
      //         Receiver (string): 审核人 ,
      // FlowSetId (string): 流程配置 ,
      RawId: that.data.orderData.TradeApplyRawId,
      BookingStatus: that.data.orderData.BookingStatus.Key
    }
    params = this.getCommonParam(params)
    let url = app.api.TheatreOrderManagePay
    app.util.postData.call(that, url, params, 'POST',
    // 成功时的回调
    function (res) {
      // 跳转到预约单详情页
      // 改为返回上一页
      app.util.commonViewTap('/pages/operaOrderDetail/operaOrderDetail?id=' + that.data.orderData.TradeApplyRawId,1)
    },
    // 失败时的回调
    function(res) {
      console.error(res.message)
      topMsgTip.show.call(that, res.message, 1500)
      if (res.statusCode === 400) {
        setTimeout(function(){
          app.util.commonViewTap('', 99)
        },1500)
      }
    }
    )
  }

})