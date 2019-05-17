<template>
  <div id="perDt">
    <!--列表-->
    <div id="List" v-infinite-scroll="getName" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <div class="list" v-for="(item,index) in list">
        <div class="header">
          <img v-if="item.faceimg != null" class="left" :src="url1+item.faceimg" alt="">
          <img v-if="item.faceimg == null" class="left" src="./images/admin.png" alt="">
          <div class="msg">
            <span class="name">{{item.username}}</span>
            <span class="dept">{{item.dept}}</span>
          </div>
          <img @click="editDle(index)" class="right" src="./images/more.png" alt="">
          <div class="edit" v-show="item.show">
            <p class="editMsg" @click="edit(item.id)"><img src="./images/edit.png" alt=""><span>编辑</span></p>
            <p class="del" @click="del(item.id,index)"><img src="./images/del.png" alt=""><span>删除</span></p>
          </div>
        </div>
        <span @click="tzDetail">{{decodeURI(item.content)}}</span>
        <div class="time" @click="tzDetail">
          <p class="left">{{item.addtime.split(" ")[0]}}</p>
          <p class="right">
            <span class="fabu"><img src="./images/appreciate.png" alt="">{{item.isgood}}</span>
            <span class="reply"><img src="./images/rmsg.png" alt="">{{item.comment}}</span>
          </p>
        </div>
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
    <!--底部-->
    <div id="footer" @click="fb">
      <img src="./images/fb.png" alt=""><span>发布动态</span>
    </div>
  </div>


</template>

<script>
  export default {
    data() {
      return {
        name: '',
        show: false,
        department: '',
        url1: '',
        faceImg: require('./images/mrHeader.jpg'),
        IsAddS: false,
        userid: '',
        list: [],
        pageIndex: 0,
        pageSize: 10,
        loading: true,
        noData: false,
        noMoreData: false,
        loadingShow:false,
      }

    },
    created: function () {
      $("#title").text("个人动态");
      this.$MintUI.Indicator.close();
      clearTimeout(this.setTime);
      this.userid = this.WX_UserId;
      this.url1 = this.url;
      this.$nextTick(function () {
        $(".weui-picker-container").hide();
      });
      // this.$MintUI.Indicator.open('加载中');
    },
    mounted: function () {
      this.getName();
    },
    methods: {
      tzDetail: function () {
        var that = this;
        that.$router.push({
          path: '/love/detail',
          query: {
            id: that.userid
          }
        })
      },
      fb: function () {
        this.$router.push('/love/dynamics');
      },
      detail: function () {  //点击编辑时弹框,
        this.IsAddS = true;
      },
      getName: function () {   //获取当前使用人的name  需传给后台
        var that = this;
        that.loading = true;
        if(that.pageInde>0){
          that.loadingShow = true;
        }
        this.setTime = setTimeout(function () {
          that.$MintUI.Indicator.open("加载中");
        }, that.timeNum);
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/GetMyDynamicList",
          data: {
            userid: that.userid,
            PageIndex: that.pageIndex,
            PageSize: that.pageSize,
          },
          dataType: "json",
          success: function (res) {
            that.loadingShow = false;
            clearTimeout(that.setTime);
            that.$MintUI.Indicator.close();
            if (res.returncode == 0) {
              var data = JSON.parse(res.data);
              for (var i = 0; i < data.length; i++) {
                data[i]["show"] = false;
                that.list.push(data[i])
              }
              console.log(that.list);
              if (data.length < that.pageSize) {
                that.loading = true;
                if (that.pageIndex == 0 && that.list.length <= 0) {
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
              that.$MintUI.Toast(res.msg);
            }

          }, error: function () {
            that.loadingShow = false;
            clearTimeout(that.setTime)
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
      editDle: function (e) {  //编辑和删除的弹框
        var that = this;
        for (var i = 0; i < that.list.length; i++) {
          if (i != e) {
            that.list[i].show = false;
          }
        }
        that.list[e].show = !that.list[e].show;
      },
      del: function (e,index) {  //删除动态
        var that = this;
        $.ajax({
          type: "post",
          url: that.port + "api/QueQiao/DelDynamic",
          data: {userid: that.userid, id: e},
          dataType: "json",
          success: function (res) {
            if (res.returncode == 0) {
              // that.$MintUI.Toast("删除成功");
              that.list.splice(index,1);
              // window.location.reload();
            } else {
              that.$MintUI.Indicator.close();
              that.$MintUI.Toast(res.msg);
            }

          }, error: function () {
            that.$MintUI.Indicator.close();
            that.$MintUI.Toast("服务器错误");
            return false;
          }
        });
      },
      edit: function (e) {
        this.$router.push({
          path: '/love/dynamics',
          query: {
            id: e
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
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "./css/perDt.css";

  #perDt {
    width: 100%;
    height: 100%;
    padding-bottom: 3rem;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }

  /*# sourceMappingURL=home.css.map */
</style>
