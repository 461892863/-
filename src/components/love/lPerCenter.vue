<template>
  <div id="perCenter">
    <!--头部  未加入的时候显示-->
    <div id="header" @click="detail" v-show="addShow">
      <img style="border:1px solid #efefef;" class="portrait" :src="faceImg" alt="">
      <span class="name">{{name}}</span>
      <span class="bm">{{department}}</span>
      <img class="right" src="./images/right.png" alt="">
    </div>

    <!--列表-->
    <!-- <div id="List" v-show="show">
        <a href="dynamics.html">
            <img src="./images/dynamic.png" alt="" class="icon"><span>发布动态</span><img src="./images/right.png" alt="" class="right">
        </a>
        <a href="mineFollow.html">
            <img src="./images/follow.png" alt="" class="icon"><span>我的关注</span><img src="./images/right.png" alt="" class="right">
        </a>
        <a href="messageCenter.html">
            <img src="./images/msg.png" alt="" class="icon"><span>我的消息</span><img src="./images/right.png" alt="" class="right">
        </a>
        <a href="myActivity.html">
            <img src="./images/activity.png" alt="" class="icon"><span>我的活动</span><img src="./images/right.png" alt="" class="right">
        </a>
    </div> -->
    <!--头部  加入的时候显示-->
    <div id="isYes" v-show="show">
      <div class="header">
        <img src="./images/edit.png" alt="" class="bj" @click="yIsAddS">
        <img style="border:1px solid #efefef;" class="portrait" :src="faceImg" alt="">
        <div class="name">
          <span class="na">{{name}}</span>
          <span class="dept">{{department | deptSub}}</span>
        </div>
        <div class="all">
          <span>资料完善度</span>
          <span>
              <img src="./images/start01.png" alt="">
              <img src="./images/start01.png" alt="">
              <img v-if="num>=3" src="./images/start01.png" alt="">
              <img v-else="" src="./images/start02.png" alt="">
              <img v-if="num>=4" src="./images/start01.png" alt="">
              <img v-else="" src="./images/start02.png" alt="">
              <img v-if="num==5" src="./images/start01.png" alt="">
              <img v-else="" src="./images/start02.png" alt="">
          </span>
        </div>
      </div>

      <!--推荐  活动报名-->
      <!-- <div id="tab">
         <a href="javascript:;" @click="recom" style="width:49%;">
           <img src="./images/firendTj.png" alt="">
           <span>推荐好友</span>
         </a>
         <router-link to="/love/loveActivity">
           <img src="./images/bom.png" alt="">
           <span>活动报名</span>
         </router-link>
       </div>-->

      <div id="list" style="padding-bottom: 3.5rem;">
        <router-link to="/love/perDt">
          <img src="./images/mineDt.png" alt="" class="icon">
          <span>我的动态</span>
          <img src="./images/right.png" alt="" class="right">
        </router-link>
        <router-link to="/love/mineFollow">
          <img src="./images/mineGz.png" alt="" class="icon">
          <span>我的关注</span>
          <img src="./images/right.png" alt="" class="right">
        </router-link>
        <router-link to="/love/myFans">
          <img src="./images/fensi.png" alt="" class="icon">
          <span>我的粉丝</span>
          <img src="./images/right.png" alt="" class="right">
        </router-link>
        <router-link to="/love/messageCenter">
          <img src="./images/mineXx.png" alt="" class="icon">
          <span>我的消息</span>
          <img src="./images/right.png" alt="" class="right">
        </router-link>
        <!--<router-link to="/love/myActivity">
          <img src="./images/mineHd.png" alt="" class="icon">
          <span>我的活动</span>
          <img src="./images/right.png" alt="" class="right">
        </router-link>-->
        <a>
          <img src="./images/canSee.png" alt="" class="icon">
          <span>个人信息可见</span>
          <mt-switch v-model="canSee" style="float: right;height: 100%;display: flex;align-items: center;"></mt-switch>
        </a>
      </div>
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
        <router-link to="/love/dynamics" style="text-align: center;">
          <li>
            <img src="./images/jy-9.png" alt="">
            <span>说说</span>
          </li>
        </router-link>
        <router-link to="/love/lPerCenter" class="red" style="text-align: center;">
          <li>
            <img style="margin-right: 0.1rem;" src="./images/jy-12.png" alt="">
            <span>我的</span>
          </li>
        </router-link>
      </ul>
    </div>
    <!--未加入佳缘时的弹框 -->
    <div id="model" v-show="IsAddS"></div>
    <div id="isAdd" v-show="IsAddS">
      <P>
        <img src="./images/ts.png" alt="">
        <span>提示</span>
      </P>
      <div class="content">
        此应用，是茅台集团为员工提供的一个企业内的交友平台，员工首次进入该应用需填写自己个人的真实信息，在此应用中员工发生一系列不正当行为，与茅台集团无关。
      </div>
      <div class="bottom">
        <span class="no" @click="nIsAddS">拒绝</span>
        <span class="yes" @click="yIsAddS">同意</span>
      </div>

    </div>
  </div>


