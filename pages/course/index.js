import http from "../../utils/http"
const app = getApp()
// pages/course/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCancel: false,
    value: '',
    timer: null,
    keyword: '',
    searchReust: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.history()
  },
  history() {
    const history = wx.getStorageSync('searchResult')
    this.setData({
      historyList: history
    })
  },

  onSearch() {
    console.log(54545454, 'onSearch')
  },
  onCancel() {
    this.setData({
      isCancel: false
    })
    console.log('------', 'onCancel')
  },
  focus() {
    this.setData({
      isCancel: true
    })
  },
  imputValue(e) {
    clearTimeout(this.data.timer)
    this.data.timer = setTimeout(async () => {
      // console.log(e.detail)
      this.data.keyword = e.detail
      if (this.data.keyword.trim().length != 0) {
        const res = await http({
          url: "suggestion",
          data: {
            q: this.data.keyword
          }
        })
        // console.log(res)
        if (res.statusCode === 200) {
          // comsole.log(res,22)
          this.setData({
            searchReust: res.data.data.options
          })
        }
      }
    }, 1000)
  },
  // 删除过滤
  delete(e) {
    console.log(e.target.dataset.index)
    this.data.searchReust.splice(e.target.dataset.index, 1)
    this.setData({
      searchReust: this.data.searchReust
    })
  },
  // 点击内容
  async searchtap(e) {
    // console.log(e)
    let item = this.data.searchReust[e.target.dataset.index]
    let dataList = wx.getStorageSync('searchResult') || []
    dataList.unshift(item)
    dataList=[...new Set(dataList)]
    wx.setStorageSync('searchResult', dataList)
    wx.switchTab({
      url: '/pages/study/index?keyword=',
    })
    app.globalData.keyword = item
  },
  onHide() {
    console.log('--hide--')
    this.setData({
      searchReust: [],
      value: '',
      isCancel: false
    })
  },
  toResult(e){
    // console.log(e)
    app.globalData.keyword=e.target.dataset.result
    wx.switchTab({
      url: '/pages/study/index',
    })
  }

})