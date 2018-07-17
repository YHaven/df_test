const app = getApp()
// var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  data: {
    tips1: '只允许修改1次,请慎重',
    tips2: '4-20个字符',
    tips3: '首位须为英文字母',
    tips4: '字母或字母、数字组合或字母、数字、下划线组合',
    placeholder: '请输入用户名',
    buttonText: '完成修改',
    inputVal: '',
    isVerify: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderInfo()
  },
  renderInfo: function () {
    if (app.globalData.iyanyiUser.UserName && app.globalData.iyanyiUser.UserName !== '') {
      this.setData({
        inputVal: app.globalData.iyanyiUser.UserName,
        isVerify: true
      })
    }
  },
  // 校验用户名称
  verifyUserName: function(e) {
    let that = this
    let errorMsg = ''
    let value = e.detail.value
    let length = value.length
    let sum = 0
    that.data.inputVal = value
    if (!value || length < 4 || length > 20) {
      that.data.isVerify = false
      errorMsg = '须为4-20个字符'
      that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    } else {
      sum++
      // 判断首位
      let firstLetter = value.substr(0, 1)
      if (/[A-Za-z]/.test(firstLetter)) {
        sum++
        // 判断组合
        if (/^[0-9a-zA-Z_]{1,}$/.test(value)) {
          sum++
        } else {
          that.data.isVerify = false
          errorMsg = '只能包含数字、字母、下划线'
          that.selectComponent("#topMsgTips").show(errorMsg, 1500)
        }
      } else {
        that.data.isVerify = false
        errorMsg = '首位须为英文字母'
        that.selectComponent("#topMsgTips").show(errorMsg, 1500)
      }
    }
    that.data.isVerify = sum === 3
    that.setData({
      isVerify: that.data.isVerify,
      inputVal: that.data.inputVal
    })
  },
  // 按钮提交事件
  btnSubmit: function() {
    let errorMsg = ''
    let that = this
    let value = that.data.inputVal
    let url = app.api.modifyUserName
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      OldUserName: app.globalData.iyanyiUser.UserName, // 原用户名
      NewUserName: value // 新用户名
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        app.globalData.iyanyiUser.UserName = value
        app.util.setPrePageData({
          username: value,
          isUserNameHaveSetted: true
        })
        app.util.commonViewTap('',99)
      },
      function (res) {  // 失败
        let errorMsg = res.message
        that.selectComponent("#topMsgTips").show(errorMsg, 1500)
      }
    )
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 通用分享
    return app.util.commonShareAppMessage()
  }
})
