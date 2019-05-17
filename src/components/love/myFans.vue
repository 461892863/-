<template>
  <div id="myFans">
    <ul class="userLists" v-infinite-scroll="userList" infinite-scroll-disabled="loading"
        infinite-scroll-distance="1">
      <li v-for="(item,index) in userLists">
        <div class="userMessage" @click="personalHomepage(item.followid)">
          <div class="userImg">
            <img v-if="item.img!=null" :src="url1+item.img" alt="">
            <img v-if="item.img==null" src="./images/admin.png" alt="">
          </div>
          <div class="userInfors">
            <p>{{item.name}}</p>
            <p class="departments">
              <span>{{item.departName}}</span>
              <span>|</span>
              <span>{{item.age}}</span>
            </p>
          </div>
        </div>
        <div class="focusBox" @click="follow(index,item.followid)" v-if="item.type==0">
          <span>+关注</span>
        </div>
        <div class="focusBox" @click="followClick(index,item.followid)" v-if="item.type==1">
          <span>+已关注</span>
        </div>
      </li>
      <!--加载中-->
      <div v-show="loadingShow"
           style="overflow:hidden;padding:0.5rem 0;margin:0 auto;color:#aaa;width:4.5rem;font-size:0.75rem;text-align:center;">
        <mt-spinner style="float:left;" :type="3" color="#aaa" :size="20"></mt-spinner>
        <span style="font-size: 12px;">加载中</span>
      </div>
      <!--暂无数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-if="noData">
        <!--<img style="width:80%;" src="./images/nodata.png" alt="">-->
        <p style="font-size: 12px;padding: .5rem;color: #aaa;text-align: center;clear: both">------暂无数据------</p>
      </div>
      <!--没有更多数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="noData" v-if="noMoreData">
        <!--<img style="width:80%;" src="./images/nodata.png" alt="">-->
        <p style="font-size: 12px;padding: .5rem;color: #aaa;text-align: center;clear: both">------已显示所有内容------</p>
      </div>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userLists: [],
        url1: "",
        dataLists: false,
        pageSize: 10,
        pageIndex: 0,
        loading: true,
        noData: false,
        noMoreData: false,
        loadingShow: false,
      }
    },
    created: function () {
      $("#title").text("我的粉丝");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      clearTimeout(this.setTime);
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.userList();
    },
    methods: {
      userList: function () {
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
          url: that.port + "api/QueQiao/MyFans",
          data: {
            userid: that.userid,
            pageIndex: that.pageIndex,
            pageSize: that.pageSize,
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              that.isfollow = data.type;
              for (var i = 0; i < data.length; i++) {
                that.userLists.push(data[i]);
              }
              if (data.length < that.pageSize) {
                that.loading = true;
                if (that.pageIndex == 0 && that.userLists.length <= 0) {
                  that.noData = true
                } else {
                  that.noMoreData = true;
                }
              } else {
                that.noData = false;
                that.noMoreData = false;
                that.$nextTick(function () {
                  that.loading = false;
                  that.pageIndex++;
                })
              }
              that.$MintUI.Indicator.close();
            } else {
              that.$MintUI.Indicator.close();
              return false;
            }
          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
//关注粉丝
      follow: function (e, id) {
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/AddFollow",
          data: {
            userid: id,
            followid: that.userid
          },
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              console.log(res);
              if (res.data == "0") {  //关注
                that.userLists[e].type = "1";
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
//取消关注
      followClick: function (e, id) {
        var that = this;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/DelFollow',
          data: {
            userid: id,
            followid: that.userid
          },
          dataType: "json",
          success: function (res) {
            console.log(res);
            if (res.returncode == "0") {
              // that.$MintUI.Toast(res.msg);
              if (res.data == "0") {  //关注
                that.userLists[e].type = "0";
              }
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }
          }, error: function () {
            that.$MintUI.Toast("服务器错误");

          }
        })
      },
//进入个人详情
      personalHomepage: function (followid) {
        this.$router.push({
          path: '/love/detail',
          query: {
            id: followid
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/myFans.css";

  #myFans {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
  }

  /*# sourceMappingURL=home.css.map */
</style>
