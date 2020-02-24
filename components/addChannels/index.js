import http from '../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showChannel: {
      type: Boolean,
      value: false
    },
    channel: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bIsEdit: false,
    aOtherChannels: [],
    bIsHide: true
  },
  ready() {
    this.courrent()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async courrent() {
      const res = await http({
        url: "channels"
      })
      if (res.statusCode === 200) {
        let channels = res.data.data.channels
        let my = this.data.channel
        let newChannels = channels.filter(item => {
          for (let i = 0; i < my.length; i++) {
            if (my[i].id === item.id) {
              return false
            }
          }
          return true

        })
        // console.log(newChannels)
        this.setData({
          aOtherChannels: newChannels
        })

      }
    },

    finish() {
      // this.data.bIsHide=true
      this.setData({
        bIsHide: false,
        bIsEdit: false
      })
    },
    editContent() {
      this.setData({
        bIsHide: true,
        bIsEdit: true
      })
    },
    async clearMyChannel(e) {
      // console.log(e)
      // 上面的
      let channelId = e.target.dataset.id
      const index = this.data.channel.findIndex(item => {
        return item.id === channelId
      })
      const item = this.data.channel[index]
      this.data.aOtherChannels.push(item)
      this.data.channel.splice(index, 1)
      this.setData({
        channel: this.data.channel,
        aOtherChannels: this.data.aOtherChannels
      })
      // 发情网络请求
      
      let channel = this.data.channel
      const getChannel = channel.slice(1).map(item => {
        return {
          id: item.id,
          seq: item.id
        }
      })
      // console.log(getChannel)
      const res =await http({
          url:"user/channels",
          method:"PUT",
          data:{
            channels:getChannel
          }
      })
      if(res.statusCode===201){
        wx.showToast({
          title: '删除频道成功',
        })
        this.triggerEvent('super',this.data.channel)
      }
    },
    async addMyChannel(e) {
      //  console.log(e)
      this.data.channel.push({...e.target.dataset.item,list:[]})
      const index = this.data.aOtherChannels.findIndex(item => item.id === e.target.dataset.item.id)
      this.data.aOtherChannels.splice(index, 1)
      this.setData({
        channel: this.data.channel,
        aOtherChannels: this.data.aOtherChannels
      })
      let channel = this.data.channel
      const getChannel = channel.slice(1).map(item => {
        return {
          id: item.id,
          seq: item.id
        }
      })
      // console.log(getChannel)
      const res =await http({
          url:"user/channels",
          method:"PUT",
          data:{
            channels:getChannel
          }
      })
      if(res.statusCode===201){
        wx.showToast({
          title: '添加频道列表成功',
        })
        this.triggerEvent('super',this.data.channel)
      }

    },
    hiddenShow(){
        this.setData({
          showChannel:false
        })
    }
  }
})