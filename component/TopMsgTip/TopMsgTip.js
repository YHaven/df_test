module.exports = {
  show: function (errorMsg, duration, errorIcon) {
    var that = this
    that.setData({
      errorMsg: errorMsg,
      errorIcon: errorIcon ? errorIcon: '',
    })

    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation

    animation.opacity(1, 0).translateY(35).step()

    that.setData({
      animationData: animation.export()
    })

    if (typeof duration !== 'undefined') {
      setTimeout(function () {
        animation.opacity(0, 1).translateY(-35).step()
        that.setData({
          // errorMsg: '',
          animationData: animation.export()
        })
      }, duration)
    }
  },
  hide: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.opacity(0, 1).translateY(-35).step()
    that.setData({
      // errorMsg: '',
      animationData: animation.export()
    })
  }
}