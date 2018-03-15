const app=getApp()
const network = require("../../utils/network.js")
var startX;
var startY;
var endX;
var endY;
var key;
var maxRight=160;

var ReportDataSync = [
  {
    reportType: "按时间排序",
    chilItem: [
      { ID: 1, Name: "按时间排序", ReportUrl: "DailyReport.aspx", Type: 1 },
      { ID: 2, Name: "按课程名称排序", ReportUrl: "DailyReport.aspx", Type: 1 },
      { ID: 3, Name: "按课程人数排序", ReportUrl: "DailyReport.aspx", Type: 1 },
      { ID: 4, Name: "按到勤率排序", ReportUrl: "DailyReport.aspx", Type: 1 }]
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
//自制数组
var transchedules=function(schedules){
  var newschedules=new Array();
  var finalschedules=new Array();
  for(var i=0,j=-1;i<schedules.length-1;i++){
   
    if(schedules[i].schDay==schedules[i+1].schDay){
      newschedules.push(schedules[i]);
      j=j+1;
      newschedules[j].schTime = schedules[i].schTime + "," + schedules[i+1].schTime+"节课";
      switch(newschedules[j].schDay){
        case 1: newschedules[j].schDay = "星期一" + newschedules[j].schTime 
          break;
        case 2: newschedules[j].schDay = "星期二" + newschedules[j].schTime 
          break;
        case 3: newschedules[j].schDay = "星期三" + newschedules[j].schTime 
          break;
        case 4: newschedules[j].schDay = "星期四" + newschedules[j].schTime 
          break;
        case 5: newschedules[j].schDay = "星期五" + newschedules[j].schTime 
          break;
        case 6: newschedules[j].schDay = "星期六" + newschedules[j].schTime 
          break;
        case 7: newschedules[j].schDay = "星期日" + newschedules[j].schTime 
          break;
        default:
          break;
      }
   
    }

  }
  for(var i=0,j=-1;i<newschedules.length-1;i++){
    if(newschedules[i].location.locName==newschedules[i+1].location.locName){
      finalschedules.push(newschedules[i]);
      j=j+1;
      finalschedules[j].schDay = newschedules[i].schDay+"和"+newschedules[i+1].schDay
    }

  }
  if(finalschedules!=null)
    return finalschedules;
  else
    return newschedules;

}

var getCards=function(that){
  //获取课表
  var url = "https://www.xsix103.cn/SignInSystem/Student/showCourses.do"
  var params={}
  var header = {
    'Cookie': app.globalData.header.Cookie
  }
  var method="POST"
  network.request(url,params,method,header).then((data)=>{
    var count = 0;
    var cards = that.data.cards;
    for (var index in data.courses) {
      var final = transchedules(data.courses[index].schedules)
      for (var i in final) {

        cards.push({ "id": data.courses[index].cozId, "courseName": data.courses[index].cozName, "courseTeacher": data.courses[index].teacher.userName, "courseTime": final[i].schDay, "coursePlace": final[i].location.locName, "locLat": final[i].location.locLat, "locLon": final[i].location.locLon, "right": 0, "startRight": 0 })
      }

    }
    that.setData({
      cards: cards
    })
    wx.setStorageSync('Course', data)
    wx.setStorageSync('Cards', cards)
  })
  /*
  wx.request({
    url: "https://www.xsix103.cn/SignInSystem/Student/showCourses.do",
    method: 'POST',
    header: {
      'Cookie': app.globalData.header.Cookie
    },
    success: function (res) {
      console.log(res.data)
      var count = 0;
      var cards=that.data.cards;
      for (var index in res.data.courses) {
        var final = transchedules(res.data.courses[index].schedules)
        for (var i in final) {

        cards.push({ "id": res.data.courses[index].cozId, "courseName": res.data.courses[index].cozName, "courseTeacher": res.data.courses[index].teacher.userName, "courseTime": final[i].schDay, "coursePlace": final[i].location.locName, "locLat": final[i].location.locLat, "locLon": final[i].location.locLon, "right": 0, "startRight":0})
        }
        
      }
      that.setData({
        cards:cards
      })
      wx.setStorageSync('Course', res.data)
      wx.setStorageSync('Cards', cards)
    },
    fail: function (res) {
      console.log(res.data)
      wx.showToast({
        title: '获取失败',
        icon: "loading",
        duration: 2000
      })

    }
  })*/
}
//正在签到课程处理
var transchedule = function (schedule) {

      var newschedules={}
      newschedules=JSON.parse(JSON.stringify(schedule))
      newschedules.schTime = "第"+schedule.schTime + "节课";
      switch (newschedules.schDay) {
        case 1: newschedules.schDay = "星期一" 
          break;
        case 2: newschedules.schDay = "星期二"
          break;
        case 3: newschedules.schDay = "星期三" 
          break;
        case 4: newschedules.schDay = "星期四" 
          break;
        case 5: newschedules.schDay = "星期五" 
          break;
        case 6: newschedules.schDay = "星期六" 
          break;
        case 7: newschedules.schDay = "星期日"
          break;
        default:
          break;
      }

      if (newschedules!= null)
    return newschedules;

}
//获取正在签到的课程
var getSigning=function(that){
  var url = "https://www.xsix103.cn/SignInSystem/Student/checkCourse.do"
  var header = {
    'Cookie': app.globalData.header.Cookie
  }
  var params={}
  var method="POST"
  network.request(url,params,method,header).then((data)=>{
    var count = 0;
    var signingCard = that.data.signingCard;

    var final = transchedule(data.schedule)


    signingCard = { "id": data.course.cozId, "courseName": data.course.cozName, "courseTeacher": data.course.teacher.userName, "courseTime": final.schDay + final.schTime, "coursePlace": final.location.locName, "locLat": final.location.locLat, "locLon": final.location.locLon, "right": 0, "startRight": 0, "schId": data.schedule.schId, "schWeek": data.schedule.schWeek, "schTime": data.schedule.schTime, "schDay": data.schedule.schDay, "schYear": data.schedule.schYear, "schTerm": data.schedule.schTerm, "schFortnight": data.schedule.schFortnight }



    that.setData({
      signingCard: signingCard
    })
    wx.setStorageSync('SigningCourse', data)
    wx.setStorageSync('SigningCard', signingCard)
  })
  /*
  wx.request({
    url: "https://www.xsix103.cn/SignInSystem/Student/checkCourse.do",
    method: 'POST',
    header: {
      'Cookie': app.globalData.header.Cookie
    },
    success: function (res) {
      console.log(res.data)
      var count = 0;
      var signingCard = that.data.signingCard;
     
        var final = transchedule(res.data.schedule)
        

          signingCard={ "id": res.data.course.cozId, "courseName": res.data.course.cozName, "courseTeacher": res.data.course.teacher.userName, "courseTime": final.schDay+final.schTime, "coursePlace": final.location.locName, "locLat": final.location.locLat, "locLon": final.location.locLon, "right": 0, "startRight": 0,"schId":res.data.schedule.schId,"schWeek":res.data.schedule.schWeek,"schTime":res.data.schedule.schTime,"schDay":res.data.schedule.schDay,"schYear":res.data.schedule.schYear,"schTerm":res.data.schedule.schTerm,"schFortnight":res.data.schedule.schFortnight}
        

      
      that.setData({
        signingCard: signingCard
      })
      wx.setStorageSync('SigningCourse', res.data)
      wx.setStorageSync('SigningCard', signingCard)
    },
    fail: function () {
      console.log("获取失败")
    }
  })
  */
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    signingCard: {}, //正在签到
    scrollTop: 0,
    scrollHeight: 0,
    text:"签到仅限课前十分钟和上课十分钟之内有效！！！",
    marqueePace: 0.5,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status:false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 30 ,// 时间间隔
    hidden:true,
    showModalStatus:false,
    locationInfo:null,
    //自己位置
    longitude:11,
    latitude:2,
    ifSign:"签到时间未到",
    //地图缩放比例
    scale:18,
    schedule: {},//发送给后台的单个签到
    studentPermit: 0,
    teacherPermit: 0,


    reportData: [],
    subMenuDisplay: [],
    subMenuHighLight: [],
    animationData: {},
    animationData1: {},
    teacherLists: [{ "id": 1, "courseName": "java", "courseNum": 100, "courseTime": "星期一", "coursePlace": "二教" }, { "id": 2, "courseName": "数据库", "courseNum": 100, "courseTime": "星期一", "coursePlace": "二教" }],
    ifshade: false,
  },
  //全部课程的滑动
  start:function(e){
    var touch=e.touches[0];
    startX=touch.clientX;
    startY=touch.clientY;
    var cards=this.data.cards;
    for(var i in cards){
      var data=cards[i];
      data.startRight=data.right;
    }
    key=true;
  },
  end:function(e){
    var cards=this.data.cards;
    for(var i in cards){
      var data=cards[i];
      if(data.right<=100/2){
        data.right=0;
      }else{
        data.right=maxRight;
      }
    }
    this.setData({
      cards:cards
    });
  },
  move:function(e){
    var self=this;
    var dataID=e.currentTarget.id;
    var cards=this.data.cards;
    if(key){
      var touch=e.touches[0];
      endX=touch.clientX;
      endY=touch.clientY;

      if(endX-startX==0)
      return ;
      var res=cards;
      //right to left
      if((endX-startX)<0){
        for(var k in res){
          var data=res[k];
          if(res[k].id==dataID){
            var startRight=res[k].startRight;
            var change=startX-endX;
            startRight+=change;
            if(startRight>maxRight)
            startRight=maxRight;
            res[k].right=startRight;
          }
        }
      }else{
        for (var k in res) {
          var data = res[k];
          if (res[k].id == dataID) {
            var startRight = res[k].startRight;
            var change = endX-startX;
            startRight -= change;
            if (startRight <0)
              startRight = 0;
            res[k].right = startRight;
      }
    }
  }
  self.setData({
    cards:cards
  });
    }
  },
  //签到课程的滑动
  start1: function (e) {
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var signingCard = this.data.signingCard;
      var data = signingCard;
      data.startRight = data.right;
    
    key = true;
  },
  end1: function (e) {
    var signingCard = this.data.signingCard;
    
      var data = signingCard;
      if (data.right <= 100 / 2) {
        data.right = 0;
      } else {
        data.right = maxRight;
      }
    
    this.setData({
      signingCard: signingCard
    });
  },
  move1: function (e) {
    var self = this;
    var dataID = e.currentTarget.id;
    var signingCard = this.data.signingCard;
    if (key) {
      var touch = e.touches[0];
      endX = touch.clientX;
      endY = touch.clientY;

      if (endX - startX == 0)
        return;
      var res = signingCard;
      //right to left
      if ((endX - startX) < 0) {
        
          var data = res;
          if (res.id == dataID) {
            var startRight = res.startRight;
            var change = startX - endX;
            startRight += change;
            if (startRight > maxRight)
              startRight = maxRight;
            res.right = startRight;
          }
        
      } else {
     
          var data = res;
          if (res.id == dataID) {
            var startRight = res.startRight;
            var change = endX - startX;
            startRight -= change;
            if (startRight < 0)
              startRight = 0;
            res.right = startRight;
          }
        
      }
      self.setData({
        signingCard: signingCard
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    }); 
    

    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    
    that.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin,//当文字长度小于屏幕长度时，需要增加补白
      studentPermit:app.globalData.userPermit[0],
      teacherPermit:app.globalData.userPermit[2],
      reportData: ReportDataSync,//菜单数据 
      subMenuDisplay: initSubMenuDisplay, //一级 
      subMenuHighLight: initSubMenuHighLight //二级 
    });
    if(that.data.teacherPermit==1){
    loadDropDownMenu()
    }
    if(that.data.studentPermit==1){
    that.run1();// 水平一行字滚动完了再按照原来的方向滚动
    that.run2();// 第一个字消失后立即从右边出现
    getSigning(that);
    getCards(that);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   console.log(app.globalData.userPermit)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    

  },
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
    let str = JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: './parts/leave/leave?jsonStr='+str
    })
  },
  //正在签到地图
  signMaping:function(e){
    var that=this;
      app.getLocationInfo(function (locationInfo) {
        
        console.log('map', locationInfo);
        that.setData({
          longitude: locationInfo.longitude
          , latitude: locationInfo.latitude
          ,ifSign:"正在签到..."
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
            radius: 10,
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
        var datal = {
          locLat: locationInfo.latitude,
          locLon: locationInfo.longitude,
          locAcc: 0,
          locVAcc: 0,
          locHAcc: 0,
          locName: "sec_tch"
        }
        var term = wx.getStorageSync('SigningCourse')
        var schedule = {
          schId: term.schedule.schId,
          cozId: term.course.cozId,
          schTime: term.schedule.schTime,
          schDay: term.schedule.schDay,
          schWeek: term.schedule.schWeek,
          schYear: term.schedule.schYear,
          schTerm: term.schedule.schTerm,
          schFortnight: term.schedule.schFortnight,
          location: datal,
          cozSuspendList: term.schedule.cozSuspendList,

        }
        wx.setStorageSync('schedule', schedule)
    
        })
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
        
  
      //}
   // })
    
  },
  /*
  
  signMap:function(e){
    var that=this;
    console.log(that.data.schedule)
    wx.request({
      url: "https://www.xsix103.cn/SignInSystem/Student/signIn.do",
      data: this.data.schedule,
      method: 'POST',
      header: {
        'Cookie': app.globalData.header.Cookie,
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.location && res.data.time) {
          var currentStatu = "successclose";
          that.util(currentStatu)
        } else {
          var currentStatu = "failclose"
          that.util(currentStatu)
        }
      },
      fail: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '连接失败',
          icon: "cancel",
          duration: 2000
        })
      }

    })
  },*/
  
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
          radius: 10,
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
            left: 255,
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
            left: 290,
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
  //点击签到
  confirm:function(e){
    var that=this
    console.log("hhh:"+wx.getStorageSync('schedule'))
    if (wx.getStorageSync('schedule') !="") {
      wx.request({
      url: "https://www.xsix103.cn/SignInSystem/Student/checkSignIn.do",
      data: wx.getStorageSync('schedule'),
      method:'POST',
      header:{
        'Cookie': app.globalData.header.Cookie,
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res.data)
        if(!res.data){
        wx.request({
          url: "https://www.xsix103.cn/SignInSystem/Student/signIn.do",
          data: wx.getStorageSync('schedule'),
          method: 'POST',
          header: {
            'Cookie': app.globalData.header.Cookie,
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data);
            if (res.data.location && res.data.time) {
              var currentStatu = "successclose";
              that.util(currentStatu)
            } else {
              var currentStatu = "failclose"
              that.util(currentStatu)
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
        }else{
          var currentStatu="successedclose";
          that.util(currentStatu)
        }
      },
      fail(res){
        console.log(res.data)
        wx.showToast({
          title: '连接失败',
          icon: "loading",
          duration: 2000
        })
      }
    })
    
    
    }else{
      var currentStatu = e.currentTarget.dataset.statu
      this.util(currentStatu)
    }
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
    console.log(app.globalData.userId)
    var that=this;
    that.setData({
      signingCard:{},
      cards:[]
    })
 
    
    if(app.globalData.userPermit[0]==1){
      
        getSigning(that);
        getCards(that);
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
            showModalStatus: true
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
        wx.showToast({
          title: '已签到',
          icon: 'success',
          duration: 1500

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
   