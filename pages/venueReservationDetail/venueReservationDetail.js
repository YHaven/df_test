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

    flowSetId: undefined, // 提交预约单流程配置ID
    tradeApplyId: undefined, // 当前预约单ID
    tradeApply: {}, // 获取指定ID的预约单，包含当前有用和无用的数据
    showReceiveFlowBox: false,
    showSubmitFlowBox: false,
    showSubmitAgreeOrderBox: false,
    showCancelBox: false,
    showReceiveBox: false,
    isReceiveOrder: true,
    currentItem: {},
    receiverList: [],
    employeeInfo: {},
    organInfo: {},
    entityInfo: {},
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
    selectedVenueName: '',
    troupeItemInfo: { // 获取指定ID的剧目，包含当前有用和无用的数据
      TroupeId: '', // 被约剧目的剧团ID
      ItemId: '', // 被约剧目ID
    },
    HasAddiPrice: false, // 是否有额外费用

    tradeApplyDisplay: { // 显示在界面上的内容
      ApplyCode: '', // 预约单号   
      ApplyCreateTime: '',
      HasOneMoreShow: false, // 是否有多场演出
      Schedules: [ // 剧目档期列表
        {
          ScheduleBeginDatetime: undefined,
          ScheduleEndDatetime: undefined,
          Price: 0,
          EpositPrice: 0,
          IsOneDay: false,
        }
      ],
      TeamArriveTime: undefined, // 剧组到达时间  
      TeamLeaveTime: undefined, // 剧组离开时间
      LeaveMessage: '', // 留言
      TotalPrice: 0, // 总金额
      TotalEpositPrice: 0, // 总预约金
      AddiPriceNum: 0,
      AdditionalPriceAbs: 0, // 额外追加金额
      IsGrowUp: true, // 额外金额增长箭头方向
      FinalPrice: 0,
      VenueScheduleBeginTime: undefined, // （预约方）剧场本身档期开始时间     
      VenueScheduleEndTime: undefined, // （预约方）剧场本身档期开始时间 
      VenueName: '', // （预约方）剧场用于表演剧目的场厅名称
      TheatreName: '', // （预约方）剧场名称
      LinkerFullName: '', // （预约方）预约人名称
      LinkerPhone: '', // （预约方）预约人电话
    },
    troupeDisplay: { // 界面上显示的被约剧团信息
      Name: '',
      UrlSource: '',
      UrlSmallThumbnail: '',
    },
    ItemDisplay: { // 被约剧目的显示信息
      Name: '',
      ShowType: '', // 剧目适演类型
      ShowMinutes: 120, // 剧目时长
      UrlSource: '',
      UrlSmallThumbnail: '',
      FirstShowDate: undefined,
      TourShowActorCount: '',
    },
    reportToListDisplay: [ // 流程审核人列表
      {
        Name: '',
        Phone: '',
        Id: '',
      }
    ],
    dataToSubmit: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.setNavigationBarTitle({
    //   title: '预约单详情',
    // })
    let that = this
    if (options.id) {
      that.setData({
        tradeApplyId: options.id
      })
    }
    this.getUserinfo()

  },
  getUserinfo: function() {
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
  onShow: function() {

    // 加载流程信息
    // this.getSubmitOrderWorkflowConfig();
    this.getItemBookingInfo(this.data.tradeApplyId);
  },

  // 刷新
  refresh: function() {
    this.onShow()
  },
  onPullDownRefresh() {
    let that = this
    that.onShow()
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function(e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url, 1)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  errorGImg: function(e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = '../../images/operaImgError120X178.jpg'
    // console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg)
    this.setData(_errObj)
  },
  getItemBookingInfo: function(tradeApplyId) { // 加载
    var that = this;
    var url = app.api.TheatreVenueAboutGetScheduleBookingInfoById;
    var parms = {
      rawId: tradeApplyId,
    };
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, parms, 'GET',
      function(res) {
        that.setData({
          tradeApply: res.data || {}
        })
        that.setCurrentDataItem()

        var displayData = {};
        displayData.ApplyCode = res.data.TroupeOrderScheduleBase.ApplyCode || '';
        displayData.ApplyCreateTime = (res.data.TroupeOrderScheduleBase.ApplyCreateTime || '').replace(/-/g, '.');
        displayData.LinkerFullName = res.data.TroupeOrderScheduleBase.LinkerFullName || '';
        displayData.LinkerPhone = res.data.TroupeOrderScheduleBase.LinkerPhone || '';
        displayData.Schedules = [];

        displayData.TeamArriveTime = that.formatDT(res.data.TeamArriveTime);
        displayData.TeamLeaveTime = that.formatDT(res.data.TeamLeaveTime);
        displayData.VenueScheduleBeginTime = that.formatDT(res.data.VenueScheduleBeginTime);
        displayData.VenueScheduleEndTime = that.formatDT(res.data.VenueScheduleEndTime);
        if (res.data.TroupeOrderScheduleBase.BookingStatus.Key > 3 || true) {
          displayData.ItemScheduleBeginTime = that.formatDT(res.data.TroupeOrderScheduleBase.ItemScheduleBeginTime);
          displayData.ItemScheduleEndTime = that.formatDT(res.data.TroupeOrderScheduleBase.ItemScheduleEndTime);
          displayData.SetStageBeginTime = that.formatDT(res.data.TroupeOrderScheduleBase.SetStageBeginTime);
          displayData.SetStageEndTime = that.formatDT(res.data.TroupeOrderScheduleBase.SetStageEndTime);
          displayData.CutStageBeginTime = that.formatDT(res.data.TroupeOrderScheduleBase.CutStageBeginTime);
          displayData.CutStageEndTime = that.formatDT(res.data.TroupeOrderScheduleBase.CutStageEndTime);
        }
        displayData.VenueName = res.data.TroupeOrderScheduleBase.TheatreVenueOutline.VenueName;
        displayData.TheatreName = res.data.TroupeOrderScheduleBase.TheatreName;
        displayData.TroupeName = res.data.TroupeOrderScheduleBase.TroupeName;
        displayData.ItemName = res.data.TroupeOrderScheduleBase.ItemName;
        displayData.LeaveMessage = res.data.LeaveMessage;

        that.formatSchedDateTime(res.data.TroupeOrderScheduleBase.OrderSchedules, displayData.Schedules);
        displayData.HasOneMoreShow = displayData.Schedules.length > 1;

        var prices = that.extractPrices(res.data.TroupeOrderScheduleBase.OrderSchedules);
        that.data.tradeApply.TroupeOrderScheduleBase.TotalPrice = prices.totalPrice;
        that.data.tradeApply.TroupeOrderScheduleBase.TotoalEpositPrice = prices.totalEpositPrice;
        displayData.TotalPrice = app.util.toThousands(prices.totalPrice);
        displayData.TotalEpositPrice = app.util.toThousands(prices.totalEpositPrice);
        displayData.AdditionalPrice = res.data.TroupeOrderScheduleBase.AdditionalPrice;
        displayData.FinalPrice = app.util.toThousands(prices.totalPrice + displayData.AdditionalPrice);
        displayData.IsGrowUp = displayData.AdditionalPrice > 0 ? true : false;
        displayData.AdditionalPrice = app.util.toThousands(displayData.AdditionalPrice);
        displayData.AdditionalPriceAbs = displayData.AdditionalPrice.replace('-', '');


        displayData.BookingStatus = that.data.tradeApply.TroupeOrderScheduleBase.BookingStatus
        displayData.WorkFlowReturnStatus = that.data.tradeApply.TroupeOrderScheduleBase.WorkFlowReturnStatus
        displayData.StatusExpireTime = that.data.tradeApply.TroupeOrderScheduleBase.StatusExpireTime
        displayData.Payments = that.data.tradeApply.TroupeOrderScheduleBase.Payments

        var sched = undefined;
        for (var i in displayData.Schedules) {
          sched = displayData.Schedules[i];
          sched.Price = app.util.toThousands(sched.Price);
          sched.EpositPrice = app.util.toThousands(sched.EpositPrice);
          // 判断是否同一天
          sched.ScheduleDatetime = that.getComTimeObj(sched.ScheduleBeginDatetime, sched.ScheduleEndDatetime)
        }

        // 如果预约人为空，选择当前用户为预约人
        if (displayData.LinkerFullName == undefined || displayData.LinkerFullName == '') {
          displayData.LinkerFullName = app.globalData.employeeInfo.Name;
          displayData.LinkerPhone = app.globalData.employeeInfo.PhoneNumber;
        }

        that.setData({
          HasAddiPrice: (displayData.AdditionalPrice && displayData.AdditionalPrice != 0),
          tradeApplyDisplay: displayData,
        });
        // if (displayData.BookingStatus.Key === 4){
        //   that.selectComponent("#timeCountDown").lastSecond() // 启动剩余时间倒计时
        // }

        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
      function(err) {
        if (err.statusCode == 460) {
          // http request 参数值非法，请检查是否为空
        } else if (err.statusCode == 521) {
          // 再次查询预约单状态，明确预约单是已提交还是被取消
        }
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      });
  },
  // 判断返回是否同一天时间
  getComTimeObj: function(start, end) {
    let startDay = start.split(' ')[0]
    let endDay = end.split(' ')[0]
    let result = {}
    if (startDay === endDay) {
      result = {
        timeStr: startDay + ' ' + start.split(' ')[1] + '-' + end.split(' ')[1],
        status: 0
      }
    } else {
      result = {
        status: 1
      }
    }
    return result
  },
  formatDT: function(dt) { // 格式化时间
    try {
      var tmpDT = new Date(dt);
      return app.util.formatDate(tmpDT, 'yyyy.MM.dd hh:mm');
    } catch (e) {
      return '';
    }
  },
  formatSchedDateTime: function(srcSchedList, destSchedList) { // 格式化档期时间为要显示的格式
    var sched = undefined;
    var begDT, endDT, beginDay, endDay;
    for (var i in srcSchedList) {
      sched = {
        ScheduleBeginDatetime: srcSchedList[i].ScheduleBeginDatetime,
        ScheduleEndDatetime: srcSchedList[i].ScheduleEndDatetime,
        SingleTimeM: srcSchedList[i].SingleTimeM,
        Price: srcSchedList[i].Price.toFixed(2),
        EpositPrice: srcSchedList[i].EpositPrice.toFixed(2),
      };
      begDT = new Date(sched.ScheduleBeginDatetime);
      endDT = new Date(sched.ScheduleEndDatetime);
      beginDay = app.util.formatDate(begDT, 'yyyy-MM-dd');
      endDay = app.util.formatDate(endDT, 'yyyy-MM-dd');

      sched.ScheduleBeginDatetime = app.util.formatDate(begDT, 'yyyy.MM.dd hh:mm');
      sched.ScheduleEndDatetime = app.util.formatDate(endDT, 'yyyy.MM.dd hh:mm');
      sched.IsOneDay = false;
      if (beginDay == endDay && false) {
        sched.ScheduleEndDatetime = app.util.formatDate(endDT, 'hh:mm');
        sched.IsOneDay = true;
      }
      destSchedList.push(sched);
    }
  },
  extractPrices: function(schedList) { // 计算总价
    let ShowPrice = 0 // 演出价
    let ShowEpositPrice = 0 // 保证金
    // let AdditionalPrice = Number(orderData.AdditionalPrice) || 0
    var numSch = 1
    schedList.forEach(s => {
      let ShowBeginDatetime = new Date(s.ScheduleBeginDatetime)
      let ShowEndDatetime = new Date(s.ScheduleEndDatetime)
      let minutes = ShowEndDatetime.getTime() - ShowBeginDatetime.getTime()

      let thizShowM = Math.ceil(minutes / 60000) // 计算出演出的中时长（分钟）
      let pricePerM = Number((s.Price / s.SingleTimeM).toFixed(6)) // 计算出当前演出每分钟的价格
      let epositPricePerM = Number(
        (s.EpositPrice / s.SingleTimeM).toFixed(6)
      ) // 计算出当前演出预约金每分钟的价格
      let thizShowPrice = Number((pricePerM * thizShowM).toFixed(2)) // 计算出当前演出的价格
      let thizShowEpositPrice = Number(
        (epositPricePerM * thizShowM).toFixed(2)
      )
      // let thizShowT = Number(thizShowM / s.SingleTimeM).toFixed(1)
      // let thizShowPrice = Number((s.Price * thizShowT).toFixed(2))
      // let thizShowEpositPrice = Number((s.EpositPrice * thizShowT).toFixed(2))
      if (thizShowPrice < s.Price) {
        thizShowPrice = s.Price
      }
      if (thizShowEpositPrice < s.EpositPrice) {
        thizShowEpositPrice = s.EpositPrice
      }
      ShowPrice += thizShowPrice
      ShowEpositPrice += thizShowEpositPrice
      // s.ShowItemPriceStr = util.toThousands(thizShowPrice)
      // s.ShowItemEpositPriceStr = util.toThousands(thizShowEpositPrice)
    })
    console.log(ShowPrice)
    return {
      totalPrice: ShowPrice,
      totalEpositPrice: ShowEpositPrice,
    }
  },
  // 多场演出显示更多
  showMoreShows: function() {
    if (this.data.showMore) {
      this.setData({
        showMore: false
      })
    } else {
      this.setData({
        showMore: true
      })
    }
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
  },
  // 提交预约单
  submitOrder: function(e) {
    let that = this
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
    // 判断是否有流程
    that.getSubmitOrderWorkFlowConfig(res => {

      var callback = function() {
        console.log('xxxxxxxxxxx')
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
        that.onShow()
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
        that.onShow()
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
        that.onShow()
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
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
    // let currentItem = this.data.dataList[index]
    // this.setData({
    //   currentItem: currentItem
    // })
    this.setData({
      currentItem: this.data.tradeApply.TroupeOrderScheduleBase
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
        that.onShow()
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
    // let index = e.target.dataset.index
    // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
        that.onShow()
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
        that.onShow()
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
        that.onShow()
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