// component/IdealInputBox/IdealInputBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idealList: {
      type: Array,
      value: [],
      observer:'_initShowIdealList'
    },
    maxHeight: {
      type: String,
      value: '120rpx'
    },
    placeholder: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    initType:{
      type: String,
      value: 'all'
    },
    selectItem: {
      type: Object,
      value: {}
    },
    placeholderClass: {
      type: String,
      value: 'input-placeholder'
    },
    focus: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showIdealList: [],
    isFocus: false,
    maxLength:5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showIdealList: function(newValue) {
      console.log(newValue)
      var restaurants = this.data.idealList
      var results = newValue ?
        restaurants.filter(this.createFilter(newValue)) :
        restaurants
      this.setData({
        showIdealList: results
      })
    },
    _initShowIdealList: function (newValue,oldValue){
      if (this.data.initType === 'all'){
        this.setData({
          showIdealList: newValue
        })
      }
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.label.indexOf(queryString) >=
          0
        )
      }
    },
    idealItemTap: function(e) {
      let that = this
      let index = e.target.dataset.index
      let selectItem = this.data.showIdealList[index]
      this.setData({
        value: selectItem.label
      })
      this.setData({
        selectItem: selectItem
      })
      var params = {
        selectItem: selectItem,
        value: selectItem.label
      }
      setTimeout(function () {
        that.setData({
          isFocus: false
        })
      }, 30)
      this.triggerEvent('idealInput', params)
    },
    idealInput: function(e) {
      this.setValue(e.detail.value)
      this._showIdealList(e.detail.value)
      let param = { value: e.detail.value}
      this.triggerEvent('idealInput', param)
    },
    clickClear(e) {
      this.setValue('')
    },
    bindtap(e) {
      this.triggerEvent('tap', e.detail)
    },
    bindblur(e) {
      let that = this
      this.triggerEvent('blur', e.detail)
    },
    bindfocus(e) {
      this.setData({
        isFocus: true
      })
      this.triggerEvent('focus', e.detail)
    },
    setValue(val) {
      var oldVal = this.data.value
      if (val === oldVal) {
        return
      }
      this.setData({
        value: val
      })
      this.triggerEvent('input', {
        oldValue: oldVal,
        value: val
      })
    }
  }
})