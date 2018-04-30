//const util = require("../../utils/util.js");
var app=getApp()
const network=require("../../../utils/network.js")
var dataType = 0;
var types = ["1", "11", "21", "31","41"];
var DATATYPE = {
  ALLDATATYPE: "1",
  HISTORYDATATYPE: "11",
  LEAVEDATATYPE: "21",
  GIVEDATATYPE: "31",
  TRANSDATATYPE:"41"
};

//督导课程页处理
var process=function(schedule){
  var temp=JSON.parse(JSON.stringify(schedule))
  temp.schTime="第"+temp.schTime+"节课"
  switch(temp.schDay){
    case 1: temp.schDay = "星期一"
      break;
    case 2: temp.schDay = "星期二"
      break;
    case 3: temp.schDay = "星期三"
      break;
    case 4: temp.schDay = "星期四"
      break;
    case 5: temp.schDay = "星期五"
      break;
    case 6: temp.schDay = "星期六"
      break;
    case 7: temp.schDay = "星期日"
      break;
    default:
      break;
  }
  return temp;
}
//获取全部督导课程
var getAll=function(that){

  var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/showSuvCourses.do'
  var method="POST"
  var header = app.globalData.header
  var params={}
  network.request(url,params,method,header).then((data)=>{
    var allDataList = []
    for (var index in data) {
      var temp = process(data[index].schedule)
      allDataList.push({ "ArrayFlag": index, "id": data[index].suvId, "courseName": data[index].course.cozName, "courseTeacher": data[index].course.teacher.userName, "courseTime": "第" + data[index].suvWeek + "周" + temp.schDay + temp.schTime, "coursePlace": data[index].schedule.location.locName, "suvLeave": data[index].suvLeave, "suvId": data[index].suvId, "student": data[index].student, "schedule": data[index].schedule, "course": data[index].course, "suvWeek": data[index].suvWeek, "suvMan": data[index].suvMan, "workgive": false, "suvSch": data[index], "ifInsert": false, "transwork": false, "iconColor": app.globalData.iconBackColor[index]},)
    }
    that.setData({
      allDataList: allDataList
    })
  })
}
//判断正在课程是否已督导并获取
var Monitoring=function(that){
/*
  var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/isSuvRec.do'
  var method="POST"
  var header= app.globalData.header
  var params={}
  network.request(url,params,method,header).then((data)=>{
    if (data==true) {
      */
      var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/showOneSuvCoz.do'
      var method = "POST"
      var header = app.globalData.header
      var params = {}
      network.request(url, params, method, header).then((data)=>{
        var item = {"iconColor":"#FFCC99"}
        
        if(data!=""){
        var temp = process(data.schedule)
        item = { "id": data.suvId, "courseName": data.course.cozName, "courseTeacher": data.course.teacher.userName, "courseTime": "第" + data.suvWeek + "周" + temp.schDay + temp.schTime, "coursePlace": data.schedule.location.locName, "suvLeave": data.suvLeave, "suvId": data.suvId, "student": data.student, "schedule": data.schedule, "course": data.course, "suvWeek": data.suvWeek, "suvMan": data.suvMan, "isAutoSign": false, "workgive": false, "suvSch": data, "ifInsert": true, "transwork": false, "iconColor":"#FFCC99" }
        }
        that.setData({
          item: item
        })
      })
    /*} else {
      that.setData({
        item: {}
      })
    }
  })*/

  
}
//获取历史记录
var getHistory=function(that){
  var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/findHisSuvRecRes.do'
  var method = "POST"
  var header = app.globalData.header

  var params = {}
  network.request(url, params, method, header).then((data)=>{
    var historyDataList = new Array();
    for (var index in data) {
      var temp = process(data[index].oneCozAndSch.schedule)
      var a = data[index]
      historyDataList.push({ "id": a.suvId, "courseName": a.oneCozAndSch.course.cozName, "courseTeacher": a.oneCozAndSch.course.teacher.userName, "courseTime": "第"+a.suvWeek+"周"+temp.schDay + temp.schTime, "coursePlace": a.oneCozAndSch.schedule.location.locName, "suvRecord": a.suvRecord })
    }
    that.setData({
      historyDataList: historyDataList
    })
  })
  
    
}
//时间格式化函数
var formatTime = function (Time) {
  var temp = Time[0] + "-" + Time[1] + "-" + Time[2] + " " + Time[3] + ":" + Time[4] + ":" + Time[5]
  return temp
}
module.exports = {
  formatTime: formatTime,
}
//工作请假记录
var getLeaves=function(that){
    var data=that.data.allDataList
    var leaves =new Array()

    for (var index in data) {
      if(data[index].suvLeave==true){
      var a = data[index]
      leaves.push({  "courseName": a.courseName,"courseTeacher": a.courseTeacher, "coursePlace": a.coursePlace, "courseTime": a.courseTime })
    }}
    console.log("请假记录"+leaves)
    that.setData({
      leaves: leaves,
      leaveNum: leaves.length,
      points:100-leaves.length
    })

  
  
}
//获取要审核的请假
var checkLeaves = function (that) {
  var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/getLeaves.do'
  var method = "POST"
  var header = app.globalData.header

  var params = {}
  
  network.request(url, params, method, header).then((data) => {
    var leaveDataList = new Array();
    for (var index in data) {
      var temp = process(data[index].oneCozAndSch.schedule)
      var siTime = formatTime(data[index].siTime)
      var a = data[index]
      leaveDataList.push({ "index":index,"id": a.siId, "courseName": a.oneCozAndSch.course.cozName, "courseStudent": a.student.userName, "courseXuehao": a.student.userId, "courseTime": "第"+a.siWeek+"周"+temp.schDay + temp.schTime, "siTime": siTime, "siLeave": a.siLeave,"signInRes":data[index]})
    }
    that.setData({
      leaveDataList: leaveDataList,
    })
  })


}
//获得督导池塘记录
var getGive = function (that) {
  var url = "https://www.xsix103.cn/SignInSystem/Supervisor/findToBeSupervised.do"
  var method = "POST"
  var header = app.globalData.header

  var params = {}
  network.request(url, params, method, header).then((data) => {
    var giveDataList = new Array();
    for (var index in data) {
      var temp = process(data[index].schedule)
      var a = data[index]
      giveDataList.push({ "index": index, "id": a.suvId, "courseName": a.course.cozName, "courseTeacher": a.course.teacher.userName, "courseTime": "第" + a.suvWeek + "周" +temp.schDay + temp.schTime, "coursePlace": a.schedule.location.locName,"suvSch":a})
    }
    that.setData({
      giveDataList: giveDataList
    })
  })
}
//获得督导转接记录
var getTrans = function(that){
  var url = "https://www.xsix103.cn/SignInSystem/Supervisor/getSuvTrans.do"
  var method = "POST"
  var header = app.globalData.header

  var params = {}
  network.request(url, params, method, header).then((data)=>{
    var transDataList = new Array();
    for (var index in data) {
      var temp = process(data[index].suvSch.schedule)
      var a = data[index]
      transDataList.push({ "index": index,"courseName": a.suvSch.course.cozName, "courseTeacher": a.suvSch.course.teacher.userName, "courseTime": "第" + a.suvSch.suvWeek + "周" + temp.schDay + temp.schTime, "coursePlace": a.suvSch.schedule.location.locName, "suvTrans": a,"faqiren":a.suvSch.student.userName+a.suvSch.student.userId,"ifyes":false,"ifno" :false})
    }
    that.setData({
      transDataList: transDataList
    })
  })
}

