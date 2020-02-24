//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    //换取新token
    var tokentime = wx.getStorageSync('my_tokenTime'); //过期时间
    let newTime = Date.parse(new Date()); // 当前时间
  
    const userInfo = wx.getStorageSync('my_token')
    if (newTime - tokentime >= 2 * 60 * 60 * 1000) {
      wx.request({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: "PUT",
        header: {
          'Authorization': `Bearer ${userInfo.refresh_token}`
        },
        success: res => {
          console.log('token-----',res)
          if(res.statusCode===201){
            this.globalData.userInfo.token =res.data.data.token
            //  wx.reLaunch({
            //    url: '/pages/home/index',
            //  })
          }else if(res.statusCode===403){
            // wx.navigateTo({
            //   url: '/pages/login/index',
            // })
          }
      
        },
      })

    }

    if (userInfo.token) {
      this.globalData.userInfo = userInfo
       wx.reLaunch({
         url: '/pages/home/index',
       })
    }

  },
  globalData: {
    userInfo: null,
    keyword: ''
  }
})