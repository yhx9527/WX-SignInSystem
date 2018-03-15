/** 
var ReportDataSync = [
  {
    reportType: "按时间排序",
    chilItem: [
      { ID: 1, Name: "按时间排序", ReportUrl: "DailyReport.aspx", Type: 1},
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
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 
    reportData:[],
    subMenuDisplay:[],
    subMenuHighLight:[],
    animationData: {},
    teacherLists: [{ "id": 1, "courseName": "java", "courseNum": 100, "courseTime": "星期一", "coursePlace": "二教" }, { "id": 2, "courseName": "数据库", "courseNum": 100, "courseTime": "星期一", "coursePlace": "二教"}],
    ifshade:false,
    scrollTop: 0,
    scrollHeight: 0,
*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    loadDropDownMenu()

    this.setData({
      reportData: ReportDataSync,//菜单数据 
      subMenuDisplay: initSubMenuDisplay, //一级 
      subMenuHighLight: initSubMenuHighLight //二级 
    }) 
   */
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
          
          this.data.ifshade=true
        }
      } else {
        initSubMenuDisplay[i] = 'hidden'
        this.data.ifshade = false
      }
    }
    
    this.setData({
      subMenuDisplay: initSubMenuDisplay,
      ifshade:this.data.ifshade,

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
    var clicked=ReportDataSync[indexArray[0]].chilItem[indexArray[1]]
    ReportDataSync[indexArray[0]].reportType=clicked.Name
    initSubMenuDisplay[indexArray[0]]="hidden"

    
    //刷新样式 
    this.setData({
      subMenuHighLight: initSubMenuHighLight,
      reportData: ReportDataSync,
      subMenuDisplay: initSubMenuDisplay,
      ifshade:false,

    });
    this.animation(index);
    
  },
  animation: function (index) {
    // 定义一个动画
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    // 是显示还是隐藏
    var flag = this.data.subMenuDisplay[index] == 'show' ? 1 : -1;
    // flag = 1;
    console.log(flag)
    // 使之Y轴平移
    animation.translateY(flag * (initSubMenuHighLight[index].length * 34) + 8).step();
    // 导出到数据，绑定给view属性
    this.setData({
      animationData: animation.export()
    });
  },
*/



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: (res.windowHeight)
        });
      }
    })
  },
  singleTlist:function(e){
    let str = JSON.stringify(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../teacher?jsonStr=' + str
    })*/
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