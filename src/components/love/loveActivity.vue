<template>
  <div id="app" v-cloak>
    <!--搜索-->
    <div id="search">
      <input @keyup="search" v-model="checkname" type="text" placeholder="输入关键字搜索"><img @click="btnSearch"
                                                                                        src="./images/search.png"
                                                                                        alt="">
    </div>
    <!--列表-->
    <div id="List">
      <div class="list" v-for="item in lists" @click="activ(item.id)">
        <div>
          <span>{{item.activityTitle | sort}}</span>
          <p><span class="time">{{item.createTime}}</span><span><span>{{item.activityNums}}</span>人已报名</span></p>
        </div>
        <div class="imgBoxs">
          <img :src="url1+item.activityImg" alt="">
        </div>
      </div>
      <!--暂无数据-->
      <div style="text-align: center;margin-top: 0.5rem;" class="no_msg" v-show="dataLists">
        <img style="width:80%;" src="./images/nodata.png" alt="">
        <p>暂无数据</p>
      </div>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'love',
    data() {
      return {
        lists: [], //活动列表
        dataLists: false,
        checkname: '',  //搜索关键字
        url1: ''
      }

    },
    created: function () {
      $("#title").text("活动列表");
      this.$MintUI.Indicator.close();
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      this.$MintUI.Indicator.open("加载中");
    },
    mounted: function () {
      var that = this;
      that.activityLists();
    },
    methods: {
      activityLists: function () {
        var that = this;
        $.ajax({
          type: 'post',
          url: that.port + 'api/QueQiao/GetQueQiaoActivity',
          data: {
            key: that.checkname,
          },
          dataType: "json",
          success: function (res) {
            var data = JSON.parse(res.data);
            that.lists = data;
            that.$MintUI.Indicator.close();
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
      },
      search: function () {
        this.activityLists();
      },
      btnSearch: function () {
        this.$MintUI.Indicator.open("搜索中");
        this.activityLists();
      },
      activ: function (e) {
        this.$router.push({
          path: '/love/activ',
          query: {
            id: e
          }
        });
      }

    },
    filters: {
      sort: function (value) {
        console.log(value);
        if (value.length <= 9) {
          return value;
        } else {
          value = value.substr(0, 9) + "...";
          return value;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/loveActivity.css";
  /*# sourceMappingURL=home.css.map */
</style>
