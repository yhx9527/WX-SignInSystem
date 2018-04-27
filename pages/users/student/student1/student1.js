var app=getApp();
var util = require("../../../utils/util.js")
var message = '';

var length; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopping: false,//是否已经弹出  
    animPlus: {},//旋转动画  
    animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度
    hiddenSendMessage: true,//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    monitorPermit:0,
    teacherPermit:0,
    centendata:[],//通知单
    hasMessage:false,
    person:{},//个人资料
    memberInfo:""
  },

  

  //点击弹出  
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  monitor: function () {
    if(this.data.person.userPermit[1]==1){
    wx.navigateTo({
      url: '../../monitor/monitor',
    })
    }
  },
  beginSign: function () {
    
  },
  //发布通知
  sendMessage: function () {
    this.setData({
      hiddenSendMessage: !this.data.hiddenSendMessage
    })  
  },
  //取消发布通知按钮  
  cancelMessage: function () {
    this.setData({
      hiddenSendMessage: true
    });
  },
  //获取输入内容
  inputMessage:function(e){
    this.setData({
    message:e.detail.value
    })
  },
  //发送通知按钮  
  confirmMessage: function () {
    var time=util.formatTime(new Date);
    console.log(time)
    this.setData({

      centendata:[{"time":time,"is_show_right":"1","content":"正在开发中...敬请期待！！！","character":this.data.memberInfo}],
      hiddenSendMessage: true,
      hasMessage:true
    })

    wx.showToast({
      title: '正在开发中...',
      icon: 'success',
      duration: 2000
    }); 
  },
  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(80, -80).rotateZ(180).opacity(1).step();
    animationTranspond.translate(0, -120).rotateZ(180).opacity(1).step();
    animationInput.translate(-80, -80).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var person=wx.getStorageSync('person')
    if (person.userPermit[1]==1){
      var memberInfo="督导员"
      that.setData({
        memberInfo:memberInfo
      })
    } else if (person.userPermit[2]==1){
      var memberInfo=person.userName+"老师"
      that.setData({
        memberInfo:memberInfo
      })
    }
    that.setData({
      monitorPermit:person.userPermit[1],
      teacherPermit:person.userPermit[2],
      person:person,
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