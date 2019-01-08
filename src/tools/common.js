import exif from "exif-js";
import { Message, Loading } from "element-ui";
import device from 'current-device';
import vue from "vue";
/**
 *读取图片文件
 * @param files：文件数组
 * 返回文件数组 [{name:'',src:''}]
 */
function readFilesToBase64(files) {
  let p = new Promise(function(resolve, reject) {
    let maxSize = 200 * 1024; //200kb
    let returnData = new Array();
    let currentLength = 0;
    for (var i = 0; i < files.length; i++) {
      var reader = new FileReader();
      var orientation = "";
      exif.getData(files[i], function() {
        orientation = exif.getTag(this, "Orientation");
      });
      reader.onload = function() {
        let fileObj = new Object(); //文件对象
        fileObj.id = "";
        var result = this.result; //result为data url的形式
        if (result.length < maxSize) {
          fileObj.src = result;
          currentLength++;
          returnData.push(fileObj);
          //处理结束后
          if (currentLength == files.length) {
            resolve(returnData);
          }
        } else {
          //图片压缩/转码
          compress(result, orientation).then(function(result) {
            fileObj.src = result;
            currentLength++;
            returnData.push(fileObj);
            //处理结束后
            if (currentLength == files.length) {
              resolve(returnData);
            }
          });
        }
      };
      reader.readAsDataURL(files[i]);
    }
  });
  return p;
}
/**
 * 图片压缩转码base64
 * @param data：数据
 * @param orientation:方向
 * @param name：名字
 */
function compress(data, orientation) {
  let p = new Promise(function(resolve, reject) {
    var maxWidth = 1024;
    var img = new Image();
    img.onload = function() {
      var degree = 0,
        drawWidth,
        drawHeight,
        width,
        height;
      drawHeight = this.naturalHeight;
      drawWidth = this.naturalWidth;
      //change photo size
      var maxSide = Math.max(drawWidth, drawHeight);
      if (maxSide > maxWidth) {
        var minSide = Math.min(drawWidth, drawHeight);
        minSide = minSide / maxSide * maxWidth;
        maxSide = maxWidth;
        if (drawWidth > drawHeight) {
          drawWidth = maxSide;
          drawHeight = minSide;
        } else {
          drawWidth = minSide;
          drawHeight = maxSide;
        }
      }
      let canvas = new Object();
      if (document.getElementsByTagName("canvas") == null) {
        canvas = document.getElementsByTagName("canvas");
      } else {
        canvas = document.createElement("canvas");
      }
      canvas.width = width = drawWidth;
      canvas.height = height = drawHeight;
      var context = canvas.getContext("2d");
      //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
      switch (orientation) {
        //iphone横屏拍摄，此时home键在左侧
        case 3:
          degree = 180;
          drawWidth = -width;
          drawHeight = -height;
          break;
        //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width = height;
          canvas.height = width;
          degree = 90;
          drawWidth = width;
          drawHeight = -height;
          break;
        //iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width = height;
          canvas.height = width;
          degree = 270;
          drawWidth = -width;
          drawHeight = height;
          break;
      }
      //使用canvas旋转校正
      context.rotate(degree * Math.PI / 180);
      context.drawImage(this, 0, 0, drawWidth, drawHeight);
      //返回校正图片
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = data;
  });
  return p;
}
//检测手机号是否合法
function checkPhoneNumber(phone) {
  let vm = this;
  let testRule = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
  if (!testRule.test(phone)) {
    return true;
  }
  return false;
}
/**
 * 获取URL参数
 * @param name：如果name!=null 返回该value值
 *              否则，返回一个对象，包含keys 和data 两个键
 *              keys为一个数组，值为url中的键
 *              data为一个对象，键值对的形式存在
 * @returns {*}
 */
function getUrlParams(name) {
  if (arguments.length === 1) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  } else {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    var data = new Object();
    var array = new Array();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        array.push(strs[i].split("=")[0]);
        data[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      theRequest["keys"] = array;
      theRequest["data"] = data;
      return theRequest;
    } else {
      return null;
    }
  }
}
/**
 * 格式化时间戳
 * @param timestamp :时间戳
 * @param format 格式化格式
 * @param returnType ：返回类型，html=>H ,string=>S
 * @returns {string}
 */
