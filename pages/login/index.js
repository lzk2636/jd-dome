// pages/login/index.js
import http from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'15102045416',
    code:''
  },

  onChange(event) {
    this.setData({
      [event.target.dataset.value]:event.detail
    })
  },
  async login(){
    const mobileReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if(!mobileReg.test(this.data.mobile)){
      wx.showToast({
        title: '手机号不匹配',
        icon:'none'
      })
      return
    }
    const res = await http({
      url:'authorizations',
      method:"POST",
      data:{
        mobile:this.data.mobile,
        code:this.data.code
      }
    })
    console.log(res)
    if(res.statusCode===201){
      wx.setStorageSync('my_token', res.data.data)
      wx.setStorageSync('my_tokenTime', Date.now())
      wx.reLaunch({
        url: '/pages/home/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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