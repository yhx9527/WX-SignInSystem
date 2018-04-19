var common=require("../student/student.js")
const util=require("../../utils/util.js")
const network = require("../../utils/network.js")
const app=getApp()
const date=new Date()

//日期初始化函数
var setDate=function(that,Date,now){
  var years=[]
  var months=[]
  var days=[]
  var hours=[]
  var minutes=[]
  var seconds=[]
  for (let i = 0; i <= 12; i++) {
    years.push(i+date.getFullYear())
  }
  Date[0]=years
  now.push(0)
  for(let i=1;i<=12;i++){
    months.push(i)
  }
  Date[1]=months
  now.push(date.getMonth()-1)
  for(let i=1;i<=31;i++){
    days.push(i)
  }
  now.push(date.getDay()-1)
  Date[2]=days
  for(let i=0;i<24;i++){
    hours.push(i)
  }
  now.push(date.getHours())
  Date[3]=hours
  for(let i=0;i<60;i++){
    minutes.push(i)
  }
  Date[4]=minutes
  now.push(date.getMinutes())
  for(let i=0;i<60;i++){
    seconds.push(i)
  }
  Date[5]=seconds
  now.push(date.getSeconds())
console.log("Date"+Date[0][1])
that.setData({
  Date:Date,
  now: now
})
}


