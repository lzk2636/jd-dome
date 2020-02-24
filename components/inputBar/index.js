// components/inputBar/index.js
import http from '../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentLength: {
      type: Number
    },
    artId: {
      type: Number,
      value: 0
    },
    is_collected: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''

  },

  /**
   * 组件的方法列表
   */
  methods: {
    shareNews() {
      this.triggerEvent('share')
    },
    confirm(e) {
      // console.log(e)
      this.triggerEvent('RecommentConfirm',e.detail.value)
      this.triggerEvent('comment', e.detail.value)
      this.setData({
        value: ""
      })

    },
    async collect() {
      if (!this.data.is_collected) {
        // console.log('----this.data.is_collected-----')
        const res = await http({
          url: "article/collections",
          method: "POST",
          data: {
            target: this.data.artId
          }
        })
        // console.log(res)
        if (res.statusCode === 201) {
          this.triggerEvent('collect', true)
          wx.showToast({
            title: '收藏成功',
            icon:"none"
          })
        }
        return
      }
      const res = await http({
        url: `article/collections/${+this.data.artId}`,
        method:"DELETE"
      })
      if(res.statusCode===204){
        // console.log('----this.data.is_collected--false---')
        this.triggerEvent('collect',false)
        wx.showToast({
          title: '取消收藏成功',
          icon:"none"
        })
      }


    }

  }
})