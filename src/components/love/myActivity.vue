<template>
  <div id="app" v-cloak>
    <!--列表-->
    <div id="List">
      <div class="list" v-for="item in lists" @click="activ(item.id)">
        <div>
          <span>{{item.title}}</span>
          <p><span>开始时间：</span><span class="time">{{item.satrDate}}</span></p>

          <p><span>结束时间：</span><span>{{item.endDate}}</span></p>
        </div>
        <div class="imgBx">
          <img :src="url1+item.img" alt="">
        </div>
      </div>
      <!--暂无数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-show="dataLists">
        <img style="width:80%;" src="./images/nodata.png" alt="">
        <p>您还没有参加活动！</p>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    data() {
      return {
        lists: [], //活动列表
        dataLists: false,
        checkname: '',  //搜索关键字
        url1: ''
      }

    },
    created: function () {
      $("#title").text("我的活动");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.activityLists();
    },
    methods: {
      activ: function (e) {
        this.$router.push({
          path: '/love/activ',
          query: {
            id: e
          }
        });
      },
      activityLists: function () {
        var that = this;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/MyActivity',
          data: {
            userid: that.userid,
          },
          dataType: "json",
          success: function (res) {
            that.$MintUI.Indicator.close();
            var data = JSON.parse(res.data);
            that.lists = data;
            if (that.lists == "") {
              that.dataLists = true;
            } else if (that.lists != "") {
              that.dataLists = false;
            }
          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
          }
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/myActivity.css";

  /*# sourceMappingURL=home.css.map */
</style>
