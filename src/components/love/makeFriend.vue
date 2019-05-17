<template>
  <div class="makeFriend">
    <div id="isAdd" v-show="addShow">
      <div class="lPlain">
        <header class="header">
          <img src="./images/jy-2.png" alt="">茅台交友
        </header>
        <div style="width: 100%;height: 100%;overflow: auto;">
          <div id="one">
            <h5>一、功能概述</h5>
            <p style="text-indent: 2em;">为茅台集团单身员工提供一个企业内的交友平台。员工首次进入该应用时需上传自己的照片及对自己的简单描述，进入应用后可在个人信息中查看自己的信息。</p>
          </div>
          <div class="two">
            <h5>二、功能说明</h5>
            <p style="font-size: 0.7rem;color:#333;">1、个人信息完善</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;个人中心->填写资料>资料确定
            </p>
            <div>
              <img v-for="item in oneImg" :src="item" alt=""><!-- @click="imgShow(item)"-->
            </div>
            <p class="sm">
              说明：用户进入茅台佳缘应用页面需完善自己的个人真实资料，不然无法在此应用中进行评论、私信、活动查看报名等操作，点击<img src="./images/one04.jpg"
                                                                            alt="">图标进入个人中心页面，点击<img
              src="./images/one05.jpg" alt="">按钮，进入个人资料填写页面。</p>
          </div>
          <div class="two" style="padding-top: 0;">
            <p style="font-size: 0.7rem;color:#333;">2、缘分页面</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;好友列表->选择好友->查看详情
            </p>
            <div>
              <img v-for="item in twoImg" :src="item" alt=""><!--@click="imgShow(item)"-->
            </div>
            <p class="sm">说明：用户完善个人资料后，点击<img style="width:1rem;" src="./images/two04.jpg"
                                              alt="">图标进入缘分页面，用户可查看所有的好友，点击<img style="width:1rem;"
                                                                                src="./images/two03.jpg" alt="">图标，可筛选好友，点击好友头像可查看其详细信息点击<span
              style="color:red;">+关注</span>可关注其为好友，点击<span style="color:red;">私信</span>可进行留言。</p>
          </div>
          <div class="two" style="padding-top: 0;">
            <p style="font-size: 0.7rem;color:#333;">3、个人中心</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;发帖->个人动态->个人中心
            </p>
            <div>
              <img v-for="item in threeImg" :src="item" alt=""><!-- @click="imgShow(item)"-->
            </div>
            <p>说明：用户点击<img style="width:1.5rem;" src="./images/three04.jpg" alt="">图标，可发起新的动态，点击<img
              style="width:1.5rem;"
              src="./images/three05.jpg"
              alt="">进入个人中心页面，点击<img
              style="width:2rem;" src="./images/three06.jpg" alt="">按钮，可进入活动列表页面点击查看活动详情，点击报名，即可完成报名，在个人中心页面可查看发布的动态、我的关注、我的粉丝等信息
            </p>
          </div>
          <!-- <div id="model" style="position: fixed;left:0;top:0;width:100%;height:100%;" v-show="true">
             &lt;!&ndash; @click="hide"&ndash;&gt;
             <img style="width:100%;height:100%;" :src="img" alt="">
           </div>-->
        </div>

        <footer class="footer">
          <span @click="setSesstion">知道了</span>
        </footer>
      </div>
    </div>
    <div class="friendContent">
      <div class="header">
        <div class="choose">
          <div @click.stop="searchInfo($event,0)"><span class="active">全部</span></div>
          <div @click.stop="searchInfo($event,1)"><span>男</span></div>
          <div @click.stop="searchInfo($event,2)"><span>女</span></div>
        </div>
        <div class="chooseMore" @click="routeTo()">
          <img src="./images/jy-3.png">
        </div>
      </div>
      <div class="theAll swiper-container" data-space-between='10' data-pagination='.swiper-pagination'
           data-autoplay="1000" :style="theStyle">
        <div class="swiper-wrapper" style="position: relative;">
          <div class="swiper-slide" v-for="(item,index) in dataList">
            <div class="content ">
              <div class="contImg">
                <img @click.stop="routeToDetail(item.userId)" v-changeSize ref="theImg"
                     v-if="item.img !='' && item.img !=null"
                     :src="url+item.img.split(',')[0]">
                <!--<img v-if="item.img !='' && item.img !=null" :src="url+item.img.split(',')[0]" alt="">-->
                <img @click.stop="routeToDetail(item.userId)" v-else src="./images/normalBG.jpg"
                     style="width: 100%;height: 100%;">
                <div v-if="item.userId!=WX_UserId && thePraiseShow == true">
                  <!--关注-->
                  <div @click.stop="follow(item.userId,index)" class="circle" v-if="item.isfollow == 0"><img
                    src="./images/jy-21+.png" alt=""><span>{{item.follows}}</span>
                  </div>
                  <div @click.stop="followClick(item.userId,index)" style="background: #f98b8b;" class="circle"
                       v-if="item.isfollow == 1">
                    <img src="./images/jy-21.png"><span style="color:#fff;">{{item.follows}}</span>
                  </div>
                  <!--已点赞-->
                  <div @click.stop="praise(item.id,index)" v-if="item.isgood == 1" class="circlePrice"
                       style="right: 3.9rem;background:#6fd1d1;">
                    <img src="./images/jy-20.png"><span style="color:#fff;">{{item.isgoods}}</span>
                  </div>

                  <!--未点赞-->
                  <div @click.stop="praise(item.id,index)" v-if="item.isgood == 0" class="circlePrice"
                       style="right: 3.9rem;">
                    <img src="./images/jy-20+.png"><span>{{item.isgoods}}</span>
                  </div>
                  <div class="secret" @click.stop="letterMsg(item.name,item.userId)"><img
                    src="./images/jy-22.png"><span>私信TA</span>
                  </div>
                </div>

              </div>
              <div class="contInfo">
                <div class="inDetail" @click.stop="routeToDetail(item.userId)"><img src="./images/jy-6.png" alt="">
                </div>
                <p>{{item.name}}
                  <img v-if="item.gender == '女'" src="./images/jy-4.png" alt="">
                  <img v-else src="./images/jy-5.png" alt="">
                </p>
                <div class="work">{{item.age}}岁/{{item.department}}</div>
                <div class="description" v-html="item.remark!=''&&item.remark!=null?decodeURI(item.remark):'TA什么都没留下'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--私信弹框-->
    <div id="letterModel" v-show="showMsg" @click.stop="hideMsg">
      <div id="msg_letter" @click.stop>
        <h4><img src="./images/jy-22+.png">我想对{{wantName}}说</h4>
        <textarea placeholder="请输入私信内容" v-model="msgLetter"></textarea>
        <div>
          <span class="yesSend" @click="sendLetter">发送私信</span>
          <span class="noSend" @click="hideMsg">取消</span>

        </div>
      </div>
    </div>

    <!--底部-->
    <div id="footer">
      <ul>
        <router-link to="/love/makeFriend" class="red" style="text-align: center;">
          <li>
            <img src="./images/jy-8.png" alt="">
            <span>缘分</span>
          </li>
        </router-link>
        <router-link to="/love/dynamics" style="text-align: center;">
          <li>
            <img src="./images/jy-9.png" alt="">
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
  import Swiper from 'swiper'
  // import vueWaterfallEasy from 'vue-waterfall-easy'
  export default {
    name: "makeFriend",
    data() {
      return {
        oneImg: [
          require("./images/one01.jpg"),
          require("./images/one02.jpg"),
          require("./images/one03.jpg")
        ],
        twoImg: [
          require("./images/two01.jpeg"),
          require("./images/two02.jpeg")
        ],
        threeImg: [
          require("./images/three01.jpg"),
          require("./images/three02.jpeg"),
          require("./images/three03.jpeg")
        ],
        img: "",
        show: false,
        theStyle: {
          background: "url(" + require("./images/jy-13.png") + ") 0 0",
          backgroundSize: '100% 102%',
          backgroundRepeat: 'no-repeat',
        },
        msgLetter: '',  //私信内容
        showMsg: false, //私信弹窗
        dataList: [],
        userid: '',      //userid
        pageIndex: 0,
        pageSize: 10,
        Sex: 0,
        wantName: '',
        isgoods: '',//点赞数
        mySwiper: '',
        needContinue: true,
        whetherShow: true,
        addShow: false,    //是否加入鹊桥会
        thePraiseShow: false,
      }
    },
    created: function () {
      sessionStorage.setItem('loginNum', 'yes');
      clearTimeout(this.setTime);
      this.userid = this.WX_UserId;
      $("#title").text("茅台交友");
      this.isAdd();
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
    },
    mounted: function () {
      var that = this;
      this.getInfoList();
      this.mySwiper = new Swiper('.swiper-container', {
        // loop: true,
        preventClicks: false,
        pagination: '.swiper-pagination',
        // effect: 'coverflow',
        slidesPerView: 1,
        centeredSlides: true,
        // autoplay: true,//可选选项，自动滑动
        // autoplay: {
        //     disableOnInteraction: false,
        // },
        // delay: 2000,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        on: {
          touchEnd: function (event) {
            if (that.mySwiper.activeIndex % 10 == 7) {
              that.whetherShow = true;
              that.pageIndex++;
              that.$nextTick(function () {
                if (that.needContinue == true) {
                  that.getInfoList();
                } else {
                  // console.log(1);
                }
              })
            }


            // console.log(this.activeIndex);
            // that.dataList.push({})
          },
        },
      });
    },

    //指令
    directives: {
      //图片自动适应
      changeSize: {
        inserted: function (el) {
          /* var that = this;
           var theWidth = el.width;
           var theHeight = el.height;
           if (theWidth >= theHeight) {
             el.style.height = '100%';
             el.style.width = 'auto';
           } else {
             el.style.height = 'auto';
             el.style.width = '100%';
           }*/
          let getImgInfo = function (url) {
            return new Promise(resovle => {
              let img = new Image();
              let json = {};
              img.src = url;
              img.onload = function () {
                json['width'] = img.width;
                json['height'] = img.height;
                resovle(json);
              }
            });
          };
          let maxwidth = el.parentNode.offsetWidth;
          getImgInfo(el.src).then(res => {
            var that = this;
            var theWidth = el.width;
            var theHeight = el.height;
            if (theWidth >= theHeight) {
              el.style.height = '100%';
              el.style.width = 'auto';
            } else {
              el.style.height = 'auto';
              el.style.width = '100%';
            }
          });
        },
      }
    },
    components: {
      // vueWaterfallEasy
    },
    methods: {

      setSesstion() {
        window.sessionStorage.setItem('addShow', 1);
        this.addShow = false
      },

      //是否加入了鹊桥会
      isAdd: function () {   //判断是否加入鹊桥汇
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/IsQueQiao",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              if (res.data == "0") {   //未加入
                if (window.sessionStorage.getItem('addShow') == null) {
                  that.show = false;
                  that.addShow = true;
                }
                that.thePraiseShow = false;
              } else if (res.data == "1") {
                that.show = true;
                that.addShow = false;
                that.thePraiseShow = true;
              }
              that.$MintUI.Indicator.close();
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },

      //点赞
      praise(theId, index) {
        var that = this;
        // that.$MintUI.Indicator.open("点赞");
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/NewIsGoodByQueQiao",
          data: {id: theId, userid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              if (data.type == "1") {  //点赞成功
                that.dataList[index].isgood = 1;
                that.dataList[index].isgoods++;
              } else if (data.type == "0") {  //取消点赞
                that.dataList[index].isgood = 0;
                that.dataList[index].isgoods--;
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

      //查询人员列表信息
      getInfoList: function () {
        var that = this;
        /*this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open('加载中');
        }, this.timeNum);*/
        $.ajax({
          url: that.port + "api/QueQiao/GetNewQueQiaoList",
          type: 'post',
          data: {
            "UserId": that.userid,
            "Sex": that.Sex,
            "PageIndex": that.pageIndex,
            "PageSize": that.pageSize
          },
          success: function (res) {
            console.log(JSON.parse(res.data));
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            var theData = JSON.parse(res.data);
            for (var i = 0; i < theData.length; i++) {
              that.dataList.push(theData[i]);
            }
            if (theData.length < that.pageIndex) {
              that.needContinue = false;
            } else {
              that.needContinue = true;
            }
            /* that.$nextTick(function () {
               var theIMG = that.$refs.theImg;
               for (var i = 1; i <= theIMG.length; i++) {
                 var theWidth = theIMG[i].width;
                 var theHeight = theIMG[i].height;
                 if (theWidth >= theHeight) {
                   theIMG[i].style.height = '100%';
                   theIMG[i].style.width = 'auto';
                 } else {
                   theIMG[i].style.height = 'auto';
                   theIMG[i].style.width = '100%';
                 }
               }

             })*/
          },
          error: function () {
            clearTimeout(that.setTime);
            that.$MintUI.Toast('网络错误');
          }
        })

      },


      //搜索男女
      searchInfo: function (e, sex) {
        this.mySwiper.slideTo(0);
        var current = e.currentTarget;
        this.needContinue = true;
        $(current).children('span').addClass('active');
        $(current).siblings().children('span').removeClass('active');
        var that = this;
        that.pageIndex = 0;
        this.dataList = [];
        this.Sex = sex;
        this.getInfoList();
      },

      //私信回复
      sendLetter: function () {
        var that = this;
        if (that.msgLetter == "") {
          that.$MintUI.Toast("请输入私信内容");
          return false;
        }
        that.$MintUI.Indicator.open("发送中");
        var title = "";
        var msgLetter = encodeURI(that.msgLetter);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/SendMessage",
          data: {sendId: that.userid, receiveId: that.id, title: title, content: msgLetter},
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

      //私信弹框显示
      letterMsg: function (theName, theId) {
        this.wantName = theName;
        this.id = theId;
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
                  that.$router.push({path: '/love/Linformation'})
                }, 1500)
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
        /* var that = this;
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

      //私信隐藏
      hideMsg: function () {
        this.msgLetter = "";
        this.showMsg = false;
      },

      //获取个人数据
      /* load: function () {
         var that = this;
         that.loadingShow = true;
         that.loading = true;
         // that.pageindex = 0;
         $.ajax({
           type: "post",
           url: that.port + "api/QueQiao/GetQueQiaoList",
           data: {
             name: that.name,
             ageMin: that.ageMin,
             ageMax: that.ageMax,
             sortSex: that.sortSex,
             Dept: that.dept,
             status: that.status,
             pageIndex: that.pageindex,
             pageSize: that.pagesize
           },
           dataType: "json",
           success: function (res) {
             that.loadingShow = false;
             if (res.returncode == 0) {
               // that.list = [];
               var data = JSON.parse(res.data);
               console.log(data);
               for (var i = 0; i < data.length; i++) {
                 if (data[i].img == null) {
                   // data[i].img = "./images/mrHeader.jpg";
                 } else {
                   data[i].img = that.port + data[i].img;
                 }
               }
               if (data.length != that.pagesize) {
                 that.loading = true;
                 that.ishow = false;
               } else {
                 that.$nextTick(function () {
                   that.loading = false;
                   that.ishow = true;
                   that.pageindex++;
                 })
               }
               for (var i = 0; i < data.length; i++) {
                 that.list.push(data[i])
               }

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
       },*/

      //跳转至个人详情
      routeToDetail: function (otherId) {
        this.$router.push({path: '/love/detail', query: {id: otherId}});
      },

      //跳转列表
      routeTo() {
        this.$router.push({path: '/love/msgActivity'})
      },
      //关注
      follow: function (followid, index) {
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/AddFollow",
          data: {userid: followid, followid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              if (res.data == "0") {  //关注
                // that.whetherShow = !that.whetherShow;
                that.dataList[index].isfollow = 1;
                that.dataList[index].follows++;
              }
              // that.$MintUI.Toast(res.msg); //关注成功
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
      //取关
      followClick: function (followid, index) {
        var that = this;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/DelFollow',
          data: {userid: followid, followid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == "0") {
              if (res.data == "0") {  //取关
                // that.$MintUI.Toast('取关');
                // isfollow = "0";
                that.dataList[index].isfollow = 0;
                that.dataList[index].follows--;
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

<style scoped>
  @import "./css/makeFriend.css";
</style>
