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

    }
  }
  for (var j = 0; j < newschedules.length; j++) {
    newschedules[j].schTime = "第" + newschedules[j].schTime + "节课"
    newschedules[j].schDayT = newschedules[j].schDay
    newschedules[j].schedule=schedules[0]
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
  }


  for (var i = 0, j = -1; i < newschedules.length - 1; i++) {
    if (newschedules[i].schDayT != newschedules[i + 1].schDayT) {
      finalschedules.push(newschedules[i]);
      j = j + 1;
      finalschedules[j].schDay = newschedules[i].schDay + "和" + newschedules[i + 1].schDay
      finalschedules[j].schedule=schedules[0]
    }

  }
  if (JSON.stringify(finalschedules) !== "[]")
    return finalschedules;
  else
    return newschedules;
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
  
  console.log("处理后的  "+JSON.stringify(newschedules,undefined,'\t'))
    return newschedules;
}
 function transchedule1(schedule) {

  var newschedules = []
  newschedules = JSON.parse(JSON.stringify(schedule))
  for(var index in schedule){
  newschedules[index].schTime = "第" + schedule[index].schTime + "节课";
  newschedules[index].schedule=schedule[index]
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
  }
  if (newschedules.length!=0)
    return newschedules;

}
module.exports = {
  formatTime: formatTime,
  formatNumber:formatNumber,
  transchedules:transchedules,
  transchedule:transchedule,
  formatArrayTime: formatArrayTime,
  transchedule1: transchedule1
}


  
