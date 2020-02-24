import http from "../../utils/http"
const Dates = require('../../utils/util')
// pages/userEdit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isEdit: false,
    isShowAction: false,
    actions: [{
      name: "男"
    }, {
      name: "女"
    }],
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.currentData()
    this.currentOtherData()
  },
  async currentData() {
    let res = await http({
      url: "user"
    })
    if (res.statusCode === 200) {
      this.setData({
        userInfo: res.data.data
      })
    }
  },
  async currentOtherData() {
    const res = await http({
      url: "user/profile"
    })
    if (res.statusCode === 200) {
      this.data.userInfo = {
        ...this.data.userInfo,
        ...res.data.data
      }
      this.setData({
        userInfo: this.data.userInfo
      })
    }
  },
  openShowPop() {
    this.setData({
      isEdit: true
    })
  },
  closePop() {
    this.setData({
      isEdit: false
    })
  },
  onChange(e) {
    console.log(e)
    if (e.target.dataset.name) {
      this.data.userInfo['name'] = e.detail
      this.setData({
        userInfo: this.data.userInfo
      })
    } else {
      this.data.userInfo['intro'] = e.detail
      this.setData({
        userInfo: this.data.userInfo
      })
    }
    // console.log(e.detail)
  },
  openAction() {
    this.setData({
      isShowAction: true
    })
  },
  onSelect(e) {
    // console.log(e)
    if (e.detail.name.includes("男")) {
      this.data.userInfo.gender = 0
      this.setData({
        userInfo: this.data.userInfo
      })
    } else {
      this.data.userInfo.gender = 1
      this.setData({
        userInfo: this.data.userInfo
      })
    }
  },
  onClose() {
    this.setData({
      isShowAction: false
    });
  },
  onInput(event) {
    // console.log(Dates.formatTime( event.detail).join("-"))
    this.data.currentDate = Dates.formatTime(event.detail)
    this.data.userInfo.birthday=Dates.formatTime(event.detail)
    this.setData({
      currentDate: this.data.currentDate,
      userInfo:this.data.userInfo
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})