// component/richTextViewer/richTextViewer.js
var WxParse = require('../wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: {
      type: String,
      value: 'default'
    },
    // 是否展开
    isExpand: {
      type: Boolean,
      value: false
    },
    // 富文本信息
    richInfo: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
    let info = this.data.richInfo
    if (!info) {
      info = '<div></div>'
    }
    WxParse.wxParse('formatInfo', 'html', info, this, 0);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 显示或隐藏富文本
   */
    showRichText: function () {
      this.setData({
        isExpand: !this.data.isExpand
      })
    }
  }
})
