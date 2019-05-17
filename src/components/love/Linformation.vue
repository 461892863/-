<template>
  <div id="Linformation">
    <div id="msg">
      <!--头像 -->
      <div class="header">
        <span>头像</span>
        <img class="right" src="./images/right.png" alt="">
        <img class="head" :src="img" alt="" id="view">
        <input type="file" id="file" accept="image/jpeg,image/png,image/jpg">
      </div>
      <!--姓名-->
      <!-- 	<div class="name">
                 <span>用户名</span><span class="peoName">{{name}}</span>
             </div> -->
      <!--性别-->
      <div class="name">
        <span>性别</span>
        <span class="peoName" v-if="gender==1">男</span>
        <span class="peoName" v-if="gender==2">女</span>
      </div>
      <!--婚姻状态-->
      <div class="sex">
        <span>感情状态</span>
        <img src="./images/right.png" alt="">
        <input type="text" id="picker" placeholder="是否单身">
        <!--<select name="" v-model="marry">
          <option value="0">单身</option>
          <option value="1">非单身</option>
        </select>-->
      </div>
      <!--籍贯-->
      <div class="age">
        <span>籍贯</span>
        <input type="text" placeholder="请输入" v-model="place">
      </div>
      <!--联系方式-->
      <!-- <div class="name">
                 <span>联系方式</span>
                 <span class="peoName">{{phone}}</span>
             </div> -->
    </div>
    <div id="real">
      <!--身份证号-->
      <div class="age" style="display: flex;">
        <span  class="mustFill" style="flex: none">身份证号</span>
        <input style="width: 90%;" type="tel" placeholder="请输入" v-model="idCard">
      </div>
      <!--生日-->
      <div class="age"  style="display: flex;">
        <span style="flex:none;">生日</span>
        <!-- <img style="float: right;width: 1.2rem;height: 1.2rem;margin-right: 0.3rem;margin-top: 0.575rem;" src="./images/right.png" alt=""> -->
        <!-- <input id="demo1" type="text" readonly="" name="input_date" :value="age" placeholder="请选择" data-lcalendar="1900-01-01,2100-12-31"  unselectable="on" onfocus="this.blur()"/> -->
        <input style="width: 90%;" type="tel" readonly="" name="input_date" :value="age" placeholder="输入18位身份证号后自动填充"
               data-lcalendar="1900-01-01,2100-12-31" unselectable="on" onfocus="this.blur()"/>
      </div>
      <!--学历-->
      <div class="sex">
        <span>学历</span>
        <img src="./images/right.png" alt="">
        <input type="text" id="education" placeholder="请选择学历">
        <!--<select name="" v-model="education">
          <option value="">请选择</option>
          <option value="高中">高中</option>
          <option value="大专">大专</option>
          <option value="本科">本科</option>
          <option value="研究生">研究生</option>
          <option value="硕士">硕士</option>
          <option value="博士">博士</option>
          <option value="其他">其他</option>
        </select>-->
      </div>
      <!--联系方式 -->
      <div class="name">
        <span>联系方式</span>
        <span class="peoName">{{phone}}</span>
      </div>

    </div>

    <!--个人信息-->
    <div id="mine">
      <!--简介-->
      <div class="brief">
        <span style="width:24%;">自我简介</span><input type="text" placeholder="请输入自我简介" v-model="mine">
      </div>
      <!--上传图片-->
      <div class="upload">
        <p class="mustFill">添加个人相册</p>
        <div>
          <div class="list" v-for="(item,index) in imgList">
            <img class="imag" @click="imgSize(url1+item,imgList)" :src="url1+item">
            <img class="del" @click="del(index)" src="./images/close.png" alt="">
          </div>

          <div v-show="imgList.length<9" class="album" @click="xmTanUploadImg1">
            <!-- <input id="upImgList" type="file" accept="image/*" @change="upImgList"> -->
            <img src="./images/addImg.png" alt="">
            <span>添加相册</span>
          </div>
        </div>
      </div>
    </div>
    <div id="clipArea" v-show="coreImg"></div>
    <span id="clipBtn" v-show="coreImg">使用</span>


    <!--相册弹框-->
    <div id="bigImg" v-if="show" @click="hideImg">
      <img :src="bigImage" alt="">
    </div>

    <!--提交时候的提示 -->
    <div id="model" v-show="IsAddS"></div>
    <div id="isAdd" v-show="IsAddS">
      <P>
        <img src="./images/ts.png" alt="">
        <span>提示</span>
      </P>
      <div class="content">
        本人承诺以上信息真实有效，愿意承担一切后果！
      </div>
      <div class="bottom">
        <span class="no" @click="nIsAddS">否</span>
        <span class="yes" @click="yIsAddS">是</span>
      </div>

    </div>
    <!--提交-->
    <div id="submit" @click="submit">
      提交
    </div>
  </div>