</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        name: '',
        show: false,
        addShow: false,
        department: '',
        url: '',
        faceImg: require('./images/admin.png'),
        IsAddS: false,
        num: 2,
        canSee: false
      }

    },
    created: function () {
      $("#title").text("个人中心");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.getName();
      this.isAdd();
    },
    methods: {
      recom: function () {
        var that = this;
        if (this.num == "5") {
          that.$router.push('/love/Recommend');
        } else {
          that.$MintUI.Toast("请将资料填写完整");
        }

      },
      detail: function () {  //点击编辑时弹框,
        this.IsAddS = true;
      },
      yIsAddS: function () {
        this.$router.push('/love/Linformation');  //跳转到编辑
      },
      nIsAddS: function () {
        this.IsAddS = false;
      },
      getName: function () {   //获取当前使用人的name  需传给后台
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/QueUserBaseInfo",
          data: {userid: that.userid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              console.log(data);

              that.num = data.complete;
              that.name = data.userinfo.name;
              that.department = data.userinfo.department;
              if (data.queqiao == null || data.queqiao == "") {
              } else {
                if (data.queqiao.faceImg == null || data.queqiao.faceImg == "") {
                } else {
                  that.faceImg = that.port + data.queqiao.faceImg;
                }
              }
              if(data.queqiao.isShow == 0 && data.queqiao != null){
                that.canSee = true;
              }else if(data.queqiao.isShow == 1 && data.queqiao != null){
                that.canSee = false;
              }

              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast("获取用户信息失败");
              return false;
            }
          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
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
                that.show = false;
                that.addShow = true;
                // that.$router.push({name: 'Linformation'});

              } else if (res.data == "1") {
                that.show = true;
                that.addShow = false;
              }
              that.$MintUI.Indicator.close();
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });

      }
    },
    filters: {
      deptSub: function (value) {
        if (value.length > 4) {
          return value.substr(0, 4) + "...";
        } else {
          return value;
        }
      }
    },
    watch: {
      canSee: function () {
        var that = this;
        if (this.canSee == true) {
          $.ajax({
            url: this.port + 'api/QueQiao/IsShow',
            type:'post',
            data:{
              "userid": this.userid,
              "isshow": 0
            },
            success:function (res) {
              console.log(res);
              // that.$MintUI.Toast('信息已可见');
            }
          })
        } else {
          $.ajax({
            url: this.port + 'api/QueQiao/IsShow',
            type:'post',
            data:{
              "userid": this.userid,
              "isshow": 1
            },
            success:function (res) {
              console.log(res);
              // that.$MintUI.Toast('信息不可见');

            }
          })

        }

      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/perCenter.css";

  /*# sourceMappingURL=home.css.map */
</style>
