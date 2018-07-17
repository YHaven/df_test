// component/TopSearch/TopSearch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: ''
    },
    btnName: {
      type: String,
      value: '搜索'
    },
    value: {
      type: String,
      value: ''
    },
    focus: {
      type: Boolean,
      value: false
    },
    confirmType:{
      type: String,
      value: 'done'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    search () {
      this.triggerEvent('search', {value: this.data.value})
    },
    bindchange (e) {
      this.data.value = e.detail.value
      this.triggerEvent('change', { value: e.detail.value })
    },
    bindconfirm (e) {
      this.triggerEvent('confirm', e.detail)
    }
    // bindinput (e) {
    //   this.setData({
    //     value: e.detail.value
    //   })
    // }
  },
  externalClasses: ['btn-class'],
})
