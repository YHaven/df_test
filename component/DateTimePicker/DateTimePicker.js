// component/DateTimePicker/DateTimePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: 'selector'
    },
    range: {
      type: Array,
      value: []
    },
    rangeKey: {
      type: String
    },
    value: {
      type: String,
      value: "0"
    },
    disabled: {
      type: Boolean,
      value: false
    },
    start: String,
    end: String,
    fields: {
      type: String,
      value: 'day'
    },
    customItem: String
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
    bindchange (e) {
      this.triggerEvent('change', e)
    },
    bindcancel(e) {
      this.triggerEvent('cancel', e)
    },
    bindcolumnchange(e) {
      this.triggerEvent('columnchange', e)
    }
  }
})
