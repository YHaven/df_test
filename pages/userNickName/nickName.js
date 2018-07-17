const app = getApp()
let timer = null
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  data: {
    buttonText: '完成修改',
    placeholder: '请输入昵称',
    inputVal: '',
    isVerify: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传入用户信息
    this.renderInfo()
  },
  renderInfo: function () {
    if (app.globalData.iyanyiUser.NickName && app.globalData.iyanyiUser.NickName !== '') {
      this.setData({
        inputVal: app.globalData.iyanyiUser.NickName,
        isVerify: true
      })
    }
  },
  verifyUserName: function (e) {
    let that = this
    let errorMsg = ''
    let value = e.detail.value
    that.data.inputVal = value
    that.data.isVerify = that.data.inputVal.length > 0
    that.setData({
      inputVal: that.data.inputVal,
      isVerify: that.data.isVerify
    })
  },
  // 按钮提交事件
  btnSubmit: function () {
    let that = this
    if (!that.data.inputVal) {
      let errorMsg = "昵称不能为空"
      topMsgTip.show.call(that, errorMsg, 1500)
      return
    }
    let url = app.api.modifyNickName
    let value = that.data.inputVal
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      Name: app.globalData.iyanyiUser.Name, // 用户名
      NickName: value, // 昵称
      IsMale: app.globalData.iyanyiUser.IsMale, // 性别
      BirthDate: app.globalData.iyanyiUser.BirthDate, // 出生日期
      HeadImageUrl: app.globalData.iyanyiUser.UserPic // 头像
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        app.globalData.iyanyiUser.NickName = value
        app.util.setPrePageData({
          nickName: value
        })
        app.util.commonViewTap('',99)
      },
      function (res) {  // 失败
        let errorMsg = res.response
        topMsgTip.show.call(that, errorMsg, 1500)
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
