var app = getApp()
// component/DafengInput/DafengInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入...'
    },
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    placeholderClass: {
      type: String,
      value: 'input-placeholder'
    },
    focus: {
      type: Boolean,
      value: false
    },
    iconType: {
      type: String,
      value: ''
    },
    maxlength: {
      type: Number,
      value: -1
    },
    confirmType: {
      type: String,
      value: 'done'
    }
  },
  externalClasses: ['class'],
  /**
   * 组件的初始数据
   */
  data: {
    isClear: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindinput(e){
      console.log('bindinput')
      this.setValue(e.detail.value)
    },
    clickClear (e) {
      console.log('clickClear')
      this.data.isClear = true
      this.setValue('', true)
      setTimeout(() => this.data.isClear = false, 200)
    },
    bindtap (e) {
      this.triggerEvent('tap', e.detail)
    },
    bindblur(e) {
      if (!this.data.isClear)
        this.triggerEvent('blur', e.detail)
    },
    bindfocus(e) {
      this.triggerEvent('focus', e.detail)
    },
    bindconfirm (e) {
      this.triggerEvent('confirm', e.detail)
    },
    setValue(val, isClear) {
      var oldVal = this.data.value
      if (val === '' && oldVal.length > 1 && !isClear) return
      if (val === oldVal) {
        return
      }
      this.setData({
        value: val
      })
      this.triggerEvent('input', { oldValue: oldVal, value: val })
    }
  }
})
