import http from '../../utils/http'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    page: 1,
    per_page: 8,
    searchResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.keyword = app.globalData.keyword
    this.currentData()
  },

  async currentData() {
    if (this.data.keyword.trim().length===0) {
      wx.showToast({
        title: '没有数据加载,请返回搜索页面.....',
        icon:'none'
      })
      return
    }
      
    const res = await http({
      url: "search",
      data: {
        page: this.data.page,
        // per_page:this.data.per_page,
        q: this.data.keyword
      }
    })
    if (res.statusCode === 401) {
      wx.navigateTo({
        url: '/pages/login/index',
      })

    } else if (res.statusCode == 200) {
      this.data.searchResult = [...this.data.searchResult, ...res.data.data.results]
      this.setData({
        searchResult: this.data.searchResult
      })
      if (res.data.data.results.length === 0){
        wx.showToast({
          title: '没有数据加载......',
          icon:"none",
          duration:3000
        })
        return
      }
    }
    this.data.page++;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('--bottom--')
    this.currentData()
  },
  onHide() {
    this.setData({
      searchResult: [],
      page: 1
    })
  },
  // 文章详细页面
  toDetails(e){
    console.log(e)
    const id=e.currentTarget.dataset.artid
    console.log(id)
    wx.navigateTo({
      url: '/pages/course-detail/index?id='+id,
    })
  }

})