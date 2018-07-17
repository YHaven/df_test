// component/SubmitInnerFlow/SubmitInnerFlow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    receiverList: {
      type: Array,
      value: [],
      observer: '_receiverListChange'
    },
    workFlowFirstNodeMark: {
      type: String,
      value: ''
    },
    hasAgreeFlow: {
      type: Boolean,
      value: false
    },
    beginTime:{
      type: String,
      value: ''
    },
    endTime: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    idealList: [],
    days: 3,
    hours: 0,
    minutes: 0,
    receiver: '',
    atTime: '',
    beginTimeStr:'',
    endTimeStr:'',
    inputDaysStr:'2018-06-03 00:00:00'
  },
  attached() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData:function(){
      let atTime = this.formatDate(new Date(), 'yyyy-MM-dd hh:mm')
      this.setData({
        atTime: atTime
      })
      if (this.data.hasAgreeFlow){
        if (this.data.beginTime !== ''){
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
      }
    },
    _receiverListChange: function(newValue,oldValue) {
      let idealList = []
      newValue.forEach(n=>{
        idealList.push({
          label: n.FullName + '(' + n.PhoneNumber +')',
          value: n.RawId
        })
      })
      // 格式化联想
      this.setData({
        idealList: idealList
      })
    },
    bindReceiverInput: function(e) {
      let idealDetail = e.detail
      let value = ''
      if (idealDetail.selectItem){
        value = idealDetail.selectItem.value
      }
      this.setData({
        receiver: value
      })
    },
    bindBeginTime:function(e){
      let beginTime = e.detail.value
      let beginTimeStr = this.formatDate(beginTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        beginTimeStr: beginTimeStr
      })
    },
    bindEndTime: function (e) {
      let endTime = e.detail.value
      let endTimeStr = this.formatDate(endTime, 'yyyy.MM.dd hh:mm')
      this.setData({
        endTimeStr: endTimeStr
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
      if (that.data.hasAgreeFlow){
        let beginTime = ''
        if (that.data.beginTimeStr){
          beginTime = that.data.beginTimeStr.replace(/\./g, '-') + ':00'
        }
        params.beginTime = beginTime
        let endTime = ''
        if (that.data.endTimeStr) {
          endTime = that.data.endTimeStr.replace(/\./g, '-') + ':00'
        }
        params.endTime = endTime
      }
      this.triggerEvent('submitFlow', params)
    },
    inputDays: function (e) {
      let inputDaysStr = this.formatDate(e.detail.value,'yyyy-MM-dd hh:mm:ss')
      console.log(inputDaysStr)

      this.setData({
        inputDaysStr: inputDaysStr,
        days: e.detail.value.getDate(),
        hours: e.detail.value.getHours(),
        minutes: e.detail.value.getMinutes()
      })
    },
    formatDate: function (dateInst, fmt){
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
    },
    idealFocus:function(){
      this.setData({
        idealFocusHeight: '600rpx'
      })
    },
    idealBlur: function () {
      this.setData({
        idealFocusHeight: 'auto'
      })
    }
  }
})