function formateTimestamp(timestamp, format, returnType) {
  returnType = returnType || "S";
  if (timestamp == null || timestamp == undefined || timestamp == "") {
    return "";
  } else {
    var time = new Date(parseInt(timestamp));
    var y = time.getFullYear();
    var m =
      time.getMonth() + 1 < 10
        ? "0" + (time.getMonth() + 1)
        : time.getMonth() + 1;
    var d = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    var mm =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var s = time.getSeconds();
    var returnData = "";
    format = format || "YYYY/MM/DD";
    switch (format) {
      case "YYYY/MM/DD 09:00":
        returnData =
          returnType == "S"
            ? y + "/" + m + "/" + d + " " + "09:00"
            : "<span class='qsj-date-info'>" +
              y +
              "/" +
              m +
              "/" +
              d +
              "<span></span><span class='qsj-time-info'>09:00</span>";
        break;
      case "YYYY/MM/DD HH:mm":
        returnData =
          returnType == "S"
            ? y + "/" + m + "/" + d + " " + h + ":" + mm
            : "<span class='qsj-date-info'>" +
              y +
              "/" +
              m +
              "/" +
              d +
              "</span><span class='qsj-time-info'>" +
              h +
              ":" +
              mm +
              "</span>";
        break;
      case "YYYY/MM/DD":
        returnData =
          returnType == "S"
            ? y + "/" + m + "/" + d
            : "<span class='qsj-date-info'>" +
              y +
              "/" +
              m +
              "/" +
              d +
              "</span>";
        break;
      case "YYYY-MM-DD":
        returnData =
          returnType == "S"
            ? y + "-" + m + "-" + d
            : "<span class='qsj-date-info'>" +
              y +
              "-" +
              m +
              "-" +
              d +
              "</span>";
        break;
      case "DD-MM-YYYY":
        returnData =
          returnType == "S"
            ? d + "-" + m + "-" + y
            : "<span class='qsj-date-info'>" +
              d +
              "-" +
              m +
              "-" +
              y +
              "</span>";
        break;
      case "YYYY.MM.DD":
        returnData =
          returnType == "S"
            ? y + "." + m + "." + d
            : "<span class='qsj-date-info'>" +
              y +
              "." +
              m +
              "." +
              d +
              "</span>";
        break;
      case "MM-DD":
        let now1 = new Date();
        let ny1 = now1.getFullYear();
        //非今年
        if (ny1 != y) {
          returnData =
            returnType == "S"
              ? y + "-" + m + "-" + d
              : "<span class='qsj-date-info'>" +
                y +
                "-" +
                m +
                "-" +
                d +
                "</span>";
        } else {
          returnData =
            returnType == "S"
              ? m + "-" + d
              : "<span class='qsj-date-info'>" + m + "-" + d + "</span>";
        }
        break;
      case "MM-DD HH:mm":
        let now = new Date();
        let ny = now.getFullYear();
        //非今年
        if (ny != y) {
          returnData =
            returnType == "S"
              ? y + "-" + m + "-" + d + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                y +
                "-" +
                m +
                "-" +
                d +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        } else {
          returnData =
            returnType == "S"
              ? m + "-" + d + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                m +
                "-" +
                d +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        }
        break;
      case "MM/DD":
        let now2 = new Date();
        let ny2 = now2.getFullYear();
        //非今年
        if (ny2 != y) {
          returnData =
            returnType == "S"
              ? y + "/" + m + "/" + d
              : "<span class='qsj-date-info'>" +
                y +
                "/" +
                m +
                "/" +
                d +
                "</span>";
        } else {
          returnData =
            returnType == "S"
              ? m + "/" + d
              : "<span class='qsj-date-info'>" + m + "/" + d + "</span>";
        }
        break;
      case "MM/DD HH:mm":
        let now4 = new Date();
        let ny4 = now4.getFullYear();
        //非今年
        if (ny4 != y) {
          returnData =
            returnType == "S"
              ? y + "/" + m + "/" + d + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                y +
                "/" +
                m +
                "/" +
                d +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        } else {
          returnData =
            returnType == "S"
              ? m + "/" + d + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                m +
                "/" +
                d +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        }
        break;
      case "MM月DD日 HH:mm":
        let now5 = new Date();
        let ny5 = now5.getFullYear();
        //非今年
        if (ny5 != y) {
          returnData =
            returnType == "S"
              ? y + "年" + m + "月" + d + "日" + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                y +
                "年" +
                m +
                "月" +
                d +
                "日" +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        } else {
          returnData =
            returnType == "S"
              ? m + "月" + d + "日" + " " + h + ":" + mm
              : "<span class='qsj-date-info'>" +
                m +
                "月" +
                d +
                "日" +
                "</span><span class='qsj-time-info'>" +
                h +
                ":" +
                mm +
                "</span>";
        }
        break;
      case "MM月DD日":
        let now3 = new Date();
        let ny3 = now3.getFullYear();
        let nm3 = now3.getMonth();
        //为当前年月
        if (ny3 == y && nm3 == m) {
          returnData =
            returnType == "S"
              ? m + "月" + d + "日"
              : "<span class='qsj-date-info'>" +
                y +
                "年" +
                m +
                "月" +
                d +
                "日</span>";
        } else {
          returnData =
            returnType == "S"
              ? y + "年" + m + "月" + d + "日"
              : "<span class='qsj-date-info'>" +
                y +
                "年" +
                m +
                "月" +
                d +
                "日</span>";
        }
        break;
      default:
        returnData =
          returnType == "S"
            ? y + "/" + m + "/" + d
            : "<span class='qsj-date-info'>" +
              y +
              "/" +
              m +
              "/" +
              d +
              "</span>";
        break;
    }
    return returnData;
  }
}
/**
 * 生成uuid
 * @param len 长度
 * @param radix 进制 2，10,16
 * @returns {string}
 */
