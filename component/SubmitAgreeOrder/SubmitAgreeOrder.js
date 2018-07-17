// component/SubmitAgreeOrder/SubmitAgreeOrder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    beginTime: {
      type: String,
      value: ''
    },
    endTime: {
      type: String,
      value: ''
    },
    teamArriveTime: {
      type: String,
      value: ''
    },
    teamLeaveTime: {
      type: String,
      value: ''
    },
    aboutBaseInfo: {
      type: Object,
      value: {}
    },
    WorkFlowReturnStatus: {
      type: Number,
      value: null
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    days: 3,
    hours: 0,
    minutes: 0,
    atTime: '',
    beginTimeStr: '',
    endTimeStr: '',
    teamArriveTimeStr: '',
    teamLeaveTimeStr: ''
  },
  attached() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData: function() {
      let atTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm')
      this.setData({
        atTime: atTime
      })
      if (this.data.beginTime !== '') {
        let beginTimeStr = this.formatDate(new Date(this.data.beginTime), 'yyyy.MM.dd hh:mm')
        this.setData({
          beginTimeStr: beginTimeStr
        })
      }
      if (this.data.endTime !== '') {
        let endTimeStr = this.formatDate(new Date(this.data.endTime), 'yyyy.MM.dd hh:mm')
        this.setData({
          endTimeStr: endTimeStr
        })
      }
      console.log(this.data.teamArriveTime)
      if (this.data.teamArriveTime !== '') {
        let teamArriveTimeStr = this.formatDate(new Date(this.data.teamArriveTime), 'yyyy.MM.dd hh:mm')
        this.setData({
          teamArriveTimeStr: teamArriveTimeStr
        })
      }
      if (this.data.teamLeaveTime !== '') {
        let teamLeaveTimeStr = this.formatDate(new Date(this.data.teamLeaveTime), 'yyyy.MM.dd hh:mm')
        this.setData({
          teamLeaveTimeStr: teamLeaveTimeStr
        })
      }
    },
    bindBeginTime: function(e) {
      let beginTime = e.detail.value
      let beginTimeStr = this.formatDate(beginTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        beginTimeStr: beginTimeStr
      })
    },
    bindEndTime: function(e) {
      let endTime = e.detail.value
      let endTimeStr = this.formatDate(endTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        endTimeStr: endTimeStr
      })
    },
    bindTeamArriveTime: function(e) {
      let teamArriveTime = e.detail.value
      let teamArriveTimeStr = this.formatDate(teamArriveTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        teamArriveTimeStr: teamArriveTimeStr
      })
    },
    bindTeamLeaveTime: function(e) {
      let teamLeaveTime = e.detail.value
      let teamLeaveTimeStr = this.formatDate(teamLeaveTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        teamLeaveTimeStr: teamLeaveTimeStr
      })
    },
    hideFlowBox: function() {
      this.triggerEvent('hideFlowBox', {})
    },
    submitFlow: function() {
      let that = this
      let params = {
        days: that.data.days,
        hours: that.data.hours,
        minutes: that.data.minutes,
        receiver: that.data.receiver,
      }
      let beginTime = ''
      if (that.data.beginTimeStr) {
        beginTime = that.data.beginTimeStr.replace(/\./g, '-') + ':00'
      }
      params.beginTime = beginTime
      let endTime = ''
      if (that.data.endTimeStr) {
        endTime = that.data.endTimeStr.replace(/\./g, '-') + ':00'
      }
      params.endTime = endTime
      let teamArriveTime = ''
      if (that.data.teamArriveTimeStr) {
        teamArriveTime = that.data.teamArriveTimeStr.replace(/\./g, '-') + ':00'
      }
      params.teamArriveTime = teamArriveTime
      let teamLeaveTime = ''
      if (that.data.teamLeaveTimeStr) {
        teamLeaveTime = that.data.teamLeaveTimeStr.replace(/\./g, '-') + ':00'
      }
      params.teamLeaveTime = teamLeaveTime
      this.triggerEvent('submitFlow', params)
    },
    inputDays: function(e) {
      let inputDaysStr = this.formatDate(e.detail.value, 'yyyy-MM-dd hh:mm:ss')
      console.log(inputDaysStr)

      this.setData({
        inputDaysStr: inputDaysStr,
        days: e.detail.value.getDate(),
        hours: e.detail.value.getHours(),
        minutes: e.detail.value.getMinutes()
      })
    },
    formatDate: function(dateInst, fmt) {
      var o = {
        "M+": dateInst.getMonth() + 1, //月份 
        "d+": dateInst.getDate(), //日 
        "h+": dateInst.getHours(), //小时 
        "m+": dateInst.getMinutes(), //分 
        "s+": dateInst.getSeconds(), //秒 
        "q+": Math.floor((dateInst.getMonth() + 3) / 3), //季度 
        "S": dateInst.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateInst.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

  }
})