/** 
*json转换为map 
*/
function jsonToMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}


/** 
*map转化为对象（map所有键都是字符串，可以将其转换为对象） 
*/
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/** 
*对象转换为Map 
*/
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

module.exports = {
    BaseURL:"http://api.budejie.com/api/api_open.php",
    jsonToMap: jsonToMap,
    strMapToObj: strMapToObj,
    objToStrMap: objToStrMap, 
};