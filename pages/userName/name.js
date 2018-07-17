const app = getApp()
var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  data: {
    buttonText: '完成修改',
    placeholder: '请输入姓名',
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
  renderInfo: function() {
    if (app.globalData.iyanyiUser.Name && app.globalData.iyanyiUser.Name !== '') {
      this.setData({
        inputVal: app.globalData.iyanyiUser.Name,
        isVerify: true
      })
    }
  },
  verifyUserName: function (e) {
    let that = this
    let errorMsg = ''
    let value = e.detail.value
    that.data.inputVal = value
    // 判断长度
    that.setData({
      inputVal: that.data.inputVal,
      isVerify: that.data.inputVal.length > 0
    })
  },
  // 按钮提交事件
  btnSubmit: function () {
    let that = this
    if (!that.data.inputVal) {
      let errorMsg = "姓名不能为空"
      topMsgTip.show.call(that, errorMsg, 1500)
      return
    }
    let url = app.api.modifyName
    let value = that.data.inputVal
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      Name: value, // 用户名
      NickName: app.globalData.iyanyiUser.NickName, // 昵称
      IsMale: app.globalData.iyanyiUser.IsMale, // 性别
      BirthDate: app.globalData.iyanyiUser.BirthDate, // 出生日期
      HeadImageUrl: app.globalData.iyanyiUser.UserPic // 头像
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        console.log(res)
        app.globalData.iyanyiUser.Name = value
        app.util.setPrePageData({
          name: value
        })
        app.util.commonViewTap('', 99)
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