</template>

<script>

  export default {
    name: 'HelloWorld',
    data() {
      return {
        img: require('./images/mrHeader.jpg'),  //默认
        sex: '',   //性别
        marry: '0',  //婚否
        phone: '',  //联系方式
        age: '',   //年龄
        place: '',  //籍贯
        idCard: '',  //身份证号
        imgList: [],   //相册
        imgMore: [],   //传给后台的
        mine: '',  //自我简介
        faceImg: '',  //后台-头像
        userid: '',
        name: '',
        gender: '',
        url1: '',
        show: false,
        bigImage: '',
        coreImg: false,
        education: '',   //学历
        IsAddS: false,
        yearM: "",
        type: ""  //判断是安卓  还是ios   为1是安卓 2是ios

      }

    },
    created: function () {
      $("#title").text("个人信息");
      this.$MintUI.Indicator.close();
      clearTimeout(this.setTime);
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open("加载中");
    },
    mounted: function () {
      this.getTime();
      /* var calendar = new lCalendar();
                 calendar.init({
                     'trigger': '#demo1',
                     'type': 'date'
                 }); */
      this.getSignature();//获取签名等信息
      this.getMsg();//获取个人信息
      var fileName;
      var that = this;
      var clipArea = new bjj.PhotoClip("#clipArea", {
        size: [],
        outputSize: [],
        file: "#file",
        view: "#view",
        ok: "#clipBtn",
        loadStart: function (e) {
          that.coreImg = true;
          fileName = e.name;
        },
        loadComplete: function (e) {
          //console.log("照片读取完成");
        },
        clipFinish: function (dataURL) {
          that.coreImg = false;
          that.$MintUI.Indicator.open("上传中");
          $.ajax({
            url: that.port + "api/FeedBack/UpImage",
            type: "POST",
            data: {
              base64_string: dataURL,
              fileExt: fileName,
              gao: '100',
              kuan: '100'
            },
            dataType: "json",
            success: function (res) {
              if (res.returncode == 0) {
                that.faceImg = res.data;
                that.img = that.url1 + res.data;
                that.$MintUI.Indicator.close();
              } else {

                that.$MintUI.Indicator.close();
                that.$MintUI.Toast(res.msg);
              }
            }, error: function () {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast("服务器错误");

            }
          });

        }
      });

      $("#picker").picker({
        title: "",
        cols: [
          {
            textAlign: 'center',
            values: ['单身', '非单身']
          }
        ]
      });

      $('#education').picker({
        title: '请选择学历',
        cols: [
          {
            textAlign: 'center',
            values: ['高中', '大专', '本科', '研究生', '硕士', '博士', '其他'],
          }
        ]
      });
    },
    methods: {
      getSignature: function () {   //获取签名等信息
        var that = this;
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
          that.type = "1";
        } else if (isiOS) {
          that.type = "2";
        }
        var url = window.location.href;
        if (window.location.hash.length) {
          url = url.substr(0, url.indexOf(window.location.hash));
        }
        $.ajax({
          type: "post",
          url: that.port + "api/Service/GetJsApiConfig",
          data: {url: url},
          dataType: "json",
          success: function (res) {
            var result = JSON.parse(res.data);
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: that.Crop_Id + '', // 必填，企业微信的cropID
              timestamp: result.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.nonceStr + '', // 必填，生成签名的随机串
              signature: result.signature + '',// 必填，签名，见附录1
              jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData', 'previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

          }, error: function () {
            that.wxError();
          }
        });
      },
      iosUpImg: function (e) {   //ios上传图片,,
        var that = this;
        wx.getLocalImgData({
          localId: e, // 图片的localID
          success: function (res) {
            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            var fileName = "1.jpg";
            $.ajax({
              url: that.port + "api/FeedBack/UpImage",
              type: "POST",
              data: {
                base64_string: localData,
                fileExt: fileName,
              },
              dataType: "json",
              success: function (res) {
                if (res.returncode == 0) {
                  that.imgList.push(res.data);
                } else {
                  that.$MintUI.Toast("上传失败");
                }
              }, error: function () {
                that.$MintUI.Toast("服务器错误");
              }
            });
          }
        });
      },
      androidUpImg: function (e) {   //安卓  下载图片,,,
        var that = this;
        wx.uploadImage({
          localId: e, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            var media_id = res.serverId; // 返回图片的服务器端ID
            //从腾讯服务器  下载上传的图片传到自己的服务器
            $.ajax({
              url: that.port + "api/Service/GetMedia",
              data: {
                media_id: media_id
              },
              type: "post",
              dataType: "json",
              success: function (res) {
                if (res.returncode == 0) {
                  that.imgList.push(res.data);
                } else {
                  that.$MintUI.Toast("上传失败");
                }
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                that.$MintUI.Toast("上传失败");
              }
            });
          }
        });
      },
      //图片上传
      xmTanUploadImg1: function (e) {
        var that = this;
        wx.ready(function () {
          wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            defaultCameraMode: "batch", //表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
            success: function (res) {
              if (that.type == "1") {
                for (var i = 0; i < res.localIds.length; i++) {
                  var localIds = res.localIds[i].toString();
                  that.androidUpImg(localIds);
                }
              } else {
                for (var i = 0; i < res.localIds.length; i++) {
                  var localIds1 = res.localIds[i].toString();
                  that.iosUpImg(localIds1);
                }
              }
              // andriod中localId可以作为img标签的src属性显示图片；
              // 而在IOS中需通过上面的接口getLocalImgData获取图片base64数据，从而用于img标签的显示

            }
          });
        });
      },
      getTime: function () {  //获取当前的时间
        var that = this;
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var data = date.getDate();
        that.year = year;
        that.month = month;
        if (that.month.toString().length == 1) {
          that.month = "0" + that.month;
        }
        that.yearM = that.year + "-" + that.month + "-" + date.getDate();
      },
      yIsAddS: function () {  //提交信息
        var that = this;
        that.$MintUI.Indicator.open("提交中");
        var img = that.imgList.toString();
        var marry = '';
        if ($('#picker').val() == '单身') {
          marry = '0'
        } else if ($('#picker').val() == '非单身') {
          marry = '1'
        }
        var education = $('#education').val();
        var mine = encodeURI(that.mine);
        $.ajax({
          url: that.port + "api/QueQiao/UpdateQueQiaoUser",
          type: "POST",
          data: {
            userid: that.userid,
            status: marry,
            remark: mine,
            img: img,
            faceImg: that.faceImg,
            place: that.place,
            birthday: that.age,
            education: education,
            card: that.idCard,
            contact: that.phone,
          },
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              that.$MintUI.Indicator.close();
              that.IsAddS = false;
              that.$MintUI.Toast("编辑成功");
              setTimeout(function () {
                that.$router.push('/love/LperCenter');
              }, 1500);
            } else {
              that.$MintUI.Toast("数据错误");
              that.$MintUI.Indicator.close();
            }
          }, error: function () {
            that.$MintUI.Toast("服务器错误");
            that.$MintUI.Indicator.close();
          }
        });
      },
      nIsAddS: function () {
        this.IsAddS = false;
      },
      imgSize: function (e, list) {  //图片放大
        /* 						this.bigImage=e;
                                    this.show=true; */
        var that = this;
        var arr = [];
        for (var i = 0; i < list.length; i++) {
          arr.push(that.url1 + list[i]);
        }
        wx.ready(function () {
          wx.previewImage({
            current: e, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
          });
        });
      },
      hideImg: function () {
        this.bigImage = "";
        this.show = false;
      },
      getMsg: function () {   //获取当前使用人的name  需传给后台
        var that = this;
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/QueUserBaseInfo",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.name = data.userinfo.name;
              that.phone = data.userinfo.mobile;
              that.gender = data.userinfo.gender;
              if (data.queqiao == null || data.queqiao == "") {
              } else {
                if (data.queqiao.status == 0) {
                  $('#picker').val('单身');
                } else if (data.queqiao.status == 1) {
                  $('#picker').val('非单身');
                }

                that.place = data.queqiao.place;
                if (data.queqiao.education != null) {
                  $('#education').val(data.queqiao.education)
                }
                if(data.queqiao.card != null && data.queqiao.card !=''){
                  that.idCard = data.queqiao.card;
                }else{
                  that.idCard= '';
                }
                if (data.queqiao.birthday != null) {
                  that.age = data.queqiao.birthday.split(" ")[0];
                }
                if(data.queqiao.remark != null &&data.queqiao.remark !=''){
                  that.mine = decodeURI(data.queqiao.remark);
                }else{
                  that.mine = ''

                }
                if (data.queqiao.faceImg == null || data.queqiao.faceImg == "") {

                } else {
                  that.faceImg = data.queqiao.faceImg;
                  that.img = that.port + data.queqiao.faceImg;
                }
              }
              if (data.imglist == null || data.imglist == "") {
              } else {
                that.imgList = data.imglist;
              }
              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast("数据错误");
              return false;
            }

          }, error: function () {
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
      xmTanUploadImg: function (e) {  //头像上传
        var obj = e.target;
        that.$MintUI.Indicator.open("上传中");
        var that = this;
        var file = obj.files[0];
        var fileName = file.name;
        var fileType = file.type.slice(file.type.indexOf('/') + 1).toLowerCase();
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'JPG' || fileType == 'PNG' || fileType == 'JPEG') {
          lrz(file, {width: 450})
            .then(function (rst) {
              $.ajax({
                url: that.port + "api/FeedBack/UpImage",
                type: "POST",
                data: {
                  base64_string: rst.base64,
                  fileExt: fileName,
                  gao: '100',
                  kuan: '100'
                },
                dataType: "json",
                success: function (res) {
                  if (res.returncode == 0) {
                    that.faceImg = res.data;
                    that.img = port + res.data;
                    that.$MintUI.Indicator.close();
                  } else {
                    that.$MintUI.Indicator.close();
                  }
                }, error: function () {
                  that.$MintUI.Indicator.close();
                  that.$MintUI.Toast("服务器错误");
                }
              });
            }).catch(function (err) {
          }).always(function () {
            obj.value = null;
            that.$MintUI.Indicator.close();
          });
        } else {
          that.$MintUI.Indicator.close();
          that.$MintUI.Toast("上传图片格式不正确");
          return false;
        }
      },
      del: function (e) {  //删除相册
        this.imgList.splice(e, 1);
      },
      submit: function () {   //提交
        var that = this;
        if (that.idCard != null && that.idCard.length != 18  &&!(/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(that.idCard))) {
          that.$MintUI.Toast("请输入长度为18位的正确身份证号码");
          that.IsAddS = false;
          return false;
        }
        if (that.age != "") {
          if (Number(that.age.split("-")[0]) > Number(that.yearM.split("-")[0])) {
            that.$MintUI.Toast("出生日期不能大于当前日期");
            that.IsAddS = false;
            return false;
          }
          if (Number(that.age.split("-")[0]) == Number(that.yearM.split("-")[0])) {
            if (Number(that.age.split("-")[1]) > Number(that.yearM.split("-")[1])) {
              that.$MintUI.Toast("出生日期不能大于当前日期");
              that.IsAddS = false;
              return false;
            }
            if (Number(that.age.split("-")[1]) == Number(that.yearM.split("-")[1])) {
              if (Number(that.age.split("-")[2]) > Number(that.yearM.split("-")[2])) {
                that.$MintUI.Toast("出生日期不能大于当前日期");
                that.IsAddS = false;
                return false;
              }
            }
          }
        }
        if (that.imgList.length <= 0) {
          that.$MintUI.Toast("请上传相册");
          return false;
        }
        that.IsAddS = true;
      }
    },
    watch: {
      idCard: function (value) {
        var that = this;
        if (value != "" && value != null) {
          if (value.length == 18) {
            that.age = value.substr(6, 4) + "-" + value.substr(10, 2) + "-" + value.substr(12, 2)
          } else {
            that.age = "";
          }
        }
      }
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/information.css";

  #Linformation {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  #clipArea {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
  }

  #clipBtn {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99;
    color: #0094ff;
  }

  .mustFill:after{
    content:'*';
    color:red;
    margin-left: .2rem;
  }

  /*# sourceMappingURL=home.css.map */
</style>
