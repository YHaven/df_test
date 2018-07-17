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
    showSubmitFlowBox: false,
    showPaySubmitFlowBox: false,
    showCancelBox: false,
    dataList: [],
    currentItem: {},
    receiverList: [],
    orderInfo: {
      sp: '',
      workFlowConfigId: '',
      hours: 72,
      minutes: 0
    },
    confirmPhoneCheckInfo: {
      LoadStageTime: '',
      CutStageTime: '',
      PhoneNum: '',
      CheckCode: ''
    },
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
  onShow:function(){

  },
  onMyShow: function() {
    let that = this
    this.getUserinfo()
    // 加载数量
    this.loadNumber()
    that.setData({
      dataList: [],
      showLoading: true,
      hasMore: true
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
    var url = app.api.TheatreOrderManageQueryApplyStatusNumInfo;
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
    var url = app.api.TheatreOrderManageQueryScheduleBookingInfo;
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
      // let UrlThumbnail = d.TroupeItemOutline.UrlSmallThumbnail
      // if (UrlThumbnail) {
      //   d.TroupeItemOutline.UrlThumbnail = app.config.resourceHost + UrlThumbnail
      // }
      if (d.TroupeItemOutline && (d.TroupeItemOutline.UrlSmallThumbnail || d.TroupeItemOutline.UrlBigThumbnail || d.TroupeItemOutline.UrlSource)) {
        if (d.TroupeItemOutline.UrlSmallThumbnail) {
          d.TroupeItemOutline.imgUrl = app.config.resourceHost + d.TroupeItemOutline.UrlSmallThumbnail
        } else if (item.UrlBigThumbnail) {
          d.TroupeItemOutline.imgUrl = app.config.resourceHost + d.TroupeItemOutline.UrlBigThumbnail
        } else if (item.UrlSource) {
          d.TroupeItemOutline.imgUrl = app.config.resourceHost + d.TroupeItemOutline.UrlSource
        }
      }
      // 类型
      let ShowTypes = d.TroupeItemOutline.ShowTypes
      let showTypeArr = []
      ShowTypes.forEach(s => {
        showTypeArr.push(s.Name)
      })
      d.TroupeItemOutline.ShowTypesStr = showTypeArr.join('/')
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
      if (res !== '' && that.data.currentItem.WorkFlowReturnStatus !== 1) {
        let orderInfo = {
          sp: '',
          workFlowConfigId: '',
          hours: 72,
          minutes: 0
        }
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
        that.openSubmitFlow()
      }
    })

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
      result.LockTimeHH = e.detail.days * 1440 + e.detail.hours * 60 + e.detail.minutes // 锁定时间小时
      if (result.LockTimeHH <= 0) {
        // topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
        that.selectComponent("#topMsgTips").show('锁定时长必须大于0', 1500)
        return false
      }
      result.LockTimeMM = e.detail.minutes // 锁定时间分钟
    }
    result.TradeApplyId = that.data.currentItem.TradeApplyRawId
    result.ApplyName = that.data.currentItem.TroupeItemOutline.ItemName + '预约单'
    result.TheatreId = that.data.currentItem.TheatreId
    result.TheatreName = that.data.currentItem.TheatreName
    result.TheatreVenueId = that.data.currentItem.VenueId
    result.TheatreVenueName = that.data.currentItem.VenueName
    result.PartyABeginDatetime = that.data.currentItem.VenueScheduleBeginTime
    result.PartyAEndDatetime = that.data.currentItem.VenueScheduleEndTime
    result.AdditionalPrice = Number(that.data.currentItem.AdditionalPrice || 0)
    result.TradeApplySatus = {
      Key: 3,
      Name: '等待受约方审核'
    }
    result.ShowTroupeId = that.data.currentItem.TroupeId
    result.ShowItemId = that.data.currentItem.TroupeItemOutline.ItemId

    if (that.data.currentItem.BookingStatus.Key === 1) {
      that.submitFlow(result)
    }
    if (that.data.currentItem.BookingStatus.Key === 4) {
      that.submitPayFlow(result)
    }
  },
  submitFlow: function(result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.submitTroupeItemScheduleBookingScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function(res) {
        console.log(res)
        let msg = '已提交至内部审批'
        if (res.data.ApplyStatusInfo.Key === 3) {
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
        if(res.statusCode === 533) {
          that.selectComponent("#topMsgTips").show(res.data[0], 1500)
        }
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 关闭流程审批
  hideFlowBox: function() {
    this.setData({
      showSubmitFlowBox: false,
      showPaySubmitFlowBox: false
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
    let url = app.api.submitOrderWorkFlowConfigScheduleBookingMiddle
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
  // 获取支付流程实例ID
  paymentWorkFlowConfigScheduleBookingMiddle: function(callback) {
    let that = this
    let entityID = that.data.entityInfo.entityID
    let params = {}
    params.entityID = entityID
    console.log(that.data.currentItem)
    params.tradeapplyId = that.data.currentItem.TradeApplyRawId
    params.isTheatre = true
    let url = app.api.paymentWorkFlowConfigScheduleBookingMiddle
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

  // 支付流程
  payment: function(e) {
    let that = this
    let index = e.target.dataset.index
    // 当前是哪个订单赋值
    that.setCurrentDataItem(index)
    // 判断是否有流程
    that.paymentWorkFlowConfigScheduleBookingMiddle(res => {
      if (res !== '' && that.data.currentItem.WorkFlowReturnStatus !== 1) {
        let orderInfo = {
          sp: '',
          workFlowConfigId: '',
          hours: 72,
          minutes: 0
        }
        let workFlowConfigId = res
        orderInfo.workFlowConfigId = res
        that.getOrderWorkFlowFirstNodeMark(workFlowConfigId)
        that.getEmployeeEmployees(workFlowConfigId)
        that.setData({
          orderInfo: orderInfo
        })
        // 如果有流程
        that.setData({
          showPaySubmitFlowBox: true
        })
      } else {
        // 直接提交
        // that.openSubmitFlow()
        // 打开
        wx.hideNavigationBarLoading()
        app.util.commonViewTap('/pages/payCenter/payCenter?id=' + that.data.currentItem.TradeApplyRawId)
      }
    })
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
  // 预约单未提交取消
  unSubmitCancel(params) {
    let that = this
    let url = app.api.TheatreOrderManageUnSubmitCancel
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
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 预约单等待受约方审核时取消
  cancelWhenWaitAboutReview(params) {
    let that = this
    let url = app.api.TheatreOrderManageCancelWhenWaitAboutReview
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
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 预约单等待支付时取消
  cancelWhenWaitAboutReview(params) {
    let that = this
    let url = app.api.TheatreOrderManageCancelWhenWaitPay
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
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 预约单预约剧目成功后取消
  cancelWhenSuccessAboutReview(params) {
    let that = this
    let url = app.api.TheatreOrderManageCancelWhenSuccess
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
        wx.hideNavigationBarLoading()
      }
    )

  }
})