const config = require("config.js");
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatArrayTime(Time) {
  var temp = Time[0] + "-" + Time[1] + "-" + Time[2] + " " + Time[3] + ":" + Time[4] + ":" + Time[5]
  return temp
}
function transchedules(schedules){
  var temp = JSON.parse(JSON.stringify(schedules))
  var newschedules = new Array();
  var finalschedules = new Array();

  for (var i = 0, j = 0; i < temp.length - 1; i++) {
    j = j + 1
    if (temp[i].schDay == temp[i + 1].schDay) {
      newschedules.push(temp[i]);
      j = j - 1;
      newschedules[j].schTime = newschedules[j].schTime + "," + temp[i + 1].schTime;
      if(newschedules[0].schedule==undefined){
      newschedules[0].schedule=[]
      newschedules[0].schedule.push({ "schedule": schedules[i],"scheduleTime":""})
      }
      if (j >0) {
        if (newschedules.length >= 2 && newschedules[j-1].schDay != newschedules[j].schDay)
          newschedules[0].schedule.push({ "schedule": schedules[i], "scheduleTime": "" })
      }
    }
      
    }
  //console.log("第一次处理的"+JSON.stringify(newschedules,undefined,'\t'))
  for (var j = 0; j < newschedules.length; j++) {
    newschedules[j].schTime = "第" + newschedules[j].schTime + "节课"
    newschedules[j].schDayT = newschedules[j].schDay
    
    switch (newschedules[j].schDay) {
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
    if (j < newschedules[0].schedule.length){
    newschedules[0].schedule[j].scheduleTime = newschedules[j].schDay
    }
  }


  for (var i = 0, j = -1; i < newschedules.length - 1; i++) {
    if (newschedules[i].schDayT != newschedules[i + 1].schDayT) {
      finalschedules.push(newschedules[i]);
      j = j + 1;
      finalschedules[j].schDay = newschedules[i].schDay + "和" + newschedules[i + 1].schDay
      finalschedules[j].schedule=newschedules[0].schedule
    }

  }
  if (JSON.stringify(finalschedules) !== "[]"){
    //console.log("trans处理的" + JSON.stringify(finalschedules,undefined,'\t'))
    return finalschedules;
  }
    
  else{
    //console.log("trans处理的" + JSON.stringify(newschedules, undefined, '\t'))
    return newschedules;
  }
    
}
function transchedule(schedules){
  var temp = JSON.parse(JSON.stringify(schedules))
  var newschedules = new Array();

  for (var i = 0, j = 0; i < temp.length - 1; i++) {
    j = j + 1
    if (temp[i].schDay == temp[i + 1].schDay) {
      newschedules.push(temp[i]);
      j = j - 1;
      newschedules[j].schTime = newschedules[j].schTime + "," + temp[i + 1].schTime;
      if (newschedules[j].schedule==undefined)
        newschedules[j].schedule = schedules[i];
      if(j+1<newschedules.length){
      if(newschedules.length>=2&&newschedules[j].schDay==newschedules[j+1].schDay)
        newschedules.pop(newschedules[j + 1])
      }
    }
  }
  for (var j = 0; j < newschedules.length; j++) {
    newschedules[j].schTime = "第" + newschedules[j].schTime + "节课"
    newschedules[j].schDayT = newschedules[j].schDay
    switch (newschedules[j].schDay) {
      case 1: newschedules[j].schDay = "星期一" 
        break;
      case 2: newschedules[j].schDay = "星期二" 
        break;
      case 3: newschedules[j].schDay = "星期三" 
        break;
      case 4: newschedules[j].schDay = "星期四" 
        break;
      case 5: newschedules[j].schDay = "星期五" 
        break;
      case 6: newschedules[j].schDay = "星期六" 
        break;
      case 7: newschedules[j].schDay = "星期日" 
        break;
      default:
        break;
    }
  }
  
  //console.log("处理后的  "+JSON.stringify(newschedules,undefined,'\t'))
    return newschedules;
}
 function transchedule1(schedule) {

  var newschedules = []
  newschedules = JSON.parse(JSON.stringify(schedule))
  for(var index in schedule){
  newschedules[index].schTime = "第" + schedule[index].schTime + "节课";

  switch (newschedules[index].schDay) {
    case 1: newschedules[index].schDay = "星期一" + "第" + schedule[index].schTime + "节课";
      break;
    case 2: newschedules[index].schDay = "星期二" + "第" + schedule[index].schTime + "节课";
      break;
    case 3: newschedules[index].schDay = "星期三" + "第" + schedule[index].schTime + "节课";
      break;
    case 4: newschedules[index].schDay = "星期四" + "第" + schedule[index].schTime + "节课";
      break;
    case 5: newschedules[index].schDay = "星期五" + "第" + schedule[index].schTime + "节课";
      break;
    case 6: newschedules[index].schDay = "星期六" + "第" + schedule[index].schTime + "节课";
      break;
    case 7: newschedules[index].schDay = "星期日" + "第" + schedule[index].schTime + "节课";
      break;
    default:
      break;
  }
  newschedules[index].schedule = [{
    "schedule": schedule[index], "scheduleTime": newschedules[index].schDay
  }]
  }
  if (newschedules.length!=0)
    //console.log("tran1处理的" + JSON.stringify(newschedules, undefined, '\t'))
    return newschedules;

}
//判断空对像
function isEmptyObject(e){
  var t;
  for(t in e)
  return !1;
  return !0
}
//对象数组根据属性的排序函数
function compare(prop){
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  } 
}
//返回数组下标
function getIndex(list,prop,testProp){
  for(var index in list){
    var a=list[index]
    if(a[prop]==testProp){
      return index
    }
  }
}
module.exports = {
  formatTime: formatTime,
  formatNumber:formatNumber,
  transchedules:transchedules,
  transchedule:transchedule,
  formatArrayTime: formatArrayTime,
  transchedule1: transchedule1,
  compare:compare,
  getIndex:getIndex
}


  
