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

    }
  }
  for (var j = 0; j < newschedules.length; j++) {
    newschedules[j].schTime = "第" + newschedules[j].schTime + "节课"
    newschedules[j].schDayT = newschedules[j].schDay
    newschedules[j].schedule=schedules[j]
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
  console.log("zhenghe  "+JSON.stringify(newschedules))
    return newschedules;
}

module.exports = {
  formatTime: formatTime,
  formatNumber:formatNumber,
  transchedules:transchedules,
  transchedule:transchedule,
}


  
