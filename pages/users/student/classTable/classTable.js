const app=getApp();
var Width=375;
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
    tableHead:[],
    tableContent: [],
    tableCourse:[],//课表数组
    year:2017,
    term:true,
    week:1,
    iconBackColor: ['#FFFFCC', '#CCFFFF', '#FFCCCC', '#CCCCFF', '#FFCC99', '#CCFF99', '#CCFFCC', '#66cccc' ],
    end:'#cccccc',//结课的颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tableHead=['','周一','周二','周三','周四','周五','周六','周日'];
    var tableContent=new Array(12);
    var that=this;
    var tableCourse=[];
    var week=wx.getStorageSync('nowWeek');
    var cards=JSON.parse(JSON.stringify(wx.getStorageSync('Cards')));
    tableCourse=fillTable(that.data.year,that.data.term,cards);
    console.log("课表数组"+JSON.stringify(tableCourse,undefined,'\t'));
    that.setData({
      week:week,
      tableHead:tableHead,
      tableContent:tableContent,
      tableCourse: tableCourse
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