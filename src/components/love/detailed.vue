<template>
  <div id="app" v-cloak>
    <!--背景图-->
    <div id="img">
      <img src="./images/perMsg.png" alt="">
    </div>
    <!--个人信息-->
    <div id="per">
      <p>{{name}} <span>{{age}}岁</span></p>
      <div>
        <div class="img" :style="{width:widthImg}">
          <div class="imgBoxs" v-for="item in imgs">
            <img :src="item" @click="imgSize(item,imgs)" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--个人资料-->
    <div id="perData">
      <p>个人资料</p>
      <div>
        <span>{{age}}岁</span>
        <span v-if="status==0">单身</span>
        <span v-if="status==1">非单身</span>
        <span>{{dept}}</span>
        <span>{{sex}}</span>
      </div>
    </div>
    <div id="introduce">
      <p>个人简介</p>
      <div>
        <p>{{remark==""?'他没有填写个人简介':remark}}</p>
      </div>
    </div>
    <!--最新动态-->
    <div id="newDynamic">
      <p>最新动态</p>
      <div class="list" v-for="item in dynamicList">
        <p class="tent">{{item.dynamic.content}}</p>
        <div class="content">
          <div class="img" :style="{width:item.dynamic.widthList}">
            <div v-for="it in item.dynamic_img">
              <img :src="it" @click="imgSize(it,item.dynamic_img)" alt="">
            </div>
          </div>
        </div>
        <p class="reply">
          <span class="time">{{item.dynamic.createTime}}</span>
          <span class="replyMsg" @click="hf(item.dynamic.id)"><img style="vertical-align: middle"
                                                                   src="./images/rmsg.png"
                                                                   alt="">{{item.reply.length}}</span>
          <span v-if="item.type=='1'" class="fabulous" @click="Fabulous(item.dynamic.id)"><img
            src="./images/appreciate.png"
            alt="">{{item.dynamic.isGood}}</span>
          <span v-else class="fabulous" @click="Fabulous(item.dynamic.id)"><img src="./images/appreciate_01.png"
                                                                                alt="">{{item.dynamic.isGood}}</span>
        </p>
        <div class="otherMsg">
          <p v-for="ite in item.reply"><span>{{ite.replyName}}：</span><span>{{ite.replyContent}}</span></p>
        </div>
      </div>
    </div>
    <!--关注-私信-->
    <div id="footer" v-if="id!=userid">
      <span class="follow" @click="follow" v-if="isfollow==0">+关注</span>
      <span class="follow" @click="followClick" v-if="isfollow==1">已关注</span>
      <span class="letter" @click="letterMsg">私信</span>
    </div>
    <!--相册弹框-->
    <div id="bigImg" v-if="imgShow" @click="hideImg">
      <img :src="bigImage" alt="">
    </div>
    <!--回复弹框-->
    <div id="zz" v-show="show" @click="hide"></div>
    <div id="msg_model" v-show="show">
      <textarea placeholder="请输入回复内容" v-model="replyContent"></textarea>
      <div :class="{'gary':msg_ison}" @click="msg_on">评论</div>
    </div>
    <!--私信弹框-->
    <div id="letterModel" v-show="showMsg" @click="hideMsg"></div>
    <div id="msg_letter" v-show="showMsg">
      <textarea placeholder="请输入私信内容" v-model="msgLetter"></textarea>
      <div :class="{'gary':msg_ison}" @click="sendLetter">发送私信</div>
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
        showMsg: false,
        imgs: [],
        lists: [],
        widthImg: '',
        widthList: '',
        id: '',
        name: '',
        age: '',
        dept: '',  //部门
        sex: '',
        remark: '',
        dynamicList: [],   //动态列表
        msg_ison: true,
        dynamicId: '',  //回复动态id
        replyContent: '',  //回复内容
        userName: '',
        msgLetter: '',  //私信内容
        imgShow: false,
        bigImage: '',
        status: '',
        isfollow: ""  //是否关注
      }

    },
    created: function () {
      $("#title").text("详细信息");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      var that = this;
      that.id = that.$route.query.id;
      that.perMsg();  //页面的数据
      that.getName();  //获取使用者姓名
      that.getJsApiConfig()
    },
    methods: {
      imgSize: function (e, list) {  //图片放大,
        var that = this;
        /* this.bigImage=e;
        this.imgShow=true; */
        wx.previewImage({
          current: e, // 当前显示图片的http链接
          urls: list // 需要预览的图片http链接列表
        });
      },
      hideImg: function () {
        this.bigImage = "";
        this.imgShow = false;
      },
      getJsApiConfig: function () {
        var that = this;
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
              beta: true,
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: that.Crop_Id, // 必填，企业微信的cropID
              timestamp: result.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.nonceStr, // 必填，生成签名的随机串
              signature: result.signature,// 必填，签名，见附录1
              jsApiList: ['openEnterpriseChat', "previewImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });


          }, error: function () {
          }
        });
      },
      letterMsg: function () {  //私信弹框显示
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/IsQueQiao",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              if (res.data == "0") {   //未加入
                that.$MintUI.Toast("请先加入茅台佳缘");
              } else if (res.data == "1") {
                that.showMsg = true;
              }
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
        /*   var that=this;
                               wx.ready(function () {
                                   wx.openEnterpriseChat({
                                           // 注意：userIds和externalUserIds至少选填一个，且userIds+openIds总数不能超过2000。
                                           userIds: that.id,    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
                                           groupName: '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
                                           success: function(res) {
                                                   // 回调
                                                   console.log(res);
                                           },
                                           fail: function(res) {
                                                   console.log("错误res========"+res);
                                                   if(res.errMsg.indexOf('function not exist') > -1){
                                                           alert('版本过低请升级')
                                                   }
                                           }
                                   });
                           }); */
      },
      hideMsg: function () {  //私信隐藏
        this.msgLetter = "";
        this.showMsg = false;
      },
      sendLetter: function () {  //私信回复
        var that = this;

        if (that.msgLetter == "") {
          that.$MintUI.Toast("请输入私信内容");
          return false;
        }
        that.$MintUI.Indicator.open("发送中");
        var title = "";
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/SendMessage",
          data: {sendId: that.userid, receiveId: that.id, title: title, content: that.msgLetter},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              that.msgLetter = "";
              that.showMsg = false;
              that.$MintUI.Toast(res.msg);
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast(res.msg);
            return false;
          }
        });


      },
      hf: function (e) {   //回复弹框
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/IsQueQiao",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              if (res.data == "0") {   //未加入
                that.$MintUI.Toast("请先加入茅台佳缘");
              } else if (res.data == "1") {
                that.dynamicId = e;
                that.show = true;
              }
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });

      },
      msg_on: function () {
        var that = this;
        if (that.replyContent == "") {
          that.$MintUI.Indicator.close();
          that.$MintUI.Toast("请输入回复内容");
          return false;
        }
        that.$MintUI.Indicator.open("回复中");
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/ReplyDynamic",
          data: {dynamicId: that.dynamicId, replyId: that.userid, replyContent: that.replyContent},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var a = {
                replyName: that.userName,
                replyContent: that.replyContent
              }
              for (var i = 0; i < that.dynamicList.length; i++) {
                if (that.dynamicList[i].dynamic.id == that.dynamicId) {
                  that.dynamicList[i].reply.push(a);
                }
              }
              that.dynamicId = "";
              that.replyContent = "";
              that.show = false;
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });

      },
      hide: function () {
        this.show = false;
        this.dynamicId = "";
        this.replyContent = "";
      },
      Fabulous: function (e) {   //点赞
        var that = this;
        that.$MintUI.Indicator.open("点赞");
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/DynamicIsGood",
          data: {id: e, userid: that.userid},
          dataType: "json",
          success: function (res) {

            if (res.returncode == 0) {
              if (res.data == "1") {
                that.$MintUI.Indicator.close();
                that.$MintUI.Toast(res.msg);
                return false;
              }

              var data = JSON.parse(res.data);
              if (data.type == "1") {  //点赞成功
                for (var i = 0; i < that.dynamicList.length; i++) {
                  if (that.dynamicList[i].dynamic.id == e) {
                    that.dynamicList[i].dynamic.isGood = data.is_good;
                    that.dynamicList[i].type = "0";
                  }
                }
              } else if (data.type == "0") {  //取消点赞
                for (var i = 0; i < that.dynamicList.length; i++) {
                  if (that.dynamicList[i].dynamic.id == e) {
                    that.dynamicList[i].dynamic.isGood = data.is_good;
                    that.dynamicList[i].type = "1";
                  }
                }

              }
              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });

      },
      perMsg: function () {
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/GetQueQiaoUserInfo",
          data: {
            userid: that.id,
            loginid: that.userid
          },
          dataType: "json",
          success: function (res) {

            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.status = data.queqiao_user.status;
              that.name = data.queqiao_user.name;
              that.age = data.queqiao_user.age;
              that.widthImg = (data.user_img_list.length * 6.5) + "rem";
              for (var i = 0; i < data.user_img_list.length; i++) {  //相册
                data.user_img_list[i] = that.port + data.user_img_list[i];
              }
              that.imgs = data.user_img_list;
              that.dept = data.queqiao_user.dept;
              that.sex = data.queqiao_user.sex;
              that.remark = data.queqiao_user.remark;
              that.isfollow = data.queqiao_user.isfollow;
              for (var j = 0; j < data.dynamic.length; j++) {
                var width = (data.dynamic[j].dynamic_img.length * 5.3) + "rem";
                data.dynamic[j].dynamic['widthList'] = width;
                for (var k = 0; k < data.dynamic[j].dynamic_img.length; k++) {
                  data.dynamic[j].dynamic_img[k] = that.port + data.dynamic[j].dynamic_img[k];
                }

              }
              that.dynamicList = data.dynamic;


            }

          }, error: function () {
            that.$MintUI.Indicator.close();
          }
        });
      },
      getName: function () {   //获取当前使用人的name  需传给后台
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/UserBaseInfo/GetUserBaseInfo",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.userName = data.name;
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
      follow: function () {  //关注
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/AddFollow",
          data: {userid: that.id, followid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              if (res.data == "0") {  //关注
                that.isfollow = "1";
              }

              that.$MintUI.Toast(res.msg);
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });

      }, followClick: function () {
        var that = this;
        var userid = userid;
        var followid = followid;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/DelFollow',
          data: {userid: that.id, followid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == "0") {
              that.$MintUI.Toast(res.msg);
              if (res.data == "0") {  //关注
                that.isfollow = "0";
              }
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }
          }, error: function () {
            that.$MintUI.Toast("服务器错误");

          }
        })
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/detailed.css"
  /*# sourceMappingURL=home.css.map */
</style>
