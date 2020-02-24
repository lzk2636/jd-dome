// pages/home/index.js
import http from '../../utils/http.js'
import bigJson from 'json-bigint'
const app = getApp()
let isToken = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    channels: [],
    show: false,
    artId: null,
    autId: null,
    isFrist: 1,
    bIsShow: false
  },
  // 点击切换 频道
  onChange(event) {
    this.data.active = event.detail.name


    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none'
    });
    this.getDataChannel(this.data.channels[this.data.active].id, this.data.active)
  },

  // 获取频道数据
  async getDataChannel(id, index) {
    const res = await http({
      url: "http://ttapi.research.itcast.cn/app/v1_1/articles",
      data: {
        channel_id: id,
        timestamp: Date.now(),
        with_top: 0
      },
      isToken,
      isOne: true,
      dataType: 'text'
    })
    // console.log(res)
    res.data = bigJson.parse(res.data)
    if (res.statusCode === 200) {
      if (res.data.data.results.length === 0) {
        wx.showToast({
          title: '已经没有数据加载',
        })
        return
      }
      this.data.channels[index].list = [...this.data.channels[index].list, ...res.data.data.results]
      this.setData({
        channels: this.data.channels
      })

    }

  },
  onLoad: function (options) {
    this.currentData()
    // console.log(bigJson.parse(bigJson.stringify('{ixon:1226025931663999687},name:"6555"}')))
  },
  async currentData() {
    if (app.globalData.userInfo === null) {
      isToken = false
    } else {
      isToken = true
    }
    let res = await http({
      url: "user/channels",
      isToken
    })
    // console.log(res)
    if (res.statusCode === 200) {
      this.setData({
        channels: res.data.data.channels
      })
      // this.channels=res.data.data.channels

      this.data.channels.forEach(element => {
        element.list = []
      });

      this.getDataChannel(this.data.channels[this.data.active].id, this.data.active)
    }
  },
  // 不感兴趣---反馈垃圾内容---拉黑作者
  onClose() {
    this.setData({
      show: false
    });
  },
  feedback(e) {
    console.log(e)
    let artId = ""
    let autId = ""
    e.target.dataset.artid.c && e.target.dataset.artid.c.forEach(element => {
      console.log('5555')
      artId = artId + element
    })
    e.target.dataset.autid.c && e.target.dataset.autid.c.forEach(element => {
      autId += element
    })
    this.data.artId = artId.trim().length === 0 ? e.target.dataset.artid : artId
    this.data.autId = autId.trim().length === 0 ? e.target.dataset.autid : autId
    // console.log('..............', this.data.autId)
    this.setData({
      show: true
    })
  },
  async dislike() {

    const res = await http({
      url: 'article/dislikes',
      method: "POST",
      data: {
        target: this.data.artId
      }
    })
    if (res.statusCode === 201) {
      wx.showToast({
        title: '删除成功',
      })
      const index = this.data.channels[this.data.active].list.findIndex(element => {
        return element.art_id == this.data.artId
      })
      // console.log(index)
      this.data.channels[this.data.active].list.splice(index, 1)
      this.setData({
        show: false,
        channels: this.data.channels
      })
    } else if (res.statusCode === 401) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    // console.log(res)
  },
  // article/reports 举报内容
  backTo() {
    this.setData({
      isFrist: 1
    })
  },
  reports() {
    this.setData({
      isFrist: 2
    })
    // const res = await http({
    //   url:"article/reports"
    // })
  },
  // 举报问题 
  async reportsRequest(e) {
    const res = await http({
      url: "article/reports",
      method: "POST",
      data: {
        type: +e.target.dataset.prosid,
        target: this.data.artId
      }
    })
    // console.log(res)
    if (res.statusCode === 201) {
      wx.showToast({
        title: '举报成功',
      })
      this.setData({
        show: false,
        isFrist: 1
      })
    } else if (res.statusCode === 401) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

  },
  // 拉黑用户 user/blacklists
  async blackUser() {
    const res = await http({
      url: "user/blacklists",
      method: "POST",
      data: {
        target: this.data.autId
      }
    })
    if (res.statusCode === 201) {
      wx.showToast({
        title: '拉黑用户成功',
      })
      this.setData({
        show: false
      })
    } else if (res.statusCode === 401) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },


  onPullDownRefresh: function () {
    this.data.channels[this.data.active].list = []
    this.getDataChannel(this.data.channels[this.data.active].id, this.data.active)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataChannel(this.data.channels[this.data.active].id, this.data.active)
  },
  channelShow() {
    this.setData({
      bIsShow: true
    })
  },
  super(e) {
    this.setData({
      channels: e.detail
    })
  },
  todetail(e) {
    console.log(e)
    let art_id = ""
    art_id = e.currentTarget.dataset.artid.c && e.currentTarget.dataset.artid.c.join("")
    console.log(art_id)
    art_id = art_id ===undefined ? e.currentTarget.dataset.artid : art_id
    wx.navigateTo({
      url: '/pages/course-detail/index?id=' + art_id,
    })
  }



})