function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}
/**
 *转换时间(专用于时间分组的时间转换)
 *@param format:时间戳
 *@param type:返回类型，M=>以月为分割线，D=>以日为分割线
 *返回重组后的时间字符串
 */
function transDate(format, type) {
  let date = new Date(parseInt(format));
  let Y = date.getFullYear() + "年";
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "月";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + "日" : date.getDate() + "日";
  if (type === "M") {
    return Y + M;
  } else if (type === "D") {
    return Y + M + D;
  }
}
/**
 *根据月、日分割数据（仅用于项目列表数据处理）
 *@param data:数组
 *@param returnType:返回类型，month=>以月为分割线，day=>以日为分割线
 *返回重组后的数据数组
 */
function cutApartTime(data, returnType) {
  returnType = returnType || "month";
  if (data.length == 0 || data == null || data == undefined || data == "") {
    return [];
  } else {
    let newArr = [];
    if (returnType === "month") {
      //按照月份分组
      for (let i = 0; i < data.length; i++) {
        //按照月份比较赋值
        let timeitem = transDate(data[i].operation_time, "M");
        data[i].new_time = timeitem;
      }
      data.forEach((address, m) => {
        //数组时间比较并赋值
        let index = -1;
        let alreadyExists = newArr.some((newAddress, j) => {
          if (address.new_time === newAddress.timeInfo) {
            index = j;
            return true;
          }
        });
        if (!alreadyExists) {
          newArr.push({
            timeInfo: address.new_time,
            pulldown: true,
            timeGroupList: [
              {
                proj_id: address.proj_id,
                proj_name: address.proj_name,
                creator: address.creator,
                creator_avatar: address.creator_avatar,
                create_time: address.operation_time,
                proj_num: address.proj_num,
                operator: address.operator,
                operation_time: address.operation_time,
                operation_type: address.operation_type
              }
            ]
          });
        } else {
          newArr[index].timeGroupList.push({
            proj_id: address.proj_id,
            proj_name: address.proj_name,
            creator: address.creator,
            creator_avatar: address.creator_avatar,
            create_time: address.operation_time,
            proj_num: address.proj_num,
            operator: address.operator,
            operation_time: address.operation_time,
            operation_type: address.operation_type
          });
        }
      });
    } else if (returnType === "day") {
      for (let i = 0; i < data.length; i++) {
        //按照日比较赋值
        let timeitem = transDate(data[i].operation_time, "D");
        data[i].new_time = timeitem;
      }
      data.forEach((address, m) => {
        //数组时间比较并赋值
        let index = -1;
        let alreadyExists = newArr.some((newAddress, j) => {
          if (address.new_time === newAddress.timeInfo) {
            index = j;
            return true;
          }
        });
        if (!alreadyExists) {
          newArr.push({
            timeInfo: address.new_time,
            pulldown: true,
            timeGroupList: [
              {
                proj_id: address.proj_id,
                proj_name: address.proj_name,
                creator: address.creator,
                creator_avatar: address.creator_avatar,
                create_time: address.operation_time,
                proj_num: address.proj_num,
                operator: address.operator,
                operation_time: address.operation_time,
                operation_type: address.operation_type
              }
            ]
          });
        } else {
          newArr[index].timeGroupList.push({
            proj_id: address.proj_id,
            proj_name: address.proj_name,
            creator: address.creator,
            creator_avatar: address.creator_avatar,
            create_time: address.create_time,
            proj_num: address.proj_num,
            operator: address.operator,
            operation_time: address.operation_time,
            operation_type: address.operation_type
          });
        }
      });
    }
    return newArr;
  }
}
/**
 * 比较排序
 * @param prop 属性值
 * @param type L:large 升序 S:Small 降序
 * @returns {*}
 */
function compare(prop, type = "L") {
  return function(obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      if (type == "L") {
        return -1;
      } else {
        return 1;
      }
    } else if (val1 > val2) {
      if (type == "L") {
        return 1;
      } else {
        return -1;
      }
    } else {
      return 0;
    }
  };
}
/**
 * 计算文档大小
 * @param size
 * @returns {string}
 */
