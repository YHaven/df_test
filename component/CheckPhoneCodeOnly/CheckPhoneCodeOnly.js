
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    codeAction: {
      type: String,
      value: ''
    },
    phoneNumber: {
      type: String,
      value: ''
    },
    isPartyA: {
      type: String,
      value: ''
    },
    checkOnly: {
      type: Boolean,
      value: false
    },
    isReceiveOrder:{
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    PhoneNum: '',
    BusinessCode: '',
    CheckCode: '',
    errorMsg: '',
    codeDisabled: false,
    interval: 0,
    codeText: '获取验证码',
    time: 60
  },
  attached() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData: function(){
      this.setData({
        PhoneNum: this.data.phoneNumber
      })
    },
    hideCancelBox: function () {
      this.triggerEvent('hideCancelBox', {})
    },
    cancelOrder: function () {
      let that = this
      let result = that.checkForm()
      if (!result) {
        return false
      }
      let params = {
        PhoneNum: that.data.PhoneNum,
        BusinessCode: that.data.BusinessCode,
        CheckCode: that.data.CheckCode
      }
      this.triggerEvent('cancelOrder', params)
    },
    validateRulesPhoneNumber: function (phone) {
      if (phone) {
        if (/^[1][3,4,5,7,8][0-9]{9}$/g.test(phone)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    checkForm: function () {
      let formData = this.data
      let result = true
      let errorMsg = ''
      if (formData.PhoneNum) {
        if (!this.validateRulesPhoneNumber(formData.PhoneNum)) {
          result = false
          errorMsg = '请输入正确的手机号'
        }
      } else {
        result = false
        errorMsg = '手机号不能为空'
      }
      if (result && !formData.BusinessCode) {
        result = false
        errorMsg = '请输入正确验证码'
      }
      if (result && !formData.CheckCode) {
        result = false
        errorMsg = '验证码不能为空'
      }
      let that = this
      // that.setData({
      //   errorMsg: errorMsg
      // })
      if (errorMsg){
        that.selectComponent("#topMsgTips").show(errorMsg, 1500)
      }
      
      return result
    },
    // 表单input
    bindPhoneInput: function (e) {
      this.setData({
        PhoneNum: e.detail.value
      })
    },
    bindCodeInput: function (e) {
      this.setData({
        CheckCode: e.detail.value
      })
    },
    sendMsg: function () {
      let that = this
      console.log(this.data.codeDisabled)
      if (this.data.codeDisabled) {
        return false
      }
      let phoneNumber = this.data.PhoneNum
      // 检查一下手机号，然后向后台请求
      if (!phoneNumber) {
        // that.setData({
        //   errorMsg: '手机号不能为空'
        // })
        that.selectComponent("#topMsgTips").show('手机号不能为空', 1500)
        return false
      }
      if (this.validateRulesPhoneNumber(phoneNumber)) {
        // 防止多次点击重复发送
        this.setData({
          codeDisabled: true
        })
        let isReceiveOrder = this.data.isReceiveOrder
        let params = {
          Name: isReceiveOrder ? 'BookingFeeReceived' : 'BookingFeeNotFound',
          CheckOnly: this.data.checkOnly === undefined ? false : this.data.checkOnly,
          PhoneNumbers: phoneNumber,
          CodePrefix:'',
          SmValueJson:'{ "code": "" }'
        }

        let me = this.data
        let url = me.codeAction

        console.log(url)
        var access_token = wx.getStorageSync('access_token')
        var header = {
          "Authorization": access_token.startsWith('Bearer ') ? access_token : 'Bearer ' + access_token
        }
        wx.request({
          url: url,
          data: params,
          header: header,
          method: 'POST',
          complete(res) {
            if (res.statusCode === 200) {
              if (res.data.ResetTime <= 0) {
                //还有一个是重复获取验证码。倒计时到0时，所以加字符串分辨
                if (res.data.FailureReason.indexOf('已达上限') >= 0) {
                  // that.setData({
                  //   errorMsg: '发送验证码已达上限，24小时后重试'
                  // })
                  that.selectComponent("#topMsgTips").show('发送验证码已达上限，24小时后重试', 1500)
                } else {
                  wx.showToast({
                    title: res.data.FailureReason,
                    icon: 'none',
                    duration: 3000
                  })
                }
                that.setData({
                  // codeText: '重新获取',
                  codeDisabled: false
                })
              } else {
                that.setData({
                  BusinessCode: res.data.BusinessNo
                })
                if (res.data.IsNew) {
                  wx.showToast({
                    title: '验证码已发送',
                    icon: 'success',
                    duration: 1500
                  })
                  me.time = res.data.ResetTime
                  // 请求返回倒计时
                  that.freezeMsg(me, () => { })
                } else {
                  wx.showToast({
                    title: '验证码获取太频繁',
                    icon: 'none',
                    duration: 1500
                  })
                  that.setData({
                    codeDisabled: false
                  })
                }
              }



            } else {
              that.setData({
                // codeText: '重新获取',
                codeDisabled: false
              })
            }
          }
        })

      } else {
        // that.setData({
        //   errorMsg: '请输入正确的手机号'
        // })
        that.selectComponent("#topMsgTips").show('请输入正确的手机号', 1500)
      }


    },
    // 短信验证冻结倒计时
    freezeMsg(me, callback) {
      let that = this
      if (me.interval > 0) {
        clearInterval(me.interval)
      }
      me.interval = setInterval(function () {
        --me.time
        that.setData({
          codeText: me.time + 's'
        })
        if (me.time < 0) {
          that.setData({
            codeText: '重新获取',
            codeDisabled: false
          })
          me.time = 60
          callback()
          clearInterval(me.interval)
        }
      }, 1000)
    }
  }
})