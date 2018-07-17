const app = getApp()
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    netTimeOut: false,
    defaultImg: app.config.defaultImg,
    showMore: false,
    showOrderRuleBox: false,
    showSubmitFlowBox: false,
    hasAnyVenue: false,                     // 当前剧场是否有场厅
    selectedVenueIndex: 0,                  // 选中的场厅
    selectedVenueName: '',                  // 选中的场厅
    selectedVenueId: undefined,             // 选中的场厅
    flowSetId: undefined,                   // 提交预约单流程配置ID
    flowFirstNodeMark: undefined,           // 提交预约单流程第一个节点的备注
    tradeApplyId: undefined,                // 当前预约单ID
    tradeApply: {},                         // 获取指定ID的预约单，包含当前有用和无用的数据
    troupeItemInfo: {                       // 获取指定ID的剧目，包含当前有用和无用的数据
      TroupeId: '',                         // 被约剧目的剧团ID
      ItemId: '',                           // 被约剧目ID
    },

    HasAddiPrice: false,                    // 是否有额外费用
    AdditionalPrice: '',                    // 额外追加金额
    tradeApplyDisplay: {                    // 显示在界面上的内容
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
      LinkerFullName: '',                   // （预约方）预约人名称
      LinkerPhone: '',                      // （预约方）预约人电话
    },
    troupeDisplay: {
      Name: '',
      UrlSource: '',
      UrlSmallThumbnail: '',
    },
    ItemDisplay: {                          // 被约剧目的显示信息
      Name: '',
      ShowType: '',                         // 剧目适演类型 [ { Key: 1, Name: '歌剧' } ]
      ShowMinutes: 120,
      UrlSource: '',
      UrlSmallThumbnail: '',
      FirstShowDate: undefined,
      TourShowActorCount: '',
    },
    VenueListDisplay: [                     // 场厅列表显示信息
      {  
        Name: '',
        Id: '',
      }
    ],
    reportToListDisplay: [                  // 流程审核人列表
      {
        Name: '',
        Phone: '',
        Id: '',
      }
    ],
    schedPickerDefault: {                   // 档期选择控件默认设置
      showAt: '',
      min: '',
      max: '',
    },
    dataToSubmit: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认预约单',
    })
    if (options.tradeApplyId) {
      this.setData({
        tradeApplyId: options.tradeApplyId
      })

      this.getThisTroupeItemBookingInfo(this.data.tradeApplyId);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.tradeApplyId || this.data.tradeApplyId == '') {
      console.log('开发注意了，预约单不见了');
      return;
    }
    // 加载流程信息
    this.getSubmitOrderWorkflowConfig();
    this.getVenueList();

    var showAt = app.util.formatDate(new Date(), 'yyyy-MM-dd hh:mm');
    var min = app.util.formatDate(new Date(), 'yyyy-01-01');
    this.setData({ schedPickerDefault: { showAt: showAt, min: min, max: '',  } });
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
  showOrderRule: function(){
    this.setData({
      showOrderRuleBox:true
    })
  },
  hideOrderRule: function(){
    this.setData({
      showOrderRuleBox: false
    })
  },
  // 提交预约单
  submitOrder:function(){
    var that = this
     
    // 判断负 预约总额 + 浮动金额 是否小于等于 0
    var addiPrice = that.data.tradeApplyDisplay.AddiPriceNum;
    var totalPrice = that.data.tradeApply.TheatreOrderScheduleBase.TotalPrice;

    // 判断是否有场厅被选中
    var venueId = that.data.selectedVenueId;
    var venueName = that.data.selectedVenueName; 
    if (venueId == undefined || venueId == '' || venueName == undefined || venueName == '') {
      topMsgTip.show.call(that, '请选择表演场厅', 1500);
      return;
    }

    // 判断场厅档期是否合法
    var venueSchedueBegin = that.data.tradeApplyDisplay.VenueScheduleBeginTime;
    var venueSchedueEnd = that.data.tradeApplyDisplay.VenueScheduleEndTime;
    if (venueSchedueBegin == undefined || venueSchedueBegin == '' 
       || venueSchedueEnd == undefined || venueSchedueEnd == '') {
      topMsgTip.show.call(that, '请选择场厅档期', 1500);
      return;
    }
    var venueSchedBeginDT = new Date(venueSchedueBegin);
    var firstShowBeginDT = new Date(that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules[0].ScheduleBeginDatetime);
    if (venueSchedBeginDT >= firstShowBeginDT) {
      topMsgTip.show.call(that, '开始时间须早于第一场演出开始时间', 1500);
      return;
    }
    var venueSchedEndDT = new Date(venueSchedueEnd);
    var orderSchedLength = that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules.length;
    var lastShowEndDT = new Date(that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules[orderSchedLength - 1].ScheduleEndDatetime);
    if (venueSchedEndDT <= lastShowEndDT) {
      topMsgTip.show.call(that, '结束时间须晚于最后一场演出结束时间', 1500);
      return;
    }

    // 设置留言
    var leaveMessage = that.data.tradeApplyDisplay.LeaveMessage;
    
    that.data.dataToSubmit = {
      TradeApplyId: that.data.tradeApplyId,                 // 预约单编号 ,
      ApplyName: that.data.ItemDisplay.Name + '预约单',     // 预约单名称 ,
      TheatreId: app.globalData.entityInfo.entityID,        // 剧院ID ,
      TheatreName: app.globalData.entityInfo.entityName,    // 剧院名称 ,
      TheatreVenueId: venueId,                              // 场厅ID ,
      TheatreVenueName: venueName,                          // 场厅名称 ,
      PartyABeginDatetime: venueSchedueBegin,               // 预约发起方档期开始时间,
      PartyAEndDatetime: venueSchedueEnd,                   // 预约发起方档期结束时间,
      TradeApplySatus: { Key: 3, } 	,                       // 预约状态 , 下一个状态等待受约方审核
      AdditionalPrice: addiPrice,                           // 追加费用 ,
      FlowSetID: that.data.flowSetId,                       // 流程设置ID ,
      ShowTroupeId: that.data.troupeItemInfo.TroupeId,      // 被约剧目的剧团ID ,
      ShowItemId: that.data.troupeItemInfo.ItemId,          // 被约剧目ID ,
      LeavingMessage: leaveMessage,                         // 预约单备注 ,
      EmployeeId: app.globalData.employeeInfo.employeeId,   // 提交预约单的员工的ID ,
      EmployeeName: app.globalData.employeeInfo.employeeName,// 提交预约单的员工的名称 ,
      EmployeePhoneNum: app.globalData.employeeInfo.employeePhoneNumber,// 提交预约单的员工的电话

      Receiver: undefined,                                  // 审核人 ,
      LockTimeHH: undefined,                                // 审核预锁定时间 - 小时部分（不是小时，是分钟） ,
      LockTimeMM: undefined,                                // 审核预锁定时间 - 分钟部分(错误， 是秒，填0就行了) ,
    };

    // 提交预约单
    if (that.data.flowSetId == undefined || that.data.flowSetId == '') {
      that.start2Submit(that, that.data.dataToSubmit);
    } else {
      // 如果有流程，显示流程审批
      this.setData({
        showSubmitFlowBox: true,
      })
    }
  },
  start2Submit: function (that, data) { // 开始提交预约单
    var isItemOrder = that.data.tradeApply.IsItemOrdering;

    var url = app.api.submitTroupeOrder;
    app.util.postData.call(that, url, data, 'POST',
      function (res) {
        let msg = '已提交至内部审批'
        console.log(res)
        if (res.data.ApplyStatusInfo && res.data.ApplyStatusInfo.Key === 3) {
          msg = '已提交至受约方'
        }
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1500
        })
        setTimeout(function(){
          app.util.commonViewTap('/pages/operaOrderDetail/operaOrderDetail?id=' + that.data.tradeApplyId, 1);
        },1500)
        
      },
      function (err) {
        if (err.statusCode == 531) {
          topMsgTip.show.call(that, '所选剧目档期被占用', 1500);
        } else if (err.statusCode == 533) {
          topMsgTip.show.call(that, '本场厅档期已不可用', 1500);
        } else if (err.statusCode == 534) {
          topMsgTip.show.call(that, '本场厅档期已被占用', 1500);
        } else if (err.statusCode == 535) {
          topMsgTip.show.call(that, '所选剧目档期已不存在', 1500);
        } else {
          topMsgTip.show.call(that, '出错了o(╥﹏╥)o', 1500);
        }

      });
  },
  // 关闭流程审批
  hideFlowBox:function(){
    this.setData({
      showSubmitFlowBox: false,
      showVenueList: false,
    })
  },
  bindInputAdditionalPrice: function (evt) {
    var that = this;
    var value = evt.detail.value;
    var nValue = value.replace(/[^-0-9\.]/g, '');
    if (nValue == '') {
      return { value: nValue, };
    }
    if (nValue == '-') {
      return { value: '￥' + nValue, };
    }
    if (/^-{0,1}\d{1,8}(\.\d{0,2}){0,1}$/g.test(nValue)) {
      try {
        var numVal = Number(nValue);
        if (numVal != NaN && numVal != 0) {
          var totalPrice = that.data.tradeApply.TheatreOrderScheduleBase.TotalPrice;
          if (totalPrice + numVal < 0) {
            nValue = (-1 * totalPrice).toString();
          }
          that.data.AdditionalPrice = nValue;
          return {
            value: '￥' + nValue,
          };
        }
      }
      finally {
      }
    } else {
      return {
        value: '￥' + (that.data.AdditionalPrice || ''),
      };
    }
  },
  bindBlurAdditionalPrice: function (evt) {
    var that = this;
    var value = evt.detail.value;
    try {
      value = value.replace(/[^-0-9\.]/g, '');
      value = (value == '-' ? '-0.00' : value);

      var addiPrice = Number(value);

      var displayData = that.data.tradeApplyDisplay;
      displayData.AddiPriceNum = addiPrice;
      displayData.IsGrowUp = addiPrice >= 0 ? true : false;
      displayData.AdditionalPriceAbs = app.util.toThousands(addiPrice).replace('-', '');
      displayData.FinalPrice = app.util.toThousands(that.data.tradeApply.TheatreOrderScheduleBase.TotalPrice + addiPrice);

      //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
      that.setData({
        //HasAddiPrice: (addiPrice > 0 || addiPrice < 0),
        tradeApplyDisplay: displayData,
      });
    } finally {
    }
  },
  listVenues: function (evt) {
    this.setData({
      showVenueList: true,
    })
  },
  bindVenueChange: function (evt) {
    var that = this;
    var index = Number(evt.detail.value);
    var target = that.data.VenueListDisplay[index];
    that.data.selectedVenueId = target.Id;
    that.setData({ selectedVenueIndex: index, selectedVenueName: target.Name, });
  },
  bindLeaveMessage: function (evt) {
    var that = this;
    var msg = evt.detail.value;
    that.data.tradeApplyDisplay.LeaveMessage = msg;
  },
  bindReceiverChange: function (evt) {
    var that = this;
    if (that.data.flowSetId && that.data.dataToSubmit) {
      that.data.dataToSubmit.Receiver = evt.detail.receiver
      if (!that.data.dataToSubmit.Receiver) {
        topMsgTip.show.call(that, '请选择审批人', 1500)
        return false
      }
      that.data.dataToSubmit.LockTimeHH = evt.detail.days * 1440 + evt.detail.hours * 60 + evt.detail.minutes // 锁定时间小时
      if (that.data.dataToSubmit.LockTimeHH <= 0) {
        topMsgTip.show.call(that, '锁定时长必须大于0', 1500)
        return false
      }
      that.data.dataToSubmit.LockTimeMM = evt.detail.minutes // 锁定时间分钟

      that.start2Submit(that, that.data.dataToSubmit);
    }
  },
  bindSelfSchedueBegin: function (evt) {
    var that = this;
    var displayData = that.data.tradeApplyDisplay;
    try {
      var firstShowBegin = new Date(that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules[0].ScheduleBeginDatetime);
      var beginDT = evt.detail.value;
       
      if (firstShowBegin <= beginDT) {
        topMsgTip.show.call(that, '开始时间须早于第一场演出开始时间', 1500)
        return;
      }

      displayData.VenueScheduleBeginTime = app.util.formatDate(beginDT, 'yyyy.MM.dd hh:mm');
      that.setData({ tradeApplyDisplay: displayData, }) 
    } catch (ex) {
      console.log('选取的自身场厅档期开始时间错误：' + evt.detail.value + '。' + ex.message);
      displayData.VenueScheduleBeginTime = undefined;
      that.setData({ tradeApplyDisplay: displayData, }) 
    }
  },
  bindSelfSchedueEnd: function (evt) {
    var that = this;
    var displayData = that.data.tradeApplyDisplay;
    try {
      var orderSchedLength = that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules.length;
      var lastShowEnd = new Date(that.data.tradeApply.TheatreOrderScheduleBase.OrderSchedules[orderSchedLength - 1].ScheduleEndDatetime);
      var endDT = evt.detail.value;

      if (lastShowEnd >= endDT) {
        topMsgTip.show.call(that, '结束时间须晚于最后一场演出结束时间', 1500)
        return;
      }

      displayData.VenueScheduleEndTime = app.util.formatDate(endDT, 'yyyy.MM.dd hh:mm');
      that.setData({ tradeApplyDisplay: displayData, }) 
    } catch (ex) {
      console.log('选取的自身场厅档期结束时间错误：' + evt.detail.value + '。' + ex.message);
      displayData.VenueScheduleEndTime = undefined;
      that.setData({ tradeApplyDisplay: displayData, }) 
    }
  },
  switch1Change: function (evt) {
    var that = this;
    var displayData = that.data.tradeApplyDisplay;
    var latsAddiPrice = that.data.tradeApply.TheatreOrderScheduleBase.AdditionalPrice;
    var totalShowPrice = that.data.tradeApply.TheatreOrderScheduleBase.TotalPrice;

    if (evt.detail.value) {
      displayData.AddiPriceNum = latsAddiPrice;
      displayData.AdditionalPriceAbs = app.util.toThousands(displayData.AddiPriceNum);
      displayData.IsGrowUp = displayData.AddiPriceNum >= 0;
      displayData.FinalPrice = app.util.toThousands(totalShowPrice + latsAddiPrice);

      that.setData({ 
        HasAddiPrice: true, 
        AdditionalPrice: latsAddiPrice ? '￥' + latsAddiPrice : '', 
        tradeApplyDisplay: displayData, 
      });
    } else {
      displayData.AddiPriceNum = 0;
      displayData.AdditionalPriceAbs = app.util.toThousands(0);
      displayData.IsGrowUp = false;
      displayData.FinalPrice = app.util.toThousands(totalShowPrice);

      that.setData({ HasAddiPrice: false, AdditionalPrice: '', tradeApplyDisplay: displayData, });
    }
  },
  
  getVenueList: function () {
    var that = this;
    var url = app.api.getAllVenues;
    var parms = {
      entityId: app.globalData.entityInfo.entityID,
    };
    app.util.postData.call(that, url, parms, 'GET',
      function (res) {
        that.setData({ hasAnyVenue: (res.data && res.data.length > 0), });
        if (that.data.hasAnyVenue) {
          var tmpVenue;
          var venueList = [];
          for (var i in res.data) {
            tmpVenue = res.data[i];
            if (tmpVenue.RawId == that.data.selectedVenueId) {
              that.data.selectedVenueIndex = Number(i);
            }
            venueList.push({
              Name: tmpVenue.Name,
              Id: tmpVenue.RawId,
              CreateDateTime: tmpVenue.CreateDateTime,
            });
          }
          that.setData({ selectedVenueIndex: that.data.selectedVenueIndex, VenueListDisplay: venueList, }); // 渲染场厅列表
        } else {
          that.setData({ selectedVenueName: '', selectedVenue: undefined, VenueListDisplay: [], }); // 渲染场厅列表
        }
      },
      function (err) { });
  },
  popNoVenueError: function () {
    var that = this;
    topMsgTip.show.call(that, '暂无场厅，请去PC端创建', 1500);
  },
  getSubmitOrderWorkflowConfig: function () { // 从档期 API 中读取提交预约单的流程配置
    var that = this;
    var url = app.api.getSubmitOrderWFConfig;
    var parms = {
      entityId: app.globalData.entityInfo.entityID,
      isTheatre: true,
    };
    app.util.postData.call(that, url, parms, 'GET', 
    function (res) {
      if (res.statusCode == 200) { // OK
        that.data.flowSetId = (res.data || '').trim();

        url = app.api.getWorkflowFirstNodeMark;
        parms = {
          flowSetID: that.data.flowSetId,
        };
        app.util.postData.call(that, url, parms, 'GET',
        function (res) {
          that.setData({ flowFirstNodeMark: res.data, });
        },
        function (err) { });

        that.getReportToList('', '');
      } else  {
      }
    },
    function (err) { });
  },
  getThisTroupeItemBookingInfo: function (tradeApplyId) { // 加载剧目预约单信息
    var that = this;
    var url = app.api.getTroupeOrderInfoById;
    var parms = {
      rawId: tradeApplyId,
    };
    app.util.postData.call(that, url, parms, 'GET',
      function (res) {
        try {
          url = app.api.getTroupeItemInfoById;
          parms = {
            entityId: res.data.TheatreOrderScheduleBase.TroupeId,
            itemId: res.data.TheatreOrderScheduleBase.TroupeItemOutline.ItemId,
            priced: false,
            itemOnly: false,
          };
          
          // 如果预约单状态已提交或在内部审批中，则返回到剧目详情页中。
          var tradeApplyStatus = res.data.TheatreOrderScheduleBase.BookingStatus.Key;
          tradeApplyStatus = tradeApplyStatus || res.data.TheatreOrderScheduleBase.BookingStatus.key;
          var workflowId = res.data.TheatreOrderScheduleBase.WorkFlowInstId;
          var workflowStatus = res.data.TheatreOrderScheduleBase.WorkFlowReturnStatus;
          var isUnderWorkflow = (workflowId && workflowId.length > 0 && workflowStatus == 0);
          if (tradeApplyStatus > 1 || isUnderWorkflow) {
            app.util.commonViewTap('', 99); // 返回上一页
            return;
          }

          app.util.postData.call(that, url, parms, 'GET', 
            function (res) {
              that.data.troupeItemInfo = res.data;
              
              var troupePart = {};
              troupePart.Name = res.data.OrganEntiy.EntityName;
              troupePart.UrlSource = app.config.resourceHost + res.data.OrganEntiy.EntityCoverUrl;
              that.setData({ troupeDisplay: troupePart }); // 渲染剧团数据
              that.data.troupeItemInfo.TroupeId = res.data.OrganEntiy.EntityID;

              var itemPart = {};
              itemPart.Name = res.data.ItemBaseInfoData.Name; 
              itemPart.ShowType = '';
              var showType = undefined;
              for (var i in res.data.ItemBaseInfoData.ShowType) {
                showType = res.data.ItemBaseInfoData.ShowType[i];
                itemPart.ShowType += showType.Name + '/';
              }
              var showTypeLength = (itemPart.ShowType.length > 0 ? itemPart.ShowType.length - 1 : 0);
              itemPart.ShowType = itemPart.ShowType.substr(0, showTypeLength);

              itemPart.ShowMinutes = res.data.ItemBaseInfoData.ShowMinutes;
              itemPart.UrlSource = app.config.resourceHost + res.data.ItemBaseInfoData.UrlSource;
              itemPart.UrlSmallThumbnail = app.config.resourceHost + res.data.ItemBaseInfoData.UrlSmallThumbnail;
              if (res.data.ItemBaseInfoData.FirstShowDate) {
                itemPart.FirstShowDate = res.data.ItemBaseInfoData.FirstShowDate.replace('-', '.').replace('-', '.');
                itemPart.FirstShowDate = itemPart.FirstShowDate.substr(0, itemPart.FirstShowDate.indexOf(' '));
              } else {
                itemPart.FirstShowDate = '';
              }
              itemPart.TourShowActorCount = res.data.ItemBaseInfoData.TourShowActorCount || 0;
              that.setData({ ItemDisplay: itemPart }); // 渲染剧目数据
              that.data.troupeItemInfo.ItemId = res.data.ItemBaseInfoData.ItemId;
            },
            function (err) {
            }
          );
          
          if (res.data.TheatreOrderScheduleBase.VenueName && res.data.TheatreOrderScheduleBase.VenueName != '') {
            that.setData({ selectedVenueName: res.data.TheatreOrderScheduleBase.VenueName, });
          }
          that.data.selectedVenueId = res.data.TheatreOrderScheduleBase.VenueId;

          that.data.tradeApply = res.data || {};
          // 测试打开 res.data.TheatreOrderScheduleBase.AdditionalPrice = 600;
          var addiPrice = res.data.TheatreOrderScheduleBase.AdditionalPrice || 0;
          that.data.AdditionalPrice = (addiPrice == 0 ? '' : addiPrice);

          var displayData = {};
          displayData.LinkerFullName = res.data.TheatreOrderScheduleBase.LinkerFullName || '';
          displayData.LinkerPhone = res.data.TheatreOrderScheduleBase.LinkerPhone || '';
          displayData.Schedules = [];

          displayData.TeamArriveTime = that.formatDT(res.data.TeamArriveTime);
          displayData.TeamLeaveTime = that.formatDT(res.data.TeamLeaveTime);
          displayData.VenueScheduleBeginTime = that.formatDT(res.data.VenueScheduleBeginTime);
          displayData.VenueScheduleEndTime = that.formatDT(res.data.VenueScheduleEndTime);
          
          displayData.LeaveMessage = res.data.TheatreOrderScheduleBase.LeaveMessage;

          that.formatSchedDateTime(res.data.TheatreOrderScheduleBase.OrderSchedules, displayData.Schedules);
          displayData.HasOneMoreShow = displayData.Schedules.length > 1;

          var prices = that.extractPrices(displayData.Schedules);
          that.data.tradeApply.TheatreOrderScheduleBase.TotalPrice = prices.totalPrice;
          that.data.tradeApply.TheatreOrderScheduleBase.TotoalEpositPrice = prices.totalEpositPrice;
          displayData.TotalPrice = app.util.toThousands(prices.totalPrice);
          displayData.TotalEpositPrice = app.util.toThousands(prices.totalEpositPrice);

          displayData.FinalPrice = app.util.toThousands(prices.totalPrice + addiPrice);
          displayData.IsGrowUp = addiPrice >= 0 ? true : false;
          displayData.AddiPriceNum = addiPrice;
          displayData.AdditionalPriceAbs = app.util.toThousands(addiPrice).replace('-', '');
          
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
            HasAddiPrice: (displayData.AddiPriceNum != 0),
            AdditionalPrice: '￥' + that.data.AdditionalPrice,
            tradeApplyDisplay: displayData,
          });
        } catch (e) {
        }
      },
      function (err) {
        if (err.statusCode == 460) {
          // http request 参数值非法，请检查是否为空
        } else if (err.statusCode == 521) {
          // 再次查询预约单状态，明确预约单是已提交还是被取消
        }
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
  getReportToList: function (name, phone) {
    var that = this;
    if (that.data.flowSetId == undefined || that.data.flowSetId == '') {
      return;
    }
    
    var url = app.api.getReportToListByNameOrPhone;
    var parms = {
      organId: app.globalData.organInfo.organId,
      entityId: app.globalData.entityInfo.entityID,
      flowSetId: that.data.flowSetId,
      name: name,
      phone: phone,
    };
    app.util.postData.call(that, url, parms, 'GET', 
    function (res) { 
      var tmpList = [];
      var tmp = undefined;
      for (var i in res.data) {
        tmp = res.data[i];
        tmpList.push({
          Name: tmp.FullName,
          Phone: tmp.PhoneNumber,
          Id: tmp.RawId,
        });
      }
      that.setData({ reportToListDisplay: res.data, });
    }, 
    function (err) { });
  },
  
  formatDT: function (dt, fmtStr) { // 格式化时间
    if (!dt || dt == '') {
      return '';
    }
    try {
      var tmpDT = new Date(dt);
      return app.util.formatDate(tmpDT, fmtStr && fmtStr != '' ? fmtStr : 'yyyy.MM.dd hh:mm');
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
        Price: srcSchedList[i].Price.toFixed(2),
        EpositPrice: srcSchedList[i].EpositPrice.toFixed(2),
      };
      begDT = new Date(sched.ScheduleBeginDatetime.replace(/-/g, '/'));
      endDT = new Date(sched.ScheduleEndDatetime.replace(/-/g, '/'));
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
    var totalPrice = 0;
    var totalEpositPrice = 0;

    var sched = undefined;
    for (var i in schedList) {
      sched = schedList[i];
      totalPrice += Number(sched.Price || '0');
      totalEpositPrice += Number(sched.EpositPrice || '0');
    }

    return { totalPrice: totalPrice, totalEpositPrice: totalEpositPrice, }
  },
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
  }
})