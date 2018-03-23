var common=require("../student/student.js")
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName:"JAVA",
    teacherList:[],
    topItems:[],
    currentTopItem: "0",
    Height:0,//屏幕高
    Width:0,//屏幕宽
    colorSet:["#C7F3FF", "#FDC7FF", "#FFDCF5", "#F2F4C3"],//背景颜色集合
    background:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let temp=JSON.parse(options.jsonStr);
    
    console.log("老师单个课程页数据:"+temp.list)
    var topItems=that.data.topItems
    
    for(var index in temp.list.schedules){
      topItems.push(common.transchedule(temp.list.schedules[index]))
    }
    console.log("top值"+topItems)
    var Width = (app.globalData.Width)/(topItems.length)
    console.log("单个宽"+Width)
    this.setData({
      teacherList:temp.list,
      topItems:topItems,
      Height:app.globalData.Height,
      Width:Width,
      background:"#C7F3FF"
    })
  },
  //切换顶部标签
  switchTab:function(e){
    var dataType = e.currentTarget.dataset.idx;
    var that=this;
    that.setData({
      currentTopItem: e.currentTarget.dataset.idx,
      background:that.data.colorSet[dataType]
    });
    //this.setNewDataWithRes(dataType);
  },
  //设置新数据
  setNewDataWithRes: function (dataType) {
    var that = this;
    switch (types[dataType]) {
      //督导课堂
      case DATATYPE.ALLDATATYPE:
        Monitoring(that);
        getAll(that);
        break;
      //历史记录
      case DATATYPE.HISTORYDATATYPE:
        getHistory(that);
        break;
      //审核请假
      case DATATYPE.LEAVEDATATYPE:
        checkLeaves(that);
        break;
      //督导转接
      case DATATYPE.GIVEDATATYPE:
        getGive(that);

        break;
      default:
        break;
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
    
  }
})