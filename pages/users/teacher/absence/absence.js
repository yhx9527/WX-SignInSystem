const app=getApp();
const network=require("../../../utils/network.js");
var getAbsence = function (that, schId, week) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/fSchAbsRecByCoz.do"
  var header = app.globalData.header
  var method = "GET"
  var params = {
      "schId":schId,
      "week":week
    }
    network.request(url, params, method, header).then((data) => {
      if(data.length>0){
      that.setData({
        sumAbsence: data[0].studentList
      })
      }
    })


}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    absence:{},//缺勤名单
    sumAbsence:[],
    coursename:"",
    coursetime:"",
    week:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    let temp=JSON.parse(options.jsonStr)
    getAbsence(that,temp.schid,temp.week);
    console.log("缺勤名单"+options.jsonStr)
    that.setData({
      coursename:temp.coursename,
      coursetime:temp.coursetime,
      week:temp.week,
      iconBackColor: app.globalData.iconBackColor
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