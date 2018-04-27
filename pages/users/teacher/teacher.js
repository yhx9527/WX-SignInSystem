var common=require("../student/student.js")
const util=require("../../utils/util.js")
const network = require("../../utils/network.js")
const app=getApp()
const date=new Date()
var dataType = 0;

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
  now.push(date.getMonth())
  for(let i=1;i<=31;i++){
    days.push(i)
  }
  now.push(date.getDate()-1)
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


var getMonitor=function(that,schedule,sumMonitor){
  var url ="https://www.xsix103.cn/SignInSystem/Teacher/fSuvRecByCoz.do"
  var header =app.globalData.header
  var method = "POST"

    schedule.forEach((item, i, schedule) => {
      var params = item.schedule
      sumMonitor[i]=new Array()
      network.request(url, params, method, header).then((data) => {
        for (var y in data) {
          sumMonitor[i].push(data[y])
          console.log("sumMonitor"+sumMonitor[i])
        }
        that.setData({
          sumMonitor: sumMonitor
        })
      })
    })

  
 
}
var getAbsence = function (that,schedule,sumAbsence) {
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/fSchAbsRecByCoz.do"
  var header = app.globalData.header
  var method = "POST"
    schedule.forEach((item, j, schedule) => {
      var params = item.schedule
      sumAbsence[j]=new Array()
      network.request(url, params, method, header).then((data) => {
        for (var y in data) {
          sumAbsence[j].push(data[y])
          console.log("sumAbsence"+sumAbsence[j])
        }
        that.setData({
          sumAbsence: sumAbsence
        })
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
      if(topItems[i].schDayT==data[j].oneCozAndSch.schedule.schDay&&data[j].siApprove==0){
        a.push(data[j])
      }
    }
    }
    that.setData({
      topItems:topItems,
      leaveData:data
    })
  })
}
//得到该课程的是否正在签到
var getSign=function(that,topItems,i,week){
  var url = 'https://www.xsix103.cn/SignInSystem/Teacher/getCozSignIn.do'
  var method = "POST"
  var header =app.globalData.header
  var params = topItems[i].schId
  network.request(url, params, method, header).then((data)=>{
    for(var index in data){
      if(data[index]==parseInt(week)){
        topItems[i].ifSign=true
      }
    }
    that.setData({
      topItems:topItems
    })
  })
}
//得到该课程的设置督导情况
var getSuv=function(that,topItems,i,week){
  var url = 'https://www.xsix103.cn/SignInSystem/Teacher/findCozSuv.do'
  var method = "POST"
  var header = app.globalData.header
  var params = topItems[i].schId
  network.request(url, params, method, header).then((data) => {
    for (var index in data) {
      if (data[index] == parseInt(week)) {
        topItems[i].ifMonitor = true
      }
    }
    that.setData({
      topItems: topItems
    })
  })
}
//填充对应搜索周的数据
var fillInForm=function(that,week,day){
  var sumMonitor=that.data.sumMonitor
  var searchMonitor={}
  var sumAbsence=that.data.sumAbsence
  var searchAbsence=[]
  var leaveData=that.data.leaveData
  var searchLeaveData=[]
  sumMonitor[dataType].forEach((item)=>{
    if(item.suvWeek==week){
      searchMonitor=item
    }
  })
  sumAbsence[dataType].forEach((item)=>{
    if(item.sarWeek==week)
    searchAbsence.push(item)
  })
  leaveData.forEach((item)=>{
    if(item.siWeek==week&&item.oneCozAndSch.schedule.schDay==day){
      searchLeaveData.push(item)
    }
  })
  that.setData({
    nowWeek:week,
    searchMonitor:searchMonitor,
    searchAbsence:searchAbsence,
    searchLeaveData:searchLeaveData
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
    sumMonitor:[],//一个课程的总课程督导记录
    searchMonitor:{},
    sumAbsence:[],//一个课程的总课程缺勤记录
    searchAbsence:[],
    leaveData:[],
    searchLeaveData:[],
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
    stopWeek:0,
    inputVal:"",
    inputShowed:false,
    nowWeek:-1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let temp=JSON.parse(options.jsonStr);
    var Date=that.data.Date
    var sumMonitor=[]
    var sumAbsence=[]
    for(var k=0;k<5;k++){
      Date[k]=new Array()
    }
    var now=that.data.now
    setDate(that,Date,now)
    //console.log("老师单个课程页数据:"+JSON.stringify(temp.list.schedules),undefined,'\t')
    var topItems=[]
    var schedule=util.transchedule(temp.list.schedules)
    console.log("老师的"+JSON.stringify(schedule,undefined,'\t'))
    for(var index in schedule){
      var a = schedule[index]
      a.ifSign=false
      a.ifMonitor=false
      //a.ifMonitor1=true
      //a.ifStopClass=true
      a.suvWeek=a.schWeek
      //topItems.push(common.transchedule(temp.list.schedules[index]))
      topItems.push(a)
    }
      setTimeout(function(){
        getMonitor(that, schedule, sumMonitor);
        getAbsence(that, schedule, sumAbsence);
      },2000)
      
    //getSign(that,topItems,0)
    //getSuv(that,topItems,0)
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
    dataType = e.currentTarget.dataset.idx;
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
    var inputVal=that.data.inputVal
    if(topItems.length!=0){
      that.setData({
        searchMonitor: {},
        searchAbsence: [],
        searchLeaveData: [],
        hintColor: "black",
      });
      if (parseInt(inputVal) >= 1 && parseInt(inputVal) <= 20) {
        fillInForm(that, inputVal, topItems[dataType].schDayT)
        getSign(that, topItems, dataType, inputVal)
        getSuv(that, topItems, dataType, inputVal)
      }else if(inputVal.length==0){
        topItems[dataType].ifSign=false
        topItems[dataType].ifMonitor=false
        that.setData({
          topItems:topItems
        })
      }
      /*
    switch (dataType) {
      //第一节课
      case 0:
        that.setData({
          searchMonitor: {},
          searchAbsence: [],
          searchLeaveData: [],
          hintColor: "black",
        });
        if (parseInt(inputVal) >= 1 && parseInt(inputVal) <= 20){
          fillInForm(that,inputVal,topItems[0].schDayT)
          getSign(that, topItems, 0, inputVal)
          getSuv(that, topItems, 0, inputVal)
        }
        
        //getMonitor(that,topItems[0].schedule);
        //getAbsence(that, topItems[0].schedule);
        
        //getSign(that,topItems,0)
        //getSuv(that,topItems,0)
        break;
      //第二节课
      case 1:
        that.setData({
          searchMonitor: {},
          searchAbsence: [],
          searchLeaveData: [],
          hintColor: "black",
        });
        if (parseInt(inputVal) >= 1 && parseInt(inputVal) <= 20) {
          fillInForm(that, inputVal, topItems[0].schDayT)
          getSign(that, topItems, 0, inputVal)
          getSuv(that, topItems, 0, inputVal)
        }
        //getMonitor(that, topItems[1].schedule);
        //getAbsence(that, topItems[1].schedule);
        //getSign(that, topItems,1)
        //getSuv(that, topItems,1)
        break;
      //第三节课
      case 2:
        that.setData({
          searchMonitor: {},
          searchAbsence: [],
          searchLeaveData: [],
          inputVal: "",
          inputShowed: false,
          hintColor: "black",
          nowWeek: -1
        });
        //getMonitor(that, topItems[2].schedule);
        //getAbsence(that, topItems[2].schedule);
        //getSign(that, topItems,2)
        //getSuv(that, topItems,2)
        break;
      //第四节课
      case 3:
        that.setData({
          searchMonitor: {},
          searchAbsence: [],
          searchLeaveData: [],
          inputVal: "",
          inputShowed: false,
          hintColor: "black",
          nowWeek: -1
        });
        //getMonitor(that, topItems[3].schedule);
        //getAbsence(that, topItems[3].schedule);
        //getSign(that, topItems,3)
        //getSuv(that, topItems,3)
        break;
      default:
        break;
    }
    */
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
  /*
  stopClass:function(e){
    var index=e.currentTarget.dataset.index
    var topItems=this.data.topItems
    topItems[index].ifStopClass=false
    this.setData({
      topItems:topItems
    })
  },
  */
  confirmStop:function(e){
    var that = this
    var inputVal=that.data.inputVal
    //var tishi = e.currentTarget.dataset.schday + e.currentTarget.dataset.schtime+"进行停课"
    var index=e.currentTarget.dataset.index
    
    var topItems=that.data.topItems
    if (parseInt(inputVal) >= 1 && parseInt(inputVal) <= 20) {
    /*if(that.data.stopWeek==0){
      var params = topItems[index].schId + "&" + topItems[index].schWeek
    }else{
      var params = topItems[index].schId + "&" + that.data.stopWeek
    }*/
    wx.showModal({
      title: '提示',
      content: '第'+inputVal+'周'+topItems[index].schDay+topItems[index].schTime+'进行停课',
      success:function(yes){
        if(yes.confirm){
          var params = topItems[index].schId + "&" + inputVal;
          console.log(params);
          var url = "https://www.xsix103.cn/SignInSystem/Teacher/suspendClass.do"
          var header = app.globalData.header
          var method = "POST"
          network.request(url, params, method, header).then((data) => {
            if (data == true) {
              wx.showToast({
                title: '停课成功',
                icon: "success",
                duration: 2000
              })
              topItems[index].ifStopClass = true
              that.setData({
                topItems: topItems,
                stopWeek: 0
              })
            } else {
              wx.showToast({
                title: '停课失败',
                icon: "none",
                duration: 2000
              })
              that.setData({
                stopWeek: 0
              })
            }
          })
        }
      }
    })
    
  }else{
    wx.showModal({
      title: '提示',
      content: '请先进行搜索并输入正确的周次',
    })
  } 
  },
  /*
  cancelStop:function(e){
    var topItems = this.data.topItems
    var index = e.currentTarget.dataset.index
    topItems[index].ifStopClass = true
    this.setData({
      topItems: topItems
    })
  },
  */
  confirmStopInput:function(e){
    console.log("输入的是" + e.detail.value)
    this.setData({
      stopWeek:e.detail.value
    })
  },
  //显示底部弹出框
  showBottomModel:function(e){
    var index = e.currentTarget.dataset.index
    var topItems = this.data.topItems
    var that=this
    var inputVal=that.data.inputVal
    if(parseInt(inputVal)>=1&&parseInt(inputVal)<=20){
    if(!topItems[index].ifSign){
      var date1 = new Date()
      var now = [0, date1.getMonth(), date1.getDate() - 1, date1.getHours(), date1.getMinutes(), date1.getSeconds()]
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
      topItems:topItems,
      now:now
    })
    setTimeout(function(){
      animation.translateY(-46).step()
      this.setData({
        animationBottom:animation.export()
      })
    }.bind(this),200)
    }else{
      wx.showModal({
        title: '提示',
        content: '第' + inputVal + '周' + topItems[index].schDay + topItems[index].schTime +'取消签到?',
        success:function(res){
          if(res.confirm){
             var suvMan={"schId":topItems[index].schId,"siWeek":that.data.inputVal}
             var url = 'https://www.xsix103.cn/SignInSystem/Teacher/removeCozSignIn.do'
             var method = "POST"
             var header =app.globalData.header
             var params = suvMan
             network.request(url, params, method, header).then((data)=>{
               if(data==true){
                 wx.showToast({
                   title: '取消成功',
                   icon:"success",
                   duration:2000
                 })
                 topItems[index].ifSign=false
                 that.setData({
                   topItems:topItems
                 })
  
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
  }else{
      wx.showModal({
        title: '提示',
        content: '请先进行搜索并输入正确的周次',
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
      animation.translateY(-46).step()
      this.setData({
        animationBottom:animation.export(),
        topItems:topItems
      })
    }.bind(this),200)
  },
  //手动签到设置时间
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
    var inputVal=that.data.inputVal
    var temp=e.detail.value
    var topItems=this.data.topItems
    
    if(temp.autoSign&&!temp.manSign){
      var suvMan={"schId":topItems[index].schId,"siWeek":inputVal,"siTime":[1970,1,1,8,0,1],"suvManAutoOpen":true}
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header = app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data)=>{
        console.log("自动")
        if(data==true){
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
      var suvMan = { "schId": topItems[index].schId, "siWeek":inputVal, "siTime": temp.manDt, "suvManAutoOpen": false }
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header =app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data) => {
        console.log("人工")
        if (data==true) {
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
      temp.manDt[0] += date.getFullYear()
      temp.manDt[1] += 1
      temp.manDt[2] += 1
      var suvMan = { "schId": topItems[index].schId, "siWeek": inputVal, "siTime": temp.manDt, "suvManAutoOpen": true }
      var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSignIn.do'
      var method = "POST"
      var header =app.globalData.header
      var params = suvMan
      network.request(url, params, method, header).then((data) => {
        console.log("都有")
        if (data==true) {
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
    var inputVal=that.data.inputVal
    if(parseInt(inputVal)>=1&&parseInt(inputVal)<=20){
      if (!topItems[index].ifMonitor) {
        wx.showModal({
          title: '提示',
          content: '第' + inputVal + '周' + topItems[index].schDay + topItems[index].schTime+"设置督导",
          success:function(yes){
            if(yes.confirm){
              var paramStr = topItems[index].schId + "&" + inputVal
              var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSuv.do'
              var method = "POST"
              var header = app.globalData.header
              var params = paramStr
              network.request(url, params, method, header).then((data) => {
                if (data == true) {
                  wx.showToast({
                    title: '设置成功',
                    icon: "success",
                    duration: 2000
                  })
                  topItems[index].ifMonitor = true
                  topItems[index].ifMonitor1 = true
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
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '是否取消督导',
          success: function (res) {
            if (res.confirm) {
              var paramStr = topItems[index].schId + "&" + inputVal
              var url = 'https://www.xsix103.cn/SignInSystem/Teacher/removeCozSuv.do'
              var method = "POST"
              var header = app.globalData.header
              var params = paramStr
              network.request(url, params, method, header).then((data) => {
                if (data == true) {
                  wx.showToast({
                    title: '取消成功',
                    icon: "success",
                    duration: 2000
                  })
                  topItems[index].ifMonitor = false
                  that.setData({
                    topItems: topItems
                  })
                } else {
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
    }else{
      wx.showModal({
        title: '提示',
        content: '请先进行搜索并输入正确的周次',
      })
    }
    
  },
  /*
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
    var inputVal=that.data.inputVal
    var index = e.currentTarget.dataset.index
    var paramStr = topItems[index].schId + "&" + topItems[index].suvWeek
    var url = 'https://www.xsix103.cn/SignInSystem/Teacher/setCozSuv.do'
    var method = "POST"
    var header = app.globalData.header
    var params = paramStr
    network.request(url, params, method, header).then((data)=>{
      if (data==true) {
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
  */
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*var now = this.data.now
    var topItems=this.data.topItems
    var date1=new Date()
    now = [0, date.getMonth() , date.getDate() - 1, date.getHours(), date.getMinutes(), date.getSeconds()]
    //this.setNewDataWithRes(dataType)

    
    this.setData({
      now: now
    })*/
    //var topItems=this.data.topItems
    //getLeaves(this, topItems)
  },
  /**
   * 搜索框
   */
  showInput: function () {
    this.setData({
      inputShowed: true,
      hintColor: "black"
    });
  },
  hideInput: function () {
    var topItems=this.data.topItems
    topItems[dataType].ifMonitor = false
    topItems[dataType].ifSign = false
    this.setData({
      inputVal: "",
      inputShowed: false,
      hintColor: "black",
      topItems: topItems,
      nowWeek:-1
    });
  },
  clearInput: function () {
    var topItems = this.data.topItems
    topItems[dataType].ifMonitor = false
    topItems[dataType].ifSign = false
    this.setData({
      inputVal: "",
      hintColor: "black",
      topItems: topItems,
      nowWeek:-1
    });
  },
  /*inputTell:function(e){
    if(parseInt(e.detail.value)>=1&&parseInt(e.detail.value)<=20){
      this.setData({
        inputVal:e.detail.value,
        hintColor:"black"
      })
    }else{
      this.setData({
        inputVal:"请输入有效值",
        hintColor:"red"
      })
    }
  },*/
  inputTyping: function (e) {
    var that=this
    var topItems=that.data.topItems
    if (parseInt(e.detail.value) >= 1 && parseInt(e.detail.value) <= 20) {
      if(wx.getStorageSync('searchWeek')==undefined){
        wx.setStorageSync('searchWeek', e.detail.value)
        var day = topItems[dataType].schDayT
        fillInForm(that, e.detail.value, day)
        getSign(that, topItems, dataType, e.detail.value)
        getSuv(that, topItems, dataType, e.detail.value)
      }else{
        var bSearchWeek = wx.getStorageSync('searchWeek')
        if (parseInt(bSearchWeek) != parseInt(e.detail.value)){
          var day = topItems[dataType].schDayT
          fillInForm(that, e.detail.value, day)
          getSign(that, topItems, dataType, e.detail.value)
          getSuv(that, topItems, dataType, e.detail.value)
        }
      }
      that.setData({
        inputVal: e.detail.value,
        hintColor: "black",
        nowWeek:e.detail.value
      })
      
    } else {
      that.setData({
        inputVal: "请输入有效值",
        hintColor: "red"
      })
    }
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
    wx.removeStorageSync('searchWeek')
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