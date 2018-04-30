const app=getApp()
const util=require('../../../utils/util.js')
const network=require('../../../utils/network.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: '2018-10-08',
    tempFilePaths:"",
    schWeek:1,
    courseName:"",
    signInRes:{},
    ifyes:false,
    ifno:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let leave={}
    console.log(options)
    try{
      leave = JSON.parse(options.jsonString)
    }
    catch (err){
      leave = JSON.parse(options.jsonString + '"' + "}" + "}")
    }
    finally{
      console.log(leave.signinres)
      var temp = util.formatArrayTime(leave.signinres.siTime)
      var dates = temp.split(' ')[0]
      var ifyes
      var ifno
      var leaveStatu
      if(leave.signinres.siApprove==0){
        ifyes=false
        ifno=false
      
      } else if (leave.signinres.siApprove == 1){
        ifyes=true
        ifno=false
   
      } else if (leave.signinres.siApprove == 2){
        ifyes=false
        ifno=true
   
      }
      that.setData({
        dates: dates,
        signInRes: leave.signinres,
        courseName: leave.coursename,
        schWeek: leave.signinres.siWeek,
        tempFilePaths: 'data:image/png;base64,' + leave.signinres.siVoucher,
        siId:leave.siId,
        ifyes:ifyes,
        ifno:ifno
      })
    }
    
    

  },
  //预览图片
  previewImage: function (e) {
    var that = this;
    //console.log(that.data.tempFilePaths)
    wx.previewImage({
      urls: [that.data.tempFilePaths],

    })
  },
  //通过请假
  yesLeave: function (e) {
    var that=this
    var siId=e.currentTarget.dataset.siid
    wx.showModal({
      title: '提示',
      content: '审核通过该请假',
      success: function (res) {
        if (res.confirm) {
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/approveLeave.do'
          var method = "POST"
          var header = {
            "Access-Token":app.globalData.header['Access-Token'],
            'content-type': 'application/json;charset=UTF-8'
          }
          var y = that.data.signInRes
          var params = { "siId": y.siId, "student": y.student, "oneCozAndSch": y.oneCozAndSch, "siTime": y.siTime, "siWeek": y.siWeek, "siLeave": y.siLeave, "siApprove": y.siApprove } 
          network.request(url, params, method, header).then((data) => {
            if (data==true) {
              wx.showToast({
                title: '通过',
                icon: "success",
                duration: 1500
              })
              /*
              var pages=getCurrentPages()
              var prePage=pages[pages.length-2]
              var index=util.getIndex(prePage.leaveDataList,'id',siId)
              var leaveDataList=prePage.data.leaveDataList
              leaveDataList[index].signInRes.siApprove=1
              prePage.setData({
                leaveDataList:leaveDataList
              })
*/
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
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
  noLeave: function () {
    var that=this
    wx.showModal({
      title: '提示',
      content: '驳回该请假',
      success: function (res) {
        if (res.confirm) {
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/rejectLeave.do'
          var method = "POST"
          var header = {
            "Access-Token": app.globalData.header['Access-Token'],
            'content-type': 'application/json;charset=UTF-8'
          }
          var y = that.data.signInRes
          var params = { "siId": y.siId, "student": y.student, "oneCozAndSch": y.oneCozAndSch, "siTime": y.siTime, "siWeek": y.siWeek, "siLeave": y.siLeave, "siApprove": y.siApprove } 

          network.request(url, params, method, header).then((data) => {
            if (data==true) {
              wx.showToast({
                title: '驳回',
                icon: "success",
                duration: 1500
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
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