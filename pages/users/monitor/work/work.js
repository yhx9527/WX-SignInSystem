const app=getApp();
const network=require("../../../utils/network.js")
const util=require("../../../utils/util.js")
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
  if(siTime==undefined||JSON.stringify(siTime)===JSON.stringify(close)){
    console.log("时刻相等")
    return false
  }else
    return true
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    time:"",
    course: {},
    showModalStatus:false,
    iconColor:'',
    qrcode: '',
    ifQcode: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.jsonStr);
    let course=JSON.parse(options.jsonStr)
    this.setData({
      iconColor: course.iconcolor,
    })
    var temp=util.formatTime(new Date)
    var dates=temp.split(" ")
    if(course.suvman != undefined && course.suvman !== null && testMan(course.suvman.siTime)){
      var siTime=course.suvman.siTime
      this.setData({
        iconColor:course.iconcolor,
        course:course,
        date:siTime[0]+"-"+siTime[1]+"-"+siTime[2],
        time:siTime[3]+":"+siTime[4]+":"+siTime[5],
        checked:true,

      })
    } 
    else{
      this.setData({
        course: course,
        date: dates[0],
        time: dates[1],
        checked: false,
      });
    }
      

    
    //console.log(course);
  },
  //提交表单
  formSubmit: function (e) {
    console.log(e.detail)
    var that = this
    var ifinsert=that.data.course.ifinsert
    console.log("能否插入"+ifinsert)
    if(ifinsert){
    var flag = checkForm(e.detail.value)
    var url = 'https://www.xsix103.cn/SignInSystem/Supervisor/isSuvRec.do'
    var method = "POST"
    var header = app.globalData.header
    var params = {}
    network.request(url, params, method, header).then((data)=>{
      if(data==false){
        if (flag) {

          var suvRecord = { "suvId": parseInt(that.data.course.suvid), "suvRecBadNum": parseInt(e.detail.value.suvRecBadNum1) + parseInt(e.detail.value.suvRecBadNum2), "suvRecInfo": e.detail.value.suvRecInfo, "suvRecName": that.data.course.xingming, "suvRecNum": parseInt(e.detail.value.suvRecNum), "suvWeek": that.data.course.suvweek }
          wx.request({
            url: 'https://www.xsix103.cn/SignInSystem/Supervisor/insertSuvRec.do',
            data: suvRecord,
            method: "POST",
            header: app.globalData.header,
            success: function (res) {
              if (res.data == true) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)

              } else {
                wx.showToast({
                  title: '提交失败',
                  icon: "none",
                  duration: 2000
                })
              }
              console.log(res.data)
            },
            fail: function (res) {
              wx.showToast({
                title: '连接失败',
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
      }else if(data=true){
        wx.showModal({
          title: '提示',
          content: '该课程暂已有督导记录',
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.showToast({
          title: '未知错误',
          icon:"none",
          duaration:1500
        })
      }
    })
    
  }else{
      wx.showModal({
        title: '提示',
        content: '该课程暂未开始督导',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
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
      if(that.data.course.suvman!==null){
        wx.request({                                          //更新式人工签到
          url: 'https://www.xsix103.cn/SignInSystem/Supervisor/openManSignIn.do',
          data:suvMan,
          method:"POST",
          header:app.globalData.header,
          success:function(res){
            console.log(res.data)
            if(res.data==true){
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
          header: app.globalData.header,
          success: function (res) {
            console.log(res.data)
            if (res.data==true) {
              wx.showToast({
                title: '发起成功',
                icon: 'success',
                duration: 2000
              })
              that.data.course.suvman={"AutoSignIn":true}
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
        header:app.globalData.header,
        success:function(res){
          console.log(res.data)
          if(res.data==true){
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
  //生成二维码
  produceQR:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否生成该课程二维码供未签到学生补签(十分钟有效)',
      success:function(res){
        if(res.confirm){
          var course = that.data.course;
          var schId=course.schid;
          var time = new Date().getTime();
          var text = schId.toString() + "," + time.toString();
          util.QRsign(that, text);
        }
       
      }
    })
   

  },
  cancelQR: function () {
    var ifQcode = false;
    this.setData({
      ifQcode: ifQcode
    })

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