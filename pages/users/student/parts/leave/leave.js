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
    tempFilePaths:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item1 = JSON.parse(options.jsonStr);
    this.setData({
      courseItem: item1
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
        that.setData({
          tempFilePaths:res.tempFilePaths
        })
      },
      fail:function(){

      },
      complete:function(){

      }
    })
  },
  formSubmit:function(e){
    
  }
})
