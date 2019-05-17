<template>
  <div class="detail" v-infinite-scroll="perMsg" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <!--背景图-->
    <div id="img" class="swiper-container" v-show="imgs.length>0">
      <!--<div class="paging">
        {{nowPage}}/{{imgs.length}}
      </div>-->
      <div class="swiper-wrapper">
        <div class="swiper-slide" style="overflow: hidden;" v-for="item in imgs">
          <img ref="allImgs" :src="item" @click="imgSize(item,imgs)">
        </div>
      </div>
    </div>
    <div v-show="imgs.length<=0" id="img">
      <img v-changeSize src="./images/theBG.jpeg">
    </div>
    <!--个人信息-->
    <div id="per">
      <!--关注(未)-->
      <div class="circle" style="color:#f98b8b;border:1px solid #f98b8b;" v-if="id!=userid" @click="follow"
           v-show="isfollow==0"><img src="./images/jy-21+.png"><span>关注</span>
      </div>

      <!--关注(已关注)-->
      <div class="circle" style="color:#fff;border:1px solid #f98b8b;background: #f98b8b;" v-if="id!=userid"
           @click="followClick" v-show="isfollow==1"><img src="./images/jy-21.png"><span>已关注</span>
      </div>

      <!--私信-->
      <div v-if="id!=userid" class="circle" style="right: 5.25rem;" @click="letterMsg()"><img src="./images/jy-22+.png"
                                                                                              alt=""><span>私信TA</span>
      </div>
      <p>{{name}}
        <img v-if="theSex == '女'" src="./images/jy-4.png">
        <img v-if="theSex == '男'" src="./images/jy-5.png">
      </p>
      <div class="work">{{age}}岁/{{dept}}</div>
      <div class="description" v-html="remark!=''&&remark!=null?decodeURI(remark):'TA什么都没留下'"></div>
    </div>

    <!--个人资料-->
    <!--<div id="perData">
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
    </div>-->

    <!--最新动态-->
    <div id="newDynamic">
      <p>最新动态</p>
      <div class="list"
           v-for="(item,index) in dynamicList">
        <div class="clock">
          <div class="theTime">
            <span class="days">{{item.dynamic.createTime.split(' ')[0].split('-')[2]}}</span><span>/</span><span
            class="months">{{item.dynamic.createTime.split(' ')[0].split('-')[1]}}月</span>
          </div>
          <div class="prise">
             <span v-if="item.type ==1" class="fabulous" @click="Fabulous(item.dynamic.id,index)">
              <img src="./images/jy-26.png" alt="">
               <!--{{item.dynamic.isGood}}-->
               赞
            </span>
            <span style="background: #f98b8b;color:#fff;border:0" v-if="item.type ==0" class="fabulous"
                  @click="Fabulous(item.dynamic.id,index)">
              <img src="./images/jy-20.png" alt="">
              <!--{{item.dynamic.isGood}}-->
               已赞
            </span>
            <span style="float: right;" class="fabulous" @click="hf(item.dynamic.id,index)">
              <img src="./images/jy-27.png" alt="">
                评论
              <!--{{item.reply.length}}-->
            </span>
          </div>
        </div>
        <p class="tent">{{decodeURI(item.dynamic.content)}}</p>
        <div class="content">
          <div class="img"><!-- :style="{width:item.dynamic.widthList}"-->
            <div v-for="it in item.dynamic_img" v-if="item.dynamic_img.length>0">
              <img v-changeSize :src="url+it" @click="imgSize1(url+it,item.dynamic_img)" alt="">
            </div>
          </div>
        </div>
        <div class="reply">
          <!--<span class="time">{{item.dynamic.createTime}}</span>-->
          <div class="msgHead" v-if="item.isgoodname != '' && item.isgoodname != null">
            <span class="replyMsg">
            <img style="margin-right: .75rem;" src="./images/jy-23.png" alt="">
              <span class="praiseName">
              {{item.isgoodname}}
              </span>
            </span>
          </div>
          <div class="otherMsg" v-if="item.reply.length>0">
            <p v-for="(ite,indx) in item.reply" @click.stop="delMsg(index,indx,ite.id,ite.createBy)">
              <span class="replyName">{{ite.replyName}}：</span>
              <span class="replyCont">
                {{decodeURI(ite.replyContent)}}
              </span>
              <!--<span @click="delMsg(ite.id)" v-if="ite.replyId == WX_UserId" class="delMsg">
                <img src="./images/delMsg.png" alt="">
              </span>-->
            </p>
          </div>
        </div>
      </div>
      <!--加载中-->
      <div v-show="loadingShow"
           style="overflow:hidden;padding:0.5rem 0;margin:0 auto;color:#aaa;width:4.5rem;font-size:0.75rem;text-align:center;">
        <mt-spinner style="float:left;" :type="3" color="#aaa" :size="20"></mt-spinner>
        <span style="font-size: 12px;">加载中</span>
      </div>

      <div v-if="noDynamic"
           style="font-size: 12px;padding: .5rem;color: #aaa;background: #f5f5f5;text-align: center;overflow: hidden;">------暂无数据------
      </div>
      <div v-show="noData" style="font-size: 12px;padding: .5rem;color: #aaa;text-align: center;clear: both">------已显示所有内容------
      </div>

    </div>
    <!--关注-私信-->
    <!--<div id="footer" v-if="id!=userid">
      <span class="follow" @click="follow" v-if="isfollow==0">+关注</span>
      <span class="follow" @click="followClick" v-if="isfollow==1">已关注</span>
      <span class="letter" @click="letterMsg">私信</span>
    </div>-->
    <!--相册弹框-->
    <div id="bigImg" v-if="imgShow" @click="hideImg">
      <img :src="bigImage" alt="">
    </div>
    <!--回复弹框-->
    <!--<div id="zz" v-show="show" @click="hide"></div>
    <div id="msg_model" v-show="show">
      <textarea placeholder="请输入回复内容" v-model="replyContent"></textarea>
      <div :class="{'gary':msg_ison}" @click="msg_on">评论</div>
    </div>-->
    <!--私信弹框-->
    <div id="letterModel" v-show="showMsg" @click="hideMsg">
      <div id="msg_letter" @click.stop>
        <h4><img src="./images/jy-22+.png">我想对{{name}}说</h4>
        <textarea placeholder="请输入私信内容" v-model="msgletter"></textarea>
        <div>
          <span class="yesSend" :class="{'gary':msg_ison}" @click="sendletter">发送私信</span>
          <span class="noSend" @click="hideMsg">取消</span>
        </div>
      </div>
    </div>
    <div class="footer" v-show="show" @click="hide">
      <div class="total" @click.stop>

        <div class="insert">
          <img src="./images/cy-fb3.png" alt="">
          <input ref="response" type="text" placeholder="写评论..." v-model="replyContent">
        </div>
        <div class="publish" @click="msg_on">发布</div>
      </div>
    </div>
  </div>


