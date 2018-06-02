const app=getApp();
var Width = app.getWidth();
//产生填充课表的数组
var fillTable=function(year,term,cards){
  var tempTable=[];
  var courseTable=[];
  var count=[];
  if (cards != undefined && cards.length > 0) {
  cards.forEach((item)=>{
    item.schedule.forEach((item1)=>{
      item1.scheduleName=item.courseName;
    });
  });
  cards.forEach((item2)=>{
    tempTable=tempTable.concat(item2.schedule);
  })
  courseTable = tempTable.filter((condition) => {
      return year==condition.schedule.schYear;

    }).filter((condition)=>{
      return term==condition.schedule.schTerm;
    });
    courseTable.forEach((condition)=>{
      count=condition.scheduleTime.split(",");
      condition.scheduleNum=count.length;
7
    });
    courseTable.forEach((condition)=>{
      count=condition.scheduleTime.split(",");
      condition.scheduleNum=count.length;
      var zhi=condition.schedule;
      condition.left=Width*(0.07+0.1324*(zhi.schDay-1));
      condition.top=35+45+45*(zhi.schTime-1);
    });
  }
  return courseTable;
 
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableHead: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    tableContent: [1,2,3,4,5,6,7,8,9,10,11,12],
    tableCourse:[],//课表数组
    year:2017,
    yearTemp:2017,
    term:true,
    termTemp:true,
    week:1,
    weekTemp:1,
    Temp:1,
    Temp1:1,
    iconBackColor: ['#FFFFCC', '#CCFFFF', '#FFCCCC', '#CCCCFF', '#FFCC99', '#CCFF99', '#CCFFCC', '#66cccc' ],
    end:'#cccccc',//结课的颜色
    WEEKS:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    YEARS:['2017-2018','2018-2019','2019-2020','2020-2021','2021-2022','2022-2023','2023-2024','2024-2025'],
    TERMS:['上','下'],
    isCW:false,//是否需要更改周
    isCY:false,//更改学年
    userPermit:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userPermit=wx.getStorageSync('person').userPermit;
    if(userPermit[0]==1 || userPermit[1]==1){
      var tableCourse = [];
      var week = this.data.week;
      week = wx.getStorageSync('nowWeek');
      var cards = JSON.parse(JSON.stringify(wx.getStorageSync('Cards')));
      tableCourse = fillTable(that.data.year, that.data.term, cards);
      console.log("课表数组" + JSON.stringify(tableCourse, undefined, '\t'));
      that.setData({
        week: week,
        tableCourse: tableCourse,
        userPermit:userPermit
      })
    }else{
      userPermit:userPermit
    }
   
    
  },
  isChangeWeek:function(){
    if(this.data.isCW==false){
      this.setData({
        isCW: true,
        isCY: false,
      })
    }else{
      this.setData({
        isCW: false,
        isCY: false,
      })
    }
    
  },
  changWeek:function(e){
    this.setData({
      weekTemp:parseInt(e.detail.value)+1,
      
    })
  },
  closeChangeWeek:function(){
    this.setData({
      isCW:false,
      isCY: false,
    })
  },
  confirmCW:function(){
    console.log("更改周")
    var week=this.data.weekTemp;
    this.setData({
      week:week,
      isCW:false
    })
  },
  isChangeYear:function(){
    if(this.data.isCY==false){
      this.setData({
        isCY: true,
        isCW:false
      })
    }else{
      this.setData({
        isCY: false,
        isCW:false
      })
    }
    
  },
  changYear:function(e){
    var yearTemp=2017+e.detail.value[0];
    var Temp=e.detail.value[1];
    var termTemp=this.data.termTemp;
    if(Temp==0){
      termTemp=false;
    }else if(Temp==1){
      termTemp=true;
    }
   
    this.setData({
      yearTemp:yearTemp,
      termTemp:termTemp,
      Temp:Temp,
    })

  },
  confirmCY:function(){
    var year=this.data.yearTemp
    var term=this.data.termTemp
    var Temp1=this.data.Temp
    var cards = JSON.parse(JSON.stringify(wx.getStorageSync('Cards')));
    var table = fillTable(year, term, cards);
    console.log("year"+year);
    this.setData({
      year:year,
      term:term,
      tableCourse:table,
      isCY:false,
      Temp1:Temp1
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
    console.log("屏幕宽"+Width);
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