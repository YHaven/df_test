const app = getApp()
// var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    toastMsg: false,
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
    showReceiveFlowBox: false,
    showSubmitFlowBox: false,
    showSubmitAgreeOrderBox: false,
    showCancelBox: false,
    showReceiveBox: false,
    isReceiveOrder: true,
    dataList: [],
    currentItem: {},
    receiverList: [],
    orderInfo: {
      sp: '',
      workFlowConfigId: '',
      beginTime: '',
      endTime: '',
      hours: 72,
      minutes: 0
    },
    confirmBookingInfo: {
      AboutBaseInfo: {}
    },
    confirmPhoneCheckInfo: {
      LoadStageTime: '',
      CutStageTime: '',
      PhoneNum: '',
      CheckCode: ''
    },
    reasonOptionsWx: ['档期被预约走了', '预约方未认证', '预约方信息不全', '档期计划有变', '其他原因'],
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
    searchForm: {
      BookingStatus: '',
      Keyword: ''
    },
    applyStatusNum: {
      WaitReviewNum: 0,
      WaitPayNum: 0,
      WaitConfirmNum: 0,
      WaitEvaluateNum: 0,
      WaitSubmitNum: 0
    },
    employeeInfo: {},
    organInfo: {},
    entityInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onMyShow()
  },
  getUserinfo: function() {
    // console.log(app.globalData)
    if (app.globalData.iyanyiUser) {
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
  onShow: function() {

  },
  onMyShow: function() {
    let that = this
    this.getUserinfo()
    // 加载数量
    this.loadNumber()
    that.setData({
      dataList: [],
      showLoading: true,
      hasMore: true,
      orderInfo: {
        sp: '',
        workFlowConfigId: '',
        beginTime: '',
        endTime: '',
        hours: 72,
        minutes: 0
      }
    })
    var params = {
      EntityId: that.data.entityInfo.entityID,
      BookingStatus: that.data.searchForm.BookingStatus,
      Keyword: that.data.searchForm.Keyword,
      pageIndex: 1,
      pageSize: that.data.pageSize
    }
    wx.showNavigationBarLoading()
    that.getOrderList(params, function(res) {
      that.dataFormat()
      that.setData({
        showLoading: false
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  loadNumber: function() {
    var that = this;
    var url = app.api.TheatreVenueAboutQueryApplyAboutStatusNumInfo;
    var params = {
      entity: that.data.entityInfo.entityID
    }
    app.util.postData.call(that, url, params, 'GET', function(res) {
      that.setData({
        applyStatusNum: res.data
      })
      wx.hideNavigationBarLoading()
    });
  },
  getOrderList: function(params, cb) {
    var that = this;
    var url = app.api.TheatreVenueAboutTradeApplyInfo;
    app.util.postDataList.call(that, url, params, 'POST', cb, function(res) {
      console.log(res)
      wx.hideNavigationBarLoading()
    });
  },
  errorImg: function(e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = '../../images/operaImgError120X178.jpg'
    // console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg)
    this.setData(_errObj)
  },
  dataFormat: function() {
    let that = this
    let dataList = that.data.dataList
    dataList.forEach(d => {
      // 图片
      // let UrlThumbnail = d.TheatreVenueOutline.UrlSmallThumbnail
      // if (UrlThumbnail) {
      //   d.TheatreVenueOutline.UrlThumbnail = app.config.resourceHost + UrlThumbnail
      // }
      if (d.TheatreVenueOutline && (d.TheatreVenueOutline.UrlSmallThumbnail || d.TheatreVenueOutline.UrlBigThumbnail || d.TheatreVenueOutline.UrlSource)) {
        if (d.TheatreVenueOutline.UrlSmallThumbnail) {
          d.TheatreVenueOutline.imgUrl = app.config.resourceHost + d.TheatreVenueOutline.UrlSmallThumbnail
        } else if (item.UrlBigThumbnail) {
          d.TheatreVenueOutline.imgUrl = app.config.resourceHost + d.TheatreVenueOutline.UrlBigThumbnail
        } else if (item.UrlSource) {
          d.TheatreVenueOutline.imgUrl = app.config.resourceHost + d.TheatreVenueOutline.UrlSource
        }
      }
      // 类型
      // let ShowTypes = d.TheatreVenueOutline.PerformanceType
      // let showTypeArr = []
      // ShowTypes.forEach(s => {
      //   showTypeArr.push(s.PerformanceTypeName)
      // })
      // d.TheatreVenueOutline.ShowTypesStr = showTypeArr.join('/')

      // 拆装台时间格式化
      d.SetStageBeginTimeStr = app.util.formatDate(new Date(d.SetStageBeginTime.replace(/-/g, '/')), 'yyyy.MM.dd')
      d.SetStageEndTimeStr = app.util.formatDate(new Date(d.SetStageEndTime.replace(/-/g, '/')), 'yyyy.MM.dd')
      d.CutStageBeginTimeStr = app.util.formatDate(new Date(d.CutStageBeginTime.replace(/-/g, '/')), 'yyyy.MM.dd')
      d.CutStageEndTimeStr = app.util.formatDate(new Date(d.CutStageEndTime.replace(/-/g, '/')), 'yyyy.MM.dd')
      // 金额
      let orderPrice = 0
      let orderEpositPrice = 0
      d.OrderSchedules.forEach(s => {
        let ShowBeginDatetime = new Date(s.ScheduleBeginDatetime.replace(/-/g, '/'))
        let ShowEndDatetime = new Date(s.ScheduleEndDatetime.replace(/-/g, '/'))
        let minutes = ShowEndDatetime.getTime() - ShowBeginDatetime.getTime() // 计算出演出时间长度
        let thizShowM = Math.ceil(minutes / 60000) // 计算出演出的中时长（分钟）
        let pricePerM = Number((s.Price / s.SingleTimeM).toFixed(6)) // 计算出当前演出每分钟的价格
        let epositPricePerM = Number((s.EpositPrice / s.SingleTimeM).toFixed(6)) // 计算出当前演出预约金每分钟的价格
        let thizShowPrice = Number((pricePerM * thizShowM).toFixed(2)) // 计算出当前演出的价格
        let thizShowEpositPrice = Number((epositPricePerM * thizShowM).toFixed(2))
        // let thizShowT = Number(thizShowM / s.SingleTimeM).toFixed(1)
        // let thizShowPrice = Number((s.Price * thizShowT).toFixed(2))
        // let thizShowEpositPrice = Number((s.EpositPrice * thizShowT).toFixed(2))
        if (thizShowPrice < s.Price) {
          thizShowPrice = s.Price
        }
        if (thizShowEpositPrice < s.EpositPrice) {
          thizShowEpositPrice = s.EpositPrice
        }
        orderPrice += thizShowPrice
        orderEpositPrice += thizShowEpositPrice
      })
      d.orderPrice = app.util.toThousands(orderPrice.toFixed(2))
      d.orderEpositPrice = app.util.toThousands(orderEpositPrice.toFixed(2))
      d.orderPriceP = app.util.toThousands((orderPrice + d.AdditionalPrice).toFixed(2))
      // console.log(d.orderPriceP)

    })
    this.setData({
      dataList: dataList
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this
    that.onMyShow()
  },
  // 底部加载
  onReachBottom: function() {
    var that = this
    // 还在加载中不执行，没有更多了不执行
    if (!that.data.showLoading && that.data.hasMore) {
      var params = {
        EntityId: that.data.entityInfo.entityID,
        BookingStatus: that.data.searchForm.BookingStatus,
        Keyword: that.data.searchForm.Keyword,
        pageIndex: that.data.pageIndex + 1,
        pageSize: that.data.pageSize
      }
      // wx.showLoading({
      //   title: '加载中'
      // })
      wx.showNavigationBarLoading()
      that.getOrderList(params, function(res) {
        that.dataFormat()
        wx.hideNavigationBarLoading()
        // wx.hideLoading()
        wx.stopPullDownRefresh()
      })
    }
  },
  inputSearch: function(e) {
    let searchForm = this.data.searchForm
    searchForm.Keyword = e.detail.value
    this.setData({
      searchForm: searchForm
    })
  },
  toSearch: function(e) {
    var data = e.currentTarget.dataset;
    var types = data.type
    let searchForm = this.data.searchForm
    if (types !== '') {
      types = Number(types)
    }
    searchForm.BookingStatus = types
    this.setData({
      searchForm: searchForm
    })
    this.onMyShow()
  },
  // 查看支付凭证
  viewPaymentsImg: function(e) {
    var data = e.currentTarget.dataset;
    var url = app.config.resourceHost + data.payurl
    if (data.payurl.indexOf('http') >= 0) {
      url = data.payurl
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })

    // let indicatorDots = {
    //   indicatorDots: false,
    //   autoplay: false,
    //   interval: 3000,
    //   duration: 500,
    //   photoArr: []
    // }
    // let PaymentsImg = {
    //   indicatorDots: indicatorDots,
    //   Arr:[{
    //     src: url,
    //     title: '支付凭证',
    //     info: '',}]
    // }
    // this.setData({
    //   PhotoBoxShow: true,
    //   PaymentsImg: PaymentsImg
    // })


  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function(e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  // 刷新
  refresh: function() {
    this.onMyShow()
  },
  toTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  onPageScroll: function(e) {
    if (e.scrollTop > 50) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  },
  // 提交预约单
  submitOrder: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    // 判断是否有流程
    that.getSubmitOrderWorkFlowConfig(res => {

      var callback = function() {
        if (res !== '' && that.data.currentItem.WorkFlowReturnStatus !== 1) {
          let orderInfo = that.data.orderInfo
          let workFlowConfigId = res
          orderInfo.workFlowConfigId = res
          that.getOrderWorkFlowFirstNodeMark(workFlowConfigId)
          that.getEmployeeEmployees(workFlowConfigId)
          that.setData({
            orderInfo: orderInfo
          })
          // 如果有流程
          that.setData({
            showSubmitFlowBox: true
          })
        } else {
          // 直接提交
          that.openAgreeBox()
        }
      }
      this.getConfirmBookingVunueInfo(callback)


    })

  },
  getConfirmBookingVunueInfo: function(callback) {
    let that = this
    // let currentItem = that.data.currentItem
    // let ScheduleTime = []
    // let TeamArriveTime = new Date(currentItem.ItemScheduleBeginTime)
    // let TeamLeaveTime = new Date(currentItem.ItemScheduleEndTime)
    // ScheduleTime.push(TeamArriveTime)
    // ScheduleTime.push(TeamLeaveTime)
    // let preDateTime = new Date(currentItem.ItemScheduleBeginTime)
    // that.preDateTime = preDateTime
    // let confirmBookingInfo = that.data.confirmBookingInfo
    // confirmBookingInfo.startTime = currentItem.ItemScheduleBeginTime
    // confirmBookingInfo.endTime = currentItem.ItemScheduleEndTime
    // that.setData({
    //   confirmBookingInfo: confirmBookingInfo
    // })
    // that.confirmBookingInfo.ScheduleTime = ScheduleTime
    // let SetStageBeginTimeLimit = new Date(new Date(currentItem.SetStageBeginTime.split(' ')[0]+ ' 23:59:59').getTime())
    // let CutStageEndTimeLimit = new Date(new Date(currentItem.CutStageEndTime.split(' ')[0]+ ' 00:00:00').getTime() - 1000)
    // let setTime = []
    // let cutTime = []
    // let setTime1 = new Date(currentItem.ItemScheduleBeginTime)
    // let setTime2 = new Date(currentItem.ItemScheduleEndTime)
    // setTime.push(setTime1)
    // setTime.push(setTime2)
    // that.confirmBookingInfo.TeamTime = setTime
    // let TeamArriveTimeLimit = new Date(new Date(currentItem.ItemScheduleBeginTime.split(' ')[0] + ' 00:00:00').getTime() - 1000)
    // let TeamLeaveTimeLimit = new Date(new Date(currentItem.ItemScheduleEndTime.split(' ')[0] + ' 23:59:59').getTime())
    that.getVunueOrderDetail(callback)
  },
  getVunueOrderDetail: function(callback) {
    let that = this
    let tradeApplyId = that.data.currentItem.TradeApplyRawId
    let url = app.api.TheatreVenueAboutGetScheduleBookingInfoById
    let params = {
      rawId: tradeApplyId
    }
    app.util.postData.call(that, url, params, 'GET',
      function(res) {
        let confirmBookingInfo = that.data.confirmBookingInfo
        confirmBookingInfo.AboutBaseInfo = res.data.AboutBaseInfo
        if (res.data.VenueScheduleBeginTime) {
          confirmBookingInfo.beginTime = res.data.VenueScheduleBeginTime
          confirmBookingInfo.endTime = res.data.VenueScheduleEndTime
          confirmBookingInfo.teamArriveTime = res.data.TeamArriveTime
          confirmBookingInfo.teamLeaveTime = res.data.TeamLeaveTime
        }
        that.setData({
          confirmBookingInfo: confirmBookingInfo
        })
        if (typeof callback !== 'undefined') callback()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  openSubmitFlow: function(e) {
    let that = this
    let result = {}
    result.RawId = that.data.currentItem.TradeApplyRawId
    if (!result.RawId) return false
    result.BookingStatus = that.data.currentItem.BookingStatus.Key
    if (that.data.orderInfo.workFlowConfigId) {
      result.Receiver = e.detail.receiver
      if (!result.Receiver) {
        // topMsgTip.show.call(that, '请选择审批人', 1500)
        that.selectComponent("#topMsgTips").show('请选择审批人', 1500)
        return false
      }
      result.FlowSetID = that.data.orderInfo.workFlowConfigId
      result.LockTimeM = e.detail.days * 1440 + e.detail.hours * 60 + e.detail.minutes // 锁定时间小时
      if (result.LockTimeM <= 0) {
        // topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
        that.selectComponent("#topMsgTips").show('锁定时长必须大于0', 1500)
        return false
      }
      let beginTime = e.detail.beginTime
      let endTime = e.detail.endTime
      if (beginTime === '' || endTime === '') {
        that.selectComponent("#topMsgTips").show('请选择场厅档期', 1500)
        return false
      }
      result.ScheduleBeginTime = beginTime
      result.ScheduleEndTime = endTime

      result.TeamArriveTime = that.data.currentItem.ItemScheduleBeginTime
      result.TeamLeaveTime = that.data.currentItem.ItemScheduleEndTime
      // result.LockTimeMM = e.detail.minutes // 锁定时间分钟
    } else {
      result.LockTimeM = e.detail.days * 1440 + e.detail.hours * 60 + e.detail.minutes // 锁定时间小时
      if (result.LockTimeM <= 0) {
        // topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
        that.selectComponent("#topMsgTips").show('锁定时长必须大于0', 1500)
        return false
      }
      let beginTime = e.detail.beginTime
      let endTime = e.detail.endTime
      if (beginTime === '' || endTime === '') {
        that.selectComponent("#topMsgTips").show('请选择锁定场厅时间', 1500)
        return false
      }
      result.ScheduleBeginTime = beginTime
      result.ScheduleEndTime = endTime

      let teamArriveTime = e.detail.teamArriveTime
      let teamLeaveTime = e.detail.teamLeaveTime
      if (teamArriveTime === '' || teamLeaveTime === '') {
        that.selectComponent("#topMsgTips").show('请选择剧组到离时间', 1500)
        return false
      }
      result.TeamArriveTime = teamArriveTime
      result.TeamLeaveTime = teamLeaveTime
    }
    console.log(result)
    that.submitFlow(result)
  },
  openReceiveFlow: function(e) {
    let that = this
    let result = {}
    result.RawId = that.data.currentItem.TradeApplyRawId
    if (!result.RawId) return false
    result.BookingStatus = that.data.currentItem.BookingStatus.Key
    if (that.data.orderInfo.workFlowConfigId) {
      result.Receiver = e.detail.receiver
      if (!result.Receiver) {
        // topMsgTip.show.call(that, '请选择审批人', 1500)
        that.selectComponent("#topMsgTips").show('请选择审批人', 1500)
        return false
      }
      result.FlowSetID = that.data.orderInfo.workFlowConfigId
      result.LockTimeM = e.detail.days * 1440 + e.detail.hours * 60 + e.detail.minutes // 锁定时间小时
      if (result.LockTimeM <= 0) {
        // topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
        that.selectComponent("#topMsgTips").show('锁定时长必须大于0', 1500)
        return false
      }
    }
    console.log(result)
    that.submitReceive(result)
  },
  submitReceive: function(result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.TheatreVenueAboutReceiveBooking
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        // console.log(res)
        let msg = '已提交至内部审批'
        if (result.PhoneNum) {
          msg = '确认收到预约金'
          that.setData({
            showReceiveBox: false
          })
        }
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideFlowBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        if (res.statusCode === 533 || res.statusCode === 526 || res.statusCode === 525) {
          that.selectComponent("#topMsgTips").show(res.data[0], 1500)
        }
        if (res.statusCode === 500) {
          that.selectComponent("#topMsgTips").show(res.data.join(';'), 1500)
        }
        wx.hideNavigationBarLoading()
      }
    )
  },
  submitNoReceive: function(result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.TheatreVenueAboutNoReceiveBooking
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '确认未收到预约金'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideReceiveBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        if (res.statusCode === 533 || res.statusCode === 526 || res.statusCode === 525) {
          that.selectComponent("#topMsgTips").show(res.data[0], 1500)
        }
        if (res.statusCode === 500) {
          that.selectComponent("#topMsgTips").show(res.data.join(';'), 1500)
        }
        wx.hideNavigationBarLoading()
      }
    )
  },
  submitFlow: function(result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.TheatreVenueAboutBookingConfirm
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已提交至内部审批'
        if (res.data.PaymentCodeId) {
          msg = '已同意预约'
        }
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideFlowBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        if (res.statusCode === 533 || res.statusCode === 526 || res.statusCode === 525) {
          that.selectComponent("#topMsgTips").show(res.data[0], 1500)
        }
        if (res.statusCode === 500) {
          that.selectComponent("#topMsgTips").show(res.data.join(';'), 1500)
        }
        wx.hideNavigationBarLoading()
      }
    )
  },
  openAgreeBox: function() {
    this.setData({
      showSubmitAgreeOrderBox: true
    })
  },
  receiveOrder: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    // 判断是否有流程
    that.receiveWorkFlowConfigScheduleBookingMiddle(res => {
      if (res !== '' && that.data.currentItem.WorkFlowReturnStatus !== 1) {
        let orderInfo = that.data.orderInfo
        let workFlowConfigId = res
        orderInfo.workFlowConfigId = res
        that.getOrderWorkFlowFirstNodeMark(workFlowConfigId)
        that.getEmployeeEmployees(workFlowConfigId)
        that.setData({
          orderInfo: orderInfo
        })
        // 如果有流程
        that.setData({
          showReceiveFlowBox: true
        })
      } else {
        // 直接提交
        this.setData({
          showReceiveBox: true,
          codeActionUrl: app.api.smsVerifyBizTN,
          isReceiveOrder: true
        })
      }
    })

  },
  noReceiveOrder: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    this.setData({
      showReceiveBox: true,
      isReceiveOrder: false,
      codeActionUrl: app.api.smsVerifyBizTN,
    })
  },
  hideReceiveBox: function(e) {
    this.setData({
      showReceiveBox: false,
      isReceiveOrder: true
    })
  },
  openReceiveBox: function(e) {
    let that = this
    let result = {}
    result.RawId = that.data.currentItem.TradeApplyRawId
    if (!result.RawId) return false
    result.BookingStatus = that.data.currentItem.BookingStatus.Key
    result.PhoneNum = e.detail.PhoneNum
    result.BusinessCode = e.detail.BusinessCode
    result.CheckCode = e.detail.CheckCode
    let isReceiveOrder = that.data.isReceiveOrder
    console.log(result)
    if (isReceiveOrder) {
      that.submitReceive(result)
    } else {
      that.submitNoReceive(result)
    }

    // that.submitReceive(result)
  },
  // 关闭流程审批
  hideFlowBox: function() {
    this.setData({
      showReceiveFlowBox: false,
      showSubmitFlowBox: false,
      showSubmitAgreeOrderBox: false
    })
  },
  // 赋值当前DataIem
  setCurrentDataItem: function(index) {
    let currentItem = this.data.dataList[index]
    this.setData({
      currentItem: currentItem
    })
  },
  // 获取审批节点职位
  getOrderWorkFlowFirstNodeMark: function(flowSetID) {
    let that = this
    let url = app.api.queryFlowSetFirstNodeMark
    let params = {
      flowSetID: flowSetID
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) {
        res = res.data.replace(/"/g, '')
        let orderInfo = that.data.orderInfo
        orderInfo.workFlowFirstNodeMark = res
        that.setData({
          orderInfo: orderInfo
        })
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 获取审批人列表
  getEmployeeEmployees: function(flowSetID) {
    let that = this
    let url = app.api.getEmployeeEmployees4FlowTo
    let params = {
      organId: that.data.organInfo.organId,
      entityId: that.data.entityInfo.entityID,
      flowSetId: flowSetID
    }
    console.log(params)
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) {
        console.log(res.data)
        if (res.data && res.data instanceof Array) {
          let receiverList = res.data
          that.setData({
            receiverList: receiverList
          })
        }
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )

  },
  // 获取流程实例ID
  getSubmitOrderWorkFlowConfig: function(callback) {
    let that = this
    let entityID = that.data.entityInfo.entityID
    let params = {}
    params.entityID = entityID
    params.isTheatre = true
    let url = app.api.agreeAboutWorkFlowConfigScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) {
        res = res.data.replace(/"/g, '')
        callback(res)
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  receiveWorkFlowConfigScheduleBookingMiddle: function(callback) {
    let that = this
    let entityID = that.data.entityInfo.entityID
    //   let entityID = that.orderData.TheatreId
    let params = {}
    params.entityID = entityID
    params.isTheatre = true
    let url = app.api.receiveWorkFlowConfigScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function(res) {
        res = res.data.replace(/"/g, '')
        callback(res)
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 操作公共参数
  getCommonParam: function(params) {
    let that = this
    params.RegisteOrganRawID = that.data.organInfo.organId
    params.EntityRawID = that.data.entityInfo.entityID
    params.UserRawId = that.data.iyanyiUser.UserId
    params.EmployeeId = that.data.employeeInfo.employeeId
    params.EmployeeName = that.data.employeeInfo.employeeName
    params.EmployeePhoneNum = that.data.employeeInfo.employeePhoneNumber
    params.EmployeePhone = that.data.employeeInfo.employeePhoneNumber
    if (that.data.employeeInfo.employeePhoneNumber === '') {
      params.EmployeePhoneNum = that.data.iyanyiUser.Phone
      params.EmployeePhone = that.data.iyanyiUser.Phone
    }
    return params
  },
  submitPayFlow: function(result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.TheatreOrderManagePay
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已提交至内部审批'
        if (res.data.ApplyStatusInfo && res.data.ApplyStatusInfo.Key === 6) {
          msg = '已提交至受约方'
        }
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideFlowBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  openCancelBox: function(e) {
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
    // that.hideCancelBox()
  },
  hideCancelBox: function(e) {
    this.setData({
      showCancelBox: false
    })
  },
  refuseOrder: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    wx.showActionSheet({
      itemList: that.data.reasonOptionsWx,
      success: function(res) {
        that.setData({
          cancelReason: that.data.reasonOptionsWx[res.tapIndex]
        })
        // 直接去取消
        let result = {}
        result.RawId = that.data.currentItem.TradeApplyRawId
        if (!result.RawId) return false
        result.BookingStatus = that.data.currentItem.BookingStatus.Key
        result.ReasonInfo = that.data.cancelReason
        that.refuseBookingDo(result)
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  cancelOrder: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    wx.showActionSheet({
      itemList: that.data.reasonOptionsWx,
      success: function(res) {
        that.setData({
          cancelReason: that.data.reasonOptionsWx[res.tapIndex]
        })
        // if (that.data.currentItem.BookingStatus.Key <10) {
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
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 拒绝预约单
  refuseBookingDo(params) {
    let that = this
    params = that.getCommonParam(params)
    let url = app.api.TheatreVenueAboutBookingRefuse
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已拒绝预约'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 取消预约单
  cancelBookingDo(params) {
    let that = this
    params = that.getCommonParam(params)
    // if (params.BookingStatus === 1) {
    //   that.unSubmitCancel(params)
    // }
    // if (params.BookingStatus === 3) {
    //   that.cancelWhenWaitAboutReview(params)
    // }
    // if (params.BookingStatus === 4) {
    //   that.cancelWhenWaitAboutReview(params)
    // }
    if (params.BookingStatus === 6) {
      that.cancelWhenSuccessAboutReview(params)
    } else {
      that.unSubmitCancel(params)
    }
  },
  // 预约单未提交取消
  unSubmitCancel(params) {
    let that = this
    let url = app.api.TheatreVenueAboutBookingCancel
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideCancelBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        that.selectComponent("#topMsgTips").show(res.message, 1500)
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 预约单预约剧目成功后取消
  cancelWhenSuccessAboutReview(params) {
    let that = this
    let url = app.api.TheatreVenueAboutCancelWhenSuccess
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onMyShow()
        that.hideCancelBox()
        wx.hideNavigationBarLoading()
      },
      function(res) {
        that.selectComponent("#topMsgTips").show(res.message, 1500)
        wx.hideNavigationBarLoading()
      }
    )

  }
})