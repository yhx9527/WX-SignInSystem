const app=getApp();
var checkForm=function(form){
    if(form.suvRecNum==""||form.suvLeave==""||form.suvRecBadNum1==""||form.suvRecBadNum2==""||form.suvRecInfo==""){
      return false
    }else{
      return true
    }
  
}
var arrayToInt=function(array){
  for(var index in array){
    array[index]=parseInt(array[index])
  }
  return array
}
var testMan=function(siTime){
  var close=[1970,1,1,8,0,1]
  if(JSON.stringify(siTime)==JSON.stringify(close)){
    return true
  }else
    return false
}
var util=require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    time:"",
    course: {},
    monitorName:"",
    showModalStatus:false,
    checked:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.jsonStr);
    let course=JSON.parse(options.jsonStr)
    var temp=util.formatTime(new Date)
    var dates=temp.split(" ")
    if(course.suvman != null && !testMan(course.suvman.siTime))
      var checked=true;
    else
      var checked=false;
    this.setData({
      course:course,
      monitorName: app.globalData.userName,
      date:dates[0],
      time:dates[1],
      checked:checked,
    });

    
    //console.log(course);
  },
  //提交表单
  formSubmit: function (e) {
    console.log(e.detail)
    var flag = checkForm(e.detail.value)
    var that=this
    if (flag) {
      var suvRecord={"suvId":that.data.course.suvId,"suvRecBadNum":e.detail.suvRecBadNum1+e.detail.suvRecBadNum2,"suvRecInfo":e.detail.suvRecInfo,"suvRecName":that.data.monitorName,"suvRecNum":e.detail.suvRecNum}
      wx.request({
        url: 'https://www.xsix103.cn/SignInSystem/Supervisor/insertSuvRec.do',
        data:suvRecord,
        method:"POST",
        header:{
          'Cookie': app.globalData.header.Cookie
        },
        success:function(res){
          if(res.data){
            wx.showToast({
              title: '提交成功',
            })
            wx.navigateBack({
              delta:1
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '该课程暂未开始督导',
              success: function (res) {
                if (res.confirm) {
                 wx.navigateBack({
                   delta:1
                 })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
          console.log(res.data)
        },
        fail:function(res){
          wx.showToast({
            title: '提交失败',
            icon: "loading",
            duration: 2000
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  formReset:function(e){
    console.log("表单重置")
    e.detail=null
  },
  bindDateChange:function(e){
    this.setData({
      date:e.detail.value
    })
  },
  bindTimeChange:function(e){
    console.log(e.detail.value);
    this.setData({
      time:e.detail.value+":00"
    })
  },
  switchChange:function(e){
    console.log(e.detail.value)
    var that=this;
    var schId=that.data.course.schid
    var siWeek=that.data.course.suvweek
    console.log("人工周 "+siWeek)
    var suvMan={"schId":schId,"siWeek":siWeek}
    if(e.detail.value){
      var temp1 = that.data.date.split("-")
      var temp2 = that.data.time.split(":")
      var temp = temp1.concat(temp2)
      var siTime=arrayToInt(temp)
      console.log(siTime)
      var suvMan={"schId":schId,"siWeek":siWeek,"siTime":siTime}
      if(that.data.course.suvman!=null){
        wx.request({                                          //更新式人工签到
          url: 'https://www.xsix103.cn/SignInSystem/Supervisor/openManSignIn.do',
          data:suvMan,
          method:"POST",
          header:{
            'Cookie': app.globalData.header.Cookie
          },
          success:function(res){
            console.log(res.data)
            if(res.data){
              wx.showToast({
                title: '发起成功',
                icon: 'success',
                duration: 2000
              })  
            }else{
              wx.showToast({
                title: '发起失败',
                icon: 'none',
                duration: 2000
              })  
            }
          },
          fail:function(){
            wx.showToast({
              title: '连接失败',
              icon: 'none',
              duration: 2000
            })  
          }
        })
      }else{
        wx.request({                                            //插入式人工签到
          url: 'https://www.xsix103.cn/SignInSystem/Supervisor/initAutoSignIn.do',
          data: suvMan,
          method: "POST",
          header: {
            'Cookie': app.globalData.header.Cookie
          },
          success: function (res) {
            console.log(res.data)
            if (res.data) {
              wx.showToast({
                title: '发起成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '发起失败',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: '连接失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }else{
      wx.request({
        url: 'https://www.xsix103.cn/SignInSystem/Supervisor/closeManSignIn.do',
        data: suvMan,
        method: "POST",
        header: {
          'Cookie': app.globalData.header.Cookie
        },
        success:function(res){
          console.log(res.data)
          if(res.data){
            wx.showToast({
              title: '关闭成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '关闭失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '连接失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
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

  

})