//数组元素查找函数
var findIndex=function(list,temp){
  if(list!=null){
  for(var index in list){
    if(list[index].index==temp){
      console.log(index)
      return index;
      break;
    }
  }
  }
}
//身份函数
var transPermit=function(person){
  if(person.userPermit[2]==1){
    person.memberInfo="老师"
  }else if(person.userPermit[0]==1&&person.userPermit[1]==1){
    person.memberInfo="督导队员，学生"
  } else if (person.userPermit[0] == 1 && person.userPermit[1] == 0){
    person.memberInfo = "学生"
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconBackColor: app.globalData.iconBackColor,
    allDataList: [],
    historyDataList: [],
    leaveDataList: [],
    giveDataList: [],
    transDataList:[],
    item: {},
    leaves:[],//请假记录
    leaveNum:0,
    topTabItems: ["督导课堂", "历史记录", "审核请假", "督导池塘","督导转接"],
    currentTopItem: "0",
    swiperHeight: "0",
    //个人资料
    userInfo: {},
    points:100,
    ifTransWork:true
  },
  //信用分
  point:function(){
  console.log("信用分")
  },
  //请假次数
  leaveNumber:function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var person = wx.getStorageSync('person')
    if(person.userPermit[1]==1){
      setTimeout(function () { getLeaves(that) }, 1000)
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: (res.windowHeight - 37)
        });
      }
    })
    
    transPermit(person)
    wx.setStorageSync('person', person)
    that.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true,
      person: { "xingming": person.userName, "xuehao": person.userId, "userPermit": person.userPermit, "memberInfo": person.memberInfo }
    })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var person = wx.getStorageSync('person')
    if (person.userPermit[1] == 1) {
      this.setNewDataWithRes(dataType);
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
    
  },
  //设置新数据
  setNewDataWithRes: function (dataType) {
    var that=this;
    switch (types[dataType]) {
      //督导课堂
      case DATATYPE.ALLDATATYPE:
        that.setData({
          allDataList:[],
          item:{}
        })
        Monitoring(that);
        getAll(that);
        setTimeout(function () { getLeaves(that) }, 1000)
        break;
      //历史记录
      case DATATYPE.HISTORYDATATYPE:
        that.setData({
          historyDataList:[]
        })
        getHistory(that);
        break;
      //审核请假
      case DATATYPE.LEAVEDATATYPE:
        that.setData({
          leaveDataList: []
        })
        checkLeaves(that);
        break;
      //督导池塘
      case DATATYPE.GIVEDATATYPE:
        that.setData({
          giveDataList: []          
        })
        getGive(that);
        
        break;
      //督导转接
      case DATATYPE.TRANSDATATYPE:
        that.setData({
          transDataList:[]
        })
        getTrans(that)
        break;
      default:
        break;
    }
  },
  bindChange:function(e){
    console.log("目前"+e.detail.current)
    //this.setNewDataWithRes(e.detail.current);
    this.setData({
      currentTopItem:e.detail.current
    })
  },
  /*
  //设置加载更多的数据
  setMoreDataWithRes(res, target) {
    switch (types[dataType]) {
      //督导课堂
      case DATATYPE.ALLDATATYPE:
        target.setData({
          allDataList: target.data.allDataList.concat(res.data.list)
        });
        break;
      //历史记录
      case DATATYPE.HISTORYDATATYPE:
        target.setData({
          historyDataList: target.data.videoDataList.concat(res.data.list)
        });
        console.log(array);
        break;
      //督导缺勤
      case DATATYPE.LEAVEDATATYPE:
        target.setData({
          leaveDataList: target.data.pictureDataList.concat(res.data.list)
        });
        break;
      //督导转接
      case DATATYPE.GIVEDATATYPE:
        target.setData({
          giveDataList: target.data.textDataList.concat(res.data.list)
        });
        break;
      default:
        break;
    }
  },
  */
  //查看个人督导请假记录
  leaveNumber:function(){
    console.log(this.data.leaves)
   let str=JSON.stringify(this.data.leaves)
   wx.navigateTo({
     url: '../../monitor/monitorLeave/monitorLeave?jsonStr='+str,
   })
  },
  //查看督导课程历史记录
  historyCourse:function(e){
    console.log("历史记录页")
    let str = JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../monitor/hisRecord/hisRecord?jsonStr=' + str
    })
  },
  //发起自动签到快捷键
  workSign: function (e) {
    var that=this
    var suvMan={"schId":e.currentTarget.dataset.schid,"siWeek":e.currentTarget.dataset.suvweek}
    var condition1=e.currentTarget.dataset.suvman;
    console.log(condition1)
    var arrayflag=e.currentTarget.dataset.arrayflag;
    //console.log(arrayflag)
    
    var SuvSch = e.currentTarget.dataset;
    if (JSON.stringify(SuvSch) !== "{}") {
      
      if(condition1!==null){
        var condition2 = condition1.suvManAutoOpen
        console.log(condition2)            
        if(!condition2){

        console.log("更新式自动签到")

        wx.showModal({                        //更新式自动签到
          title: '再次自动签到',
          content: '仅限上课后十分钟有效',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              
              wx.request({
                url: 'https://www.xsix103.cn/SignInSystem/Supervisor/openAutoSignIn.do',
                method: "POST",
                data: suvMan,
                header: app.globalData.header,
                success:function(res){
                  if(res.data){
                  console.log(res.data)
                  wx.showToast({
                    title: '发起成功',
                    icon: "success",
                    duration: 2000,
                  })
                  if (e.currentTarget.dataset.ifinsert == false){
                  var allDataList = that.data.allDataList
                  allDataList[arrayflag].suvMan = { "suvManAutoOpen": true };
                  that.setData({
                    allDataList: allDataList
                  })
                  } else if (e.currentTarget.dataset.ifinsert == true){
                    var item = that.data.item
                    item.suvMan = { "suvManAutoOpen": true };
                    that.setData({
                      item: item
                    })
                  }
                  }else{
                    wx.showToast({
                      title: '发起失败',
                      icon: "none",
                      duration: 2000,
                    })
                  }
                  
                },
                fail: function (res) {
                  console.log(res.data)
                  wx.showToast({
                    title: '连接失败',
                    icon: "loading",
                    duration: 2000
                  })
                }
              })
            }
          }
          })
        }else{
        console.log("更新式自动关闭")
        wx.showModal({                  //更新式自动关闭
          title: '关闭自动签到',
          content: '关闭后签到结束',
          success: function (res) {
            if (res.confirm) {
              wx.request({
                url: 'https://www.xsix103.cn/SignInSystem/Supervisor/closeAutoSignIn.do',
                method: "POST",
                data: suvMan,
                header: app.globalData.header,
                success: function (res) {
                  console.log(res.data)
                  //console.log("关闭后"+that.data.allDataList[arrayflag].suvMan.suvManAutoOpen)
                  if (res.data) {
                    wx.showToast({
                      title: '关闭成功',
                      icon: "success",
                      duration: 2000,
                    })
                    if (e.currentTarget.dataset.ifinsert == false){
                    var allDataList = that.data.allDataList
                    allDataList[arrayflag].suvMan = { "suvManAutoOpen": false };
                    that.setData({
                      allDataList: allDataList
                    })
                    } else if (e.currentTarget.dataset.ifinsert == true){
                      var item = that.data.item
                     item.suvMan = { "suvManAutoOpen": false };
                      that.setData({
                        item: item
                      })
                    }
                  }else{
                    wx.showToast({
                      title: '已经关闭',
                      icon: "none",
                      duration: 2000,
                    })
                  }
                },
                fail: function (res) {
                  console.log(res.data)
                  wx.showToast({
                    title: '关闭失败',
                    icon: "loading",
                    duration: 2000
                  })
                }
              })

            } else if (res.confirm) {
              console.log("用户点击了取消")
            }
          },
          fail: function (res) {
            console.log(res.data)
            wx.showToast({
              title: '发起失败',
              icon: "loading",
              duration: 2000
            })
          }
        })
        }
    }else{
      console.log("插入式自动签到")

      wx.showModal({              //插入式自动签到
        title: '发起自动签到',
        content: '仅限上课后十分钟有效',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: 'https://www.xsix103.cn/SignInSystem/Supervisor/initAutoSignIn.do',
              method: "POST",
              data: suvMan,
              header: app.globalData.header,
              success: function (res) {
                console.log(res.data)
                if(res.data){
                  wx.showToast({
                    title: '发起成功',
                    icon: "success",
                    duration: 2000,
                  })
                  if (e.currentTarget.dataset.ifinsert == false){
                  var allDataList=that.data.allDataList
                  allDataList[arrayflag].suvMan={"suvManAutoOpen":true};
                  that.setData({
                    allDataList:allDataList
                  })
                  } else if (e.currentTarget.dataset.ifinsert == true){
                    var item = that.data.item
                    item.suvMan = { "suvManAutoOpen": true };
                    that.setData({
                      item: item
                    })
                  }
                }else{
                  wx.showToast({
                    title: '发起失败',
                    icon: "loading",
                    duration: 2000
                  })
                }
                },
              
          fail: function (res) {
            console.log(res.data)
            wx.showToast({
              title: '连接失败',
              icon: "loading",
              duration: 2000
            })
          }
            })
        
      

    } else if (res.cancel) {
      console.log('用户点击取消')
    }
}
    })
  }
    }
  },
  //点工作请假按钮
  workLeave:function(e){
    console.log(e.currentTarget.dataset)
    var suvsch = e.currentTarget.dataset;
    var SuvSch = {"suvId":suvsch.suvid,"student":suvsch.student,"schedule":suvsch.schedule,"course":suvsch.course,"suvWeek":suvsch.suvweek,"suvLeave":suvsch.suvleave,"suvMan":suvsch.suvman}
    var that=this
    var arrayflag = suvsch.arrayflag;
    if(JSON.stringify(SuvSch)!=="{}"){
      if(!SuvSch.suvLeave){
    wx.showModal({
      title: '提示',
      content: '该课程我要请假',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://www.xsix103.cn/SignInSystem/Supervisor/suvLeave.do',
            data: SuvSch,
            method: "POST",
            header: app.globalData.header,
            success: function (res) {
              console.log(res.data)
              if(res.data==true){
                wx.showToast({
                  title: '请假成功',
                  icon: 'success',
                  duration: 2000
                })
              if (e.currentTarget.dataset.ifinsert == false){
              var allDataList = that.data.allDataList
              var leaves=that.data.leaves
              var points=that.data.points
              allDataList[arrayflag].suvLeave = true;
              leaves.push({ "courseName": allDataList[arrayflag].courseName, "courseTeacher": allDataList[arrayflag].courseTeacher, "coursePlace": allDataList[arrayflag].coursePlace, "courseTime": allDataList[arrayflag].courseTime })
              points=points-1
              that.setData({
                  allDataList: allDataList,
                  leaves:leaves,
                  leaveNum:leaves.length,
                  points:points
              })
              } else if(e.currentTarget.dataset.ifinsert == true){
                var item = that.data.item
                var leaves = that.data.leaves
                var points = that.data.points
                item.suvLeave = true;
                leaves.push({ "courseName": item.courseName, "courseTeacher": item.courseTeacher, "coursePlace": item.coursePlace, "courseTime": item.courseTime })
                points = points - 1
                that.setData({
                  item: item,
                  leaves: leaves,
                  leaveNum: leaves.length,
                  points: points
                })
              }
              }else{
                wx.showToast({
                  title: '请假失败',
                  icon: 'none',
                  duration: 2000
                })  
              }
            },
            fail: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '连接失败',
                icon: "loading",
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })}else{
      wx.showModal({
        title: '提示',
        content: '该课程已请假，请勿重复操作',
        success:function(res){
          if(res.confirm){
            console.log("确定")
          }else if(res.cancel){
            console.log("取消")
          }
        }
      })
    }
    }  
    
  },
  //点放弃督导按钮
  workGive:function(e){
    console.log("放弃督导")
    var that=this
    if (JSON.stringify(e.currentTarget.dataset)!=="{}"){
    wx.showModal({
      title: '提示',
      content: '放弃督导这堂课？',
      success:function(res){
        if(res.confirm){
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/giveUpPower.do'
          var method = "POST"
          var header = app.globalData.header
          var params = e.currentTarget.dataset.suvsch
          
          network.request(url, params, method, header).then((data)=>{
            if(data==true){
              wx.showToast({
                title: '放弃成功',
                icon:"success",
                duration:1500
              })
              if(e.currentTarget.dataset.ifinsert==false){
                var allDataList = that.data.allDataList
                var index = e.currentTarget.dataset.index
                allDataList[index].workgive = true
                that.setData({
                  allDataList: allDataList
                })
              } else if (e.currentTarget.dataset.ifinsert == true){
                var item = that.data.item
                
                item.workgive = true
                that.setData({
                  item:item
                })
              }
              
              
            }else{
              wx.showToast({
                title: '放弃失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  }
  },
  /**
   * 关于督导转接
   */
  transWork:function(e){
    if (JSON.stringify(e.currentTarget.dataset) !== "{}") {
   var aboutSuvTrans={'suvTrans':{"suvSch":e.currentTarget.dataset.suvsch,"userId":""},'ifInsert':e.currentTarget.dataset.ifinsert,"index":e.currentTarget.dataset.index}
   wx.setStorageSync('aboutSuvTrans',aboutSuvTrans )
   this.setData({
     ifTransWork:false
   })
    }
  },
  cancelTrans:function(e){  
    this.setData({
      ifTransWork:true
    })
  },
  confirmTransInput:function(e){
    var aboutSuvTrans=wx.getStorageSync('aboutSuvTrans')
    aboutSuvTrans.suvTrans.userId=e.detail.value
    wx.setStorageSync('aboutSuvTrans', aboutSuvTrans)
  },
  confirmTrans:function(){
    var aboutSuvTrans = wx.getStorageSync('aboutSuvTrans')
    var suvTrans=aboutSuvTrans.suvTrans
    var index=aboutSuvTrans.index
    var ifInsert=aboutSuvTrans.ifInsert
    var that=this
    if(suvTrans.userId==""){
      wx.showToast({
        title: '输入为空',
        icon:"none",
        duration:1500
      })
    }else{
      var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/applyForTrans.do'
      var method = "POST"
      var header = app.globalData.header
      var params = suvTrans

      network.request(url, params, method, header).then((data)=>{
        if(data==true){
          wx.showToast({
            title: '操作成功',
            icon:"success",
            duration:1500
          })
          if(ifInsert==false){
            var allDataList=that.data.allDataList
            allDataList[parseInt(index)].transwork=true
            that.setData({
              allDataList:allDataList,
              ifTransWork: true
            })
          }else if(ifInsert==true){
            var item = that.data.item
            item.transwork = true
            that.setData({
              item: item,
              ifTransWork: true
            })
          }
        }else{
          wx.showToast({
            title: '操作失败',
            icon: "none",
            duration: 1500
          })
          that.setData({
            ifTransWork: true
          })
        }
      })
    }
  },
  //督导的课程页
  monitorCourse:function(e){
    var that=this
    var temp = e.currentTarget.dataset
    
      if (temp.arrayflag != null) {
        temp.suvman = that.data.allDataList[temp.arrayflag].suvMan
      } else {
        temp.suvman = that.data.item.suvMan
      }
      let str = JSON.stringify(temp);
      console.log(temp)
      wx.navigateTo({
        url: '../../monitor/work/work?jsonStr=' + str
      })
      

    
    
      
      
      
        
      
    
      
    
    /*
    Monitoring(that)
    getAll(that)
    var temp = e.currentTarget.dataset
    if(temp.arrayflag!=null){
      temp.suvman=that.data.allDataList[temp.arrayflag].suvMan
    }else{
      temp.suvman=that.data.item.suvMan
    }
    let str = JSON.stringify(temp);
    console.log(temp)
    wx.navigateTo({
      url: './work/work?jsonStr=' + str
    })
    */
  },
  //领取课堂
  receive:function(e){
    var that = this;
    var giveDataList = that.data.giveDataList
    var temp = e.currentTarget.dataset.index
    wx.showModal({
      title: "提示",
      content: '领取该课堂',
      success:function(res){
        if(res.confirm){
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/receiveSuvSch.do'
          var method = "POST"
          var header = app.globalData.header
        
          console.log(e.currentTarget)
          var params = JSON.stringify(e.currentTarget.dataset.suvsch)
          network.request(url, params, method, header).then((data)=>{
            if(data){
              var index=findIndex(giveDataList,temp)
              giveDataList.splice(index,1)
              that.setData({
                giveDataList: giveDataList
              })
              wx.showToast({
                title: '领取成功',
                icon:"success",
                duration:1500
              })

            }else{
              wx.showToast({
                title: '领取失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  },
  //放弃领取
  /*
  giveup:function(e){
    var that=this;
    var giveDataList=that.data.giveDataList
    var temp=giveDataList[e.currentTarget.dataset.index]
    wx.showModal({
      title: '提示',
      content: '放弃督导该课堂？',
      success:function(res){
        if(res.confirm){
          var index = findIndex(giveDataList, temp)
          giveDataList.splice(index, 1)
          that.setData({
            giveDataList:giveDataList
          })
        }else if(res.cancel){
          console.log('用户点击取消') 
        }
      }
    })
  },
  
  */
  
  McheckLeave:function(e){
    let str=JSON.stringify(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../../monitor/checkLeave/checkLeave?jsonString='+str,
    })
  },

  //接受督导转接
  receiveTrans:function(e){
    var that=this
    wx.showModal({
      title: '提示',
      content: '接受此转接',
      success:function(res){
        if(res.confirm){
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/acceptSuvTrans.do'
          var method = "POST"
          var header = app.globalData.header
          var index=e.currentTarget.dataset.index
          var transDataList=that.data.transDataList
          var params = e.currentTarget.dataset.suvtrans
          network.request(url, params, method, header).then((data)=>{
            if(data==true){
              wx.showToast({
                title: '接受成功',
                icon:"success",
                duration:1500
              })
            transDataList[index].ifyes=true
            that.setData({
              transDataList:transDataList
            })
            }else{
              wx.showToast({
                title: '接受失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        }
      }
    })
  },
  //拒绝督导转接
  rejectTrans: function (e) {
    var that=this
    wx.showModal({
      title: '提示',
      content: '拒绝此转接',
      success: function (res) {
        if (res.confirm) {
          var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/refuseSuvTrans.do'
          var method = "POST"
          var header = app.globalData.header
          var index = e.currentTarget.dataset.index
          var transDataList = that.data.transDataList
    
          var params = e.currentTarget.dataset.suvtrans
          network.request(url, params, method, header).then((data) => {
            if (data == true) {
              wx.showToast({
                title: '拒绝成功',
                icon: "success",
                duration: 1500
              })
              transDataList[index].ifno = true
              that.setData({
                transDataList: transDataList
              })
            } else {
              wx.showToast({
                title: '拒绝失败',
                icon: "none",
                duration: 1500
              })
            }
          })
        }
      }
    })
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