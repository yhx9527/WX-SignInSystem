const app=getApp()
const util=require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: '2018-10-08',
    courseItem: {
      "courseid": "A", "coursename": "LOL", "courseplace": "品学楼", "courseteacher": "Jack", "coursetime": "Tuesday"
    },
    reason:'',
    tempFilePaths:[],
    height:0,
    width:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item1 = JSON.parse(options.jsonStr);
    var that = this;
    var temp = util.formatTime(new Date());
    var dates = temp.split(' ')
    that.setData({
      courseItem: item1,
      height:app.globalData.Height,
      width:app.globalData.Width,
      dates: dates[0]
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
    
  },
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  formSubmit:function(){

},
/**
   * 上传图片
   */
  chooseimage:function(){
    var that=this;
    wx.chooseImage({
      count:2,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        var tempFilePaths=that.data.tempFilePaths
        for(var index in res.tempFilePaths){
          tempFilePaths.push(res.tempFilePaths[index])
        }        
        that.setData({
          tempFilePaths:tempFilePaths
        })
      },
      fail:function(){

      },
      complete:function(){

      }
    })
  },
  //图片限制提示
  NOTchoose:function(){
    wx.showModal({
      title: '提示',
      content: '最多上传三张',
    })
  },
  //预览图片
  previewImage:function(e){
    var that=this;
    console.log(that.data.tempFilePaths)
    wx.previewImage({
      current:e.currentTarget.dataset.path,
      urls: that.data.tempFilePaths,

    })
  },
  formSubmit:function(e){
    
  }
})
