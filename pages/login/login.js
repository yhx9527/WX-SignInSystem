const app=getApp()
const network=require("../utils/network.js")
const config=require("../utils/config.js")

var processPermit=function(userPermit){
  var temp=userPermit.split("").reverse();
  var tempInt=[];
  while(temp.length<5){
    temp.push("0")
  }
  tempInt=temp.map(function(data){
    return +data;
  })
  return tempInt;
}
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse:wx.canIUse('button,open-type,getUserInfo'),
  },
   /**
   *表单提交
   */
  formSubmit:function(e){
    var that=this
    var flag=wx.getStorageSync('person')
    console.log("flag" + JSON.stringify(wx.getStorageSync('person')))
    if(flag==[]){
    if (e.detail.value.userID.length == 0 || e.detail.value.userCode.length == 0) {
      wx.showModal({
        title: '提示',
        content: '学号/工号和姓名不能为空',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '注意',
        content: '登录后不能再更改账号',
        confirmText: '确定登录',
        cancelText: '我再想想',
        success: function (res) {
          if (res.confirm) {
            //app.golbaData.userID=this.data.ID;
            //app.globaData.userName=this.data.Name;
            wx.login({
              success:function(res1){
                if(res1.code){
                  wx.request({
                    url: 'https://www.xsix103.cn/SignInSystem/login.do',
                    method: "POST",
                    data: {
                      user: {
                        userId: e.detail.value.userID,
                        userPwd: e.detail.value.userCode,
                      },
                      code: res1.code
                    },
                    header: {},
                    success: function (res) {
                      if(res.data!=null){
                      var map = config.jsonToMap(JSON.stringify(res.header));
                      var a = map.get("Set-Cookie")
                      console.log(a)
                      app.globalData.header.Cookie = a.split(";")[0]
                      console.log("login:" + app.globalData.header.Cookie)
                      var userPermit = processPermit(res.data.user.userPermit);
                      var person = { "userPermit": userPermit, "userId": res.data.user.userId, "userName": res.data.user.userName }
                      //个人信息报存本地
                      wx.setStorageSync('person', person)
                      //跳转界面
                      wx.switchTab({
                        url: '../users/student/student',
                      })
                      }else{
                        wx.showModal({
                          title: '提示',
                          content: '用户名或密码错误',
                        })
                      }
                    },
                  })
                  console.log('用户点击确定')
                }else{
                  console.log('登录失败！' + e.errMsg)
                }
              }
            })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail:function(){
          wx.showLoading({
            title: '连接失败',
          })
        }
      })
      console.log(app.globalData)

     
    }
  }else{
    wx.showModal({
      title: '已绑定微信',
      content: '请检查网络后重开应用，等待自动跳转',
    })
  }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      userInfo: app.globalData.userInfo,
    })
    wx.getStorageSync('person',[])
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    wx.login({
      success: function(res1){
    if(res1.code){
    wx.request({
      url: 'https://www.xsix103.cn/SignInSystem/wxLogin.do',
      method:"POST",
      data:{
        code: res1.code
      },
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res.data)
  
        var map = config.jsonToMap(JSON.stringify(res.header));
        var a = map.get("Set-Cookie")
        console.log(a)
        app.globalData.header.Cookie = a.split(";")[0]
        console.log("wxlogin"+app.globalData.header.Cookie)
          if (res.data.err == "1") {
            wx.showModal({
              title: '提示',
              content: '你的微信未绑定，请登录绑定',

            })
          } else if (res.data.err == "2") {
            console.log(res.data.errStr)
            wx.showModal({
              title: '提示',
              content: "code失效",
            })
          }
        else {
          
          //app.globalData.header.Cookie = 'JSESSIONID=' + data.sessionUser;
          //跳转界面
          wx.switchTab({
            url: '../users/student/student',
          })
        }
      },
      fail:function(){
        wx.showLoading({
          title: '连接失败',
        })
      }
    })
    }else{
      console.log('登录失败！' + e.errMsg)
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