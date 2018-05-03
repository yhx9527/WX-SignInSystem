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
    iconBackColor: app.globalData.iconBackColor,
    leaves:[],
    coursename:"",
    currentItem:0,
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
      console.log("上头"+temp.currentitem)
      //console.log("教师审核请假"+JSON.stringify(temp.leaves,undefined,'\t'))
      var xx=temp.leaves
      xx.forEach((item) => {
        item.siTime1 = util.formatArrayTime(item.siTime)
      })
      that.setData({
        leaves: xx,
        coursename: temp.coursename,
        currentItem:temp.currentitem
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
    var pages=getCurrentPages();
    var prevPage=pages[pages.length-2]
    var leaves=this.data.leaves
    var leaveData=prevPage.data.leaveData
    leaves.forEach((item,idx,leaves)=>{
      if(item.siApprove!=0){
        leaves.splice(idx,1)
        var index=util.getIndex(leaveData,'siId',item.siId)
        leaveData[index].siApprove=item.siApprove
      }
    })
    var urgencyLeaveData=prevPage.data.urgencyLeaveData
    var currentItem=this.data.currentItem
    urgencyLeaveData[currentItem]=leaves
    prevPage.setData({
      urgencyLeaveData:urgencyLeaveData,
      leaveData:leaveData
    })
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