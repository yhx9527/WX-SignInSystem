const app=getApp()
const network = require("../../utils/network.js")
const util=require("../../utils/util.js")
var startX;
var startY;
var endX;
var endY;
var maxRight=160;
/*
var ReportDataSync = [
  {
    reportType: "按时间排序",
    chilItem: [
      { ID: 1, Name: "按时间排序",  Type: 1 },
      { ID: 2, Name: "按课程名称排序",  Type: 1 },
      { ID: 3, Name: "按课程人数排序", Type: 1 },
      { ID: 4, Name: "按到勤率排序", Type: 1 }]
  }
]

//定义字段 
var initSubMenuDisplay = []
var initSubMenuHighLight = []
/// <summary> 
/// 初始化DropDownMenu 
/// 1.一级目录 initSubMenuDisplay ：['hidden'] 
/// 2.二级目录 initSubMenuHighLight ：[['',''],['','','','']]] 
/// </summary> 
function loadDropDownMenu() {
  for (var i = 0; i < ReportDataSync.length; i++) {
    //一级目录 
    initSubMenuDisplay.push('hidden')
    //二级目录 
    var report = []
    for (var j = 0; j < ReportDataSync[i].chilItem.length; j++) {
      report.push([''])
    }
    initSubMenuHighLight.push(report)
  }
}
*/
var getCards=function(that){
  //获取课表
  var url = "https://www.xsix103.cn/SignInSystem/Student/showCourses.do"
  var params={}
  var header = app.globalData.header
  var method="POST"
  network.request(url,params,method,header).then((data)=>{
    var cards = []
    for (var index in data.courses) {
      if(data.courses[index].schedules.length>1){
      var final = util.transchedules(data.courses[index].schedules)
        //console.log("整合情况" + JSON.stringify(final,undefined,'\t'))
      }else{
        var final = util.transchedule1(data.courses[index].schedules)
        
      }
      //for (var i in final) {

        cards.push({ "index":index,"id": data.courses[index].cozId, "courseName": data.courses[index].cozName, "courseTeacher": data.courses[index].teacher.userName, "courseTime": final[0].schDay, "coursePlace": final[0].location.locName, "locLat": final[0].location.locLat, "locLon": final[0].location.locLon, "right": 0, "startRight": 0 ,"isTouchMove":false,"schWeek":final[0].schWeek,"schedule":final[0].schedule})
      //}

    }
    //console.log("全部课表:"+cards)
    that.setData({
      cards: cards
    })
    wx.setStorageSync('Course', data)
    wx.setStorageSync('Cards', cards)
  })
}
//正在签到课程处理
var transchedule = function (schedule) {

      var newschedules={}
      newschedules=JSON.parse(JSON.stringify(schedule))
      newschedules.schTime = "第"+schedule.schTime + "节课";
      newschedules.schedule = [{
        "schedule": schedule, "scheduleTime": newschedules.schTime
      }]
      switch (newschedules.schDay) {
        case 1: newschedules.schDay = "星期一" + "第" + schedule.schTime + "节课";
          break;
        case 2: newschedules.schDay = "星期二" + "第" + schedule.schTime + "节课";
          break;
        case 3: newschedules.schDay = "星期三" + "第" + schedule.schTime + "节课";
          break;
        case 4: newschedules.schDay = "星期四" + "第" + schedule.schTime + "节课";
          break;
        case 5: newschedules.schDay = "星期五" + "第" + schedule.schTime + "节课";
          break;
        case 6: newschedules.schDay = "星期六" + "第" + schedule.schTime + "节课";
          break;
        case 7: newschedules.schDay = "星期日" + "第" + schedule.schTime + "节课";
          break;
        default:
          break;
      }

      if (newschedules!= null)
    return newschedules;

}
module.exports = {
  transchedule:transchedule,
}
//获取正在签到的课程
var getSigning=function(that){
  var url = "https://www.xsix103.cn/SignInSystem/Student/checkCourse.do"
  var header = app.globalData.header
  var params={}
  var method="POST"
  network.request(url,params,method,header).then((data)=>{
    console.log("签到"+data)
    var count = 0;
    var signingCard = {};

    var final = transchedule(data.schedule)


    signingCard = { "loc":99, "courseName": data.course.cozName, "courseTeacher": data.course.teacher.userName, "courseTime": final.schDay , "coursePlace": final.location.locName, "locLat": final.location.locLat, "locLon": final.location.locLon, "right": 0, "startRight": 0,"schWeek": data.schedule.schWeek,"schedule":final.schedule, "isTouchMove": false }



    that.setData({
      signingCard: signingCard
    })
    wx.setStorageSync('SigningCourse', data)
    wx.setStorageSync('SigningCard', signingCard)
  })
}
//获取老师课表
var getTchList=function(that){
  var url = "https://www.xsix103.cn/SignInSystem/Teacher/showTchCourses.do"
  var params = {}
  var header = app.globalData.header
  var method = "POST"
  network.request(url, params, method, header).then((data)=>{
    var teacherLists = [];
    for (var index in data.courses) {
      if (data.courses[index].schedules.length > 1) {
        var final = util.transchedules(data.courses[index].schedules)
      } else {
        var final = util.transchedule1(data.courses[index].schedules)
        console.log("yjkd" + JSON.stringify(final))
      }
      var a=data.courses[index]
        teacherLists.push({ "cozId":a.cozId , "courseName": a.cozName, "courseNum": 100, "courseTime": final[0].schDay, "coursePlace": final[0].location.locName,"teacher":data.teacher,"schedules":a.schedules })
      
    }

    that.setData({
      teacherLists:teacherLists
    })
    wx.setStorageSync('teacher',data )
  })
}
//课程块滑动渲染函数
var slideOne=function(self,cards,index){
  switch (index) {
    case '0':
      self.setData({
        'cards[0].right': cards[index].right
      })
      break;
    case '1':
      self.setData({
        'cards[1].right': cards[index].right
      })
      break;
    case '2':
      self.setData({
        'cards[2].right': cards[index].right
      })
      break;
    case '3':
      self.setData({
        'cards[3].right': cards[index].right
      })
      break;
    case '4':
      self.setData({
        'cards[4].right': cards[index].right
      })
      break;
    case '5':
      self.setData({
        'cards[5].right': cards[index].right
      })
      break;
    case '6':
      self.setData({
        'cards[6].right': cards[index].right
      })
      break;
    case '7':
      self.setData({
        'cards[7].right': cards[index].right
      })
      break;
    case '8':
      self.setData({
        'cards[8].right': cards[index].right
      })
      break;
    case '9':
      self.setData({
        'cards[9].right': cards[index].right
      })
      break;
    case '10':
      self.setData({
        'cards[10].right': cards[index].right
      })
      break;
    case '11':
      self.setData({
        'cards[11].right': cards[index].right
      })
      break;
    case '12':
      self.setData({
        'cards[12].right': cards[index].right
      })
      break;
    case '13':
      self.setData({
        'cards[13].right': cards[index].right
      })
      break;
    case '14':
      self.setData({
        'cards[14].right': cards[index].right
      })
      break;
    case '15':
      self.setData({
        'cards[15].right': cards[index].right
      })
      break;
    case '16':
      self.setData({
        'cards[16].right': cards[index].right
      })
      break;
    case '17':
      self.setData({
        'cards[17].right': cards[index].right
      })
      break;
    case '18':
      self.setData({
        'cards[18].right': cards[index].right
      })
      break;
    case '19':
      self.setData({
        'cards[19].right': cards[index].right
      })
      break;
    case '20':
      self.setData({
        'cards[20].right': cards[index].right
      })
      break;
  }

}
//签到函数
var SignIn = function (that, schedule,loc){
  console.log("loc"+JSON.stringify(loc,undefined,'\t'))
  wx.request({
    url: "https://www.xsix103.cn/SignInSystem/Student/checkSignIn.do",
    data: schedule,
    method: 'POST',
    header: app.globalData.header,
    success(res) {
      console.log(res.data)
      if (res.data == false) {
        wx.request({
          url: "https://www.xsix103.cn/SignInSystem/Student/signIn.do",
          data: schedule,
          method: 'POST',
          header: app.globalData.header,
          success: function (res) {
            console.log(res.data);
            if (res.data.success == true) {
              wx.showToast({
                title: '签到成功',
                icon: "success",
                duration: 2000
              })
            } else {
              if (res.data.needSignIn == true) {
                var currentStatu = "open"
                that.util(currentStatu)
                that.setData({
                    markers: [
                      {
                        id: 0
                        , iconPath: "../../image/ic_position.png"
                        , longitude: schedule.location.locLon
                        , latitude: schedule.location.locLat
                        , width: 30
                        , height: 30
                        , callout:
                        {
                          content: "我的位置",
                          display: 'ALWAYS'
                        }

                      },
                      {
                        id: 1,
                        iconPath: '../../image/ic_location.png',

                        longitude: loc.loclon,
                        latitude: loc.loclat,
                        width: 30,
                        height: 30
                      }
                    ]
                    , circles: [{
                      longitude: loc.loclon,
                      latitude: loc.loclat,
                      color: '#FF0000DD',
                      fillColor: '#7cb5ec88',
                      radius: 40,
                      strokeWidth: 0.1
                    }],
                    polyline: [{
                      points: [{
                        longitude: loc.loclon,
                        latitude: loc.loclat,
                      },
                      {
                        longitude: schedule.location.locLon,
                        latitude: schedule.location.locLat
                      }],
                      color: "#FF0000DD",
                      width: 2,

                    }],
                    controls: [{
                      id: 1,
                      iconPath: '../../image/jian.png',
                      position: {
                        left: 245,
                        top: 0,
                        width: 30,
                        height: 30
                      },
                      clickable: true,
                    },
                    {
                      id: 2,
                      iconPath: '../../image/jia.png',
                      position: {
                        left: 280,
                        top: 0,
                        width: 30,
                        height: 30
                      },
                      clickable: true,
                    }]
                  })
                if (res.data.time == false) {
                  that.setData({
                    SignText: "签到时间未到"
                  })
                } else {
                  that.setData({
                    SignText:"正在签到..."
                  })
                }
              } else {
                wx.showToast({
                  title: '无需签到',
                  icon: "none",
                  duration: 2000
                })
              }
            }
            /*if (res.data.needSignIn && res.data.success) {
              var currentStatu = "successclose";
              that.util(currentStatu)
            } else {
              var currentStatu = "failclose"
              that.util(currentStatu)
            }*/
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
      } else {
        var currentStatu = "successedclose";
        that.util(currentStatu)
      }
    },
    fail(res) {
      console.log(res.data)
      wx.showToast({
        title: '连接失败',
        icon: "loading",
        duration: 2000
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    signingCard: {}, //正在签到
    scrollHeight: 0,
    //text:"签到仅限课前十分钟和上课十分钟之内有效！！！",
    //marqueePace: 0.5,//滚动速度
    //marqueeDistance: 0,//初始滚动距离
    //orientation: 'left',//滚动方向
    //marqueeDistance2: 0,
    //marquee2copy_status:false,
    //marquee2_margin: 60,
    //size:14,
    //interval: 30 ,// 时间间隔
    hidden:true,
    showModalStatus:false,
    locationInfo:null,
    //自己位置
    longitude:null,
    latitude:null,
    /*
    markers:[],
    circles:[],
    polyline:[],
    controls:[],
    */
    SignText:"",//签到失败提示
    //地图缩放比例
    scale:18,
    schedule: {},//发送给后台的单个签到
    studentPermit: null,
    teacherPermit: null,
    //reportData: [],
    //subMenuDisplay: [],
   // subMenuHighLight: [],
    animationData: {},
    animationData1: {},
    teacherLists: [],
    ifshade: false,
    person:{}
  },
  //全部课程的滑动
  allStart:function(e){
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var cards = this.data.cards;
    for (var i in cards) {
      var data = cards[i];
      data.startRight = data.right;
    }
  },
  allMove:function(e){
    var self = this;
    var index = e.currentTarget.dataset.index;
    var cards = this.data.cards;
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
      var angle = self.angle({ X: startX, Y: startY }, { X: endX, Y: endY })
      //var res=cards;
      if (Math.abs(angle) > 30) return;
      //right to left
      if ((endX - startX) < 0) {
        var startRight = cards[index].startRight;
            var change = startX - endX;
            startRight += change;
            if (startRight > maxRight)
              startRight = maxRight;
            cards[index].right = startRight;
          
        
      } else {
        var startRight = cards[index].startRight;
            var change = endX - startX;
            startRight -= change;
            if (startRight < 0)
              startRight = 0;
            cards[index].right = startRight;
          
        
      }
      slideOne(self,cards,index)
      
  },
  allEnd:function(e){
    var cards = this.data.cards;
    var index = e.currentTarget.dataset.index;

      if (cards[index].right <= 100 / 2) {
        cards[index].right = 0;
      } else {
        cards[index].right = maxRight;
      }
    slideOne(this,cards,index)
  },
  //计算滑动角度
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //签到课程的滑动
  signingStart:function(e){
    var touch=e.touches[0]
    startX=touch.clientX
    startY=touch.clientY
    var signingCard=this.data.signingCard
    signingCard.startRight=signingCard.right
  },
  signingMove:function(e){
    var self = this;
    var loc = e.currentTarget.dataset.loc;
    var signingCard = this.data.signingCard;
    var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;
    var angle = self.angle({ X: startX, Y: startY }, { X: endX, Y: endY })
      //var res=cards;
      if (Math.abs(angle) > 30) return;
      //right to left
      if ((endX - startX) < 0) {
        if (signingCard.loc == loc) {
          var startRight = signingCard.startRight;
          var change = startX - endX;
          startRight += change;
          if (startRight > maxRight)
            startRight = maxRight;
          signingCard.right = startRight;
        }

      } else {

        if (signingCard.loc == loc) {
          var startRight = signingCard.startRight;
          var change = endX - startX;
          startRight -= change;
          if (startRight < 0)
            startRight = 0;
          signingCard.right = startRight;
        }

      }
      self.setData({
        'signingCard.right': signingCard.right
      });
  },
  signingEnd:function(e){
    var signingCard = this.data.signingCard;
    if (signingCard.right <= 100 / 2) {
      signingCard.right = 0;
    } else {
      signingCard.right = maxRight;
    }

    this.setData({
      'signingCard.right': signingCard.right
    });
  },
/*
//动画效果版滑动
  move1: function (e) {
    var self = this;
    var signingCard = this.data.signingCard;
    //滑动变化坐标
    var touch = e.changedTouches[0];
    endX = touch.clientX;
    endY = touch.clientY;
    //获取滑动角度
    var angle = self.angle({ X: startX, Y: startY }, { X: endX, Y: endY })
    //var res=cards;
    if (Math.abs(angle) > 30) return;
    //right to left
    if ((endX - startX) < 0) {
      signingCard.isTouchMove = true;
    } else {
      signingCard.isTouchMove = false
    }
    self.setData({
      signingCard:signingCard
    });

  },
*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    
    wx.getSystemInfo({
      success: function (res) {
        
        app.globalData.Height=res.windowHeight;
        app.globalData.Width=res.windowWidth;
        console.log("屏幕高"+app.globalData.Height)
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }); 
    

    //var length = that.data.text.length * that.data.size;//文字长度
    //var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    var person=wx.getStorageSync('person')
    that.setData({
      //length: length,
      //windowWidth: windowWidth,
      //marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin,//当文字长度小于屏幕长度时，需要增加补白
      studentPermit:person.userPermit[0],
      teacherPermit:person.userPermit[2],
      //reportData: ReportDataSync,//菜单数据 
      //subMenuDisplay: initSubMenuDisplay, //一级 
      //subMenuHighLight: initSubMenuHighLight, //二级
      person:person 
    });
    if(that.data.teacherPermit==1){
    //loadDropDownMenu();
    getTchList(that);
    }
    if(that.data.studentPermit==1){
    //that.run1();// 水平一行字滚动完了再按照原来的方向滚动
    //that.run2();// 第一个字消失后立即从右边出现
    getSigning(that);
    getCards(that);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   //console.log(app.globalData.userPermit)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    

  },
  /*
  //一级菜单点击 
  tapMainMenu: function (e) {
    //获取当前一级菜单标识 
    var index = parseInt(e.currentTarget.dataset.index);
    //改变显示状态 
    for (var i = 0; i < initSubMenuDisplay.length; i++) {
      if (i == index) {
        if (this.data.subMenuDisplay[index] == "show") {
          initSubMenuDisplay[index] = 'hidden'
          this.data.ifshade = false
        } else {
          initSubMenuDisplay[index] = 'show'

          this.data.ifshade = true
        }
      } else {
        initSubMenuDisplay[i] = 'hidden'
        this.data.ifshade = false
      }
    }

    this.setData({
      subMenuDisplay: initSubMenuDisplay,
      ifshade: this.data.ifshade,

    })
    this.animation(index);
  },

  //二级菜单点击 
  tapSubMenu: function (e) {
    //隐藏所有一级菜单 
    //this.setData({ 
    //subMenuDisplay: initSubMenuDisplay() 
    //}); 
    // 当前二级菜单的标识 
    var indexArray = e.currentTarget.dataset.index.split('-');
    var index = parseInt(indexArray[0]);
    // 删除所在二级菜单样式 
    for (var i = 0; i < initSubMenuHighLight.length; i++) {
      if (indexArray[0] == i) {
        for (var j = 0; j < initSubMenuHighLight[i].length; j++) {
          initSubMenuHighLight[i][j] = '';
        }
      }
    }
    //给当前二级菜单添加样式 
    initSubMenuHighLight[indexArray[0]][indexArray[1]] = 'highlight';
    var clicked = ReportDataSync[indexArray[0]].chilItem[indexArray[1]]
    ReportDataSync[indexArray[0]].reportType = clicked.Name
    initSubMenuDisplay[indexArray[0]] = "hidden"


    //刷新样式 
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
      reportData: ReportDataSync,
      subMenuDisplay: initSubMenuDisplay,
      ifshade: false,

    });
    this.animation(index);

  },
*/
/** 
*文字移动
*/
/*
  run1: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.length) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.run1();
      }
    }, vm.data.interval);
  },
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
  },
*/
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



  //请假
  leave:function(e){
    
    var ArraySchedule=e.currentTarget.dataset.schedule
    if(ArraySchedule.length==1){
      let str = JSON.stringify({"coursename":e.currentTarget.dataset.coursename,"schedule":ArraySchedule[0].schedule});
      wx.navigateTo({
        url: './parts/leave/leave?jsonStr=' + str
      })
    }else if(ArraySchedule.length > 1){
      var itemList = []
      for(var index in ArraySchedule){
        itemList.push(ArraySchedule[index].scheduleTime+"请假")
      }
      wx.showActionSheet({
        itemList: itemList,
        success:function(res1){
          let str = JSON.stringify({ "coursename": e.currentTarget.dataset.coursename, "schedule": ArraySchedule[res1.tapIndex].schedule });
          wx.navigateTo({
            url: './parts/leave/leave?jsonStr=' + str
          })
        }
      })
    }
    
  },
  //签到地图
  SignMap:function(e){
    var arraySchedule=JSON.parse(JSON.stringify(e.currentTarget.dataset.schedule))
    var that = this
    var locationInfo={}
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        locationInfo=res
        //wx.setStorageSync('locationInfo', locationInfo)
        that.setData({
          longitude: locationInfo.longitude,
          latitude: locationInfo.latitude
        })
        if (arraySchedule.length == 1) {

          var schedule = arraySchedule[0].schedule
          schedule.location.locLat = locationInfo.latitude
          schedule.location.locLon = locationInfo.longitude
          SignIn(that, schedule, e.currentTarget.dataset)
          /*} else {
            var currentStatu = e.currentTarget.dataset.statu
            this.util(currentStatu)
          }*/

          //var that=this;    

          //}
          // })
        } else if (arraySchedule.length > 1) {
          var itemList = []
          for (var index in arraySchedule)
            itemList.push(arraySchedule[index].scheduleTime + "签到")
          wx.showActionSheet({
            itemList: itemList,
            success: function (res1) {
              var schedule = arraySchedule[res1.tapIndex].schedule
              schedule.location.locLat = locationInfo.latitude
              schedule.location.locLon = locationInfo.longitude
              SignIn(that, schedule, e.currentTarget.dataset)
            }
          })
        }
      },
      fail:function(res){
        console.log("未授权定位"+JSON.stringify(res,undefined,'\t'))
        wx.showModal({
          title: '提示',
          content: '请先授权位置信息',
          success:function(res2){
            wx.openSetting({
              success:function(res3){
                console.log(res3)
              }
            })
          }
        })
        //wx.setStorageSync('locationInfo', -1)
      }
    })
  
  },
  /*
  //还未签到的地图
  signMap: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)

    app.getLocationInfo(function (locationInfo) {

      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude
        , latitude: locationInfo.latitude
        ,ifSign:"签到时间未到"
        , markers: [
          {
            id: 0
            , iconPath: "../../image/ic_position.png"
            , longitude: locationInfo.longitude
            , latitude: locationInfo.latitude
            , width: 30
            , height: 30
            , callout:
            {
              content: "我的位置",
              display: 'ALWAYS'
            }

          },
          {
            id: 1,
            iconPath: '../../image/ic_location.png',

            longitude: e.currentTarget.dataset.loclon,
            latitude: e.currentTarget.dataset.loclat,
            width: 30,
            height: 30
          }
        ]
        , circles: [{
          longitude: e.currentTarget.dataset.loclon,
          latitude: e.currentTarget.dataset.loclat,
          color: '#FF0000DD',
          fillColor: '#7cb5ec88',
          radius: 40,
          strokeWidth: 0.1
        }],
        polyline: [{
          points: [{
            longitude: e.currentTarget.dataset.loclon,
            latitude: e.currentTarget.dataset.loclat,
          },
          {
            longitude: locationInfo.longitude,
            latitude: locationInfo.latitude
          }],
          color: "#FF0000DD",
          width: 2,

        }],
        controls: [{
          id: 1,
          iconPath: '../../image/jian.png',
          position: {
            left: 245,
            top: 0,
            width: 30,
            height: 30
          },
          clickable: true
        },
        {
          id: 2,
          iconPath: '../../image/jia.png',
          position: {
            left: 280,
            top: 0,
            width: 30,
            height: 30
          },
          clickable: true
        }]

      })
      wx.removeStorageSync('schedule')
     
      
    })
    

    //}
    // })

  },
  */
  
  //点击缩放按钮动态请求数据
  controlclick(e) {
    var that = this;
    console.log("点击缩放")
    that.mapCtx = wx.createMapContext('map4select')
    console.log("scale===" + that.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      that.setData({
        scale:that.data.scale-2
      })
      // }
    } else {
      //  if (this.data.scale !== 13) {
      that.setData({
        scale: ++that.data.scale
      })
      // }
    }
  },
  //地图视野变化时触发
  regionchange:function(e){

  },
  //点击签到
  confirm:function(e){
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  cancel:function(e){
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },

  /**将教室的经纬度mark出来
  getLngLat: function (locLon,locLat) {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
        that.setData({
          longitude: locLon
          , latitude: locLat
          , markers: [
            {
              id: 0
              , iconPath: "../../image/ic_location.png"
              , longitude: locLon
              , latitude:locLat
              , width: 30
              , height: 30
            }
          ]
        })

  },**/
  

  courseInfo:function(e){
    //先将对象转换为json字符串然后到下个页面将json字符串，再转化为对象
    let str=JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: './parts/courseInfo/courseInfo?jsonStr='+str
    })
  },
  //刷新
  onPullDownRefresh:function(){
    console.log("刷新")
    var that=this;
    that.setData({
      signingCard:{},
      cards:[],
      teacherLists:[],
    })
 
    
    if(that.data.person.userPermit[0]==1){
      
        getSigning(that);
        getCards(that);
        wx.stopPullDownRefresh();
    }
    if(that.data.person.userPermit[2]==1){
       getTchList(that);
       wx.stopPullDownRefresh();
    }
    
   
    
  
   
  
  },
  //老师单个课程点击
  singleTlist: function (e) {
    let str = JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../teacher/teacher?jsonStr=' + str
    })
  },
  //下拉菜单动画
  animation: function (index) {
    // 定义一个动画
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    // 是显示还是隐藏
    var flag = this.data.subMenuDisplay[index] == 'show' ? 1 : -1;
    // flag = 1;
    // 使之Y轴平移
    animation.translateY(flag * (initSubMenuHighLight[index].length * 34) + 8).step();
    // 导出到数据，绑定给view属性
    this.setData({
      animationData1: animation.export()
    });
  },
  //签到地图弹框动画
  
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //签到失败 
      if (currentStatu == "failclose") {
        this.setData(
          {
            showModalStatus: false
          }
        );
        wx.showToast({
          title: '签到失败',
          icon: 'none',
          duration: 1000

        })
        
      }
      //已签到时关闭
      if (currentStatu == "successedclose") {
        this.setData(
          {
            showModalStatus: false
          }
        );
        wx.showModal({
          title: '提示',
          content: '已签到，请勿重复操作',
        })

      }
      //签到成功时关闭
      if (currentStatu == "successclose") {
        this.setData(
          {
            showModalStatus: false
          }
        );
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 1000

        })

      }
      //取消时关闭
      if (currentStatu == "cancel") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } 


})
   