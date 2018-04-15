const app=getApp()
const util=require("../../../../utils/util.js")
var Weeks=[]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: '2018-10-08',
    courseItem: {},
    reason:'',
    tempFilePaths:[],
    height:0,
    width:0,
    schWeek:1,
    Weeks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item1 = JSON.parse(options.jsonStr);
    for (var i = 1; i < 25; i++) {
      Weeks.push(i)
    }
    var that = this;
    var temp = util.formatTime(new Date());
    var dates = temp.split(' ')
    that.setData({
      courseItem: item1,
      height:app.globalData.Height,
      width:app.globalData.Width,
      dates: dates[0],
      schWeek:item1.schweek,
      Weeks:Weeks
    });
  },
  //更改请假周
  bindWeekChange:function(e){
    this.setData({
      schWeek:parseInt(e.detail.value)+1
    })
  },
  //表单提交
  formSubmitLeave:function(e){
    var that=this
    console.log("周  "+JSON.stringify(e.detail))
    var schedule=that.data.courseItem.schedule
    schedule.schWeek=e.detail.value.schWeek+1
    console.log(schedule)
    if (that.data.tempFilePaths.length!=0){
      /*
      console.log("临时  " + that.data.tempFilePaths[0])
      var formData = { "schedule": schedule, "voucher": that.data.tempFilePaths[0]}
      wx.request({
        url: 'https://www.xsix103.cn/SignInSystem/Student/leave.do',
        method:"POST",
        header: {
          'Cookie': app.globalData.header.Cookie
        },
        data:formData,
        success:function(res){
          console.log(res.data)
          if (res.data) {
            wx.showToast({
              title: '提交成功',
              icon: "success",
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: "none",
              duration: 2000
            })
          }
        }
        
      })
      */
    wx.uploadFile({
      url: 'https://www.xsix103.cn/SignInSystem/Student/leave.do',
      filePath: that.data.tempFilePaths[0],
      name: 'voucher',
      header: {
        'Access-Token': app.globalData.header['Access-Token'],
        "content-type": 'multipart/form-data'
       },
      formData:{
        schedule:JSON.stringify(schedule),
      },
      success:function(res){
        console.log(res)
        if(res.data=="true"&&res.statusCode==200){
          wx.showToast({
            title: '提交成功',
            icon:"success",
            duration:2000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }else{
          wx.showToast({
            title: '提交失败',
            icon: "none",
            duration: 2000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '提交失败',
          icon:"none",
          duration:2000
        })
      }
    })
    
  }else{
    wx.showModal({
      title: '提示',
      content: '请上传请假凭证',
    })
  }

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
      count:1,
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
      content: '最多上传一张',
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
})
