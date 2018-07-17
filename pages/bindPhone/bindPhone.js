const app = getApp()
// var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    userInfo: {},
    hasUserInfo: false,
    animationData: {},
    errorMsg: '',
    toastMsg: '',
    wxCode: '',
    netTimeOut: false,
    codeDisabled: false,
    interval: 0,
    codeText: '获取验证码',
    time: 60,
    wxPhone: '',
    formData: {
      phone: '',
      code: '',
      BizNo: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success: res => {
        this.setData({
          wxCode: res.code
        })
      }
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  // 做页面跳转 url参数这么写 <text catchtap="doViewTap" data-url="/pages/login/login?title=navigate">跳转</text>
  doViewTap: function (e) {
    var data = e.currentTarget.dataset;
    var url = data.url
    app.util.commonViewTap(url)
  },
  // 刷新
  refresh: function () {
    this.onShow()
  },
  checkForm: function () {
    let formData = this.data.formData
    let result = true
    let errorMsg = ''
    if (formData.phone) {
      if (!app.util.validateRules.phoneNumber(formData.phone)) {
        result = false
        errorMsg = '请输入正确的手机号'
      }
    } else {
      result = false
      errorMsg = '手机号不能为空'
    }
    if (result && !formData.BizNo) {
      result = false
      errorMsg = '请输入正确验证码'
    }
    if (result && !formData.code) {
      result = false
      errorMsg = '验证码不能为空'
    }
    let that = this
    if (errorMsg) {
      // topMsgTip.show.call(that, errorMsg, 1500)
      that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    }
    return result
  },
  // 表单input
  bindPhoneInput: function (e) {
    let formData = this.data.formData
    formData.phone = e.detail.value
    this.setData({
      formData: formData
    })
  },
  bindCodeInput: function (e) {
    let formData = this.data.formData
    formData.code = e.detail.value
    this.setData({
      formData: formData
    })
  },
  submitForm: function () {
    let that = this
    if (this.checkForm()) {
      let formData = this.data.formData
      this.setData({
        showLoading: true
      })
      // app.util.postData(url,params,function(res){})
      
      wx.login({
        success: res => {
          console.log(res.code)
          let url = app.api.userLogin
          let params = {
            Phone: formData.phone,
            BizNo: formData.BizNo,
            VerifyCode: formData.code,
            Code: res.code,
            NickName: that.data.userInfo.nickName,
            UserFm: that.data.userInfo.gender,
            UserPic: that.data.userInfo.avatarUrl,
            City: that.data.userInfo.city,
            Province: that.data.userInfo.province,
            Country: that.data.userInfo.country,
            Language: that.data.userInfo.language,
            LoginLogInfo: app.globalData.loginLog // 添加登录日志需要的额外信息
          }
          app.util.postData.call(that, url, params, 'POST',
            function (res) {  // 成功
              console.log(res)
              // 更新全局user
              wx.setStorageSync('access_token', res.data.AuthResult.access_token)
              let PhoneNumberString = res.data.Phone
              res.data.PhoneNumberString = PhoneNumberString ? PhoneNumberString.substring(0, 3) + '*****' + PhoneNumberString.substring(8, 11) : '无'
              app.globalData.iyanyiUser = res.data
              app.util.commonViewTap(app.config.homepage, 3)
            },
            function (res) {  // 失败
              console.log(res)
              that.submitErrorFun(res)
            }
          )
         
        }
      })
      
    }
  },
  submitFormPhone: function(){
    let that = this
    let formData = this.data.formData
    wx.showLoading({
      title: '加载中'
    })
    wx.login({
      success: res => {
        let url = app.api.userLogin
        let params = {
          Phone: formData.phone,
          // BizNo: formData.BizNo,
          // VerifyCode: formData.code,
          Code: res.code,
          NickName: that.data.userInfo.nickName,
          UserFm: that.data.userInfo.gender,
          UserPic: that.data.userInfo.avatarUrl,
          City: that.data.userInfo.city,
          Province: that.data.userInfo.province,
          Country: that.data.userInfo.country,
          Language: that.data.userInfo.language,
          LoginLogInfo: app.globalData.loginLog // 添加登录日志需要的额外信息
        }
        app.util.postData.call(that, url, params, 'POST',
          function (res) {  // 成功
            console.log(res)
            // 更新全局user
            wx.setStorageSync('access_token', res.data.AuthResult.access_token)
            let PhoneNumberString = res.data.Phone
            res.data.PhoneNumberString = PhoneNumberString ? PhoneNumberString.substring(0, 3) + '*****' + PhoneNumberString.substring(8, 11) : '无'
            app.globalData.iyanyiUser = res.data
            app.util.commonViewTap(app.config.homepage, 3)
            wx.hideLoading()
          },
          function (res) {  // 失败
            console.log(res)
            that.submitErrorFun(res)
          }
        )

      }
    })
  },
  submitErrorFun: function (res){
    let that = this
    // 463 短信验证码/业务吗为空(绑定用户) 
    if (res.statusCode === 462 || res.statusCode === 464 || res.statusCode === 465) {
      // topMsgTip.show.call(that, '请输入正确的验证码', 1500)
      that.selectComponent("#topMsgTips").show('请输入正确的验证码', 1500)
    }
    if (res.statusCode === 526) {
      // topMsgTip.show.call(that, '该手机号已绑定其他微信', 1500)
      that.selectComponent("#topMsgTips").show('该手机号已绑定其他微信', 1500)
    }
    // 给一个新值备用获取微信手机号
    wx.login({
      success: resCode => {
        this.setData({
          wxCode: resCode.code
        })
      }
    })
    wx.hideLoading()
    this.setData({
      showLoading: false
    })
  },
  sendMsg: function () {
    let that = this
    if (this.data.codeDisabled) {
      return false
    }
    let phoneNumber = this.data.formData.phone
    // 检查一下手机号，然后向后台请求
    if (!phoneNumber) {
      // topMsgTip.show.call(that, '手机号不能为空', 1500)
      that.selectComponent("#topMsgTips").show('手机号不能为空', 1500)
      return false
    }
    if (app.util.validateRules.phoneNumber(phoneNumber)) {
      // 防止多次点击重复发送
      this.setData({
        codeDisabled: true
      })
      let params = {
        phoneNumber: phoneNumber
      }
      let url = app.api.sendBindingCode
      let me = this.data
      app.util.postData.call(that, url, params, 'GET',
        function (res) {  // 成功
          // console.log(res)
          if (res.data.ResetTime <= 0) {
            //还有一个是重复获取验证码。倒计时到0时，所以加字符串分辨
            if (res.data.FailureReason.indexOf('已达上限')>=0){
              // topMsgTip.show.call(that, '发送验证码已达上限，24小时后重试', 1500)
              that.selectComponent("#topMsgTips").show('发送验证码已达上限，24小时后重试', 1500)
            }else {
              wx.showToast({ title: res.data.FailureReason, icon: 'none', duration: 3000 })
            }
            that.setData({
              // codeText: '重新获取',
              codeDisabled: false
            })
          } else {
            // bug 834提示验证码获取太频繁  又改回去
            // me.time = res.data.ResetTime
            // 立即显示请求返回倒计时
            // that.freezeMsg(me, () => { })

            let formData = that.data.formData
            formData.BizNo = res.data.BusinessNo
            that.setData({
              formData: formData
            })
            if (res.data.IsNew) {
              me.time = res.data.ResetTime
              // 立即显示请求返回倒计时
              that.freezeMsg(me, () => { })
              app.util.messageToast.show.call(that, '验证码已发送', 1500)
            } else {
              wx.showToast({ title: '验证码获取太频繁', icon: 'none', duration: 1500 })
              that.setData({
                codeDisabled: false
              })
            }
          }
        },
        function (res) {  // 失败
          console.log(res)
          that.setData({
            // codeText: '重新获取',
            codeDisabled: false
          })
        }
      )

    } else {
      // topMsgTip.show.call(that, '请输入正确的手机号', 1500)
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
  },
  // 防止重复获取微信手机号
  getPhoneNumber2: function() {
    let that = this
    if (that.data.wxPhone) {
      let formData = that.data.formData
      formData.phone = that.data.wxPhone
      that.setData({
        formData: formData
      })
    }
  },
  // 第一次获取微信手机号
  getPhoneNumber: function (e) {
    let that = this
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // console.log(e.detail.iv)
      // console.log(e.detail.encryptedData)
      // 这里去后台解码
      let url = app.api.exchangePhone
      let params = {
        IV: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        code:that.data.wxCode
      }
      app.util.postData.call(that, url, params, 'GET',
        function (res) {  // 成功
          let formData = that.data.formData
          formData.phone = res.data
          that.setData({
            formData: formData,
            wxPhone: res.data
          })
          // 直接注册
          that.submitFormPhone()
        },
        function (res) {  // 失败
          console.log(res)
          if(res.statusCode === 522) {
            wx.showToast({ title: '微信临时凭证过期', icon: 'none', duration: 3000 })
          }else{
            wx.showToast({ title: res.data, icon: 'none', duration: 3000 })
          }
        }
      )
      
    } else {
      console.log(e.detail.errMsg)
    }
  }
})