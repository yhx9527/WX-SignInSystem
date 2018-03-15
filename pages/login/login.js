const app=getApp()
const network=require("../utils/network.js")
var list={}

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
            var url="https://www.xsix103.cn/SignInSystem/login.do"
            var params = {
              userId: e.detail.value.userID,
              userPwd: e.detail.value.userCode
            }
            var method="POST"
            network.request(url,params,method).then((data)=>{
              that.setData({
                list: data
              })
              //个人信息保存全局变量
              var userPermit = processPermit(data.user.userPermit);

              app.globalData.userId = data.user.userId;
              app.globalData.userName = data.user.userName;
              app.globalData.userPermit = userPermit;
              app.globalData.header.Cookie = 'JSESSIONID=' + data.sessionId;
              //跳转界面
              wx.switchTab({
                url: '../users/student/student',
              })
            });
           /*
            wx.request({
              url: "https://www.xsix103.cn/SignInSystem/login.do",
              method: "POST",
              data: {
                userId: e.detail.value.userID,
                userPwd: e.detail.value.userCode
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
               
                console.log(res.data)
                that.setData({
                  list:res.data
                })
                //个人信息保存全局变量
                var userPermit = processPermit(res.data.user.userPermit);
                
                app.globalData.userId=res.data.user.userId;
                app.globalData.userName=res.data.user.userName;
                app.globalData.userPermit=userPermit;
                app.globalData.header.Cookie='JSESSIONID='+res.data.sessionId;
                //跳转界面
                wx.switchTab({
                  url: '../users/student/student',
                })
              },
              */
            
                //判断是否填对
                /*
                wx.showModal({
                  title: '提示',
                  content: '学号/工号或姓名错误，请重新填写',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                  */
              /*
              fail: function (res) {
                console.log(res.data)
                wx.showToast({
                  title: '连接失败',
                  icon:"loading",
                  duration:2000
                })
                
              }
           
            })
          
            */
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

     
    }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

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

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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