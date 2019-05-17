<template>
  <div id="dynamics">
    <!--个人信息-->
    <div id="mine">
      <!--简介-->
      <div class="brief">
        <textarea name="" v-model="mine" placeholder="请输入信息"></textarea>
      </div>
      <!--上传图片-->
      <div class="upload">
        <div>
          <div class="list" v-for="(item,index) in imgList">
            <img class="imag" @click="imgSize(item,imgList)" :src="item">
            <img class="del" @click="del(index)" src="./images/close.png" alt="">
          </div>
          <div v-show="imgList.length<9" class="album" @click="xmTanUploadImg">
            <!-- <input type="file" accept="image/*" @change="upImgList"> -->
            <img src="./images/addImg.png" alt="">
          </div>

        </div>
      </div>
    </div>

    <!--相册弹框-->
    <div id="bigImg" v-if="show" @click="hideImg">
      <img :src="bigImage" alt="">
    </div>

    <!--提交-->
    <div v-if="tjShow" id="submit" @click="submit">
      提交
    </div>
    <div v-else id="submit" class="gary">
      提交
    </div>

    <!--底部-->
    <div id="footer">
      <ul>
        <router-link to="/love/makeFriend" style="text-align: center;">
          <li>
            <img src="./images/jy-7.png" alt="">
            <span>缘分</span>
          </li>
        </router-link>
        <router-link to="/love/dynamics" class="red" style="text-align: center;">
          <li>
            <img src="./images/jy-10.png" alt="">
            <span>说说</span>
          </li>
        </router-link>
        <router-link to="/love/lPerCenter" style="text-align: center;">
          <li>
            <img style="margin-right: 0.1rem;" src="./images/jy-11.png" alt="">
            <span>我的</span>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        imgList: [],
        imgMore: [],
        mine: '',
        userid: '',
        show: false,
        bigImage: '',
        id: '0',
        type: "",  //判断是安卓  还是ios   为1是安卓 2是ios
        tjShow: true
      }
    },
    created: function () {
      clearTimeout(this.setTime);
      $("#title").text("说说");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
    },
    mounted: function () {
      this.getSignature();//获取签名等信息
      if (this.$route.query.id != undefined) {
        this.id = this.$route.query.id;
        this.getMsg();
      }
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
                fileExt: fileName
              },
              dataType: "json",
              success: function (res) {
                if (res.returncode == 0) {
                  that.imgMore.push(res.data);
                  that.imgList.push(that.port + res.data);
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
                  that.imgMore.push(res.data);
                  that.imgList.push(that.port + res.data);
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
      xmTanUploadImg: function (e) {
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
      getMsg: function () {
        var that = this;
        // that.$MintUI.Indicator.open("加载中");
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/DynamicDetail",
          data: {userid: that.userid, id: that.id},
          dataType: "json",
          success: function (res) {
            clearTimeout(that.setTime);
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              console.log(data);
              debugger
              that.mine = decodeURI(data.dynamic.content);
              if(data.img!=null){
                that.imgMore = data.img;
              }
              if (data.img != '' && data.img != null) {
                for (var i = 0; i < data.img.length; i++) {
                  that.imgList.push(that.port + data.img[i]);
                }
              }

              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast(res.msg);
            }

          }, error: function () {
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
      imgSize: function (e, list) {  //图片放大
        // 				this.bigImage=e;
        // 					this.show=true;
        wx.previewImage({
          current: e, // 当前显示图片的http链接
          urls: list // 需要预览的图片http链接列表
        });
      },
      hideImg: function () {
        this.bigImage = "";
        this.show = false;
      },
      del: function (e) {  //删除相册
        this.imgList.splice(e, 1);
        this.imgMore.splice(e, 1);
      },
      submit: function () {   //提交
        var that = this;


        if (this.mine == "" || this.mine == null) {
          that.$MintUI.Indicator.close();
          that.$MintUI.Toast("请输入信息");
          return false;
        }
        /* else if (that.imgMore.length == 0) {
           that.$MintUI.Indicator.close();
           that.$MintUI.Toast("请上传图片");
           return false;
         }*/ else if (that.imgMore.length > 9) {
          that.$MintUI.Toast("图片最多只能上传九张");
          return false;
        }
        var imgMore = that.imgMore.join(',');
        that.$MintUI.Indicator.open("发布中");
        that.tjShow = false;
        // alert(that.mine);
        var mine = encodeURI(that.mine);
        // alert(that.mine);
        // console.log(that.mine);
        // console.log(mine);
        // alert(mine);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/AddQueQiaoDynamic",
          data: {
            id: that.id,
            userid: that.userid,
            content: mine,
            img: imgMore
          },
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast({
                message: '提交成功',
                position: 'center',
                duration: 1400
              });
              setTimeout(function () {
                that.$router.push('/love/perDt');
              }, 1500);

            } else {
              that.$MintUI.Toast("数据错误");
              that.tjShow = true;
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            that.tjShow = true;
            return false;
          }
        });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/dynamics.css";

  #dynamics {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  #submit.gary {
    background-color: #ccc;
  }

  /*# sourceMappingURL=home.css.map */
</style>
