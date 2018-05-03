const app=getApp()
const network=require("../../../utils/network.js")
//获取课程的学生名单
var getStuList = function (that,cozId) {
  var url = 'https://www.xsix103.cn/SignInSystem/Teacher/getCozStudent.do'
  var method = "GET"
  var header = app.globalData.header
  var params = { cozId: cozId }
  console.log("cozId" + cozId)
  network.request(url, params, method, header).then((data) => {
    that.setData({
      stuList:data
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuList:[],
    cozId:'',
    coursename:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let temp=JSON.parse(options.jsonStr)
    getStuList(this,temp.cozid)
    this.setData({
      coursename:temp.coursename,
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