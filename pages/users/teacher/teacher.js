var common=require("../student/student.js")
const network = require("../../utils/network.js")
const app=getApp()
var getMonitoring=function(that,schedule){
  var url ="https://www.xsix103.cn/SignInSystem/Teacher/fSuvRecByCoz.do"
  var params = schedule
  
  var header = {
    'Cookie': app.globalData.header.Cookie
  }
  var method = "POST"
  network.request(url, params, method, header).then((data)=>{
    if(data.length!=0){
    that.setData({
      Monitoring:data[0]
    })
    }else{
      that.setData({
        Monitoring:{}
      })
    }
  })
}
var getAbsence = function (that, schedule) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/fSchAbsRecByCoz.do"
  var params = schedule

  var header = {
    'Cookie': app.globalData.header.Cookie
  }
  var method = "POST"
  network.request(url, params, method, header).then((data) => {
    that.setData({
      Absence:data
    })
    
  })
}
var getLeaves = function (that) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/getLeaves.do"
  var params = {}

  var header = {
    'Cookie': app.globalData.header.Cookie
  }
  var method = "POST"
  network.request(url, params, method, header).then((data) => {
    that.setData({
      leaves: data.length
    })
    if(data.length>0){
      that.setData({
        ifLeaves:true
      })
    }else{
      that.setData({
        ifLeaves:false
      })
    }
  })

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName:"JAVA",
    teacherList:[],
    topItems:[],
    Monitoring:{},
    Absence:[],
    currentTopItem: "0",
    Height:0,//屏幕高
    Width:0,//屏幕宽
    colorSet:["#C7F3FF", "#FDC7FF", "#FFDCF5", "#F2F4C3"],//背景颜色集合
    background:"",
    ifxiala:false,//是否下拉
    animation1:{},//下拉动画
    leaves:0,//请假人数
    ifLeaves:false,//请假是否亮
    ifAuto:false,//发起自动签到是否亮
    ifMan:false,//发起手动签到是否亮
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
    getMonitoring(that, temp.list.schedules[0]);
    getAbsence(that, temp.list.schedules[0]);
    getLeaves(that)
    var Width = (app.globalData.Width)/(topItems.length)
    this.setData({
      teacherList:temp.list,
      topItems:topItems,
      Height:app.globalData.Height,
      Width:Width,
      background:"#C7F3FF"
    })
    console.log("单个课程" + JSON.stringify(temp.list.schedules[0]))
    
    
  },
  //切换顶部标签
  switchTab:function(e){
    var dataType = e.currentTarget.dataset.idx;
    var that=this;
    that.setData({
      currentTopItem: e.currentTarget.dataset.idx,
      background:that.data.colorSet[dataType]
    });
    this.setNewDataWithRes(dataType);
  },
  //设置新数据
  setNewDataWithRes: function (dataType) {
    var that = this;
    var schedules=that.data.teacherList.schedules
    switch (dataType) {
      //第一节课
      case 0:
        getMonitoring(that,schedules[0]);
        getAbsence(that, schedules[0]);
        break;
      //第二节课
      case 1:
        getMonitoring(that,schedules[1]);
        getAbsence(that,schedules[1]);
        break;
      //第三节课
      case 2:
        getMonitoring(that,schedules[2]);
        getAbsence(that,schedules[2]);
        break;
      //第四节课
      case 3:
        getMonitoring(that,schedules[3]);
        getAbsence(that,schedules[3]);
        break;
      default:
        break;
    }
  },
  bindChange:function(e){
    this.setData({
    currentTopItem:e.detail.current,
    background:this.data.colorSet[e.detail.current],
  })
  },
  xiala:function(){
    var that=this;
    if(that.data.ifxiala){
      //收回
      that.takeback();
      that.setData({
        ifxiala:false
      })
    }else if(!that.data.ifxiala){
      //弹出
      that.pop();
      that.setData({
        ifxiala:true
      })
    }
  },
  //弹出
  pop:function(){
    var animation1=wx.createAnimation({
      duration:300,
      timingFunction:'ease-out'
    })
    animation1.rotateZ(90).step();
    this.setData({
      animation1:animation1.export()
    })
  },
  //收回
  takeback:function(){
    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    animation1.rotateZ(0).step();
    this.setData({
      animation1:animation1.export()
    })
  },
  //缺勤学生名单
  absence:function(e){
    let str=JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: './absence/absence?jsonStr='+str
    })
  },
  //审核请假
  checkLeave:function(e){
    console.log(e)
    let str=JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: './checkLeaves/checkLeaves?jsonStr='+str,
    })
  },
  //课程停课
  stopClass:function(e){
    var tishi = e.currentTarget.dataset.schday + e.currentTarget.dataset.schtime+"进行停课"
    var params=e.currentTarget.dataset.schid+"&"+e.currentTarget.dataset.schweek
    console.log(params);
    var url = "https://www.xsix103.cn/SignInSystem/Teacher/fSchAbsRecByCoz.do"
    var header = {
      'Cookie': app.globalData.header.Cookie
    }
    var method = "POST"
    wx.showModal({
      title: '提示',
      content: tishi,
      success:function(res){
        if(res.confirm){
          network.request(url, params, method, header).then((data) => {
            if(data){
              wx.showToast({
                title: '停课成功',
                icon:"success",
                duration:2000
              })
            }else{
              wx.showToast({
                title: '停课失败',
                icon: "none",
                duration: 2000
              })
            }
          }) 
        }else if(res.cancel){
          
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