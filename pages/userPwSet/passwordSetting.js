const app = getApp()
// var topMsgTip = require('../../component/TopMsgTip/TopMsgTip') //dialog提示
Page({
  data: {
    tips1: '当前密码',
    tips2: '新密码',
    tips3: '确认密码',
    placeholder1: '请输入手机号',
    placeholder2: '请输入验证码',
    codeText: '获取验证码',
    buttonText: '完成修改',
    iconTips: 'icon图标',
    oldPw: '',
    pwText1: '',
    pwText2: '',
    pw1Show: true,
    pw2Show: true,
    pw3Show: true,
    pw1Verify: false,
    pw2Verify: false,
    pw3Verify: false,
    isFirstReg: false, // 是否第一次
    primarySize: 60,
    isVerify: false,
  },
  onLoad(options){
    this.setData({
      isFirstReg: app.globalData.iyanyiUser.IsFirstPasswordChange
    })
  },
  // 校验当前密码
  inputCurrentPw (e) {
    this.setData({
      oldPw: e.detail.value
    })
  },
  inputNewPw (e) {
    this.setData({
      pwText1: e.detail.value
    })
  },
  inputConfirmNewPw (e) {
    this.setData({
      pwText2: e.detail.value
    })
  },
  verifyCurrentPw: function (e) {
    /**
     * 当前密码不进行格式检查
     */
    this.setData({
      pw1Verify: !!this.data.oldPw
    })
    // let that = this
    // let errorMsg = ''
    // let value = e.detail.value
    // that.setData({
    //   oldPw: value
    // })
    // if (!value) {
    //   errorMsg = '请输入当前密码'
    //   that.setData({
    //     pw1Verify: false
    //   })
    //   that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    // } else if (value.length < 6 || value.length > 16) {
    //   errorMsg = '请输入6-16位字符'
    //   that.setData({
    //     pw1Verify: false
    //   })
    //   that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    // } else {
    //   let sum = 0
    //   // 匹配数字
    //   if (/[0-9]/.test(value)) {
    //     sum++
    //   }
    //   // 匹配字母
    //   if (/[a-zA-Z]/.test(value)) {
    //     sum++
    //   }
    //   // 匹配特殊字符(正则不成功，改用遍历字符串)
    //   let regStr = '!@#$%^&*()_+-='
    //   for (var i = 0; i < regStr.length; i++) {
    //     if (value.indexOf(regStr[i]) !== -1) {
    //       sum++
    //     }
    //   }
    //   if (sum >= 2) {
    //     that.setData({
    //       pw1Verify: true
    //     })
    //   } else {
    //     errorMsg = '密码包含数字、字母、特殊字符(!@#$%^&*()_+-=)至少两种组合'
    //     that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    //     that.setData({
    //       pw1Verify: false
    //     })
    //   }
    // }
  },
  // 校验新密码
  verifyNewPw: function (e) {
    let that = this
    let errorMsg = ''
    let value = e.detail.value
    this.setData({
      pwText1: value
    })
    if (!value) {
      errorMsg = '请输入新密码'
      that.setData({
        pw2Verify: false
      })
      that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    } else if (value.length < 6 || value.length > 16) {
      errorMsg = '新密码请输入6-16位字符'
      that.setData({
        pw2Verify: false
      })
      that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    } else {
      let sum = 0
      // 匹配数字
      if (/[0-9]/.test(value)) {
        sum++
      }
      // 匹配字母
      if (/[a-zA-Z]/.test(value)) {
        sum++
      }
      // 匹配特殊字符(正则不成功，改用遍历字符串)
      let regStr = '!@#$%^&*()_+-='
      for (var i = 0; i < regStr.length; i++) {
        if (value.indexOf(regStr[i]) !== -1) {
          sum++
        }
      }
      if (sum >= 2) {
        if (/[^0-9a-zA-Z!@#$%^&*()_+=-]/.test(value)) {
          errorMsg = '特殊字符限定 !@#$%^&*()_+-='
          that.selectComponent("#topMsgTips").show(errorMsg, 1500)
          that.setData({
            pw2Verify: false
          })
        } else {
          that.setData({
            pw2Verify: true
          })
        }
      } else {
        errorMsg = '须包含字母、数字、特殊字符至少两种组合'
        that.selectComponent("#topMsgTips").show(errorMsg, 1500)
        that.setData({
          pw2Verify: false
        })
      }
    }
  },
  // 确认新密码
  verifyConfirmNewPw: function (e) {
    let that = this
    let errorMsg = ''
    let value = e.detail.value
    this.setData({
      pwText2: value
    })
    if (!value) {
      errorMsg = '请输入确认密码'
      that.setData({
        pw3Verify: false
      })
      that.selectComponent("#topMsgTips").show(errorMsg, 1500)
    } else {
      if (this.data.pwText2 === this.data.pwText1) {
        that.setData({
          pw3Verify: true
        })
      } else {
        errorMsg = '两次密码输入不一致'
        that.setData({
          pw3Verify: false
        })
        that.selectComponent("#topMsgTips").show(errorMsg, 1500)
      }
    }
  },
  // 改变眼睛色彩
  changeEye: function(e) {
    let typeno = e.currentTarget.dataset.typeno
    let that = this
    if (typeno == 1) {
      if (!that.data.oldPw) return
      if (that.data.pw1Show) {
        that.setData({
          pw1Show: false
        })
      } else {
        that.setData({
          pw1Show: true
        })
      }
    }
    if (typeno == 2) {
      if (!that.data.pwText1) return
      if (that.data.pw2Show) {
        that.setData({
          pw2Show: false
        })
      } else {
        that.setData({
          pw2Show: true
        })
      }
    }
    if (typeno == 3) {
      if (!that.data.pwText2) return
      if (that.data.pw3Show) {
        that.setData({
          pw3Show: false
        })
      } else {
        that.setData({
          pw3Show: true
        })
      }
    }
  },
  // 按钮提交事件
  btnSubmit: function () {
    let that = this
    if (!that.data.isFirstReg) {
      that.verifyCurrentPw({ detail: { value: that.data.oldPw } })
      if (!that.data.pw1Verify) return
    }
    
    that.verifyNewPw({ detail: { value: that.data.pwText1 } })
    if (!that.data.pw2Verify) return
    that.verifyConfirmNewPw({ detail: { value: that.data.pwText2 } })
    if (!that.data.pw3Verify) return
    let url = app.api.modifyPassword
    let params = {
      UserId: app.globalData.iyanyiUser.UserId, // 用户主键
      OldPassword: that.data.oldPw, // 老密码
      NewPassword: that.data.pwText1 // 新密码
    }
    app.util.postData.call(that, url, params, 'POST',
      function (res) {  // 成功
        app.globalData.iyanyiUser.IsFirstPasswordChange = false
        app.util.commonViewTap('',99)
      },
      function (res) {  // 失败
        if (res.statusCode === 523) {
          let errorMsg = '原密码输入不正确'
          that.selectComponent("#topMsgTips").show(errorMsg, 1500)
        } else {
          let errorMsg = res.message || '未知错误'
          that.selectComponent("#topMsgTips").show(errorMsg, 1500)
        }
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
