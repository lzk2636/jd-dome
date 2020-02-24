import http from '../../utils/http'
import bigJson from 'json-bigint'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    artId: null,
    newDatails: null,
    isOffset: false,
    allComment: [],
    end_id: null,
    last_id: null,
    total_count: 0,
    // 评论回复
    bIsRecomment: false,
    // 评论列表==>上的object
    RecommentList: [],
    //本条评论所有的回复
    aRecommentList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options, "artId")
    this.data.artId = options.id
    this.currentData()
    this.commentList()
  },
  async currentData() {
    const res = await http({
      url: `articles/${this.data.artId}`
    })
    if (res.statusCode === 200) {
      this.setData({
        newDatails: res.data.data
      })
    } else if (res.statusCode === 401) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
  },
  async commentList() {
    if (!this.data.isOffset) {
      const res = await http({
        url: "/comments",
        data: {
          type: 'a',
          source: this.data.artId,
          limit: 10
        },
        dataType: "text"
      })
      // console.log(res)
      res.data = bigJson.parse(res.data)
      // this.data.total_count=res.data.data.total_count
      this.data.end_id = res.data.data.end_id
      this.data.last_id = res.data.data.last_id
      this.setData({
        allComment: res.data.data.results,
        total_count: res.data.data.total_count
      })
    }

    this.data.isOffset = true
  },
  async addMoreComment() {
    if (this.data.last_id === null) {
      wx.showToast({
        title: '暂无数据加载中........',
      })
      return
    }
    const res = await http({
      url: "comments",
      data: {
        type: 'a',
        source: this.data.artId,
        limit: 10,
        offset: this.data.last_id
      },
      dataType: 'text'
    })
    res.data = bigJson.parse(res.data)
    if (res.statusCode === 200) {
      this.data.allComment = [...this.data.allComment, ...res.data.data.results]
      this.data.last_id = res.data.data.last_id

      this.setData({
        allComment: this.data.allComment
      })
    }
  },

  // 关注用户
  async follow() {
    if (!this.data.newDatails.is_followed) {
      const res = await http({
        url: "user/followings",
        method: "POST",
        data: {
          target: this.data.newDatails.aut_id
        }
      })
      if (res.statusCode === 201) {
        this.data.newDatails.is_followed = true
        this.setData({
          newDatails: this.data.newDatails
        })
        wx.showToast({
          title: '关注成功',
        })
      }
    } else {
      const res = await http({
        url: `user/followings/${this.data.newDatails.aut_id}`,
        method: "DELETE",
      })
      if (res.statusCode === 204) {
        wx.showToast({
          title: '取消关注成功',
        })
        this.data.newDatails.is_followed = false
        this.setData({
          newDatails: this.data.newDatails
        })
      }
    }

  },
  // 不喜欢文章
  async unliking() {
    const attitude = this.data.newDatails.attitude

    if (attitude === -1 || attitude === 1) {
      const res = await http({
        url: "article/dislikes",
        method: "POST",
        data: {
          target: this.data.artId
        }
      })
      if (res.statusCode === 201) {
        this.data.newDatails.attitude = 0
        this.setData({
          newDatails: this.data.newDatails
        })
      }
      return
    }
    const res = await http({
      url: `article/dislikes/${+this.data.artId}`,
      method: "DELETE"
    })
    if (res.statusCode === 204) {
      this.data.newDatails.attitude = -1
      this.setData({
        newDatails: this.data.newDatails
      })
    }

  },
  // 对文章点赞
  async liking() {
    const attitude = this.data.newDatails.attitude
    if (attitude === -1 || attitude === 0) {
      const res = await http({
        url: "article/likings",
        method: "POST",
        data: {
          target: this.data.artId
        }
      })
      if (res.statusCode === 201) {
        this.data.newDatails.attitude = 1
        this.setData({
          newDatails: this.data.newDatails
        })
      }
      return
    }
    const res = await http({
      url: `article/likings/${+this.data.artId}`,
      method: "DELETE"
    })
    if (res.statusCode === 204) {
      this.data.newDatails.attitude = -1
      this.setData({
        newDatails: this.data.newDatails
      })
    }


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
    this.addMoreComment()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  share() {
    // console.log('dsdsds')
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
  async comment(e) {
   if(e.detail.trim().length===0){
     wx.showToast({
       title: '输入内容不能为空',
       icon:"none"
     })
     return
   }
    const res = await http({
      url: "comments",
      method: "POST",
      data: {
        target: this.data.artId,
        content: e.detail
      },
      dataType: 'text'
    })
    res.data = bigJson.parse(res.data)
    if (res.statusCode === 201) {
      // console.log(res)
      this.data.allComment.unshift(res.data.data.new_obj)
      this.setData({
        allComment: this.data.allComment,
        total_count: this.data.total_count + 1
      })

    }
  },
  // 收藏事件
  isCollect(e) {
    // console.log(e)
    this.data.newDatails.is_collected = e.detail
    this.setData({
      newDatails: this.data.newDatails
    })
  },
  // 评论列表获取 ===>获取评论的回复和第一个对象
  Recomment(e) {
    // console.log(e)
    this.data.RecommentList = []
    this.data.RecommentList.push(e.detail)
    this.setData({
      RecommentList: this.data.RecommentList,
      bIsRecomment: e.detail.isTure
    })
    this.getRecomment()
  },
  async getRecomment() {
    let commId = this.data.RecommentList[0].com_id
    commId = commId.c && commId.c.join("")
    commId = commId === undefined ? this.data.RecommentList[0].com_id : commId
    const res = await http({
      url: "comments",
      data: {
        type: 'c',
        source: commId,
        limit: 50
      }

    })
    // console.log(res)
    if (res.statusCode === 200) {
      this.data.aRecommentList = res.data.data.results
      this.setData({
        aRecommentList: this.data.aRecommentList
      })
    }

  },
  // 评论回复事件
  async RecommentConfirm(e) {
    let {
      commId,
      artId
    } = {
      commId: this.data.RecommentList[0].com_id,
      artId: this.data.artId
    }
    commId = commId.c && commId.c.join("")
    const res = await http({
      url: "comments",
      method: "POST",
      data: {
        target: commId,
        content: e.detail,
        art_id: artId
      },
      dataType: 'text'
    })
    res.data = bigJson.parse(res.data)
    // console.log(res)
    if (res.statusCode === 201) {
      // console.log(res.data.data.new_obj)
      this.data.aRecommentList.unshift(res.data.data.new_obj)
      const index = this.data.allComment.findIndex(item => {
        return item.com_id == commId
      })
      console.log('index',index)

      this.data.allComment[index].reply_count += 1;
      this.setData({
        aRecommentList: this.data.aRecommentList,
        allComment:this.data.allComment
      })
    }



  },
  hidenReCmment() {
    this.setData({
      bIsRecomment: false
    })
  }
})