// component/TopMsgTips/TopMsgTips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: String,
      value: '',
      // observer: '_showTips'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    duration: 1500,
    errorMsg: '',
    noShowing: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showTips: function(newValue, oldValue) {
      console.log(newValue)
      this.show(newValue, this.data.duration)
    },
    show: function(errorMsg, duration, errorIcon) {
      var that = this
      that.setData({
        errorMsg: errorMsg,
        errorIcon: errorIcon ? errorIcon : '',
      })
      if (that.data.noShowing) {

        var animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        that.animation = animation

        animation.opacity(1, 0).translateY(35).step()

        that.setData({
          noShowing: false,
          animationData: animation.export()
        })

        if (typeof duration !== 'undefined') {
          setTimeout(function () {
            that.hide()
          }, duration)
        }
      }
    },
    hide: function() {
      var that = this
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      that.animation = animation
      animation.opacity(0, 1).translateY(-35).step()
      that.setData({
        // errorMsg: '',
        noShowing: true,
        animationData: animation.export()
      })
    }
  }
})