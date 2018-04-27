const app=getApp()
const network = require("../../../utils/network.js")
const util=require("../../../utils/util.js")

/*var getLeaves = function (that,schday) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/getLeaves.do"
  var params = {}
  var header =  app.globalData.header
  var method = "POST"
  network.request(url, params, method, header).then((data) => {
    var leaves = []
    for (var i in data) {
      if(data[i].oneCozAndSch.schedule.schDay==schday){
      var leave = {}
      leave.signInRes = data[i]
      leave.siTime1 = util.formatArrayTime(data[i].siTime)
      if (data[i].siApprove == 0) {
        leave.leaveStatu = "待审核"
      } else if (data[i].siApprove == 1) {
        leave.leaveStatu = "已通过"
      } else if (data[i].siApprove == 2) {
        leave.leaveStatu = "已驳回"
      }
      leaves.push(leave)
    }
    }

    that.setData({
      leaves: leaves
    })
  })
}*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaves:[],
    coursename:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let temp = {}
    try {
      //console.log("传递过来的"+options.jsonString)
      temp = JSON.parse(options.jsonString)
    }
    catch (err) {
      temp = JSON.parse(options.jsonString + '"' + "}" + "]"+"}")
    }
    finally{
      //console.log("教师审核请假"+JSON.stringify(temp.leaves,undefined,'\t'))
      var xx=temp.leaves
      xx.forEach((item) => {
        item.siTime1 = util.formatArrayTime(item.siTime)
      })
      that.setData({
        leaves: xx,
        coursename: temp.coursename,
      })
    }
    

  },
  //查看详情
  checkLeave:function(e){
    let str = JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../TcheckLeave/TcheckLeave?jsonString='+str,
    })
  },
  /*
  //通过请假
  yesLeave: function (e) {
    wx.showModal({
      title: '提示',
      content: '审核通过该请假',
      success: function (res) {
        if (res.confirm) {
          var url = 'https://www.xsix103.cn/SignInSystem/Teacher/approveLeave.do'
          var method = "POST"
          var header = app.globalData.header
          console.log(e.currentTarget)
          var params = e.currentTarget.dataset.signinres

          network.request(url, params, method, header).then((data) => {
            if (data) {
              wx.showToast({
                title: '通过',
                icon: "success",
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '通过失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },
  //驳回请假
  noLeave: function (e) {
    wx.showModal({
      title: '提示',
      content: '驳回该请假',
      success: function (res) {
        if (res.confirm) {
          var url = 'https://www.xsix103.cn/SignInSystem/Teacher/rejectLeave.do'
          var method = "POST"
          var header =  app.globalData.header
          console.log(e.currentTarget)
          var params = e.currentTarget.dataset.signinres

          network.request(url, params, method, header).then((data) => {
            if (data) {
              wx.showToast({
                title: '驳回',
                icon: "success",
                duration: 1500
              })
            } else {
              wx.showToast({
                title: '驳回失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },
*/
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