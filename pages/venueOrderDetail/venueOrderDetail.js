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

    flowSetId: undefined,                   // 提交预约单流程配置ID
    tradeApplyId: undefined,                // 当前预约单ID
    tradeApply: {},                         // 获取指定ID的预约单，包含当前有用和无用的数据
    showSubmitFlowBox: false,
    showPaySubmitFlowBox: false,
    showCancelBox: false,
    currentItem: {},
    receiverList: [],
    employeeInfo: {},
    organInfo: {},
    entityInfo: {},
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
    troupeItemInfo: {                       // 获取指定ID的剧目，包含当前有用和无用的数据
      TroupeId: '',                         // 被约剧目的剧团ID
      ItemId: '',                           // 被约剧目ID
    },
    HasAddiPrice: false,                    // 是否有额外费用

    tradeApplyDisplay: {                    // 显示在界面上的内容
      ApplyCode: '',                             // 预约单号   
      ApplyCreateTime: '',
      HasOneMoreShow: false,                // 是否有多场演出
      Schedules: [                          // 剧目档期列表
        {
          ScheduleBeginDatetime: undefined,
          ScheduleEndDatetime: undefined,
          Price: 0,
          EpositPrice: 0,
          IsOneDay: false,
        }
      ],
      TeamArriveTime: undefined,            // 剧组到达时间  
      TeamLeaveTime: undefined,             // 剧组离开时间
      LeaveMessage: '',                     // 留言
      TotalPrice: 0,                        // 总金额
      TotalEpositPrice: 0,                  // 总预约金
      AddiPriceNum: 0,
      AdditionalPriceAbs: 0,                // 额外追加金额
      IsGrowUp: true,                       // 额外金额增长箭头方向
      FinalPrice: 0,
      VenueScheduleBeginTime: undefined,    // （预约方）剧场本身档期开始时间     
      VenueScheduleEndTime: undefined,      // （预约方）剧场本身档期开始时间 
      VenueName: '',                        // （预约方）剧场用于表演剧目的场厅名称
      TheatreName: '',                      // （预约方）剧场名称
      LinkerFullName: '',                   // （预约方）预约人名称
      LinkerPhone: '',                      // （预约方）预约人电话
    },
    troupeDisplay: {                        // 界面上显示的被约剧团信息
      Name: '',
      UrlSource: '',
      UrlSmallThumbnail: '',
    },
    ItemDisplay: {                          // 被约剧目的显示信息
      Name: '',
      ShowType: '',                         // 剧目适演类型
      ShowMinutes: 120,                     // 剧目时长
      UrlSource: '',
      UrlSmallThumbnail: '',
      FirstShowDate: undefined,
      TourShowActorCount: '',
    },
    reportToListDisplay: [                  // 流程审核人列表
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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约单详情',
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

    // 加载流程信息
    // this.getSubmitOrderWorkflowConfig();
    this.getItemBookingInfo(this.data.tradeApplyId);
  },

  // 刷新
  refresh: function () {
    this.onShow()
  },
  onPullDownRefresh() {
    let that = this
    that.onShow()
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url, 1)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  errorGImg: function (e) {
    var _errImg = e.target.dataset.errorsrc
    var _objImg = "'" + _errImg + "'"
    var _errObj = {}
    _errObj[_errImg] = '../../images/operaImgError120X178.jpg'
    // console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg)
    this.setData(_errObj)
  },
  getItemBookingInfo: function (tradeApplyId) { // 加载剧目预约单信息
    var that = this;
    var url = app.api.TroupeOrderManageGetScheduleBookingInfoById;
    var parms = {
      rawId: tradeApplyId,
    };
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, parms, 'GET',
      function (res) {
        try {
          
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
        } catch (e) {
          console.log('先设置未设置的预约联系人');
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      },
      function (err) {
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
  getComTimeObj: function (start, end) {
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

  formatDT: function (dt) { // 格式化时间
    try {
      var tmpDT = new Date(dt);
      return app.util.formatDate(tmpDT, 'yyyy.MM.dd hh:mm');
    } catch (e) {
      return '';
    }
  },
  formatSchedDateTime: function (srcSchedList, destSchedList) { // 格式化档期时间为要显示的格式
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
  extractPrices: function (schedList) { // 计算总价
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
  showMoreShows: function () {
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
  viewPaymentsImg: function (e) {
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
  submitOrder: function (e) {
    let that = this
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
  openSubmitFlow: function (e) {
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
        that.selectComponent("#topMsgTips").show('锁定时长必须大于0', 1500)
        // topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
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
  submitFlow: function (result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.submitTroupeItemScheduleBookingScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function (res) {
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
        that.onShow()
        that.hideFlowBox()
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 关闭流程审批
  hideFlowBox: function () {
    this.setData({
      showSubmitFlowBox: false,
      showPaySubmitFlowBox: false
    })
  },
  // 赋值当前DataIem
  setCurrentDataItem: function (index) {
    // let currentItem = this.data.dataList[index]
    this.setData({
      currentItem: this.data.tradeApply.TroupeOrderScheduleBase
    })
  },
  // 获取审批节点职位
  getOrderWorkFlowFirstNodeMark: function (flowSetID) {
    let that = this
    let url = app.api.queryFlowSetFirstNodeMark
    let params = {
      flowSetID: flowSetID
    }
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function (res) {
        res = res.data.replace(/"/g, '')
        let orderInfo = that.data.orderInfo
        orderInfo.workFlowFirstNodeMark = res
        that.setData({
          orderInfo: orderInfo
        })
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 获取审批人列表
  getEmployeeEmployees: function (flowSetID) {
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
      function (res) {
        console.log(res.data)
        if (res.data && res.data instanceof Array) {
          let receiverList = res.data
          that.setData({
            receiverList: receiverList
          })
        }
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )

  },
  // 获取流程实例ID
  getSubmitOrderWorkFlowConfig: function (callback) {
    let that = this
    let entityID = that.data.entityInfo.entityID
    let params = {}
    params.entityID = entityID
    params.isTheatre = true
    let url = app.api.submitOrderWorkFlowConfigScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function (res) {
        res = res.data.replace(/"/g, '')
        callback(res)
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 获取支付流程实例ID
  paymentWorkFlowConfigScheduleBookingMiddle: function (callback) {
    let that = this
    let entityID = that.data.entityInfo.entityID
    let params = {}
    params.entityID = entityID
    params.isTheatre = true
    let url = app.api.paymentWorkFlowConfigScheduleBookingMiddle
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'GET',
      function (res) {
        res = res.data.replace(/"/g, '')
        callback(res)
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
  // 操作公共参数
  getCommonParam: function (params) {
    let that = this
    console.log(params)
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
  payment: function (e) {
    let that = this
    // let index = e.target.dataset.index
    // // 当前是哪个订单赋值
    // that.setCurrentDataItem(index)
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
        app.util.commonViewTap('/pages/payCenter/payCenter?id=' + that.data.currentItem.TradeApplyRawId, 1)
      }
    })
  },
  submitPayFlow: function (result) {
    let that = this
    let params = this.getCommonParam(result)
    let url = app.api.TheatreOrderManagePay
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function (res) {
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
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )
  },
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
  // 预约单未提交取消
  unSubmitCancel(params) {
    let that = this
    let url = app.api.TheatreOrderManageUnSubmitCancel
    wx.showNavigationBarLoading()
    app.util.postData.call(that, url, params, 'POST',
      function (res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onShow()
        wx.hideNavigationBarLoading()
      },
      function (res) {
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
      function (res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onShow()
        wx.hideNavigationBarLoading()
      },
      function (res) {
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
      function (res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onShow()
        wx.hideNavigationBarLoading()
      },
      function (res) {
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
      function (res) {
        console.log(res)
        let msg = '已取消预约单'
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        that.onShow()
        wx.hideNavigationBarLoading()
      },
      function (res) {
        wx.hideNavigationBarLoading()
      }
    )

  }
})