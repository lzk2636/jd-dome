import BASE from './base.js'
const http=({url,method='GET',isToken=true,header={},tips="数据加载中....",data,isOne=false,dataType='json'})=>{
  let app=getApp()
  wx.showLoading({
    title: tips
  })
 
  if(!isOne){
    url=`${BASE}${url}`
  }
  
  if(isToken){
    if (app.globalData.userInfo && app.globalData.userInfo.token) {
      // console.log(app.globalData.userInfo.token)
      header.Authorization = `Bearer ${app.globalData.userInfo.token}`
    } else {
      const value = wx.getStorageSync('my_token');
      app.globalData.userInfo = value
      header.Authorization = `Bearer ${app.globalData.userInfo.token}`
  
    }
  }
  // console.log(url)
  
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      header,
      data,
      dataType,
      success: res => {
        resolve(res)
      },
      fail: fail => {
        reject(fail)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  })
}
export default http