</template>

<script>
  import Swiper from 'swiper'
  import {MessageBox} from 'mint-ui';

  export default {
    name: 'HelloWorld',
    data() {
      return {
        noData: false, //没有更多数据
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
        msgletter: '',  //私信内容
        imgShow: false,
        bigImage: '',
        status: '',
        isfollow: "",  //是否关注
        noDynamic: false,
        pageIndex: 0,
        pageSize: 4,
        loading: true,
        nowPage: 1,
        pushMsg:0,
        loadingShow:false,
        theSex:0,
      }

    },
    //指令
    directives: {
      changeSize: {
        inserted: function (el) {
          var getImgInfo = function (url) {
            return new Promise(resovle => {
              var img = new Image();
              var json = {};
              img.src = url;
              img.onload = function () {
                json['width'] = img.width;
                json['height'] = img.height;
                resovle(json);
              }
            })
          };
          var maxwidth = el.parentNode.offsetWidth;
          getImgInfo(el.src).then(res => {
            var that = this;
            var theWidth = el.width;
            var theHeight = el.height;
            if (theWidth > theHeight) {
              el.style.height = '100%';
              el.style.width = 'auto';
            } else {
              el.style.height = 'auto';
              el.style.width = '100%';
            }
          })
        }
      }
    },

    created: function () {
      $("#title").text("详细信息");
      this.$MintUI.Indicator.close();
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      this.userid = this.WX_UserId;
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      var that = this;
      that.id = that.$route.query.id;
      that.perMsg();  //页面的数据
      that.getName();  //获取使用者姓名
      that.getJsApiConfig();
      var mySwiper = new Swiper('.swiper-container', {
        autoplay: true,//可选选项，自动滑动
        loop: true,
        delay: 2000,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        type : 'fraction',
        on: {
          touchMove: function (event) {
            that.nowPage = mySwiper.activeIndex + 1;
          },
        },
      })
    },
    methods: {
      showBig:function(){

      },

      //删除评论
      delMsg: function (index,indx,theId, theUserid) {
        if(theUserid == this.userid){
          var that = this;
          MessageBox.confirm('确定删除该评论?').then(action => {
            // alert(theId);
            $.ajax({
              type: "post",
              url: that.port + "api/QueQiao/DelDynamicReply",
              data: {
                id: theId,
                userid: that.userid,
              },
              dataType: "json",
              success: function (res) {
                if (res.returncode == 0) {
                  that.dynamicList[index].reply.splice(indx,1);
                }
              }
            })
          });
        }
      },

      imgSize: function (e, list) {  //图片放大,
        var that = this;
        /* this.bigImage=e;
        this.imgShow=true; */
        console.log(e);
        console.log(list);
        wx.previewImage({
          current: e, // 当前显示图片的http链接
          urls: list // 需要预览的图片http链接列表
        });
      },
      imgSize1: function (e, list) {  //图片放大,
        var that = this;
        var ss = [];
        for(var i = 0;i<list.length;i++){
          var theImg = that.url+list[i]
          ss.push(theImg)
        }
        console.log(e);
        console.log(ss);
        wx.previewImage({
          current: e, // 当前显示图片的http链接
          urls: ss // 需要预览的图片http链接列表
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
              jsApiList: ["previewImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          }, error: function () {
            that.wxError();
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
                setTimeout(function () {
                  that.$router.push({path: '/love/lPerCenter'});
                }, 1000);
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
        /*  var that = this;
          wx.ready(function () {
            wx.openEnterpriseChat({
              // 注意：userIds和externalUserIds至少选填一个，且userIds+openIds总数不能超过2000。
              userIds: that.id,    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
              groupName: '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
              success: function (res) {
                // 回调
                console.log(res);
              },
              fail: function (res) {
                console.log("错误res========" + res);
                if (res.errMsg.indexOf('function not exist') > -1) {
                  alert('版本过低请升级')
                }
              }
            });
          });*/
      },
      hideMsg: function () {  //私信隐藏
        this.msgletter = "";
        this.showMsg = false;
      },

      //私信回复
      sendletter: function () {
        var that = this;
        if (that.msgletter == "") {
          that.$MintUI.Toast("请输入私信内容");
          return false;
        }
        that.$MintUI.Indicator.open("发送中");
        var msgletter = encodeURI(that.msgletter);
        var title = "";
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/SendMessage",
          data: {sendId: that.userid, receiveId: that.id, title: title, content: msgletter},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              that.msgletter = "";
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

      hf: function (e,index) {   //回复弹框
        var that = this;
        that.pushMsg= index;
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
                $('.detail').css('padding-bottom', '3rem');
                that.$refs.response.focus();
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
        $('.detail').css('padding-bottom', 0);
        // that.$MintUI.Indicator.open("回复中");
        var replyContent = encodeURI(that.replyContent)
        debugger
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/ReplyDynamic",
          data: {dynamicId: that.dynamicId, replyId: that.userid, replyContent: replyContent},
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            var ss = JSON.parse(res.data).retmodel;
            if (res.returncode == 0) {
              var a = {
                replyName: that.userName,
                replyContent: decodeURI(that.replyContent)
              }
              for (var i = 0; i < that.dynamicList.length; i++) {
                if (that.dynamicList[i].reply.id == that.dynamicId) {
                  that.dynamicList[i].reply.push(a);
                }
              }

              that.dynamicList[that.pushMsg].reply.push(ss);

              if (that.dynamicList.length <= 0) {
                that.noDynamic = true;
              } else {
                that.noDynamic = false;
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
        $('.detail').css('padding-bottom', 0);
        this.show = false;
        this.dynamicId = "";
        this.replyContent = "";
      },

      Fabulous: function (e, index) {   //点赞
        var that = this;
        // that.$MintUI.Indicator.open("点赞");
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/DynamicIsGood",
          data: {id: e, userid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              if (data.type == "1") {  //点赞成功
                /*  for (var i = 0; i < that.dynamicList.length; i++) {
                    if (that.dynamicList[i].dynamic.id == e) {
                      that.dynamicList[i].dynamic.isGood = data.is_good;
                      that.dynamicList[i].type = "0";
                    }
                  }*/
                that.dynamicList[index].dynamic.isGood = data.is_good;
                that.dynamicList[index].type = "0";
                that.dynamicList[index].isgoodname = data.names;

              } else if (data.type == "0") {  //取消点赞
                /* for (var i = 0; i < that.dynamicList.length; i++) {
                   if (that.dynamicList[i].dynamic.id == e) {
                     that.dynamicList[i].dynamic.isGood = data.is_good;
                     that.dynamicList[i].type = "1";
                   }
                 }*/
                that.dynamicList[index].dynamic.isGood = data.is_good;
                that.dynamicList[index].type = "1";
                that.dynamicList[index].isgoodname = data.names;
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
        this.loading = true;
        if (that.pageIndex > 0) {
          that.loadingShow = true;
        }
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/GetQueQiaoUserInfo",
          data: {
            userid: that.id,
            loginid: that.userid,
            pageIndex: that.pageIndex,
            pageSize: that.pageSize,
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            that.$MintUI.Indicator.close();
            clearTimeout(that.setTime);
            if (res.returncode == 0) {

              debugger
              console.log(that.pageIndex);
              var data = JSON.parse(res.data);
              that.status = data.queqiao_user.status;
              that.name = data.queqiao_user.name;
              that.age = data.queqiao_user.age;
              that.theSex = data.queqiao_user.sex;
              that.widthImg = (data.user_img_list.length * 6.5) + "rem";
              for (var i = 0; i < data.user_img_list.length; i++) {  //相册
                data.user_img_list[i] = that.port + data.user_img_list[i];
              }
              that.imgs = data.user_img_list;
              console.log(that.imgs);
              //判断图片宽高
              that.dept = data.queqiao_user.dept;
              that.sex = data.queqiao_user.sex;
              that.remark = data.queqiao_user.remark;
              that.isfollow = data.queqiao_user.isfollow;
              var theData = data.dynamic;
              for (var j = 0; j < data.dynamic.length; j++) {
                // var width = (data.dynamic[j].dynamic_img.length * 5.3) + "rem";
                // data.dynamic[j].dynamic['widthList'] = width;
                // for (var k = 0; k < data.dynamic[j].dynamic_img.length; k++) {
                //   data.dynamic[j].dynamic_img[k] = that.port + data.dynamic[j].dynamic_img[k];
                // }
                that.dynamicList.push(data.dynamic[j]);
              }
              console.log(that.dynamicList);

              if (theData.length < that.pageSize) {
                that.loading = true;
                if (that.pageIndex <= 0 && that.dynamicList.length <= 0) {
                  that.noDynamic = true;
                } else {
                  that.noData = true;
                }
              } else {
                that.noData = false;
                that.noDynamic = false;
                that.$nextTick(function () {
                  that.loading = false;
                  that.pageIndex++;
                })
              }
            }
          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime);
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
              // that.$MintUI.Toast(res.msg);
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
      followClick: function () {
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
              // that.$MintUI.Toast(res.msg);
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
  @import "./css/detail.css";


  /*# sourceMappingURL=home.css.map */
</style>