function calcFileSize(size) {
  let b = size / 1024;
  let kb = size / (1024 * 1024);
  if (b < 1) {
    return size + "B";
  } else if (kb < 10) {
    return Math.round(parseFloat(size / 1024) * 100) / 100 + "KB";
  } else {
    return Math.round(size / (1024 * 1024) * 100) / 100 + "MB";
  }
}
/**
 * 关键字变红.
 * @param{string} data：数据
 * @param{string} keyword:关键字
 */
function buildRedKeyword(data, keyword) {
  let key = keyword||"";
  let str = data;
  let reg = new RegExp("(" + key + ")", "g");
  let newstr = str.replace(reg, "<span style='color:red;'>$1</span>");
  return newstr;

}
//弹框警告
function pmWarningInfo(title = "提示", des = "轻点开了点小差，请重试") {
  let message =
    "<div class='title'>" + title + "</div><div class='des'>" + des + "</div>";
  if (!vue.waringMessage) {
    vue.waringMessage = Message({
      dangerouslyUseHTMLString: true,
      type: "warning",
      showClose: true,
      duration: 3000,
      iconClass: "pm-warning",
      onClose: function() {
        vue.waringMessage = null;
      },
      message: message
    });
  }
}
//弹框成功提示
function pmSuccessInfo(title,des){
    let message =
        "<div class='title'>" + title + "</div><div class='des'>" + des + "</div>";
    if (!vue.successMessage) {
        vue.successMessage = Message({
            dangerouslyUseHTMLString: true,
            type: "success",
            showClose: true,
            duration: 3000,
            iconClass: "pm-success",
            onClose: function() {
                vue.waringMessage = null;
            },
            message: message
        });
    }
}
//显示进度条
function openPmLoading(loadingTip = "轻点正在为您准备数据，请稍等") {
  if (vue.loadingInstance != null) {
    vue.loadingInstance.text = loadingTip;
  }
  vue.loadingInstance = Loading.service({
    lock: true,
    text: loadingTip,
    spinner: "pm-icon-loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
}
//关闭进度条
function closePmLoading() {
  if (vue.loadingInstance != null) {
    setTimeout(function() {
      vue.loadingInstance.close();
    }, 1500);
  }
}
/**
 * 检查是否为移动端
 * @returns {boolean}
 */
function checkisMobile() {
  //（1）拦截手机
  //（2）拦截浏览器/轻推PC客户端
  if (device.desktop()) {
    return false;
  } else {
    return true;
  }
}
/**
 * 对面板数据进行重组
 * @params data要进行排序的数据
 * @params key 关键字变红
 * @returns {Array}
 **/
function reformPanelData(data,key=""){
  let newObj = {array0:[],array1:[],array2:[]};
  for(let i=0,dataLen=data.length;i<dataLen;i++){
    let column = data[i].coordinate.split(",")[0];
    data[i].fixed = false;
    switch (column){
        case "0":
            newObj.array0.push(data[i])
            break;
        case "1":
            newObj.array1.push(data[i])
            break;
        case "2":
            newObj.array2.push(data[i])
            break;
    };
    if(key==""){
    }else{
      if(data[i].task_list.length==0){

      }else{
        let taskList = data[i].task_list;
        for(let j=0,taskLen=taskList.length;j<taskLen;j++){
            taskList[j].title = buildRedKeyword(taskList[j].title,key);
        }
      }
    }
  }
    return newObj
}
/**
 *  配合observeDom 方法，对节点内新增元素设置v-data属性
 * @param node
 * @param attr
 */
function setChildNodesAttr(node,attr) {
    if(node.nodeType == 1&&node.attributes&&!node.attributes[attr]){
        node.setAttribute(attr,"");
    }
    if (node.hasChildNodes() && node.nodeType == 1) {
        for (var i = 0; i < node.childNodes.length; i++) {
//             $.proxy(this.setChildNodesAttr(node.childNodes[i],attr), this );
            setChildNodesAttr(node.childNodes[i],attr)
        }
    }
}
/**
 * 对观察节点内的所有新增元素或子节点添加v-data属性
 * @param observeNode   要观察的节点
 * @param attr  要赋值的v-data属性值，需要获取
 */
function observeDom(observeNode,attr){
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            let target = mutation.target;
            setChildNodesAttr(target,attr);
        });
    });
    // 配置观察选项:
    let config = { childList: true,subtree:true}
    // 传入目标节点和观察选项
    observer.observe(observeNode, config);
}
export default {
  checkPhoneNumber,
  readFilesToBase64,
  getUrlParams,
  formateTimestamp,
  uuid,
  cutApartTime,
  compare,
  calcFileSize,
  buildRedKeyword,
  pmWarningInfo,
  pmSuccessInfo,
  openPmLoading,
  closePmLoading,
  checkisMobile,
  reformPanelData,
  observeDom,
};
