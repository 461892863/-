<template>
  <div id="mineFollow">
    <!--列表-->
    <div id="List" v-infinite-scroll="list" infinite-scroll-disabled="loading"
         infinite-scroll-distance="1">
      <div class="list" v-for="(item,index) in lists">
        <img v-if="item.img!=null" class="head" :src="url1+item.img" alt="" @click="detail(item.userid)">
        <img v-if="item.img==null" class="head" src="./images/admin.png" alt="" @click="detail(item.userid)">
        <div style="width:52%;" @click="detail(item.userid)">
          <p class="name">{{item.name}}</p>
          <p style="margin-top: 0.3rem;"><span
            class="bm">{{item.departName}}</span><span>&nbsp;|&nbsp;{{item.age}}岁</span></p>
        </div>
        <div class="follow" @click="followClick(item.userid,item.followid,index)" v-show="!item.theShow">
          已关注
        </div>
        <div class="follow" style="background: #fff;color:#f98b8b" @click="follow(item.userid,item.followid,index)"
             v-show="item.theShow">
          + 关注
        </div>
        <!--<img @click="followClick(item.userid,item.followid,index)" class="follow" src="./images/yiguanzhu.png" alt="">-->
      </div>
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
    </div>
  </div>


</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        lists: [], //关注列表
        img: require('./images/nodata.png'),
        url1: '',
        pageSize: 10,
        pageIndex: 0,
        noData: false,
        noMoreData: false,
        loading: true,
        loadingShow: false,
      }
    },
    created: function () {
      $("#title").text("我的关注");
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
      var that = this;
      that.list();
    },
    methods: {
      //数据列表
      list: function () {
        var that = this;
        that.loading = true;
        if (that.pageIndex > 0) {
          that.loadingShow = true;
        }
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/MyFollow',
          data: {
            userid: that.userid,
            PageIndex: that.pageIndex,
            PageSize: that.pageSize
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            if (res.returncode == "0") {
              var data = JSON.parse(res.data);
              data.map(function (item) {
                item.theShow = false;
                that.lists.push(item)
              });
              if (data.length < that.pageSize) {
                that.loading = true;
                if (that.pageIndex == 0 && that.lists.length <= 0) {
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
            }
          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
          }
        })
      },
      detail: function (e) {  //跳转详情
        this.$router.push({
          path: '/love/detail',
          query: {
            id: e
          }
        })
      },

      //关注
      follow: function (userid, followid, index) {
        var that = this;
        var userid = userid;
        var followid = followid;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/AddFollow",
          data: {userid: userid, followid: followid},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              if (res.data == "0") {  //关注
                that.isfollow = "1";
                that.lists[index].theShow = false;
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

      //取关
      followClick: function (userid, followid, index) {
        var that = this;
        var userid = userid;
        var followid = followid;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/DelFollow',
          data: {
            userid: userid,
            followid: followid,
          },
          dataType: "json",
          success: function (res) {
            if (res.returncode == "0") {
              // that.$MintUI.Toast(res.msg);
              that.lists[index].theShow = true;
              /*setTimeout(function () {
                window.location.reload();
              }, 1500)*/
            } else {
              that.$MintUI.Toast(res.msg);
              return false;
            }
          }
        })
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
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/mineFollow.css";

  #mineFollow {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
  }

  /*# sourceMappingURL=home.css.map */
</style>
