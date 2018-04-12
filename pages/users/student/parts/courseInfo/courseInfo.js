// pages/users/student/pages/parts/courseInfo/courseInfo.js
var app=getApp();
const network=require("../../../../utils/network.js")
const util=require("../../../../utils/util.js")
var dataType = 0;
var types = ["1", "41", "10"];
var DATATYPE = {
  SIGNDATATYPE: "1",
  LEAVEDATATYPE: "41",
  NODATATYPE: "10",
};
/** 
 * 旋转上拉加载图标 
 */
function updateRefreshIcon() {
  var deg = 0;
  var _this = this;
  console.log('旋转开始了.....')
  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function () {
    if (!_this.data.refreshing)
      clearInterval(timer);
    animation.rotateZ(deg).step();//在Z轴旋转一个deg角度  
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
}  


Page({

  /**
   * 页面的初始数据
   */
  data: {
    signDataList: [],
    leaveDataList: [],
    noDataList: [],
    topTabItems: ["历史签到", "历史请假", "历史缺勤"],
    currentTopItem: "0",
    swiperHeight: "0",
    scrollTop:"1",
    courseItem:{
      "courseid": "A", "coursename": "LOL", "courseplace": "品学楼", "courseteacher": "Jack", "coursetime": "Tuesday"
    },
    refreshHeight: 0,//获取高度  
    refreshing: false,//是否在刷新中  
    refreshAnimation: {}, //加载更多旋转动画数据  
    clientY: 0,//触摸时Y轴坐标  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item1=JSON.parse(options.jsonStr);
    this.setNewDataWithRes(dataType);
    this.setData({
      courseItem:item1,
      swiperHeight:app.globalData.Height
    });
   

  },
  test:function(){
    console.log(courseItem)
  },
  //切换顶部标签
  switchTab: function (e) {
    dataType = e.currentTarget.dataset.idx;
    this.setData({
      currentTopItem: e.currentTarget.dataset.idx
    });
    this.setNewDataWithRes(dataType);
    
  },
  /*
  //刷新数据
  refreshNewData: function () {
    //加载提示框
    //util.showLoading();
    var that = this;
    var parameters = 'a=list&c=data&type=' + types[dataType];
    console.log("parameters = " + parameters);
    util.request(parameters, function (res) {
      page = 1;
      that.setNewDataWithRes(res, that);
      setTimeout(function () {
        util.hideToast();
        wx.stopPullDownRefresh();
      }, 1000);
    });
  },
  */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: (res.windowHeight - 37)
        });
      }
    })
    
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
  //设置新数据
  setNewDataWithRes: function (dataType) {
    var that=this
    
    var term = wx.getStorageSync('SigningCourse')
    var schedule=term.schedule
    switch (types[dataType]) {
      //历史签到
      case DATATYPE.SIGNDATATYPE:
        var url = "https://www.xsix103.cn/SignInSystem/Student/fOneCozSignIn.do"
        var params=schedule
        var method="POST"
        var header={
          'Cookie': app.globalData.header.Cookie,
          'content-type': 'application/json' // 默认值
        }
        network.request(url,params,method,header).then((data)=>{
          var signDataList = new Array();
          for (var index in data) {
            var id = data[index].siId
            var time = util.formatArrayTime(data[index].siTime)
            signDataList.push({ "id": id, "time": time })
          }

          that.setData({
            signDataList: signDataList
          });
        })
        break;
      //历史请假
      case DATATYPE.LEAVEDATATYPE:
        that.data.list = [{
          "id": "2016220401007",
          "time": "2018-02-07 19:59:59"
        }, { "id": "2016220401007", "time": "2018-02-07 20:59:59" }];
        target.setData({
          leaveDataList: [{
            "id": "2016220401007",
            "time": "2018-02-07 19:59:59"
          }, { "id": "2016220401007", "time": "2018-02-07 20:59:59" }]
        });
        break;
      //历史缺勤
      case DATATYPE.NODATATYPE:
        var url = "https://www.xsix103.cn/SignInSystem/Student/fOneCozAbsent.do"
        var params=schedule
        var method="POST"
        var header = {
          'Cookie': app.globalData.header.Cookie,
          'content-type': 'application/json' // 默认值
        }
        network.request(url,params,method,header).then((data)=>{
          var noDataList = new Array();
          for (var index in data) {
            var time = util.formatArrayTime(data[index].siTime)
            var id = data[index].siId
            noDataList.push({ "id": id, "time": time })
          }

          that.setData({
            noDataList: noDataList
          });
        }) 
        break;
      default:
        break;
    }
  },
  upper:function(e){
    
    console.log("下拉了....")
    //获取用户Y轴下拉的位移
    if (this.data.refreshing) return;
    this.setData({ refreshing: true });
    updateRefreshIcon.call(this);
    var that = this;
    that.setNewDataWithRes(e.currentTarget.dataset.idx)
    setTimeout(function () {
      that.setData({
        refreshing: false
      })
    }, 2500)
  },
  //滚动
  scroll: function (event) {
    console.log("滑动了")
  },
  start: function (e) {
    console.log("开始下拉")
    var startPoint = e.touches[0]
    var clientY = startPoint.clientY;
    this.setData({
      clientY: clientY,
      refreshHeight: 0
    })
  },
  end: function (e) {
    var that=this
    console.log("下拉结束")
    var endPoint = e.changedTouches[0]
    var y = (endPoint.clientY - this.data.clientY) * 0.6;
    if (y > 30) {
      y = 30;
    }
    this.setData({
      refreshHeight: y
    })
    if(y==30){
      that.upper(e)
    }
    
  },
  move: function (e) {
    console.log("下拉滑动了...")

  },  
  //上拉
   DownLoad:function(){
    console.log("上拉了")
   },
  /*
  //设置加载更多的数据
  setMoreDataWithRes(res, target) {
    switch (types[dataType]) {
      //历史签到
      case DATATYPE.SIGNDATATYPE:
        target.setData({
          signDataList: target.data.signDataList.concat(res.data.list)
        });
        break;
      //历史请假
      case DATATYPE.LEAVEDATATYPE:
        target.setData({
          leaveDataList: target.data.leaveDataList.concat(res.data.list)
        });
        console.log(array);
        break;
      //历史缺勤
      case DATATYPE.NODATATYPE:
        target.setData({
          noDataList: target.data.noDataList.concat(res.data.list)
        });
        break;
      default:
        break;
    }
  },*/

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