var getMonitoring=function(that,schedule){
  var url ="https://www.xsix103.cn/SignInSystem/Teacher/fSuvRecByCoz.do"
  var params = schedule
  
  var header =app.globalData.header
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

  var header = app.globalData.header
  var method = "POST"
  network.request(url, params, method, header).then((data) => {
    that.setData({
      Absence:data
    })
    
  })
}
var getLeaves = function (that,topItems) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/getLeaves.do"
  var params = {}

  var header = app.globalData.header
  var method = "POST"
  network.request(url, params, method, header).then((data) => {
    for(var i in topItems){
    topItems[i].signInRes=[]
    var a=topItems[i].signInRes
    for(var j in data){
      if(topItems[i].schDayT==data[j].oneCozAndSch.schedule.schDay){
        a.push(data[j])
      }
    }
    }
    that.setData({
      topItems:topItems
    })
  })

}
//得到该课程的是否正在签到
var getSign=function(schId){
  var url = 'https://www.xsix103.cn/SignInSystem/Teacher/getCozSignIn.do'
  var method = "POST"
  var header =app.globalData.header
  var params = schId
  network.request(url, params, method, header).then((data)=>{
    console.log("getSign  ")
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
    animationBottom:{},//底部框动画
    leaves:0,//请假人数
    ifLeaves:false,//请假是否亮
    ifAuto:false,//发起自动签到是否亮
    ifMan:false,//发起手动签到是否亮
    Date:[],
    now:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let temp=JSON.parse(options.jsonStr);
    var Date=that.data.Date
    for(var k=0;k<5;k++){
      Date[k]=new Array()
    }
    var now=that.data.now
    setDate(that,Date,now)
    console.log("老师单个课程页数据:"+temp.list)
    var topItems=[]
    var schedule=util.transchedule(temp.list.schedules)
    for(var index in schedule){
      var a = schedule[index]
      a.ifSign=false
      a.ifMonitor=false
      a.ifMonitor1=true
      a.suvWeek=a.schWeek
      //topItems.push(common.transchedule(temp.list.schedules[index]))
      topItems.push(a)
    }
    getMonitoring(that,schedule[0].schedule);
    getAbsence(that, schedule[0].schedule);
    getLeaves(that,topItems)
    var Width = (app.globalData.Width)/(topItems.length)
    that.setData({
      teacherList:temp.list,
      topItems:that.data.topItems,
      Height:app.globalData.Height,
      Width:Width,
      background:"#C7F3FF",
      
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
    this.setNewDataWithRes(dataType);
    
  },
  //设置新数据
  setNewDataWithRes: function (dataType) {
    var that = this;
    var topItems=that.data.topItems
    switch (dataType) {
      //第一节课
      case 0:
        getMonitoring(that,topItems[0].schedule);
        getAbsence(that, topItems[0].schedule);
        break;
      //第二节课
      case 1:
        getMonitoring(that, topItems[1].schedule);
        getAbsence(that, topItems[1].schedule);
        break;
      //第三节课
      case 2:
        getMonitoring(that, topItems[2].schedule);
        getAbsence(that, topItems[2].schedule);
        break;
      //第四节课
      case 3:
        getMonitoring(that, topItems[3].schedule);
        getAbsence(that, topItems[3].schedule);
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
    let str=JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: './checkLeaves/checkLeaves?jsonString='+str,
    })
  },
  
  //课程停课
  stopClass:function(e){
    var tishi = e.currentTarget.dataset.schday + e.currentTarget.dataset.schtime+"进行停课"
    var params=e.currentTarget.dataset.schid+"&"+e.currentTarget.dataset.schweek
    console.log(params);
    var url = "https://www.xsix103.cn/SignInSystem/Teacher/fSchAbsRecByCoz.do"
    var header =app.globalData.header
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
  //手动签到设置时间
  manDt:function(e){
    console.log("手动时间:   "+e.detail.value)
  },
  //显示底部弹出框
  showBottomModel:function(e){
    var index = e.currentTarget.dataset.index
    var topItems = this.data.topItems
    var that=this
    if(!topItems[index].ifSign){
    
    console.log("手动"+index)
    
    topItems[index].ifshowModel=true
    var animation=wx.createAnimation({
      duration:200,
      timingFunction:"linear",
      delay:0
    })
    this.animation=animation
    animation.translateY(300).step()
    this.setData({
      animationBottom:animation.export(),
      topItems:topItems
    })
    setTimeout(function(){
      animation.translateY(0).step()
      this.setData({
        animationBottom:animation.export()
      })
    }.bind(this),200)
    }else{
      wx.showModal({
        title: '提示',
        content: '是否取消签到',
        success:function(res){
          if(res.confirm){
             var suvMan={"schId":topItems[index].schId,"siWeek":topItems[index].schWeek}
             var url = 'https://www.xsix103.cn/SignInSystem/Teacher/removeCozSignIn.do'
             var method = "POST"
             var header =app.globalData.header
             var params = suvMan
             network.request(url, params, method, header).then((data)=>{
               if(data){
                 wx.showToast({
                   title: '取消成功',
                   icon:"success",
                   duration:2000
                 })
                 topItems[index].ifSign=false
                 that.setData({
                   topItems:topItems
                 })
                 getSign(topItems[index].schId)
               }else{
                 wx.showToast({
                   title: '取消失败',
                   icon:"none",
                   duration:2000
                 })
               }
             })
          }
        }
      })
    }
  },
//隐藏底部弹出框
  hideBottomModel:function(e){
    var index = e.currentTarget.dataset.index
    console.log("手动" + index)
    var topItems = this.data.topItems
    topItems[index].ifshowModel = false
    var animation=wx.createAnimation({
      duration:200,
      timingFunction:"linear",
      delay:0
    })
    this.animation=animation
    animation.translateY(300).step()
    this.setData({
      animationBottom:animation.export(),
    })
    setTimeout(function(){
      animation.translateY(0).step()
      this.setData({
        animationBottom:animation.export(),
        topItems:topItems
      })
    }.bind(this),200)
  },
  manDt:function(e){
    this.setData({
      now:e.detail.value
    })
  },
  //发起签到的表单
  formSubmit:function(e){
    console.log("form  "+JSON.stringify(e.detail.value))
    var that=this
    var index=e.currentTarget.dataset.index
    var temp=e.detail.value
    var topItems=this.data.topItems
    
    if(temp.autoSign&&!temp.manSign){
      var suvMan={"schId":topItems[index].schId,"siWeek":topItems[index].schWeek,"siTime":[1970,1,1,8,0,1],"suvManAutoOpen":true}
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header = app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data)=>{
        console.log("自动")
        if(data){
          that.hideBottomModel(e)
          wx.showToast({
            title: '设置成功',
            icon:"success",
            duration:2000
          })
          topItems[index].ifSign = true
          that.setData({
            topItems:topItems
          })
        }else{
          wx.showToast({
            title: '设置失败',
            icon: "none",
            duration: 2000
          })
        }
      })
    } else if (!temp.autoSign && temp.manSign){
      temp.manDt[0] += date.getFullYear()
      temp.manDt[1] += 1
      temp.manDt[2] += 1
      var suvMan = { "schId": topItems[index].schId, "siWeek": topItems[index].schWeek, "siTime": temp.manDt, "suvManAutoOpen": false }
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header =app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data) => {
        console.log("人工")
        if (data) {
          that.hideBottomModel(e)
          wx.showToast({
            title: '设置成功',
            icon: "success",
            duration: 2000
          })
          topItems[index].ifSign = true
          that.setData({
            topItems:topItems
          })
        } else {
          wx.showToast({
            title: '设置失败',
            icon: "none",
            duration: 2000
          })
        }
      })
    } else if (temp.autoSign && temp.manSign){
      var suvMan = { "schId": topItems[index].schId, "siWeek": topItems[index].schWeek, "siTime": temp.manDt, "suvManAutoOpen": true }
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header =app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data) => {
        console.log("都有")
        if (data) {
          that.hideBottomModel(e)
          wx.showToast({
            title: '设置成功',
            icon: "success",
            duration: 2000
          })
          topItems[index].ifSign = true
          that.setData({
            topItems:topItems
          })
        } else {
          wx.showToast({
            title: '设置失败',
            icon: "none",
            duration: 2000
          })
        }
      })
    }else{
      console.log("都没有")
      that.hideBottomModel(e)
    }

  },
  //手动签到弹出时间
  manSign:function(e){
    this.setData({
      isMan:e.detail.value
    })
  },
  //设置督导
  setMonitor:function(e){
    var topItems=this.data.topItems
    var index=e.currentTarget.dataset.index
    var that=this
    if(!topItems[index].ifMonitor){
      topItems[index].ifMonitor1=false
      this.setData({
        topItems:topItems
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否取消督导',
        success:function(res){
          if(res.confirm){
            var paramStr=topItems[index].schId+"&"+topItems[index].suvWeek
            var url = 'https://www.xsix103.cn/SignInSystem/Teacher/removeCozSuv.do'
            var method = "POST"
            var header =app.globalData.header
            var params = paramStr
            network.request(url, params, method, header).then((data)=>{
              if(data){
                wx.showToast({
                  title: '取消成功',
                  icon:"success",
                  duration:2000
                })
                topItems[index].ifMonitor=false
                that.setData({
                  topItems:topItems
                })
              }else{
                wx.showToast({
                  title: '取消失败',
                  icon: "none",
                  duration: 2000
                })
              }
            })
          }
        }
      })
    }
  },
  //取消督导模态框
  cancelMonitor:function(e){
    var topItems=this.data.topItems
    var index=e.currentTarget.dataset.index
    topItems[index].ifMonitor1=true
    this.setData({
      topItems:topItems
    })
  },
  //输入督导周
  confirmInput:function(e){
    var topItems = this.data.topItems
    var index = e.currentTarget.dataset.index
    topItems[index].suvWeek=e.detail.value
    console.log("输入的是" + topItems[index].suvWeek)
    this.setData({
      topItems:topItems
    })
  },
  //提交设置的督导
  confirmMonitor:function(e){
    var that=this
    var topItems = this.data.topItems
    var index = e.currentTarget.dataset.index
    var paramStr = topItems[index].schId + "&" + topItems[index].suvWeek
    var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSuv.do'
    var method = "POST"
    var header = app.globalData.header
    var params = paramStr
    network.request(url, params, method, header).then((data)=>{
      if (data) {
        wx.showToast({
          title: '设置成功',
          icon: "success",
          duration: 2000
        })
        topItems[index].ifMonitor = true
        topItems[index].ifMonitor1=true
        that.setData({
          topItems: topItems
        })
      } else {
        wx.showToast({
          title: '设置失败',
          icon: "none",
          duration: 2000
        })
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
    var now = this.data.now
    now = [0, date.getMonth() - 1, date.getDay() - 1, date.getHours(), date.getMinutes(), date.getSeconds()]
    getSign(17)
    this.setData({
      now: now
    })

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