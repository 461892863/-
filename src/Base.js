//获取url参数
exports.install = function (Vue) {
  Vue.prototype.GetQueryString = function (Paras) {
    var url = window.location.href.split("#")[0];
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (i = 0; j = paraString[i]; i++) {
      paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[Paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
      return "";
    } else {
      return returnValue;
    }
  };

  Vue.prototype.GetUserId = function (code) {
    var userId = "";
    $.ajax({
      url: this.url + "/api/UserBaseInfo/GetUserId",
      async: false,
      type: "Post",
      data: {
        code: code
      },
      dataType: "json",
      success: function (msg) {
        if (msg.returncode == 0) {
          userId = msg.data;
        }
      },
      error: function () {
        // alert("服务器错误");
      },
      complete: function () {
      }
    });
    return userId;
  };
  Vue.prototype.setTime = '';
  Vue.prototype.timeNum = 1500;


//域名参数
  /* Vue.prototype.port = "http://139.199.63.146:6012/";  //接口域名
   Vue.prototype.url = "http://139.199.63.146:6012";   //图片使用的
   Vue.prototype.Crop_Id = 'ww275ee6863288fce6';  //快捷*/
  Vue.prototype.port = "http://zhsh.moutai.com.cn:8012/";  //接口域名
  Vue.prototype.url = "http://zhsh.moutai.com.cn:8012";   //图片使用的
  Vue.prototype.Crop_Id = 'wxd1e38ad5ef809965';  //茅台

// Vue.prototype.WX_UserId = window.sessionStorage.getItem('Kaoqian_userId');
  Vue.prototype.WX_UserId = "shiyuncong";
//   Vue.prototype.WX_UserId = "heyucheng";
//   Vue.prototype.WX_UserId = "heyuchen";
//   Vue.prototype.WX_UserId = "liuqi";
//   Vue.prototype.WX_UserId = "wangzhen";
  // Vue.prototype.WX_UserId = "sutao";
//   Vue.prototype.WX_UserId = "coco";
//   Vue.prototype.WX_UserId = "songxiong";
//   Vue.prototype.WX_UserId = "wangyan";
//   Vue.prototype.WX_UserId = "dongjunwei";
  Vue.prototype.isUserId = function () {
    if (this.WX_UserId == null) {
      var WX_Code = this.GetQueryString("code");
      if (WX_Code == "") {
        var nowUrl = encodeURI(window.location.href.split("#")[0]);
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.Crop_Id + '&redirect_uri=' + nowUrl + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';

      } else {
        Vue.prototype.WX_UserId = this.GetUserId(WX_Code);
        if (this.WX_UserId != "") {
          window.sessionStorage.setItem('Kaoqian_userId', this.WX_UserId);
        } else {
          // alert("userid:" + this.WX_UserId);
        }
      }
    }
  }

  //微信sdk
  Vue.prototype.wxError = function () {
    $.ajax({
      url: this.port + 'api/Service/RemoveCache',
      type: 'post',
      data: {
        "key": "ticket"
      },
      success: function (res) {
        if (res.returncode == 0) {
          location.reload();
        }
      }
    })
  }
}



